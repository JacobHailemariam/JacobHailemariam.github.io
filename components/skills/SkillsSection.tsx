import SectionShell from "@/components/layout/SectionShell";
import Reveal from "@/components/ui/Reveal";
import { skillGroups } from "@/lib/site-content";

/**
 * Four groups in a 2×2 on desktop, stacked on mobile.
 *
 * Two decisions worth defending:
 *
 * NO LOGOS. The brief allowed tech logos, and a grid of them is the reflexive
 * choice — but it introduces twenty foreign brand colours into a palette
 * built on exactly two accents, and it reads as a badge collection rather
 * than a claim about capability. Set words instead, in the site's own type,
 * and the section stays part of the same designed object. (If you want the
 * logos, the note in the README explains where to add them.)
 *
 * EACH GROUP GETS A LINE OF CONTEXT. A bare tag cloud tells a recruiter
 * nothing they can't already infer from the projects. One sentence per group
 * turns a list into a claim about depth — and specifically lets the hardware
 * group say "schematic to fabricated board", which is the differentiator the
 * ML tags can't carry.
 */
export default function SkillsSection() {
  return (
    <SectionShell
      id="skills"
      heading="Tools I actually reach for"
      deck="Grouped by what they're for. Everything here has shipped in something on this page."
    >
      <div className="grid grid-cols-1 gap-x-16 gap-y-14 sm:grid-cols-2">
        {skillGroups.map((group, index) => (
          <Reveal key={group.heading} delay={index * 0.06}>
            <div className="border-t border-ink-rule pt-6">
              <h3 className="text-h3 text-bone">{group.heading}</h3>

              <p className="mt-2 max-w-prose text-meta leading-relaxed text-bone-faint">
                {group.note}
              </p>

              <ul className="mt-6 flex flex-wrap gap-x-3 gap-y-2.5">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-md border border-ink-rule bg-ink-panel px-3 py-1.5 text-meta text-bone-muted transition-colors duration-200 ease-signature hover:border-volt hover:text-bone"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </SectionShell>
  );
}
