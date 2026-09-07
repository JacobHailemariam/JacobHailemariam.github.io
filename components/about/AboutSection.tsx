import Image from "next/image";
import SectionShell from "@/components/layout/SectionShell";
import Reveal from "@/components/ui/Reveal";
import { about, profile } from "@/lib/site-content";

/**
 * A 5/7 split: photo left, prose right. Not 6/6 — a perfectly even split reads
 * as a template, and the prose genuinely needs more room than the portrait.
 *
 * The portrait is deliberately small and square rather than a full-bleed
 * lifestyle shot. This is a page about work; the photo's job is to attach a
 * face to the name and then get out of the way.
 */
export default function AboutSection() {
  return (
    <SectionShell
      id="about"
      heading="Two halves of the same problem"
      deck="Models on one side, boards on the other. The interesting work is where they meet."
    >
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
        {/* ── Portrait ─────────────────────────────────────────────────── */}
        <Reveal className="lg:col-span-4">
          <div className="max-w-[18rem]">
            <div className="relative aspect-square overflow-hidden rounded-xl border border-ink-rule bg-ink-panel">
              <Image
                src={about.photo.src as string}
                alt={about.photo.alt}
                fill
                sizes="(max-width: 1024px) 60vw, 18rem"
                className="object-cover"
              />
            </div>
            <p className="mt-4 text-meta text-bone-faint">
              {profile.location}
            </p>
          </div>
        </Reveal>

        {/* ── Prose ────────────────────────────────────────────────────── */}
        <Reveal delay={0.08} className="lg:col-span-8">
          <div className="max-w-prose space-y-6">
            {about.paragraphs.map((paragraph) => (
              <p key={paragraph.slice(0, 32)} className="text-lede text-bone-muted">
                {paragraph}
              </p>
            ))}
          </div>

          {/* The human line. Set apart by a violet rule rather than dropped
              into the prose, so it reads as an aside and can't be mistaken for
              part of the professional pitch. */}
          <p className="mt-10 max-w-prose border-l-2 border-volt pl-5 text-body text-bone-faint">
            {about.offTheClock}
          </p>
        </Reveal>
      </div>
    </SectionShell>
  );
}
