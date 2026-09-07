/**
 * Motion constants, shared so every animated element on the site decelerates
 * on the same curve. Mixed easing across a page is one of those things nobody
 * can name but everybody feels as "slightly off".
 *
 * The explicit tuple type matters: Framer Motion's `ease` accepts a
 * BezierDefinition, which is `[number, number, number, number]`. Writing the
 * array inline with `as const` produces a *readonly* tuple, which TypeScript
 * will refuse to assign. Typing it here fixes that once instead of at every
 * call site.
 */
export const SIGNATURE_EASE: [number, number, number, number] = [
  0.22, 1, 0.36, 1,
];

/** Matches `ease-signature` in tailwind.config.ts. Keep the two in sync. */
export const SIGNATURE_EASE_CSS = "cubic-bezier(0.22, 1, 0.36, 1)";
