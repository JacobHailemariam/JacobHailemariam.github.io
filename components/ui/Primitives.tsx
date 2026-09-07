import type { ReactNode } from "react";
import type { Metric } from "@/lib/site-content";

/* ── TechTagList ──────────────────────────────────────────────────────────── */

/**
 * Tech tags read as a list to a screen reader, not as a run-on sentence, which
 * is why this is a real <ul> rather than a row of spans.
 *
 * Styling is deliberately flat — no pill backgrounds, no borders. On a page
 * that already has bordered cards and bordered image frames, adding a third
 * bordered thing turns the layout to noise. A hairline underline is enough.
 */
export function TechTagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-x-4 gap-y-2">
      {items.map((item) => (
        <li
          key={item}
          className="border-b border-ink-ruleHi pb-1 text-meta text-bone-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── MetricRow ────────────────────────────────────────────────────────────── */

/**
 * The numbers a recruiter's eye lands on. Monospace is doing real work here —
 * it says "measured output" rather than "marketing claim". This is the only
 * place on the site the mono face appears at size.
 */
export function MetricRow({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="flex flex-wrap gap-x-10 gap-y-5">
      {metrics.map((metric) => (
        <div key={metric.label}>
          <dt className="sr-only">{metric.label}</dt>
          <dd>
            <span className="block font-mono text-h3 font-medium tracking-tight text-bone">
              {metric.value}
            </span>
            <span className="mt-1 block text-meta text-bone-faint">
              {metric.label}
            </span>
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── ActionLink ───────────────────────────────────────────────────────────── */

type ActionLinkProps = {
  href: string;
  children: ReactNode;
  /** "solid" for the one primary action per view; "ghost" for everything else. */
  variant?: "solid" | "ghost";
  /** External links get rel="noreferrer" and an accessible new-tab warning. */
  external?: boolean;
  className?: string;
};

/**
 * One link component, two weights. Restricting the solid variant to a single
 * primary action per view is what keeps the visual hierarchy legible; if
 * everything is emphasised, nothing is.
 *
 * Hover moves to amber. Violet is structural throughout the site, so using it
 * for hover as well would make hover states invisible. Amber only ever means
 * "you are interacting with this right now".
 */
export function ActionLink({
  href,
  children,
  variant = "ghost",
  external = false,
  className = "",
}: ActionLinkProps) {
  const base =
    "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-meta font-semibold transition-colors duration-200 ease-signature";

  const variants = {
    solid:
      "bg-bone text-ink-void hover:bg-ember focus-visible:bg-ember",
    ghost:
      "border border-ink-ruleHi text-bone-muted hover:border-ember hover:text-ember",
  } as const;

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      href={href}
      className={`${base} ${variants[variant]} ${className}`}
      {...externalProps}
    >
      {children}
      {external ? <span className="sr-only">(opens in a new tab)</span> : null}
    </a>
  );
}
