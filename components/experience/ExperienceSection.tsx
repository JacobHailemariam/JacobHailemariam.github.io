import SectionShell from "@/components/layout/SectionShell";
import Reveal from "@/components/ui/Reveal";
import { experience } from "@/lib/site-content";

/**
 * The only place on the site with a vertical spine and node markers.
 *
 * That restraint is the point. Timeline rails, connector lines, and numbered
 * markers get sprayed across generated pages onto content that isn't a
 * sequence at all — a skills list doesn't have a first and a last. Roles over
 * time genuinely do, so here the rail encodes real information: reverse
 * chronology, and how recent each thing is.
 *
 * Markup is an ordered list, because that's what this is. The rail itself is
 * aria-hidden decoration drawn over the list's left edge.
 */
export default function ExperienceSection() {
  return (
    <SectionShell
      id="experience"
      heading="Where I've been"
      deck="Most recent first."
    >
      <ol className="relative">
        {/* The spine. Fades out at the bottom so it terminates rather than
            stopping abruptly mid-air. */}
        <div
          aria-hidden="true"
          className="absolute bottom-6 left-[7px] top-3 w-px bg-gradient-to-b from-ink-ruleHi via-ink-ruleHi to-transparent sm:left-[7px]"
        />

        {experience.map((role, index) => (
          <Reveal
            as="li"
            key={role.organisation}
            delay={index * 0.07}
            className="relative pb-14 pl-9 last:pb-0 sm:pl-12"
          >
            {/* Node. Ring rather than solid dot — reads as an instrument
                marker, matches the hero's lattice vocabulary. */}
            <span
              aria-hidden="true"
              className="absolute left-0 top-1.5 flex h-[15px] w-[15px] items-center justify-center rounded-full border border-volt bg-ink-void"
            >
              <span className="h-[5px] w-[5px] rounded-full bg-volt" />
            </span>

            <p className="font-mono text-meta text-bone-faint">{role.period}</p>

            <h3 className="mt-2 text-h3 text-bone">{role.title}</h3>

            <p className="mt-1.5 text-body text-volt-hi">{role.organisation}</p>

            <ul className="mt-5 max-w-prose space-y-2.5">
              {role.points.map((point) => (
                <li
                  key={point.slice(0, 32)}
                  className="relative pl-5 text-body text-bone-muted"
                >
                  {/* A hairline dash instead of a bullet glyph. Quieter, and
                      it aligns with the hairline language used elsewhere. */}
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-[0.7em] h-px w-2.5 bg-ink-ruleHi"
                  />
                  {point}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
