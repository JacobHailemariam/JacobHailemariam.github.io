import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

type SectionShellProps = {
  /** Becomes the anchor target for the nav and the aria-labelledby reference. */
  id: string;
  /** Section number shown above the heading: 1 renders as "01". */
  index: number;
  heading: string;
  /** One line of orientation, set under the heading. */
  deck?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Every section below the hero renders through this, so vertical rhythm and
 * heading scale are decided in one place.
 *
 * THE FORMAT. A full-width hairline opens each section. Under it sits a small
 * mono label ("01 / WORK"), then the section title set very large and flush
 * left, then a short muted deck. The size of the title does the job the old
 * side rail did: it tells you, at a glance, that a new section has started.
 *
 * Accessibility: each section is a landmark labelled by its own <h2>. The
 * number label is decoration and is hidden from screen readers.
 */
export default function SectionShell({
  id,
  index,
  heading,
  deck,
  children,
  className = "",
}: SectionShellProps) {
  const headingId = `${id}-heading`;
  const number = String(index).padStart(2, "0");

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-24 border-t border-ink-rule py-24 sm:py-32 ${className}`}
    >
      <div className="shell">
        <Reveal stagger>
          <p aria-hidden="true" className="label text-bone-faint">
            <span className="text-bone">{number}</span>
            <span className="mx-2">/</span>
            {id}
          </p>

          <h2
            id={headingId}
            className="mt-6 max-w-5xl text-[clamp(2.75rem,8vw,6.5rem)] font-bold leading-[0.95] tracking-[-0.045em] text-bone"
          >
            {heading}
          </h2>

          {deck ? (
            <p className="mt-7 max-w-2xl text-lede text-bone-muted">{deck}</p>
          ) : null}
        </Reveal>

        <div className="mt-14 sm:mt-20">{children}</div>
      </div>
    </section>
  );
}
