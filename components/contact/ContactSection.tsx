import SectionShell from "@/components/layout/SectionShell";
import Reveal from "@/components/ui/Reveal";
import { ActionLink } from "@/components/ui/Primitives";
import { profile, resume } from "@/lib/site-content";

/**
 * Two columns under the big heading, split by a hairline on wide screens.
 * Left: the email, set large, and itself the button. Right: the other ways
 * to reach me and, when a resume is configured, the download.
 *
 * `mailto:` rather than a contact form: a form needs a backend and an
 * anti-spam story, and a recruiter usually wants the address in their own
 * mail client anyway.
 */
export default function ContactSection() {
  return (
    <SectionShell
      id="contact"
      index={4}
      heading="Contact"
      deck="Open to Summer 2027 internships in software engineering, ML, or anything where the model has to run on real hardware. Say hello."
    >
      <div className="grid grid-cols-1 gap-12 border-t border-ink-ruleHi pt-10 lg:grid-cols-12 lg:gap-0">
        <Reveal className="min-w-0 lg:col-span-8 lg:pr-14">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-block max-w-full"
          >
            <span className="label block text-bone-faint">Email</span>
            <span className="mt-3 block break-words font-display text-[clamp(1.375rem,4.4vw,3rem)] font-semibold leading-tight tracking-tight text-bone">
              {profile.email}
            </span>
            {/* A rule that draws itself in on hover, spent on the single
                action that matters most. */}
            <span
              aria-hidden="true"
              className="mt-3 block h-px w-full origin-left scale-x-0 bg-bone transition-transform duration-500 ease-signature group-hover:scale-x-100"
            />
          </a>
          <p className="mt-5 text-lede text-bone-muted">
            or{" "}
            <a
              href={`mailto:${profile.altEmail}`}
              className="break-words text-bone underline decoration-ink-ruleHi underline-offset-4 transition-colors hover:decoration-bone"
            >
              {profile.altEmail}
            </a>
          </p>
        </Reveal>

        <Reveal
          delay={0.08}
          className="lg:col-span-4 lg:border-l lg:border-ink-rule lg:pl-10"
        >
          <p className="label text-bone-faint">Elsewhere</p>
          <div className="mt-4 flex flex-wrap gap-3">
            {resume ? (
              <ActionLink
                href={resume.href}
                download={resume.fileName}
                variant="solid"
              >
                Download resume
              </ActionLink>
            ) : null}
            <ActionLink href={profile.github} external>
              GitHub
            </ActionLink>
            <ActionLink href={profile.linkedin} external>
              LinkedIn
            </ActionLink>
          </div>
        </Reveal>
      </div>
    </SectionShell>
  );
}
