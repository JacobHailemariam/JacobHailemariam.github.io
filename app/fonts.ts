import { Bricolage_Grotesque, Manrope, JetBrains_Mono } from "next/font/google";

/**
 * next/font downloads these at build time and self-hosts them from your own
 * domain. That means: no request to fonts.googleapis.com at runtime, no
 * third-party round trip on first paint, and `display: "swap"` plus an
 * auto-generated size-adjusted fallback so text never jumps when the real
 * font lands. This is the single biggest font-related perf win available and
 * it costs one import.
 *
 * Each font exposes a CSS variable, which tailwind.config.ts maps to
 * font-display / font-sans / font-mono.
 */

/**
 * DISPLAY — Bricolage Grotesque.
 * A variable grotesque with genuine character in the letterforms (that flat-
 * topped 'a', the tight apertures) without tipping into novelty. Chosen over
 * the usual Space Grotesk / Inter default because it still reads cleanly at
 * 8rem, which is where the hero puts it.
 */
export const displayFont = Bricolage_Grotesque({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-display",
});

/**
 * BODY — Manrope.
 * Open counters, slightly geometric, quiet enough to sit under the display
 * face without competing. Comfortable down to 13px for metadata.
 */
export const sansFont = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

/**
 * DATA — JetBrains Mono.
 * Reserved strictly for numbers that are measurements: accuracies, latencies,
 * parameter counts. Monospace signals "this is instrumentation output". Using
 * it for decorative labels would dilute that signal, so don't.
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
