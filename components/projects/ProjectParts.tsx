import AssetImage from "@/components/ui/AssetImage";
import type { CaseStudy, Project } from "@/lib/site-content";

/* ── ProblemDecisionImpact ────────────────────────────────────────────────── */

/**
 * The three things a recruiter is scanning a project for, always in the same
 * order and always labelled, so the eye learns where to look after one card.
 *
 * A <dl> because that's what this is: three terms, three descriptions.
 * `columns` lays them side by side on wide screens (the featured project);
 * the default stacks them (the cards).
 */
export function ProblemDecisionImpact({
  project,
  columns = false,
}: {
  project: Pick<Project, "problem" | "decision" | "impact">;
  columns?: boolean;
}) {
  const rows = [
    { term: "Problem", text: project.problem },
    { term: "Decision", text: project.decision },
    { term: "Impact", text: project.impact },
  ];

  return (
    <dl
      className={
        columns
          ? "grid grid-cols-1 border-t border-ink-rule lg:grid-cols-3"
          : "border-t border-ink-rule"
      }
    >
      {rows.map((row, index) => (
        <div
          key={row.term}
          className={
            columns
              ? `border-b border-ink-rule py-5 lg:py-6 lg:pr-8 ${
                  index > 0 ? "lg:border-l lg:pl-8" : ""
                }`
              : "border-b border-ink-rule py-4"
          }
        >
          <dt className="label text-bone-muted">
            <span aria-hidden="true" className="mr-2 text-bone-faint">
              0{index + 1}
            </span>
            {row.term}
          </dt>
          <dd
            className={`text-body ${columns ? "mt-3" : "mt-2"} ${
              row.term === "Impact" ? "text-bone" : "text-bone-muted"
            }`}
          >
            {row.text}
          </dd>
        </div>
      ))}
    </dl>
  );
}

/* ── CaseStudyBody ────────────────────────────────────────────────────────── */

/**
 * What goes inside the case study drawer: numbered sections in two columns,
 * then numbered figures. Server-rendered and passed to <CaseStudy> as children.
 */
export function CaseStudyBody({
  caseStudy,
  figureStart = 1,
  compact = false,
}: {
  caseStudy: CaseStudy;
  /** Number of the first figure, for when figures appear above the drawer. */
  figureStart?: number;
  /** One column throughout, for a drawer inside a half-width card. */
  compact?: boolean;
}) {
  return (
    <>
      <div
        className={`grid grid-cols-1 gap-x-14 ${
          compact ? "gap-y-8" : "gap-y-10 md:grid-cols-2"
        }`}
      >
        {caseStudy.sections.map((section, index) => (
          <section key={section.heading} className="min-w-0">
            <p aria-hidden="true" className="label text-bone-faint">
              {String(index + 1).padStart(2, "0")}
            </p>
            <h4 className="mt-2 text-[1.1875rem] leading-snug text-bone">
              {section.heading}
            </h4>

            {section.body?.map((paragraph) => (
              <p
                key={paragraph.slice(0, 32)}
                className="mt-3 max-w-prose text-body text-bone-muted"
              >
                {paragraph}
              </p>
            ))}

            {section.items ? (
              <ul className="mt-3 max-w-prose space-y-2">
                {section.items.map((item) => (
                  <li
                    key={item.slice(0, 32)}
                    className="relative pl-5 text-body text-bone-muted"
                  >
                    <span
                      aria-hidden="true"
                      className="absolute left-0 top-[0.7em] h-px w-2.5 bg-bone-faint"
                    />
                    {item}
                  </li>
                ))}
              </ul>
            ) : null}

            {section.code ? (
              // tabIndex lets keyboard users scroll the block if it overflows.
              <pre
                tabIndex={0}
                className="mt-4 overflow-x-auto border border-ink-rule bg-ink-panel p-4 font-mono text-[0.75rem] leading-relaxed text-bone-muted"
              >
                <code>{section.code}</code>
              </pre>
            ) : null}
          </section>
        ))}
      </div>

      {caseStudy.figures.length > 0 ? (
        <div
          className={`grid grid-cols-1 sm:grid-cols-2 ${
            compact ? "mt-10 gap-5" : "mt-12 gap-8"
          }`}
        >
          {caseStudy.figures.map((figure, index) => (
            <AssetImage
              key={figure.alt}
              asset={figure}
              defaultAspect="aspect-[16/9]"
              defaultFit="contain"
              figureLabel={`Fig. ${index + figureStart}`}
              sizes={
                compact
                  ? "(max-width: 768px) 100vw, 36rem"
                  : "(max-width: 640px) 100vw, 70rem"
              }
              wrapperClassName={
                figure.display?.span === "half" ? "" : "sm:col-span-2"
              }
            />
          ))}
        </div>
      ) : null}
    </>
  );
}
