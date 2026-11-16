import AssetImage from "@/components/ui/AssetImage";
import Reveal from "@/components/ui/Reveal";
import {
  ActionLink,
  ChannelTags,
  MetricRow,
  ReadMoreLink,
  TechTagList,
} from "@/components/ui/Primitives";
import FusionNetwork from "./FusionNetwork";
import type { Project } from "@/lib/site-content";

/**
 * The headline project: one wide card, deliberately bigger than the grid of
 * cards below it.
 *
 * The face is kept to what a recruiter reads in a few seconds: what it is,
 * the numbers and the tools on the left; the data and the baseline
 * architecture on the right. The animated network runs across the full width
 * underneath. Everything else (problem / decision / impact, the interactive demo and the case study) is on the project's
 * own page, one "Read more" away.
 */
export default function FeaturedProject({ project }: { project: Project }) {
  const [scene, architecture] = project.images;

  return (
    <article
      id={`project-${project.id}`}
      className="group frame scroll-mt-24 bg-ink-panel/60 p-5 sm:p-8 lg:p-10"
    >
      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[minmax(0,1fr)_22rem] xl:grid-cols-[minmax(0,1fr)_25rem] xl:gap-14">
        {/* ── Left: the story ─────────────────────────────────────────── */}
        <Reveal stagger className="min-w-0">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="label text-bone-muted">
              <span className="sr-only">Project </span>01
            </span>
            <ChannelTags channels={project.channels} />
          </div>

          <div>
            <h3 className="mt-5 text-[clamp(1.75rem,3.4vw,2.75rem)] leading-[1.05] tracking-tight text-bone">
              {project.title}
            </h3>
            <p className="mt-3 text-meta text-bone-faint">{project.context}</p>
          </div>

          <p className="mt-6 text-body text-bone-muted sm:text-lede">
            {project.summary}
          </p>

          {project.metrics ? (
            <div className="mt-8">
              <MetricRow metrics={project.metrics} />
            </div>
          ) : null}

          <div className="mt-8">
            <TechTagList items={project.tech} />
          </div>
        </Reveal>

        {/* ── Right: the data, then the model it goes into ───────────── */}
        <Reveal delay={0.1} className="min-w-0 space-y-6">
          {scene ? (
            <div>
              <AssetImage
                asset={scene}
                defaultAspect="aspect-[16/9]"
                defaultFit="cover"
                showCaption={false}
                sizes="(max-width: 1024px) 100vw, 25rem"
              />
              <p className="mt-2 text-meta text-bone-faint">
                <span className="label mr-2 text-bone-muted">Data</span>
                Houston 2013 scene in false colour.
              </p>
            </div>
          ) : null}
          {architecture ? (
            <div>
              <AssetImage
                asset={architecture}
                defaultFit="contain"
                showCaption={false}
                sizes="(max-width: 1024px) 100vw, 25rem"
              />
              <p className="mt-2 text-meta text-bone-faint">
                <span className="label mr-2 text-bone-muted">Model</span>
                Baseline architecture, DAHGMN (Xie et al., IEEE TGRS 2025). Not
                my design; full citation on the project page.
              </p>
            </div>
          ) : null}
        </Reveal>
      </div>

      {/* ── The model, right on the card ───────────────────────────────── */}
      <Reveal className="mt-10">
        <FusionNetwork />
      </Reveal>

      {/* ── Everything else is on the project page ────────────────────── */}
      <div className="mt-10 border-t border-ink-rule pt-6">
        <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3">
          <ReadMoreLink id={project.id} title={project.title} />
          {project.linkNote ? (
            <span className="text-meta text-bone-faint">
              {project.linkNote}
            </span>
          ) : project.repoUrl ? (
            <ActionLink href={project.repoUrl} external>
              Repository
            </ActionLink>
          ) : null}
        </div>
      </div>
    </article>
  );
}
