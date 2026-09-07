import AssetImage from "@/components/ui/AssetImage";
import Reveal from "@/components/ui/Reveal";
import { TechTagList, MetricRow, ActionLink } from "@/components/ui/Primitives";
import type { Project } from "@/lib/site-content";

type ProjectCardProps = {
  project: Project;
  /** Even-indexed cards put text left; odd-indexed put it right. */
  index: number;
};

/**
 * Three identical cards in a row is the most recognisable shape in generated
 * portfolio design, so this component does the opposite in two ways.
 *
 * 1. ALTERNATING ORIENTATION. Text and imagery swap sides on each card. The
 *    reader's eye zig-zags down the page instead of scanning three columns.
 *
 * 2. ASYMMETRIC SPLIT. 5/7, never 6/6. The image side gets more room because
 *    a screenshot needs it and a paragraph doesn't.
 *
 * The `lg:order-*` classes handle the swap on desktop while leaving the mobile
 * DOM order alone — text always comes before its images in the source, which
 * is both the correct reading order for a screen reader and the correct
 * stacking order on a phone.
 *
 * Hover is intentionally almost nothing: the title picks up amber and the
 * frame's border lightens. No lift, no shadow, no scale. Those are fine
 * effects individually but applying them to every card is what makes a page
 * feel like it came out of a kit.
 */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const isReversed = index % 2 === 1;

  return (
    <article className="group border-t border-ink-rule pt-12 transition-colors duration-300 ease-signature hover:border-ink-ruleHi">
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-16">
        {/* ── Text column ──────────────────────────────────────────────── */}
        <Reveal
          className={`lg:col-span-5 ${isReversed ? "lg:order-2" : "lg:order-1"}`}
        >
          <p className="text-meta text-bone-faint">{project.context}</p>

          <h3 className="mt-3 text-h3 text-bone transition-colors duration-300 ease-signature group-hover:text-ember sm:text-[1.75rem]">
            {project.title}
          </h3>

          <p className="mt-5 max-w-prose text-body text-bone-muted">
            {project.summary}
          </p>

          {project.detail ? (
            <div className="mt-5 max-w-prose space-y-3">
              {project.detail.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-meta leading-relaxed text-bone-faint"
                >
                  {paragraph}
                </p>
              ))}
            </div>
          ) : null}

          {project.metrics ? (
            <div className="mt-8">
              <MetricRow metrics={project.metrics} />
            </div>
          ) : null}

          <div className="mt-8">
            <TechTagList items={project.tech} />
          </div>

          {(project.repoUrl || project.liveUrl) && (
            <div className="mt-8 flex flex-wrap gap-3">
              {project.liveUrl ? (
                <ActionLink href={project.liveUrl} variant="solid" external>
                  Visit site
                </ActionLink>
              ) : null}
              {project.repoUrl ? (
                <ActionLink href={project.repoUrl} external>
                  Repository
                </ActionLink>
              ) : null}
            </div>
          )}

          {project.linkNote ? (
            <p className="mt-6 text-meta text-bone-faint">{project.linkNote}</p>
          ) : null}
        </Reveal>

        {/* ── Image column ─────────────────────────────────────────────── */}
        <Reveal
          delay={0.08}
          className={`lg:col-span-7 ${isReversed ? "lg:order-1" : "lg:order-2"}`}
        >
          <div className="space-y-6">
            {project.images.map((image) => (
              <AssetImage
                key={image.alt}
                asset={image}
                // Defaults suit screenshots and diagrams: never crop, always
                // 16:9. Photographs override both from the content file.
                defaultAspect="aspect-[16/9]"
                defaultFit="contain"
                sizes="(max-width: 1024px) 100vw, 46rem"
              />
            ))}
          </div>
        </Reveal>
      </div>
    </article>
  );
}
