import Link from "next/link";
import type { ReactNode } from "react";
import type { Channel, Metric } from "@/lib/site-content";

/* ── ChannelTags ──────────────────────────────────────────────────────────── */

const CHANNEL_META: Record<
  Channel,
  { code: string; name: string; text: string; dot: string }
> = {
  ml: {
    code: "CH1 · ML",
    name: "Machine learning",
    text: "text-ch1",
    dot: "bg-ch1",
  },
  hw: {
    code: "CH2 · HW",
    name: "Hardware and embedded",
    text: "text-ch2",
    dot: "bg-ch2",
  },
  sw: {
    code: "SW",
    name: "Software",
    text: "text-bone-muted",
    dot: "border border-bone-muted",
  },
};

/** The small square that marks a channel. Decorative: always paired with text. */
export function ChannelDot({
  channel,
  className = "",
}: {
  channel: Channel;
  className?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block h-2 w-2 shrink-0 ${CHANNEL_META[channel].dot} ${className}`}
    />
  );
}

/**
 * Which half of the work a thing belongs to. This is the only place colour is
 * allowed to carry meaning, and it never does so alone: the code ("CH1 · ML")
 * is always written out, and a screen reader hears the full name.
 */
export function ChannelTags({ channels }: { channels: Channel[] }) {
  return (
    <ul className="flex flex-wrap items-center gap-x-4 gap-y-1">
      {channels.map((channel) => {
        const meta = CHANNEL_META[channel];
        return (
          <li
            key={channel}
            className={`label flex items-center gap-2 ${meta.text}`}
          >
            <ChannelDot channel={channel} />
            <span aria-hidden="true">{meta.code}</span>
            <span className="sr-only">{meta.name}</span>
          </li>
        );
      })}
    </ul>
  );
}

/* ── ChannelMetaLine ───────────────────────────────────────────────────────── */

/**
 * One mono line above a card title: the project number, its channels in
 * their colours, then where it happened, all joined by slashes.
 */
export function ChannelMetaLine({
  number,
  channels,
  context,
}: {
  number?: string;
  channels: Channel[];
  context: string;
}) {
  const slash = (
    <span aria-hidden="true" className="mx-2 text-ink-ruleHi">
      /
    </span>
  );
  return (
    <p className="label leading-relaxed text-bone-faint">
      {number ? (
        <>
          <span className="text-bone-muted">
            <span className="sr-only">Project </span>
            {number}
          </span>
          {slash}
        </>
      ) : null}
      {channels.map((channel) => {
        const meta = CHANNEL_META[channel];
        return (
          <span key={channel}>
            <span className={meta.text}>
              <span aria-hidden="true">{meta.code}</span>
              <span className="sr-only">{meta.name}. </span>
            </span>
            {slash}
          </span>
        );
      })}
      {context}
    </p>
  );
}

/* ── TechTagList ──────────────────────────────────────────────────────────── */

/**
 * A real <ul>, so a screen reader hears a list rather than a run-on sentence.
 * Each item is a small square-cornered box in the mono face, like a part
 * label.
 */
export function TechTagList({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => (
        <li
          key={item}
          className="border border-ink-ruleHi px-2.5 py-1 font-mono text-[0.75rem] leading-snug text-bone-muted"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/* ── MetricRow ────────────────────────────────────────────────────────────── */

/**
 * The numbers a recruiter's eye lands on, set as instrument readouts: a mono
 * value over a small label, divided by hairlines.
 */
export function MetricRow({ metrics }: { metrics: Metric[] }) {
  return (
    <dl className="grid grid-cols-1 border-y border-ink-rule min-[420px]:grid-cols-3">
      {metrics.map((metric, index) => (
        <div
          key={metric.label}
          className={`py-4 min-[420px]:px-4 min-[420px]:first:pl-0 ${
            index > 0
              ? "border-t border-ink-rule min-[420px]:border-l min-[420px]:border-t-0"
              : ""
          }`}
        >
          <dt className="sr-only">{metric.label}</dt>
          <dd>
            <span className="block font-mono text-[1.375rem] font-medium leading-tight tracking-tight text-bone">
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
  /** Set to a file name to make the link download instead of navigate. */
  download?: string;
  className?: string;
};

/**
 * One link component, two weights. Square corners, like a panel button.
 * Hover brightens to bone rather than borrowing a channel colour.
 */
export function ActionLink({
  href,
  children,
  variant = "ghost",
  external = false,
  download,
  className = "",
}: ActionLinkProps) {
  const base =
    "inline-flex min-h-[2.75rem] items-center gap-2 px-5 py-2.5 text-meta font-semibold transition-colors duration-200 ease-signature";

  const variants = {
    solid: "bg-bone text-ink-void hover:bg-white",
    ghost:
      "border border-ink-ruleHi text-bone-muted hover:border-bone hover:text-bone",
  } as const;

  const externalProps = external
    ? { target: "_blank", rel: "noopener noreferrer" }
    : {};

  return (
    <a
      href={href}
      download={download}
      className={`${base} ${variants[variant]} ${className}`}
      {...externalProps}
    >
      {children}
      {download ? (
        <span aria-hidden="true" className="font-mono">
          ↓
        </span>
      ) : null}
      {external ? (
        <>
          <span aria-hidden="true" className="font-mono">
            ↗
          </span>
          <span className="sr-only">(opens in a new tab)</span>
        </>
      ) : null}
    </a>
  );
}

/* ── ReadMoreLink ─────────────────────────────────────────────────────────── */

/** The page a project's "Read more" opens. */
export const projectHref = (id: string) => `/projects/${id}/`;

/**
 * The white "Read more" button on every project card. It opens the project's
 * own page; that page links straight back to the same card.
 */
export function ReadMoreLink({ id, title }: { id: string; title: string }) {
  return (
    <Link
      href={projectHref(id)}
      className="group/more inline-flex min-h-[2.75rem] items-center gap-4 bg-bone px-5 text-ink-void transition-colors duration-200 ease-signature hover:bg-white"
    >
      <span className="label font-semibold">
        Read more<span className="sr-only">: {title}</span>
      </span>
      <span
        aria-hidden="true"
        className="font-mono transition-transform duration-300 ease-signature group-hover/more:translate-x-1"
      >
        →
      </span>
    </Link>
  );
}
