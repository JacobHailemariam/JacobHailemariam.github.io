import type { ReactNode } from "react";
import Reveal from "@/components/ui/Reveal";

type SectionShellProps = {
  /** Becomes the anchor target for the nav and the aria-labelledby reference. */
  id: string;
  heading: string;
  /** One line of orientation, set beside the heading on wide screens. */
  deck?: string;
  children: ReactNode;
  className?: string;
};

/**
 * Every section below the hero renders through this, which is what makes the
 * page feel like one designed object rather than five stitched-together
 * templates. Vertical rhythm, heading scale, and the hairline rule are all
 * decided here, once.
 *
 * The heading treatment: an asymmetric two-column split with the title left
 * and a one-line deck right. Notably absent is the tracked-out all-caps
 * eyebrow label above every heading — it's the single most common tell of a
 * generated page, and it adds no information the heading doesn't already give.
 *
 * Accessibility: each section is a landmark labelled by its own <h2>, so a
 * screen-reader user can jump between sections by landmark.
 */
export default function SectionShell({
  id,
  heading,
  deck,
  children,
  className = "",
}: SectionShellProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className={`scroll-mt-24 py-24 sm:py-32 ${className}`}
    >
      <div className="shell">
        <Reveal>
          <div className="hairline" />
          <div className="grid grid-cols-1 gap-6 pt-8 lg:grid-cols-12 lg:gap-12">
            <h2
              id={headingId}
              className="text-h2 text-bone lg:col-span-7"
            >
              {heading}
            </h2>
            {deck ? (
              <p className="max-w-prose text-body text-bone-muted lg:col-span-5 lg:pt-2">
                {deck}
              </p>
            ) : null}
          </div>
        </Reveal>

        <div className="mt-14 sm:mt-20">{children}</div>
      </div>
    </section>
  );
}
