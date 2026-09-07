"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";
import { palette, withAlpha } from "@/lib/palette";

/* ── Tuning constants ─────────────────────────────────────────────────────── */

const GRID_SPACING = 26; // px between lattice nodes
const BASE_RADIUS = 1.1; // px, an unlit node
const PEAK_RADIUS = 2.9; // px, a fully lit node
const SWEEP_PERIOD_MS = 5200; // one full left-to-right pass
const SWEEP_WIDTH = 140; // px, how wide the illuminated band is
const ENERGY_DECAY = 0.955; // per frame; lower = shorter trail
const POINTER_RADIUS = 130; // px, how far the cursor reaches
const MAX_DPR = 2; // cap: retina is enough, 3x is wasted fill rate

type Node = {
  x: number;
  y: number;
  /** 0–1. Set by the sweep and the pointer, decays every frame. */
  energy: number;
  /** Per-node jitter so the sweep edge isn't a perfectly straight line. */
  phase: number;
};

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THE SIGNATURE MOMENT
 * ─────────────────────────────────────────────────────────────────────────────
 * A lattice of points with a band of light sweeping across it, leaving a
 * decaying trail. Points near the cursor light amber.
 *
 * Why this and not a gradient blob: it's a picture of the actual job. A
 * hyperspectral sensor and a LiDAR unit both work by sweeping a scene and
 * reading a return per sample point. The hero is literally an instrument
 * acquiring a frame — which means the most eye-catching thing on the page is
 * also the most on-subject thing on the page. That's the whole design bet.
 *
 * ── How it works ────────────────────────────────────────────────────────────
 * 1. Build a fixed lattice of nodes once per resize. Positions never change,
 *    so there's no per-frame allocation and no garbage-collection stutter.
 * 2. Each frame, compute the sweep's x position from elapsed time (NOT from a
 *    frame counter — that would run at different speeds on 60Hz and 144Hz
 *    displays).
 * 3. For each node, if it falls inside the sweep band, raise its `energy`
 *    toward 1. Same for proximity to the pointer.
 * 4. Multiply every node's energy by ENERGY_DECAY. That single line is what
 *    produces the comet trail — no trail buffer, no second canvas.
 * 5. Draw. Radius and colour both interpolate on energy.
 *
 * ── Performance ─────────────────────────────────────────────────────────────
 * · devicePixelRatio is capped at 2. Beyond that you're shading pixels nobody
 *   can resolve, and on a 3x phone it's the difference between 60fps and 40.
 * · An IntersectionObserver cancels the animation frame loop entirely when the
 *   hero scrolls out of view. There's no reason to burn a phone's battery
 *   animating something six sections above the viewport.
 * · Pointer position is stored in a ref, never in state. Putting it in state
 *   would re-render React on every mousemove, which is the classic way to make
 *   a canvas effect janky.
 *
 * ── Reduced motion ──────────────────────────────────────────────────────────
 * If the visitor's OS asks for reduced motion we paint the lattice once at a
 * low uniform energy and return without ever starting the loop or attaching
 * pointer listeners. Not a slower animation — no animation.
 */
export default function SensorField() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let animationFrameId: number | null = null;
    let startTime = performance.now();

    /* ── Lattice construction ──────────────────────────────────────────── */

    const buildLattice = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);

      width = rect.width;
      height = rect.height;

      // Backing store is scaled for the display; the transform lets the rest
      // of the code think entirely in CSS pixels.
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);

      const columns = Math.ceil(width / GRID_SPACING) + 1;
      const rows = Math.ceil(height / GRID_SPACING) + 1;

      nodes = [];
      for (let column = 0; column < columns; column += 1) {
        for (let row = 0; row < rows; row += 1) {
          nodes.push({
            x: column * GRID_SPACING,
            y: row * GRID_SPACING,
            energy: 0,
            // Deterministic pseudo-jitter. Math.random() would reshuffle on
            // every resize, which looks like a glitch rather than a texture.
            phase: Math.sin(column * 12.9898 + row * 78.233) * 0.5 + 0.5,
          });
        }
      }
    };

    /* ── Painting ──────────────────────────────────────────────────────── */

    const paintNode = (node: Node) => {
      const energy = node.energy;
      const radius = BASE_RADIUS + (PEAK_RADIUS - BASE_RADIUS) * energy;

      // Unlit nodes are barely there — the lattice should read as texture,
      // not as a dot-grid pattern shouting for attention.
      if (energy < 0.04) {
        context.fillStyle = withAlpha(palette.ink.ruleHi, 0.55);
      } else {
        // Fade from the deep violet through to the bright one as energy rises,
        // so the leading edge of the sweep is visibly hotter than its trail.
        const color = energy > 0.55 ? palette.volt.hi : palette.volt.DEFAULT;
        context.fillStyle = withAlpha(color, 0.25 + energy * 0.75);
      }

      context.beginPath();
      context.arc(node.x, node.y, radius, 0, Math.PI * 2);
      context.fill();
    };

    /* ── Static render (reduced motion) ────────────────────────────────── */

    const paintStaticLattice = () => {
      context.clearRect(0, 0, width, height);
      for (const node of nodes) {
        // A gentle horizontal ramp so it still reads as a field with direction
        // rather than a flat grid — but nothing moves.
        node.energy = 0.1 + (node.x / Math.max(width, 1)) * 0.18;
        paintNode(node);
      }
    };

    /* ── Animation loop ────────────────────────────────────────────────── */

    const renderFrame = (now: number) => {
      const elapsed = (now - startTime) % SWEEP_PERIOD_MS;
      const progress = elapsed / SWEEP_PERIOD_MS;

      // Overshoot the bounds on both sides so the sweep enters and exits
      // cleanly instead of popping into existence at x=0.
      const sweepX = -SWEEP_WIDTH + progress * (width + SWEEP_WIDTH * 2);
      const pointer = pointerRef.current;

      context.clearRect(0, 0, width, height);

      for (const node of nodes) {
        // 1. Sweep contribution — cosine falloff across the band gives a soft
        //    edge for free, no gradient object required.
        const distanceFromSweep = Math.abs(node.x - sweepX);
        if (distanceFromSweep < SWEEP_WIDTH) {
          const falloff = Math.cos(
            (distanceFromSweep / SWEEP_WIDTH) * (Math.PI / 2),
          );
          // The per-node phase staggers the band slightly so the leading edge
          // shimmers instead of arriving as a hard vertical line.
          const staggered = falloff * (0.7 + node.phase * 0.3);
          node.energy = Math.max(node.energy, staggered);
        }

        // 2. Pointer contribution.
        if (pointer) {
          const dx = node.x - pointer.x;
          const dy = node.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < POINTER_RADIUS) {
            const proximity = 1 - distance / POINTER_RADIUS;
            const radius =
              BASE_RADIUS + (PEAK_RADIUS - BASE_RADIUS) * proximity;

            // Pointer response is amber, matching the site's hover language.
            // Drawn immediately and separately so it layers over the sweep
            // rather than being averaged into it.
            context.fillStyle = withAlpha(
              palette.ember.DEFAULT,
              proximity * 0.85,
            );
            context.beginPath();
            context.arc(node.x, node.y, radius, 0, Math.PI * 2);
            context.fill();
            node.energy *= ENERGY_DECAY;
            continue;
          }
        }

        paintNode(node);

        // 3. Decay. This one line is the trail.
        node.energy *= ENERGY_DECAY;
      }

      animationFrameId = requestAnimationFrame(renderFrame);
    };

    /* ── Lifecycle ─────────────────────────────────────────────────────── */

    const startLoop = () => {
      if (animationFrameId !== null) return;
      startTime = performance.now();
      animationFrameId = requestAnimationFrame(renderFrame);
    };

    const stopLoop = () => {
      if (animationFrameId === null) return;
      cancelAnimationFrame(animationFrameId);
      animationFrameId = null;
    };

    buildLattice();

    if (prefersReducedMotion) {
      paintStaticLattice();
      return () => {
        /* nothing was started, nothing to tear down */
      };
    }

    /**
     * Pointer tracking listens on `window`, not on the canvas.
     *
     * This is not a stylistic choice — it's required. The canvas is painted at
     * z-index -10 behind the hero's text column, so it never receives a
     * pointermove of its own: the text container is on top and swallows them.
     * The alternative (pointer-events-none on the whole hero) would break text
     * selection and make the CTAs unclickable. Listening globally and
     * converting to canvas-local coordinates sidesteps all of it.
     *
     * The bounding rect is cached rather than read per event, because
     * getBoundingClientRect() forces the browser to flush layout, and doing
     * that on every pointermove is a well-known source of jank. It only
     * changes on resize and scroll, so that's when we refresh it.
     */
    let cachedRect = canvas.getBoundingClientRect();
    const refreshRect = () => {
      cachedRect = canvas.getBoundingClientRect();
    };

    const handlePointerMove = (event: PointerEvent) => {
      pointerRef.current = {
        x: event.clientX - cachedRect.left,
        y: event.clientY - cachedRect.top,
      };
    };

    const handlePointerLeave = () => {
      pointerRef.current = null;
    };

    const resizeObserver = new ResizeObserver(() => {
      buildLattice();
      refreshRect();
    });
    resizeObserver.observe(canvas);

    // Stop burning frames the moment the hero leaves the viewport.
    const visibilityObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) startLoop();
        else stopLoop();
      },
      { threshold: 0 },
    );
    visibilityObserver.observe(canvas);

    // Also stop when the tab is backgrounded. rAF usually throttles itself,
    // but being explicit costs two lines.
    const handleVisibilityChange = () => {
      if (document.hidden) stopLoop();
      else startLoop();
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("scroll", refreshRect, { passive: true });
    document.addEventListener("pointerleave", handlePointerLeave);
    document.addEventListener("visibilitychange", handleVisibilityChange);
    startLoop();

    return () => {
      stopLoop();
      resizeObserver.disconnect();
      visibilityObserver.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("scroll", refreshRect);
      document.removeEventListener("pointerleave", handlePointerLeave);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      // Purely decorative: it encodes no information a screen reader needs, and
      // the hero's heading already says everything. Hiding it is the correct
      // call — an alt description here would be noise.
      aria-hidden="true"
      className="h-full w-full"
    />
  );
}
