/**
 * ─────────────────────────────────────────────────────────────────────────────
 * FUSION SIMULATION — the data behind the research-section explorer
 * ─────────────────────────────────────────────────────────────────────────────
 * A deliberately small, fully synthetic stand-in for hyperspectral + LiDAR
 * land-cover classification. It exists to make one idea visible in five
 * seconds: each sensor alone is ambiguous, and fusing them is not.
 *
 *   · A roof and a road are both dark, flat-spectrum materials. Spectrally
 *     they're near-identical; only LiDAR height separates them.
 *   · Grass and trees share the vegetation "red edge". Height separates them.
 *   · Road, grass, and water are all at ground level, so LiDAR alone can't
 *     tell them apart — but their spectra are completely different.
 *
 * The classifier is a Gaussian naive Bayes with the true class statistics, so
 * every number the explorer shows is computed, not typed in. It is NOT the
 * research model and the page says so. Pure functions, no React, no DOM.
 */

export const COLS = 40;
export const ROWS = 20;
export const BANDS = 32;

/** Band centres in nanometres, 400–1000 nm (visible through near-infrared). */
export const WAVELENGTHS = Array.from({ length: BANDS }, (_, i) =>
  Math.round(400 + (i * 600) / (BANDS - 1)),
);

export type Mode = "spectral" | "lidar" | "fused";

export const MODES: { id: Mode; label: string; blurb: string }[] = [
  {
    id: "spectral",
    label: "Hyperspectral only",
    blurb: "Knows what things are made of. Can't tell a roof from a road.",
  },
  {
    id: "lidar",
    label: "LiDAR only",
    blurb: "Knows how tall things are. Road, grass, and water all look flat.",
  },
  {
    id: "fused",
    label: "Fused",
    blurb: "Material and height together. The ambiguities cancel out.",
  },
];

export type ClassInfo = {
  name: string;
  color: string;
  /** Mean and standard deviation of LiDAR height, in metres. */
  height: [number, number];
  spectrum: (nm: number) => number;
};

const gauss = (x: number, mean: number, sd: number) =>
  Math.exp(-((x - mean) ** 2) / (2 * sd * sd));
const sigmoid = (x: number) => 1 / (1 + Math.exp(-x));

/** Chlorophyll: a small green bump, red absorption, then the steep red edge. */
const vegetation = (nm: number, nir: number) =>
  0.03 + 0.07 * gauss(nm, 550, 30) + nir * sigmoid((nm - 712) / 14);

export const CLASSES: ClassInfo[] = [
  {
    name: "Road",
    color: "#8C8C99",
    height: [0.1, 0.5],
    spectrum: (nm) => 0.07 + (0.07 * (nm - 400)) / 600,
  },
  {
    name: "Roof",
    color: "#E07A5F",
    height: [9, 2.5],
    // Dark membrane roofing: within a hair of asphalt across every band.
    spectrum: (nm) => 0.074 + (0.07 * (nm - 400)) / 600,
  },
  {
    name: "Grass",
    color: "#A3D977",
    height: [0.15, 0.5],
    spectrum: (nm) => vegetation(nm, 0.42),
  },
  {
    name: "Tree",
    color: "#2E9E6B",
    height: [8, 3],
    spectrum: (nm) => vegetation(nm, 0.4),
  },
  {
    name: "Water",
    color: "#4EA8DE",
    height: [0, 0.4],
    spectrum: (nm) => 0.015 + 0.06 * gauss(nm, 490, 70),
  },
];

const ROAD = 0;
const ROOF = 1;
const GRASS = 2;
const TREE = 3;
const WATER = 4;

/* ── Noise model ──────────────────────────────────────────────────────────── */

const SPECTRAL_NOISE = 0.02; // additive sensor noise, per band
const BRIGHTNESS_SPREAD = 0.15; // illumination: each pixel scaled by U(1±0.15)
const BRIGHTNESS_SD = (2 * BRIGHTNESS_SPREAD) / Math.sqrt(12);

const MEAN_SPECTRA = CLASSES.map((c) => WAVELENGTHS.map((nm) => c.spectrum(nm)));
const SPECTRAL_SD = MEAN_SPECTRA.map((spectrum) =>
  spectrum.map((mu) => Math.hypot(SPECTRAL_NOISE, BRIGHTNESS_SD * mu)),
);

export { MEAN_SPECTRA };

/* ── Deterministic randomness ─────────────────────────────────────────────── */

/** mulberry32 — tiny, seedable, and plenty for a 800-pixel toy scene. */
function makeRandom(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeNormal(random: () => number) {
  return () => {
    const u = Math.max(random(), 1e-9);
    const v = random();
    return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v);
  };
}

/* ── Scene layout ─────────────────────────────────────────────────────────── */

const ROAD_ROWS = [5, 6, 12, 13];
const ROAD_COLS = [8, 9, 21, 22, 32, 33];
const BLOCK_ROWS: [number, number][] = [
  [0, 4],
  [7, 11],
  [14, 19],
];
const BLOCK_COLS: [number, number][] = [
  [0, 7],
  [10, 20],
  [23, 31],
  [34, 39],
];

function buildScene(random: () => number): Uint8Array {
  const truth = new Uint8Array(COLS * ROWS).fill(GRASS);
  const set = (c: number, r: number, cls: number) => {
    if (c >= 0 && c < COLS && r >= 0 && r < ROWS) truth[r * COLS + c] = cls;
  };
  const randInt = (lo: number, hi: number) =>
    lo + Math.floor(random() * (hi - lo + 1));

  // A river across the bottom, meandering a little. Laid down first so
  // buildings and trees only ever land on dry ground.
  for (let c = 0; c < COLS; c += 1) {
    const top = 16 + Math.round(1.3 * Math.sin(c / 4.2) + 0.6);
    for (let r = top; r < ROWS; r += 1) set(c, r, WATER);
  }

  // Buildings and tree clusters inside each block.
  for (const [r0, r1] of BLOCK_ROWS) {
    for (const [c0, c1] of BLOCK_COLS) {
      const w = c1 - c0 + 1;
      const h = r1 - r0 + 1;
      if (random() < 0.8 && w >= 5 && h >= 4) {
        const bw = Math.max(2, w - 2 - randInt(0, 3));
        const bh = Math.max(2, h - 2 - randInt(0, 1));
        const bx = c0 + 1 + randInt(0, w - 2 - bw);
        const by = r0 + 1 + randInt(0, Math.max(0, h - 2 - bh));
        for (let r = by; r < by + bh; r += 1)
          for (let c = bx; c < bx + bw; c += 1)
            if (truth[r * COLS + c] === GRASS) set(c, r, ROOF);
      }
      const clusters = randInt(1, 2);
      for (let k = 0; k < clusters; k += 1) {
        const cx = randInt(c0, c1);
        const cy = randInt(r0, r1);
        const radius = 0.9 + random() * 1.1;
        for (let r = r0; r <= r1; r += 1)
          for (let c = c0; c <= c1; c += 1)
            if (
              Math.hypot(c - cx, r - cy) <= radius &&
              truth[r * COLS + c] === GRASS
            )
              set(c, r, TREE);
      }
    }
  }

  // Roads last, so the vertical ones bridge the river.
  for (const r of ROAD_ROWS) for (let c = 0; c < COLS; c += 1) set(c, r, ROAD);
  for (const c of ROAD_COLS) for (let r = 0; r < ROWS; r += 1) set(c, r, ROAD);

  return truth;
}

/* ── Classifier ───────────────────────────────────────────────────────────── */

const LOG_SQRT_2PI = 0.5 * Math.log(2 * Math.PI);

/**
 * Neighbouring bands share one illumination factor, so 32 bands are nowhere
 * near 32 independent measurements. Naive Bayes would count them as if they
 * were and drown out the single height reading; this scales the spectral
 * evidence down to roughly its effective number of independent bands.
 */
const SPECTRAL_EVIDENCE_WEIGHT = 1 / 6;
const logNormal = (x: number, mu: number, sd: number) =>
  -((x - mu) ** 2) / (2 * sd * sd) - Math.log(sd) - LOG_SQRT_2PI;

function classify(
  spectrum: Float32Array,
  height: number,
  mode: Mode,
  out: Float32Array,
  offset: number,
) {
  const logLikelihood = CLASSES.map((cls, k) => {
    let total = 0;
    if (mode !== "lidar") {
      let spectral = 0;
      for (let b = 0; b < BANDS; b += 1)
        spectral += logNormal(spectrum[b], MEAN_SPECTRA[k][b], SPECTRAL_SD[k][b]);
      total += spectral * SPECTRAL_EVIDENCE_WEIGHT;
    }
    if (mode !== "spectral") {
      total += logNormal(height, cls.height[0], cls.height[1]);
    }
    return total;
  });
  const peak = Math.max(...logLikelihood);
  const exps = logLikelihood.map((ll) => Math.exp(ll - peak));
  const sum = exps.reduce((a, b) => a + b, 0);
  let best = 0;
  exps.forEach((e, k) => {
    out[offset + k] = e / sum;
    if (e > exps[best]) best = k;
  });
  return best;
}

/* ── Public entry point ───────────────────────────────────────────────────── */

export type Simulation = {
  truth: Uint8Array;
  spectra: Float32Array[];
  heights: Float32Array;
  predictions: Record<Mode, Uint8Array>;
  /** Row-major, CLASSES.length probabilities per pixel. */
  probabilities: Record<Mode, Float32Array>;
  accuracy: Record<Mode, number>;
};

export function buildSimulation(seed = 20260501): Simulation {
  const random = makeRandom(seed);
  const normal = makeNormal(random);
  const truth = buildScene(random);
  const count = COLS * ROWS;

  const spectra: Float32Array[] = [];
  const heights = new Float32Array(count);
  for (let i = 0; i < count; i += 1) {
    const cls = truth[i];
    const brightness = 1 + (random() * 2 - 1) * BRIGHTNESS_SPREAD;
    const spectrum = new Float32Array(BANDS);
    for (let b = 0; b < BANDS; b += 1)
      spectrum[b] = Math.max(
        0,
        MEAN_SPECTRA[cls][b] * brightness + normal() * SPECTRAL_NOISE,
      );
    spectra.push(spectrum);
    const [mu, sd] = CLASSES[cls].height;
    heights[i] = Math.max(0, mu + normal() * sd);
  }

  const modes: Mode[] = ["spectral", "lidar", "fused"];
  const predictions = {} as Record<Mode, Uint8Array>;
  const probabilities = {} as Record<Mode, Float32Array>;
  const accuracy = {} as Record<Mode, number>;
  for (const mode of modes) {
    const pred = new Uint8Array(count);
    const prob = new Float32Array(count * CLASSES.length);
    let correct = 0;
    for (let i = 0; i < count; i += 1) {
      pred[i] = classify(spectra[i], heights[i], mode, prob, i * CLASSES.length);
      if (pred[i] === truth[i]) correct += 1;
    }
    predictions[mode] = pred;
    probabilities[mode] = prob;
    accuracy[mode] = correct / count;
  }

  return { truth, spectra, heights, predictions, probabilities, accuracy };
}

/** Colour-infrared composite (NIR→R, red→G, green→B), the standard way remote
 *  sensing renders vegetation: healthy plants come out bright red. */
const NIR_BAND = WAVELENGTHS.findIndex((nm) => nm >= 800);
const RED_BAND = WAVELENGTHS.findIndex((nm) => nm >= 660);
const GREEN_BAND = WAVELENGTHS.findIndex((nm) => nm >= 550);

export function colorInfrared(spectrum: Float32Array): [number, number, number] {
  const scale = (v: number) => Math.min(255, Math.round(Math.pow(v * 2.2, 0.8) * 255));
  return [scale(spectrum[NIR_BAND]), scale(spectrum[RED_BAND]), scale(spectrum[GREEN_BAND])];
}
