import AssetImage from "@/components/ui/AssetImage";
import Reveal from "@/components/ui/Reveal";
import { TechTagList, ActionLink } from "@/components/ui/Primitives";
import type { Project } from "@/lib/site-content";

/**
 * The headline project gets a layout that appears exactly once on the page.
 *
 * That's the whole mechanism by which "this is the most important thing here"
 * is communicated — not a badge saying FEATURED, not a bigger font size on an
 * otherwise identical card. Hierarchy through structure. A recruiter skimming
 * for ninety seconds registers "this block is different" before they've read
 * a word of it.
 *
 * The hyperspectral strip runs full width above the text because it's an
 * unusual shape (roughly 4.7:1) and a striking one. Cropping it into a
 * conventional 16:9 card would throw away the thing that makes it arresting.
 */
export default function FeaturedProject({ project }: { project: Project }) {
  const [primaryImage, ...supportingImages] = project.images;

  return (
    <article className="relative">
      {/* A violet rule marks the featured block. It's the only element on the
          page with this treatment. */}
      <div
        aria-hidden="true"
        className="absolute -left-4 top-1 hidden h-24 w-px bg-gradient-to-b from-volt to-transparent lg:block"
      />

      <Reveal>
        <p className="text-meta text-volt-hi">{project.context}</p>
        <h3 className="mt-4 max-w-3xl text-h2 text-bone">{project.title}</h3>
        <p className="mt-6 max-w-2xl text-lede text-bone-muted">
          {project.summary}
        </p>
      </Reveal>

      {/* ── The strip ─────────────────────────────────────────────────── */}
      <Reveal delay={0.06} className="mt-12">
        {/* No `priority` here: this sits well below the fold, and the page's
            LCP element is the hero heading (text). Marking a below-fold image
            as priority just competes with resources that are actually needed
            for first paint. */}
        <AssetImage
          asset={primaryImage}
          defaultFit="contain"
          sizes="(max-width: 1024px) 100vw, 82rem"
        />
      </Reveal>

      {/* ── Detail and supporting evidence ────────────────────────────── */}
      <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        <Reveal className="lg:col-span-5">
          <div className="max-w-prose space-y-5">
            {project.detail?.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-body text-bone-muted">
                {paragraph}
              </p>
            ))}
          </div>

          <div className="mt-9">
            <TechTagList items={project.tech} />
          </div>

          {/* Rather than leaving a dead "Code" button or a link to nowhere,
              say plainly why there isn't one. Silence looks like an omission;
              a one-line explanation looks like judgement. */}
          {project.linkNote ? (
            <p className="mt-8 text-meta text-bone-faint">{project.linkNote}</p>
          ) : null}

          {project.repoUrl ? (
            <div className="mt-8">
              <ActionLink href={project.repoUrl} external>
                Repository
              </ActionLink>
            </div>
          ) : null}
        </Reveal>

        <Reveal delay={0.08} className="lg:col-span-7">
          <div className="space-y-8">
            {supportingImages.map((image) => (
              <AssetImage
                key={image.alt}
                asset={image}
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
