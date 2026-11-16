import type { Config } from "tailwindcss";
import { palette } from "./lib/palette";

/**
 * ─────────────────────────────────────────────────────────────────────────────
 * THE ONE FILE TO RETUNE THE SITE
 * ─────────────────────────────────────────────────────────────────────────────
 * Every colour, font, and spacing decision the site makes routes through here.
 *
 * The palette is named by role, not by hue (see lib/palette.ts):
 *
 *   ink    → backgrounds and hairlines (darkest to lightest)
 *   bone   → text (brightest to dimmest)
 *   ch1    → channel 1, teal. Machine learning.
 *   ch2    → channel 2, amber. Hardware and embedded.
 *
 * Those two channels are the only colour on the site. Hover and focus states
 * brighten to bone instead of borrowing a channel colour.
 */

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  // Hover styles only apply on devices that can actually hover, so a tap on a
  // phone doesn't leave a card stuck in its hover state.
  future: { hoverOnlyWhenSupported: true },
  theme: {
    extend: {
      // Sourced from lib/palette.ts so the canvases, which paint with literal
      // colour strings rather than classes, can't drift out of sync.
      colors: palette,

      fontFamily: {
        // Loaded in app/fonts.ts and bound to these CSS variables in layout.tsx.
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },

      fontSize: {
        // Line-heights are baked in so headings never need a leading- class.
        micro: ["0.6875rem", { lineHeight: "1.4", letterSpacing: "0.04em" }],
        meta: ["0.8125rem", { lineHeight: "1.5", letterSpacing: "0.01em" }],
        body: ["1rem", { lineHeight: "1.65" }],
        lede: ["1.1875rem", { lineHeight: "1.6" }],
        h3: ["1.5rem", { lineHeight: "1.2", letterSpacing: "-0.02em" }],
        h2: ["clamp(2rem, 4.5vw, 3.25rem)", { lineHeight: "1.02", letterSpacing: "-0.035em" }],
        h1: ["clamp(3rem, 11vw, 8.5rem)", { lineHeight: "0.88", letterSpacing: "-0.05em" }],
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
        // Hero text rises out of a clipping mask, one line after another.
        "line-rise": {
          from: { transform: "translate3d(0, 105%, 0)" },
          to: { transform: "translate3d(0, 0, 0)" },
        },
        "fade-rise": {
          from: { opacity: "0", transform: "translate3d(0, 18px, 0)" },
          to: { opacity: "1", transform: "translate3d(0, 0, 0)" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
      },
      animation: {
        "line-rise": "line-rise 0.9s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-rise": "fade-rise 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 1.4s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
