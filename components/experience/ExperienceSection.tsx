import SectionShell from "@/components/layout/SectionShell";
import Reveal from "@/components/ui/Reveal";
import { ChannelTags } from "@/components/ui/Primitives";
import { experience, type Channel } from "@/lib/site-content";

/**
 * Roles as a timeline: one vertical rail down the left edge with a dot per
 * role, coloured by channel (teal for ML, amber for hardware, neutral for
 * software). Each entry puts who and when on the left with the role title
 * set large, and what I did on the right.
 *
 * Markup is an ordered list, because reverse chronology is a real sequence.
 * The rail and dots are decoration and hidden from screen readers; the
 * channel is still announced through ChannelTags.
 */

/** Fill for the timeline dot and the bullet squares, by channel. */
const CHANNEL_FILL: Record<Channel, string> = {
  ml: "bg-ch1",
  hw: "bg-ch2",
  sw: "bg-bone-faint",
};

export default function ExperienceSection() {
  return (
    <SectionShell
      id="experience"
      index={2}
      heading="Experience"
      deck="Where I've been, most recent first."
    >
      <div className="relative">
        {/* The rail. Runs from the first dot to the bottom of the list. Kept
            outside the <ol> so the list only contains list items. */}
        <span
          aria-hidden="true"
          className="absolute bottom-0 left-[5px] top-3 w-px bg-ink-ruleHi"
        />

        <ol>
          {experience.map((role, index) => (
            <Reveal
              as="li"
              key={role.organisation}
              delay={Math.min(index, 3) * 0.06}
              className="group relative pb-14 pl-8 last:pb-0 sm:pl-12 sm:pb-16"
            >
              {/* Dot on the rail. The ring in the page colour cuts the line so
                the dot reads as sitting on it. */}
              <span
                aria-hidden="true"
                className={`absolute left-0 top-1.5 h-[11px] w-[11px] rounded-full ring-4 ring-ink-void ${CHANNEL_FILL[role.channel]}`}
              />

              <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14">
                <div className="min-w-0">
                  <p className="label text-bone-muted">{role.organisation}</p>
                  <h3 className="mt-3 text-[clamp(1.6rem,3vw,2.4rem)] leading-[1.05] tracking-[-0.03em] text-bone">
                    <span className="trace pb-1">{role.title}</span>
                  </h3>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
                    <p className="font-mono text-meta text-bone-faint">
                      {role.period}
                    </p>
                    <ChannelTags channels={[role.channel]} />
                  </div>
                </div>

                <ul className="min-w-0 space-y-3 lg:pt-7">
                  {role.points.map((point) => (
                    <li
                      key={point.slice(0, 32)}
                      className="relative pl-6 text-body text-bone-muted"
                    >
                      <span
                        aria-hidden="true"
                        className={`absolute left-0 top-[0.62em] h-1.5 w-1.5 ${CHANNEL_FILL[role.channel]}`}
                      />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </SectionShell>
  );
}
