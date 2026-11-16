import { profile } from "@/lib/site-content";

/**
 * Deliberately thin. Everything a visitor needs is in the contact section
 * directly above; the footer closes the page and carries the colophon.
 */
export default function SiteFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-ink-rule py-10">
      <div className="shell flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="label text-bone-faint">
          © {currentYear} {profile.name}
        </p>
        <p className="label text-bone-faint">
          Built with Next.js, TypeScript and Tailwind
        </p>
      </div>
    </footer>
  );
}
