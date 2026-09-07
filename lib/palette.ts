/**
 * ─────────────────────────────────────────────────────────────────────────────
 * PALETTE
 * ─────────────────────────────────────────────────────────────────────────────
 * The raw hex values, in one place.
 *
 * Why this file exists rather than putting the hexes straight into
 * tailwind.config.ts: the hero's <canvas> paints with the 2D context, which
 * knows nothing about Tailwind classes — it needs literal colour strings at
 * runtime. Without a shared module you end up with the violet defined twice,
 * and the day you retune the accent, the canvas quietly keeps the old one.
 *
 * So: this file is the source, tailwind.config.ts imports it, and the canvas
 * imports it. Change a value here and both follow.
 *
 * Names describe ROLE, not hue, so swapping violet for teal doesn't turn every
 * class name into a lie.
 */

export const palette = {
  /** Backgrounds and hairlines, darkest to lightest. */
  ink: {
    void: "#0A0A0B",
    panel: "#101014",
    panelHi: "#16161B",
    rule: "#1E1E25",
    ruleHi: "#34343F",
  },
  /** Text, brightest to dimmest. Never pure white — #EDEAE4 is warmer and
   *  easier on the eye against near-black. */
  bone: {
    DEFAULT: "#EDEAE4",
    muted: "#9A9AA6",
    faint: "#63636E",
  },
  /** Signature accent. Electric violet. */
  volt: {
    DEFAULT: "#7F5AF0",
    hi: "#A78BFA",
    lo: "#4C2FA8",
  },
  /** Secondary accent. Warm gold — hover, focus, and pointer response only. */
  ember: {
    DEFAULT: "#F0B429",
    hi: "#FFCE5C",
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
