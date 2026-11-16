/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PALETTE
 * ─────────────────────────────────────────────────────────────────────────────
 * The raw hex values, in one place.
 *
 * Why this file exists rather than putting the hexes straight into
 * tailwind.config.ts: the hero's <canvas> paints with the 2D context, which
 * knows nothing about Tailwind classes. It needs literal colour strings at
 * runtime. So this file is the source, tailwind.config.ts imports it, and the
 * canvases import it. Change a value here and both follow.
 *
 * THE TWO-CHANNEL RULE
 * The site is drawn like a two-channel instrument. Exactly two colours carry
 * meaning, and nothing else on the page is allowed colour:
 *
 *   ch1 (teal)  → machine learning: models, training, research
 *   ch2 (amber) → hardware: firmware, boards, embedded
 *
 * Everything else is graphite and bone. If a third hue shows up, or either
 * channel starts being used as decoration, the system stops meaning anything.
 */

export const palette = {
  /** Backgrounds and hairlines, darkest to lightest. Cool graphite. */
  ink: {
    void: "#0B0D10",
    panel: "#11151A",
    panelHi: "#171C22",
    rule: "#222931",
    ruleHi: "#3A434E",
  },
  /**
   * Text, brightest to dimmest. All three pass WCAG AA (4.5:1) for body-size
   * text on both `void` and `panel`; `faint` is the floor at about 5.5:1.
   */
  bone: {
    DEFAULT: "#E6E9EC",
    muted: "#A6AEB8",
    faint: "#828B96",
  },
  /** Channel 1. Machine learning. */
  ch1: {
    DEFAULT: "#3DDCC8",
    hi: "#7DEBDD",
    lo: "#1C7F74",
  },
  /** Channel 2. Hardware and embedded. */
  ch2: {
    DEFAULT: "#FFB224",
    hi: "#FFCB66",
    lo: "#9A6A0F",
  },
};

/**
 * Canvas needs alpha compositing, and hex-with-alpha (#RRGGBBAA) isn't
 * supported everywhere. This converts once at module load.
 */
export function withAlpha(hex: string, alpha: number): string {
  const normalized = hex.replace("#", "");
  const r = parseInt(normalized.slice(0, 2), 16);
  const g = parseInt(normalized.slice(2, 4), 16);
  const b = parseInt(normalized.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
