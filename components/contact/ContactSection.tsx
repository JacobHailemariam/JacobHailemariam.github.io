import SectionShell from "@/components/layout/SectionShell";
import Reveal from "@/components/ui/Reveal";
import { profile } from "@/lib/site-content";

/**
 * The email is set at display size and is itself the button. A recruiter who
 * has scrolled this far has already decided; the only thing left to do is make
 * the address impossible to miss and one tap away on a phone.
 *
 * `mailto:` rather than a contact form: a form needs a backend, an anti-spam
 * story, and a delivery guarantee, and it puts a step between the visitor and
 * the inbox. A recruiter would rather have the address anyway — they usually
 * want it in their own client so it threads with the rest of their pipeline.
 *
 * Note there is deliberately no résumé link, per the brief.
 */
export default function ContactSection() {
  return (
    <SectionShell
      id="contact"
      heading="Open to Summer 2027 internships"
      deck="Software engineering, ML, or anything where the model has to run on real hardware. Say hello."
    >
      <Reveal>
        <a
          href={`mailto:${profile.email}`}
          className="group inline-block max-w-full"
        >
          <span className="block break-words font-display text-[clamp(1.5rem,5.5vw,3.5rem)] font-semibold leading-tight tracking-tight text-bone transition-colors duration-300 ease-signature group-hover:text-ember">
            {profile.email}
          </span>
          {/* A rule that draws itself in on hover. The one hover flourish on
              the page, spent on the single action that matters most. */}
          <span
            aria-hidden="true"
            className="mt-3 block h-px w-full origin-left scale-x-0 bg-ember transition-transform duration-500 ease-signature group-hover:scale-x-100"
          />
        </a>
      </Reveal>

      <Reveal delay={0.08}>
        <ul className="mt-14 flex flex-wrap gap-x-10 gap-y-4">
          <li>
            <a
              href={profile.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-bone-muted transition-colors duration-200 ease-signature hover:text-ember"
            >
              GitHub
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
          <li>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-body text-bone-muted transition-colors duration-200 ease-signature hover:text-ember"
            >
              LinkedIn
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </li>
        </ul>
      </Reveal>
    </SectionShell>
  );
}
