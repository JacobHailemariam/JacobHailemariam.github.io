import {
  Bricolage_Grotesque,
  Instrument_Sans,
  JetBrains_Mono,
} from "next/font/google";

/**
 * next/font downloads these at build time and self-hosts them from your own
 * domain: no request to fonts.googleapis.com at runtime, and a size-adjusted
 * fallback so text doesn't jump when the real font lands.
 *
 * Each font exposes a CSS variable, which tailwind.config.ts maps to
 * font-display / font-sans / font-mono.
 */

/**
 * DISPLAY: Bricolage Grotesque.
 * A variable grotesque with real character in the letterforms. Set heavy and
 * tight, it reads like lettering stamped on an equipment panel.
 */
export const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/**
 * BODY: Instrument Sans.
 * Slightly condensed and precise, quiet enough to sit under the display face.
 */
export const sansFont = Instrument_Sans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/**
 * READOUT: JetBrains Mono.
 * Two jobs only: measured numbers, and the small uppercase labels that mark
 * sections, channels and figures (the `.label` class). Never body copy.
 */
export const monoFont = JetBrains_Mono({
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500"],
  variable: "--font-mono",
});

export const fontVariables = [
  displayFont.variable,
  sansFont.variable,
  monoFont.variable,
].join(" ");
