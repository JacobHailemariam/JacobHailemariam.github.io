import { profile } from "@/lib/site-content";

/**
 * Deliberately thin. Everything a visitor needs is in the contact section
 * directly above; the footer's only jobs are to close the page visually and
 * to carry the colophon.
 *
 * The colophon is not filler — for a portfolio aimed at engineers, naming the
 * stack is a small, checkable claim that the site itself is a work sample.
 */
export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-rule py-10">
      <div className="shell flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-meta text-bone-faint">
          © {currentYear} {profile.name}
        </p>
        <p className="text-meta text-bone-faint">
          Designed and built with Next.js, TypeScript, Tailwind, and Framer
          Motion.
        </p>
      </div>
    </footer>
  );
}
