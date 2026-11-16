import SectionShell from "@/components/layout/SectionShell";
import Reveal from "@/components/ui/Reveal";
import { ChannelDot } from "@/components/ui/Primitives";
import { skillGroups } from "@/lib/site-content";

/**
 * Numbered groups set as columns: four across on desktop, two on tablets,
 * stacked on phones. Each group is a mono "01 / Name" header, a line of
 * context, and a plain list with small square bullets in the group's channel
 * colour.
 *
 * NO LOGOS. A grid of tech logos would bring twenty brand colours into a
 * palette built on two. Skills are set as words in the site's own type.
 */

const BULLET: Record<string, string> = {
  ml: "bg-ch1",
  hw: "bg-ch2",
  sw: "bg-bone-faint",
};

export default function SkillsSection() {
  return (
    <SectionShell
      id="skills"
      index={3}
      heading="Skills"
      deck="Tools I actually reach for, grouped by what they're for. Everything here has shipped in something on this page."
    >
      <Reveal
        stagger
        as="ol"
        className="grid grid-cols-1 gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-4"
      >
        {skillGroups.map((group, index) => (
          <li key={group.heading} className="border-t border-ink-ruleHi pt-6">
            <h3 className="label flex items-center gap-2.5 font-mono font-normal text-bone">
              <ChannelDot channel={group.channel} />
              <span className="text-bone-faint">
                {String(index + 1).padStart(2, "0")}
              </span>
              <span aria-hidden="true" className="text-bone-faint">
                /
              </span>
              {group.heading}
            </h3>

            <p className="mt-4 text-meta leading-relaxed text-bone-muted">
              {group.note}
            </p>

            <ul className="mt-5 space-y-2.5">
              {group.items.map((item) => (
                <li
                  key={item}
                  className="flex items-baseline gap-3 text-body text-bone"
                >
                  <span
                    aria-hidden="true"
                    className={`h-1.5 w-1.5 shrink-0 translate-y-[-0.15em] ${BULLET[group.channel]}`}
                  />
                  {item}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </Reveal>
    </SectionShell>
  );
}
