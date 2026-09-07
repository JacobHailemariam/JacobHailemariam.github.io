import type { Config } from "tailwindcss";
import { palette } from "./lib/palette";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THE ONE FILE TO RETUNE THE SITE
 * ─────────────────────────────────────────────────────────────────────────────
 * Every colour, font, and spacing decision the site makes routes through here.
 * Change a hex below and it propagates everywhere — no hunting through
 * components for a stray `#7F5AF0`.
 *
 * The palette is named by role, not by hue, so you can swap the actual colours
 * without the class names becoming lies:
 *
 *   ink    → backgrounds and hairlines (darkest to lightest)
 *   bone   → text (brightest to dimmest)
 *   volt   → the signature accent. Electric violet.
 *   ember  → the secondary accent. Warm gold. Used ONLY for hover, focus,
 *            and a small number of "look here" highlights. If ember starts
 *            showing up everywhere, the hierarchy is broken.
 */

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      // Sourced from lib/palette.ts so the hero canvas — which paints with
      // literal colour strings, not classes — can't drift out of sync.
      colors: palette,

      fontFamily: {
        // Loaded in app/fonts.ts and bound to these CSS variables in layout.tsx.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      fontSize: {
        // A modular scale (~1.25 minor third at the small end, widening at the
        // display end so headlines actually carry weight). Line-heights are
        // baked in so headings never need a separate leading- class.
        micro: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.04em" }],
        meta: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        body: ["1rem", { lineHeight: "1.65" }],
        lede: ["1.1875rem", { lineHeight: "1.6" }],
        h3: ["1.5rem", { lineHeight: "1.25", letterSpacing: "-0.015em" }],
        h2: ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.05", letterSpacing: "-0.03em" }],
        h1: ["clamp(3rem, 11vw, 8.5rem)", { lineHeight: "0.88", letterSpacing: "-0.045em" }],
      },

      maxWidth: {
        // ~68 characters at our body size. Keeps prose readable.
        prose: "34rem",
        shell: "82rem",
      },

      transitionTimingFunction: {
        // One easing curve for the whole site. Consistency reads as intent.
        signature: "cubic-bezier(0.22, 1, 0.36, 1)",
      },

      keyframes: {
        "rule-draw": {
          from: { transform: "scaleX(0)" },
          to: { transform: "scaleX(1)" },
        },
      },
      animation: {
        "rule-draw": "rule-draw 0.9s cubic-bezier(0.22, 1, 0.36, 1) forwards",
      },
    },
  },
  plugins: [],
};

export default config;
