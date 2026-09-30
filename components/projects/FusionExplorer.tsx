"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { palette, withAlpha } from "@/lib/palette";
import {
  BANDS,
  CLASSES,
  COLS,
  MEAN_SPECTRA,
  MODES,
  ROWS,
  WAVELENGTHS,
  buildSimulation,
  colorInfrared,
  type Mode,
} from "@/lib/fusion-sim";

/* ── Tuning constants ─────────────────────────────────────────────────────── */

const TRANSITION_MS = 1100; // city rising / map rescanning on a mode change
const AUTOPLAY_DELAY_MS = 900; // pause after scrolling into view before the reveal
const MAX_DPR = 2;
const MAX_HEIGHT_M = 16;
const HEIGHT_PX_PER_TILE = 0.3; // metres → pixels, as a fraction of tile size

type RGB = [number, number, number];

const hexToRgb = (hex: string): RGB => {
  const n = hex.replace("#", "");
  return [0, 2, 4].map((i) => parseInt(n.slice(i, i + 2), 16)) as RGB;
};
const rgb = (c: RGB, factor = 1) =>
  `rgb(${Math.round(c[0] * factor)}, ${Math.round(c[1] * factor)}, ${Math.round(c[2] * factor)})`;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Painter's order for an isometric grid: back row first, nearest last. */
const DRAW_ORDER = Array.from({ length: COLS * ROWS }, (_, i) => i).sort(
  (a, b) => (a % COLS) + Math.floor(a / COLS) - ((b % COLS) + Math.floor(b / COLS)),
);

const CLASS_RGB = CLASSES.map((c) => hexToRgb(c.color));

type Point = [number, number];

function insideConvex(point: Point, polygon: Point[]) {
  let sign = 0;
  for (let i = 0; i < polygon.length; i += 1) {
    const [x1, y1] = polygon[i];
    const [x2, y2] = polygon[(i + 1) % polygon.length];
    const cross = (x2 - x1) * (point[1] - y1) - (y2 - y1) * (point[0] - x1);
    if (cross !== 0) {
      if (sign === 0) sign = Math.sign(cross);
      else if (Math.sign(cross) !== sign) return false;
    }
  }
  return true;
}

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FUSION EXPLORER
 * ─────────────────────────────────────────────────────────────────────────────
 * An isometric city where the hyperspectral camera supplies each pixel's
 * colour and LiDAR supplies its height. Switching sensors flattens or raises
 * the city, rescans a live classification map, and re-scores it.
 *
 * The point is the research question in miniature: each sensor alone is
 * ambiguous in a different way, and fusing them removes both ambiguities. A
 * recruiter who has never heard of hyperspectral imaging gets that from the
 * accuracy number alone.
 *
 * Everything is computed (see lib/fusion-sim.ts) — a toy Gaussian classifier
 * on synthetic pixels, labelled as such on the page.
 *
 * Canvas, not SVG: 800 extruded prisms redrawn every frame of a transition is
 * well within 2D-canvas budget, and far outside what 2,400 SVG nodes animate
 * smoothly on a phone. Animation state lives in refs so a transition never
 * re-renders React; only discrete changes (mode, selected pixel) do.
 */
export default function FusionExplorer() {
  const sim = useMemo(() => buildSimulation(), []);
  const reduceMotion = useReducedMotion();

  /** The first roof the hyperspectral-only model gets wrong: the story pixel. */
  const storyPixel = useMemo(() => {
    const index = sim.truth.findIndex(
      (cls, i) => cls === 1 && sim.predictions.spectral[i] !== 1,
    );
    return index === -1 ? 0 : index;
  }, [sim]);

  const [mode, setMode] = useState<Mode>("spectral");
  const [selected, setSelected] = useState(storyPixel);

  const sectionRef = useRef<HTMLDivElement | null>(null);
  const isoRef = useRef<HTMLCanvasElement | null>(null);
  const mapRef = useRef<HTMLCanvasElement | null>(null);
  const accuracyRef = useRef<HTMLSpanElement | null>(null);
  const interactedRef = useRef(false);

  const anim = useRef({
    from: "spectral" as Mode,
    to: "spectral" as Mode,
    start: 0,
    t: 1,
    selected: storyPixel,
  });
  const geometry = useRef({ tile: 0, originX: 0, originY: 0, zScale: 0, k: 0 });
  const kick = useRef<() => void>(() => {});

  /** Per-mode appearance: top-face colour per pixel, and how tall the city is. */
  const appearance = useMemo(() => {
    const count = COLS * ROWS;
    const infrared = new Float32Array(count * 3);
    const elevation = new Float32Array(count * 3);
    const low = hexToRgb(palette.ink.ruleHi);
    const high = hexToRgb(palette.volt.hi);
    for (let i = 0; i < count; i += 1) {
      infrared.set(colorInfrared(sim.spectra[i]), i * 3);
      const t = Math.min(1, sim.heights[i] / 12) ** 0.8;
      for (let k = 0; k < 3; k += 1)
        elevation[i * 3 + k] = low[k] + (high[k] - low[k]) * t;
    }
    return {
      spectral: { colors: infrared, lift: 0 },
      lidar: { colors: elevation, lift: 1 },
      fused: { colors: infrared, lift: 1 },
    } satisfies Record<Mode, { colors: Float32Array; lift: number }>;
  }, [sim]);

  /* ── Canvas lifecycle ─────────────────────────────────────────────────── */

  useEffect(() => {
    const iso = isoRef.current;
    const map = mapRef.current;
    const isoCtx = iso?.getContext("2d");
    const mapCtx = map?.getContext("2d");
    if (!iso || !map || !isoCtx || !mapCtx) return;

    let frame: number | null = null;
    let lastWidth = -1;

    const cornersFor = (index: number, z: number) => {
      const { tile, originX, originY } = geometry.current;
      const c = index % COLS;
      const r = Math.floor(index / COLS);
      const x = originX + (c - r) * tile;
      const y = originY + ((c + r) * tile) / 2;
      const north: Point = [x, y - z];
      const east: Point = [x + tile, y + tile / 2 - z];
      const south: Point = [x, y + tile - z];
      const west: Point = [x - tile, y + tile / 2 - z];
      return { north, east, south, west, x, y };
    };

    const drawIso = (eased: number) => {
      const { from, to, selected: sel } = anim.current;
      const a = appearance[from];
      const b = appearance[to];
      const lift = a.lift + (b.lift - a.lift) * eased;
      geometry.current.k = lift;
      const { tile, zScale } = geometry.current;
      const width = iso.clientWidth;
      const height = iso.clientHeight;
      isoCtx.clearRect(0, 0, width, height);

      const color: RGB = [0, 0, 0];
      for (const index of DRAW_ORDER) {
        for (let k = 0; k < 3; k += 1)
          color[k] =
            a.colors[index * 3 + k] +
            (b.colors[index * 3 + k] - a.colors[index * 3 + k]) * eased;
        const z = sim.heights[index] * zScale * lift;
        const { north, east, south, west } = cornersFor(index, z);

        if (z > 0.6) {
          // Left face, then right face. Two shades sell the light direction.
          isoCtx.fillStyle = rgb(color, 0.62);
          isoCtx.beginPath();
          isoCtx.moveTo(west[0], west[1]);
          isoCtx.lineTo(south[0], south[1]);
          isoCtx.lineTo(south[0], south[1] + z);
          isoCtx.lineTo(west[0], west[1] + z);
          isoCtx.closePath();
          isoCtx.fill();

          isoCtx.fillStyle = rgb(color, 0.42);
          isoCtx.beginPath();
          isoCtx.moveTo(south[0], south[1]);
          isoCtx.lineTo(east[0], east[1]);
          isoCtx.lineTo(east[0], east[1] + z);
          isoCtx.lineTo(south[0], south[1] + z);
          isoCtx.closePath();
          isoCtx.fill();
        }

        isoCtx.fillStyle = rgb(color);
        isoCtx.beginPath();
        isoCtx.moveTo(north[0], north[1]);
        isoCtx.lineTo(east[0], east[1]);
        isoCtx.lineTo(south[0], south[1]);
        isoCtx.lineTo(west[0], west[1]);
        isoCtx.closePath();
        isoCtx.fill();
        if (tile > 6) {
          isoCtx.strokeStyle = withAlpha(palette.ink.void, 0.28);
          isoCtx.lineWidth = 0.6;
          isoCtx.stroke();
        }
      }

      // Selected pixel: an amber outline plus a beacon, drawn last so it's
      // never hidden behind a taller neighbour.
      const z = sim.heights[sel] * zScale * lift;
      const { north, east, south, west } = cornersFor(sel, z);
      isoCtx.strokeStyle = palette.ember.DEFAULT;
      isoCtx.lineWidth = 2;
      isoCtx.beginPath();
      isoCtx.moveTo(north[0], north[1]);
      isoCtx.lineTo(east[0], east[1]);
      isoCtx.lineTo(south[0], south[1]);
      isoCtx.lineTo(west[0], west[1]);
      isoCtx.closePath();
      isoCtx.stroke();
      const beacon = isoCtx.createLinearGradient(0, north[1] - tile * 5, 0, north[1]);
      beacon.addColorStop(0, withAlpha(palette.ember.DEFAULT, 0));
      beacon.addColorStop(1, withAlpha(palette.ember.DEFAULT, 0.9));
      isoCtx.fillStyle = beacon;
      isoCtx.fillRect(north[0] - 1, north[1] + tile / 2 - tile * 5, 2, tile * 5);
    };

    const drawMap = (eased: number) => {
      const { from, to, selected: sel } = anim.current;
      const width = map.clientWidth;
      const cell = width / COLS;
      const scanX = eased * width;
      mapCtx.clearRect(0, 0, width, cell * ROWS);

      for (let index = 0; index < COLS * ROWS; index += 1) {
        const c = index % COLS;
        const r = Math.floor(index / COLS);
        const x = c * cell;
        // Mamba-style: the new prediction is written left to right, one
        // column at a time, behind a scan line.
        const source = x + cell / 2 < scanX ? to : from;
        const predicted = sim.predictions[source][index];
        mapCtx.fillStyle = rgb(CLASS_RGB[predicted]);
        mapCtx.fillRect(x, r * cell, Math.ceil(cell), Math.ceil(cell));
        if (predicted !== sim.truth[index]) {
          mapCtx.fillStyle = withAlpha(palette.ink.void, 0.85);
          mapCtx.beginPath();
          mapCtx.arc(x + cell / 2, r * cell + cell / 2, cell * 0.2, 0, Math.PI * 2);
          mapCtx.fill();
        }
      }

      if (eased < 1) {
        const glow = mapCtx.createLinearGradient(scanX - 40, 0, scanX, 0);
        glow.addColorStop(0, withAlpha(palette.volt.DEFAULT, 0));
        glow.addColorStop(1, withAlpha(palette.volt.hi, 0.55));
        mapCtx.fillStyle = glow;
        mapCtx.fillRect(scanX - 40, 0, 40, cell * ROWS);
        mapCtx.fillStyle = palette.volt.hi;
        mapCtx.fillRect(scanX - 1, 0, 2, cell * ROWS);
      }

      const sc = sel % COLS;
      const sr = Math.floor(sel / COLS);
      mapCtx.strokeStyle = palette.ember.DEFAULT;
      mapCtx.lineWidth = 2;
      mapCtx.strokeRect(sc * cell + 1, sr * cell + 1, cell - 2, cell - 2);
    };

    const draw = () => {
      const eased = easeOut(anim.current.t);
      drawIso(eased);
      drawMap(eased);
      if (accuracyRef.current) {
        const { from, to } = anim.current;
        const value =
          sim.accuracy[from] + (sim.accuracy[to] - sim.accuracy[from]) * eased;
        accuracyRef.current.textContent = `${(value * 100).toFixed(1)}%`;
      }
    };

    const resize = () => {
      const width = iso.parentElement?.clientWidth ?? iso.clientWidth;
      if (width === lastWidth) return;
      lastWidth = width;
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      const tile = width / (COLS + ROWS);
      const zScale = tile * HEIGHT_PX_PER_TILE;
      const headroom = MAX_HEIGHT_M * zScale + 8;
      const isoHeight = ((COLS + ROWS) * tile) / 2 + headroom + 6;
      geometry.current = { ...geometry.current, tile, zScale, originX: ROWS * tile, originY: headroom };
      iso.style.height = `${isoHeight}px`;
      iso.width = Math.floor(width * dpr);
      iso.height = Math.floor(isoHeight * dpr);
      isoCtx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const mapWidth = map.parentElement?.clientWidth ?? map.clientWidth;
      const mapHeight = (mapWidth / COLS) * ROWS;
      map.style.height = `${mapHeight}px`;
      map.width = Math.floor(mapWidth * dpr);
      map.height = Math.floor(mapHeight * dpr);
      mapCtx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };

    const tick = (now: number) => {
      const state = anim.current;
      state.t = reduceMotion ? 1 : Math.min(1, (now - state.start) / TRANSITION_MS);
      draw();
      frame = state.t < 1 ? requestAnimationFrame(tick) : null;
    };

    kick.current = () => {
      if (frame === null) frame = requestAnimationFrame(tick);
    };

    const observer = new ResizeObserver(() => {
      lastWidth = -1;
      resize();
    });
    if (iso.parentElement) observer.observe(iso.parentElement);
    if (map.parentElement) observer.observe(map.parentElement);
    resize();

    return () => {
      observer.disconnect();
      if (frame !== null) cancelAnimationFrame(frame);
      kick.current = () => {};
    };
  }, [sim, appearance, reduceMotion]);

  /* ── State changes ────────────────────────────────────────────────────── */

  const changeMode = (next: Mode) => {
    const state = anim.current;
    if (next === state.to) return;
    state.from = state.to;
    state.to = next;
    state.start = performance.now();
    state.t = 0;
    setMode(next);
    kick.current();
  };

  const select = (index: number) => {
    if (index < 0 || index >= COLS * ROWS || index === anim.current.selected) return;
    anim.current.selected = index;
    setSelected(index);
    kick.current();
  };

  // The reveal: the first time the explorer is properly on screen, raise the
  // city from hyperspectral-only to fused — unless the visitor got there first.
  useEffect(() => {
    // Watch the city itself, not the whole panel: on a phone the panel is
    // taller than the screen, so a threshold on it would never be reached.
    const node = isoRef.current;
    if (!node || reduceMotion) return;
    let timer: number | undefined;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        timer = window.setTimeout(() => {
          if (!interactedRef.current) changeMode("fused");
        }, AUTOPLAY_DELAY_MS);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      window.clearTimeout(timer);
    };
    // changeMode only touches refs and a state setter; safe to omit.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  /* ── Pointer picking ──────────────────────────────────────────────────── */

  const pickIso = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const point: Point = [event.clientX - rect.left, event.clientY - rect.top];
    const { tile, originX, originY, zScale, k } = geometry.current;
    // Front to back, so a tall building in front wins over what's behind it.
    for (let j = DRAW_ORDER.length - 1; j >= 0; j -= 1) {
      const index = DRAW_ORDER[j];
      const c = index % COLS;
      const r = Math.floor(index / COLS);
      const x = originX + (c - r) * tile;
      const y = originY + ((c + r) * tile) / 2;
      const z = sim.heights[index] * zScale * k;
      const silhouette: Point[] = [
        [x, y - z],
        [x + tile, y + tile / 2 - z],
        [x + tile, y + tile / 2],
        [x, y + tile],
        [x - tile, y + tile / 2],
        [x - tile, y + tile / 2 - z],
      ];
      if (insideConvex(point, silhouette)) {
        interactedRef.current = true;
        select(index);
        return;
      }
    }
  };

  const pickMap = (event: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const cell = rect.width / COLS;
    const c = Math.floor((event.clientX - rect.left) / cell);
    const r = Math.floor((event.clientY - rect.top) / cell);
    if (c < 0 || c >= COLS || r < 0 || r >= ROWS) return;
    interactedRef.current = true;
    select(r * COLS + c);
  };

  const handleKey = (event: React.KeyboardEvent) => {
    const moves: Record<string, number> = {
      ArrowLeft: -1,
      ArrowRight: 1,
      ArrowUp: -COLS,
      ArrowDown: COLS,
    };
    const delta = moves[event.key];
    if (delta === undefined) return;
    event.preventDefault();
    const c = selected % COLS;
    if ((delta === -1 && c === 0) || (delta === 1 && c === COLS - 1)) return;
    interactedRef.current = true;
    select(selected + delta);
  };

  /* ── Inspector data ───────────────────────────────────────────────────── */

  const truth = sim.truth[selected];
  const predicted = sim.predictions[mode][selected];
  const probabilities = Array.from(
    sim.probabilities[mode].subarray(selected * CLASSES.length, (selected + 1) * CLASSES.length),
  );
  const confidence = probabilities[predicted];
  const verdict =
    predicted !== truth
      ? `Wrong — called it ${CLASSES[predicted].name.toLowerCase()}`
      : confidence >= 0.9
        ? "Correct, and confident"
        : "Correct, but barely";
  const spectrum = sim.spectra[selected];
  const height = sim.heights[selected];
  const usesSpectrum = mode !== "lidar";
  const usesHeight = mode !== "spectral";
  const activeMode = MODES.find((m) => m.id === mode)!;

  // Spectrum chart geometry.
  // Wide viewBox so the SVG's 10-unit text lands near 10–12px on screen at
  // the column widths this renders into, rather than being scaled up.
  const chartW = 520;
  const chartH = 170;
  const px = (b: number) => 10 + (b * (chartW - 20)) / (BANDS - 1);
  const py = (v: number) => chartH - 22 - (Math.min(v, 0.6) / 0.6) * (chartH - 34);
  const polyline = (values: ArrayLike<number>) =>
    Array.from(values, (v, b) => `${px(b).toFixed(1)},${py(v).toFixed(1)}`).join(" ");
  const nirStart = px(WAVELENGTHS.findIndex((nm) => nm >= 700));

  const isoCaption = {
    spectral:
      "What the hyperspectral camera sees: a colour-infrared composite with no height. Plants glow red because they reflect near-infrared strongly.",
    lidar: "What LiDAR sees: height only, no material. Brighter is taller.",
    fused: "Both at once: material from the spectrum, height from LiDAR.",
  }[mode];

  return (
    <div
      ref={sectionRef}
      className="rounded-2xl border border-ink-rule bg-ink-panel/60 p-5 sm:p-8"
    >
      {/* ── Header and sensor switch ───────────────────────────────────── */}
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <p className="text-meta text-volt-hi">Interactive · why fusion matters</p>
          <h4 className="mt-3 text-h3 text-bone">
            Two sensors, one decision.
          </h4>
          <p className="mt-3 text-body text-bone-muted">
            A roof and a road look almost identical to a hyperspectral camera.
            Grass and trees do too. LiDAR tells them apart instantly, but
            can&apos;t tell road from grass from water. Switch sensors and watch
            the classifier fall apart and recover.
          </p>
        </div>

        <div
          role="group"
          aria-label="Sensor input"
          className="flex shrink-0 flex-wrap gap-1 rounded-full border border-ink-ruleHi p-1"
        >
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-pressed={mode === m.id}
              onClick={() => {
                interactedRef.current = true;
                changeMode(m.id);
              }}
              className={`rounded-full px-4 py-2 text-meta font-semibold transition-colors duration-200 ease-signature ${
                mode === m.id
                  ? "bg-bone text-ink-void"
                  : "text-bone-muted hover:text-ember"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Scene and prediction ───────────────────────────────────────── */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:gap-10">
        <figure className="lg:col-span-7">
          <div className="w-full">
            <canvas
              ref={isoRef}
              role="img"
              aria-label="Isometric view of a synthetic city: colour comes from hyperspectral data, building height from LiDAR."
              className="block w-full cursor-crosshair touch-none"
              onPointerMove={pickIso}
              onPointerDown={pickIso}
            />
          </div>
          <figcaption className="mt-3 text-meta text-bone-faint">
            {isoCaption}
          </figcaption>
        </figure>

        <div className="lg:col-span-5">
          <p className="text-meta text-bone-faint">Overall accuracy</p>
          <p className="mt-1 font-mono text-[clamp(2.5rem,6vw,3.75rem)] font-medium leading-none tracking-tight text-bone">
            <span ref={accuracyRef}>
              {(sim.accuracy[mode] * 100).toFixed(1)}%
            </span>
          </p>
          <p className="mt-3 text-body text-bone-muted">{activeMode.blurb}</p>

          <div
            className="mt-6 w-full rounded-md outline-none ring-ember focus-visible:ring-2"
            tabIndex={0}
            onKeyDown={handleKey}
            aria-label="Predicted land-cover map. Use arrow keys to inspect pixels."
          >
            <canvas
              ref={mapRef}
              aria-hidden="true"
              className="block w-full cursor-crosshair touch-none rounded-md"
              onPointerMove={pickMap}
              onPointerDown={pickMap}
            />
          </div>
          <p className="mt-2 text-micro text-bone-faint">
            Predicted map · dark dots mark mistakes
          </p>
          <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
            {CLASSES.map((cls) => (
              <li key={cls.name} className="flex items-center gap-2 text-meta text-bone-muted">
                <span
                  aria-hidden="true"
                  className="h-2.5 w-2.5 rounded-sm"
                  style={{ backgroundColor: cls.color }}
                />
                {cls.name}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ── Pixel inspector ────────────────────────────────────────────── */}
      <div className="mt-10 border-t border-ink-rule pt-8">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <p className="text-meta text-bone-muted">
            <span className="text-bone">Pixel {selected % COLS}, {Math.floor(selected / COLS)}</span>
            {" · "}actually{" "}
            <span style={{ color: CLASSES[truth].color }}>{CLASSES[truth].name.toLowerCase()}</span>
          </p>
          <p
            className={`text-meta font-semibold ${
              predicted === truth ? "text-bone" : "text-ember"
            }`}
          >
            {verdict}
          </p>
        </div>
        <p className="mt-1 text-micro text-bone-faint">
          Hover or tap anywhere on the city or the map.
        </p>

        <div className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-12">
          {/* Spectrum */}
          <div
            className={`transition-opacity duration-300 sm:col-span-6 ${usesSpectrum ? "" : "opacity-30"}`}
          >
            <p className="text-meta text-bone-muted">
              Spectrum · {BANDS} bands{usesSpectrum ? "" : " · not used"}
            </p>
            <svg
              viewBox={`0 0 ${chartW} ${chartH}`}
              className="mt-2 w-full"
              role="img"
              aria-label={`Reflectance spectrum of the selected pixel from 400 to 1000 nanometres, compared with the average spectrum of each class.`}
            >
              <rect
                x={nirStart}
                y={8}
                width={chartW - 10 - nirStart}
                height={chartH - 30}
                fill={withAlpha(palette.volt.DEFAULT, 0.06)}
              />
              {MEAN_SPECTRA.map((mean, k) => (
                <polyline
                  key={CLASSES[k].name}
                  points={polyline(mean)}
                  fill="none"
                  stroke={CLASSES[k].color}
                  strokeOpacity={0.45}
                  strokeWidth={1}
                  strokeDasharray="3 3"
                />
              ))}
              <polyline
                points={polyline(spectrum)}
                fill="none"
                stroke={palette.bone.DEFAULT}
                strokeWidth={2}
                strokeLinejoin="round"
              />
              <line x1={10} x2={chartW - 10} y1={chartH - 22} y2={chartH - 22} stroke={palette.ink.ruleHi} />
              <text x={10} y={chartH - 6} fill={palette.bone.faint} fontSize={10}>400 nm</text>
              <text x={nirStart} y={chartH - 6} fill={palette.bone.faint} fontSize={10} textAnchor="middle">700</text>
              <text x={chartW - 10} y={chartH - 6} fill={palette.bone.faint} fontSize={10} textAnchor="end">1000 nm</text>
              <text x={nirStart + 6} y={20} fill={palette.volt.hi} fontSize={10}>near-infrared</text>
              <text x={14} y={20} fill={palette.bone.faint} fontSize={10}>visible</text>
            </svg>
          </div>

          {/* Height */}
          <div
            className={`transition-opacity duration-300 sm:col-span-2 ${usesHeight ? "" : "opacity-30"}`}
          >
            <p className="text-meta text-bone-muted">
              Height{usesHeight ? "" : " · not used"}
            </p>
            <div className="mt-2 flex items-end gap-3">
              <div className="relative h-32 w-3 overflow-hidden rounded-full bg-ink-rule">
                <div
                  className="absolute inset-x-0 bottom-0 rounded-full bg-volt-hi transition-[height] duration-300 ease-signature"
                  style={{ height: `${Math.min(100, (height / MAX_HEIGHT_M) * 100)}%` }}
                />
              </div>
              <p className="font-mono text-h3 text-bone">
                {height.toFixed(1)}
                <span className="ml-1 text-meta text-bone-faint">m</span>
              </p>
            </div>
          </div>

          {/* Class probabilities */}
          <div className="sm:col-span-4">
            <p className="text-meta text-bone-muted">What the model thinks</p>
            <ul className="mt-3 space-y-2.5">
              {CLASSES.map((cls, k) => (
                <li key={cls.name} className="grid grid-cols-[3.5rem_1fr_2.75rem] items-center gap-3">
                  <span className="text-meta text-bone-muted">{cls.name}</span>
                  <span className="h-2 overflow-hidden rounded-full bg-ink-rule">
                    <span
                      className="block h-full rounded-full transition-[width] duration-500 ease-signature"
                      style={{
                        width: `${probabilities[k] * 100}%`,
                        backgroundColor: cls.color,
                      }}
                    />
                  </span>
                  <span className="text-right font-mono text-meta text-bone">
                    {Math.round(probabilities[k] * 100)}%
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      <p className="mt-10 max-w-3xl text-micro leading-relaxed text-bone-faint">
        Toy simulation, built for this page: 800 synthetic pixels and a
        Gaussian naive-Bayes classifier, all computed live in your browser. It
        shows why fusion helps — it is not my research model or its results.
        The real work uses deep networks (CNN, Transformer, and Mamba) on public
        benchmark datasets like Houston 2013.
      </p>
    </div>
  );
}
