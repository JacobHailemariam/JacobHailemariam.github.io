import Image from "next/image";
import Reveal from "@/components/ui/Reveal";
import {
  ChannelMetaLine,
  ReadMoreLink,
  TechTagList,
} from "@/components/ui/Primitives";
import type { Project } from "@/lib/site-content";

type ProjectCardProps = {
  project: Project;
  /** Position in the grid. The featured project is 01, so cards start at 02. */
  index: number;
};

/** A small outbound link in the card's footer row. */
function FooterLink({ href, children }: { href: string; children: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="label inline-flex min-h-[2.75rem] items-center gap-1.5 text-bone-muted transition-colors duration-200 ease-signature hover:text-bone"
    >
      {children}
      <span aria-hidden="true">↗</span>
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  );
}

/**
 * A project as a card in a two-column grid.
 *
 * THE FACE stays short so a grid of six reads at a glance: one image across
 * the top, a mono meta line (number, channels, where), the title, a one or
 * two sentence summary, the tech as small boxed tags, and a footer row with
 * "Read more" on the left and outbound links on the right.
 *
 * "Read more" opens the project's own page (app/projects/[id]), which holds
 * everything else: problem, decision and impact, the numbers, every image,
 * and the case study if the project has one.
 *
 * HOVER. The frame's corner ticks lengthen, a hairline draws under the title,
 * and a photograph eases in slightly. No lift, no shadow.
 */
export default function ProjectCard({ project, index }: ProjectCardProps) {
  const number = String(index + 2).padStart(2, "0");
  const [cover] = project.images;
  const coverFit = cover?.display?.fit ?? "contain";

  const links = [
    project.liveUrl ? { label: "Live", href: project.liveUrl } : null,
    ...(project.extraLinks ?? []),
    project.repoUrl ? { label: "Repository", href: project.repoUrl } : null,
  ].filter((link): link is { label: string; href: string } => link !== null);

  return (
    <Reveal className="h-full">
      <article
        id={`project-${project.id}`}
        className="group h-full scroll-mt-24"
      >
        <div className="frame flex h-full flex-col bg-ink-panel/60">
          {cover?.src ? (
            <div
              className={`relative aspect-[16/10] overflow-hidden border-b border-ink-rule ${
                coverFit === "cover" ? "" : "bg-ink-void"
              }`}
            >
              <Image
                src={cover.src}
                alt={cover.alt}
                fill
                sizes="(max-width: 768px) 100vw, 40rem"
                className={
                  coverFit === "cover"
                    ? `object-cover transition-transform duration-700 ease-signature group-hover:scale-[1.03] ${
                        cover.display?.objectPosition ?? ""
                      }`
                    : "object-contain p-3"
                }
              />
            </div>
          ) : null}

          <div className="flex flex-1 flex-col p-6 sm:p-8">
            <ChannelMetaLine
              number={number}
              channels={project.channels}
              context={project.context}
            />

            <h3 className="mt-4 text-[1.75rem] font-semibold leading-[1.08] tracking-[-0.03em] text-bone sm:text-[2rem]">
              <span className="trace pb-1">{project.title}</span>
            </h3>

            <p className="mt-4 text-body text-bone-muted">{project.summary}</p>

            <div className="mt-6">
              <TechTagList items={project.tech} />
            </div>

            {/* Pushes the footer to the bottom so cards in a row line up. */}
            <div className="mt-auto pt-8">
              <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2">
                <ReadMoreLink id={project.id} title={project.title} />
                {links.length > 0 ? (
                  <div className="flex flex-wrap items-center gap-x-5">
                    {links.map((link) => (
                      <FooterLink key={link.href} href={link.href}>
                        {link.label}
                      </FooterLink>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      </article>
    </Reveal>
  );
}
