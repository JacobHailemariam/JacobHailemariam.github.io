import Link from "next/link";
import AssetImage from "@/components/ui/AssetImage";
import Reveal from "@/components/ui/Reveal";
import {
  ActionLink,
  ChannelMetaLine,
  MetricRow,
  TechTagList,
  projectHref,
} from "@/components/ui/Primitives";
import FusionExplorer from "./FusionExplorer";
import FusionNetwork from "./FusionNetwork";
import { CaseStudyBody, ProblemDecisionImpact } from "./ProjectParts";
import type { Project } from "@/lib/site-content";

type ProjectDetailProps = {
  project: Project;
  /** "01", "02"... matching the number on the home page card. */
  number: string;
  previous: Project | null;
  next: Project | null;
};

/** Back to the home page, landing on this project's card. */
function BackLink({ id }: { id: string }) {
  return (
    <Link
      href={`/#project-${id}`}
      className="group/back label inline-flex min-h-[2.75rem] items-center gap-3 text-bone-muted transition-colors duration-200 ease-signature hover:text-bone"
    >
      <span
        aria-hidden="true"
        className="font-mono text-[1rem] transition-transform duration-300 ease-signature group-hover/back:-translate-x-1"
      >
        ←
      </span>
      Back to all work
    </Link>
  );
}

/**
 * A project's own page: everything "Read more" used to tuck into a drawer,
 * laid out with room to breathe.
 *
 * Getting back is never more than one click: a back link sits at the top,
 * again at the bottom, and both land on this project's card on the home page,
 * not the top of the site. The browser back button works too.
 */
export default function ProjectDetail({
  project,
  number,
  previous,
  next,
}: ProjectDetailProps) {
  const links = [
    project.liveUrl ? { label: "Live", href: project.liveUrl } : null,
    ...(project.extraLinks ?? []),
    project.repoUrl ? { label: "Repository", href: project.repoUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  const isFusion = project.id === "gsil";

  return (
    <article className="shell pb-24 pt-24 sm:pb-32 sm:pt-28">
      <BackLink id={project.id} />

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <Reveal stagger className="mt-8 max-w-4xl">
        <ChannelMetaLine
          number={number}
          channels={project.channels}
          context={project.context}
        />
        <h1 className="mt-5 text-[clamp(2.25rem,6vw,4.5rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-bone">
          {project.title}
        </h1>
        <p className="mt-6 max-w-3xl text-lede text-bone-muted">
          {project.summary}
        </p>
        {links.length > 0 || project.linkNote ? (
          <div className="mt-8 flex flex-wrap items-center gap-3">
            {links.map((link, index) => (
              <ActionLink
                key={link.href}
                href={link.href}
                external
                variant={index === 0 ? "solid" : "ghost"}
              >
                {link.label}
              </ActionLink>
            ))}
            {project.linkNote ? (
              <p className="text-meta text-bone-faint">{project.linkNote}</p>
            ) : null}
          </div>
        ) : null}
      </Reveal>

      {/* ── Numbers and tools ──────────────────────────────────────────── */}
      <Reveal className="mt-12 max-w-4xl space-y-8">
        {project.metrics ? <MetricRow metrics={project.metrics} /> : null}
        <TechTagList items={project.tech} />
      </Reveal>

      {/* ── Images ─────────────────────────────────────────────────────── */}
      {project.images.length > 0 ? (
        <Reveal className="mt-14">
          <div
            className={`grid grid-cols-1 gap-6 ${
              project.images.length > 1 ? "md:grid-cols-2" : ""
            }`}
          >
            {project.images.map((image) => (
              <AssetImage
                key={image.alt}
                asset={image}
                defaultFit="contain"
                sizes="(max-width: 768px) 100vw, 40rem"
              />
            ))}
          </div>
        </Reveal>
      ) : null}

      {/* ── Problem, decision, impact ──────────────────────────────────── */}
      <Reveal className="mt-16">
        <h2 className="label mb-6 text-bone-muted">The short version</h2>
        <ProblemDecisionImpact project={project} columns />
      </Reveal>

      {/* ── The research project's interactive pieces ──────────────────── */}
      {isFusion ? (
        <>
          <Reveal className="mt-16">
            <FusionNetwork />
          </Reveal>
          <Reveal className="mt-14">
            <FusionExplorer />
          </Reveal>
        </>
      ) : null}

      {/* ── Case study ─────────────────────────────────────────────────── */}
      {project.caseStudy ? (
        <section aria-labelledby="case-study-heading" className="mt-20">
          <div className="border-t border-ink-ruleHi pt-10">
            <h2
              id="case-study-heading"
              className="text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-tight text-bone"
            >
              Case study
            </h2>
            {project.caseStudy.teaser ? (
              <p className="mt-3 max-w-2xl text-body text-bone-muted">
                {project.caseStudy.teaser}
              </p>
            ) : null}
          </div>
          <div className="mt-10">
            <CaseStudyBody caseStudy={project.caseStudy} />
          </div>
        </section>
      ) : null}

      {/* ── Way out ────────────────────────────────────────────────────── */}
      <nav
        aria-label="More projects"
        className="mt-20 grid grid-cols-1 gap-6 border-t border-ink-ruleHi pt-8 sm:grid-cols-3 sm:items-center"
      >
        <div>
          <BackLink id={project.id} />
        </div>
        <div className="sm:text-center">
          {previous ? (
            <Link
              href={projectHref(previous.id)}
              className="inline-flex min-h-[2.75rem] flex-col justify-center text-bone-muted transition-colors hover:text-bone"
            >
              <span className="label text-bone-faint">Previous</span>
              <span className="text-meta">{previous.title}</span>
            </Link>
          ) : null}
        </div>
        <div className="sm:text-right">
          {next ? (
            <Link
              href={projectHref(next.id)}
              className="inline-flex min-h-[2.75rem] flex-col justify-center text-bone-muted transition-colors hover:text-bone"
            >
              <span className="label text-bone-faint">Next</span>
              <span className="text-meta">{next.title}</span>
            </Link>
          ) : null}
        </div>
      </nav>
    </article>
  );
}
