"use client";

import { useEffect, useState } from "react";
import { navSections, profile, resume } from "@/lib/site-content";

/**
 * A sticky header that does two small things well.
 *
 * 1. SCROLL SPY. An IntersectionObserver watches every section and marks the
 *    one currently in view. It does this off the main thread and only calls
 *    back when a threshold is crossed, unlike a scroll listener that would
 *    run on every frame. The rootMargin shrinks the observation window to a
 *    thin band across the middle of the viewport, so a section becomes
 *    "active" when it reaches the centre of the screen.
 *
 * 2. BACKDROP ON SCROLL. Transparent over the hero, then a blurred panel once
 *    you've scrolled past it, so the header never fights the hero type.
 */

/**
 * Which sections survive on a 375px-wide phone. All five labels overflow, so
 * the middle three are hidden below the `sm` breakpoint. Work and Contact are
 * the two things a recruiter on a phone actually wants to jump to.
 */
const MOBILE_VISIBLE_SECTIONS = new Set<string>(["work", "contact"]);

export default function SiteHeader() {
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [hasScrolled, setHasScrolled] = useState(false);

  useEffect(() => {
    const sectionElements = navSections
      .map(({ id }) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 },
    );

    sectionElements.forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 40);
    handleScroll();
    // Passive tells the browser this listener will never call
    // preventDefault(), letting it start scrolling without waiting on our JS.
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ease-signature ${
        hasScrolled
          ? "border-b border-ink-rule bg-ink-void/85 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-4">
        <a
          href="/#main"
          className="flex min-h-[2.75rem] items-center gap-2.5 font-mono text-meta font-medium tracking-wide text-bone"
        >
          {/* Both channels, side by side: the site's mark. */}
          <span aria-hidden="true" className="flex gap-1">
            <span className="h-2.5 w-1 bg-ch1" />
            <span className="h-2.5 w-1 bg-ch2" />
          </span>
          JH
          <span className="sr-only">: {profile.name}, back to top</span>
        </a>

        <div className="flex items-center gap-1 sm:gap-3">
          <nav aria-label="Sections">
            <ul className="flex items-center">
              {navSections.map(({ id, label }) => {
                const isActive = activeSection === id;
                return (
                  <li
                    key={id}
                    className={
                      MOBILE_VISIBLE_SECTIONS.has(id) ? "" : "hidden sm:block"
                    }
                  >
                    <a
                      href={`/#${id}`}
                      aria-current={isActive ? "true" : undefined}
                      className={`label relative flex min-h-[2.75rem] items-center px-3 transition-colors duration-200 ease-signature ${
                        isActive
                          ? "text-bone"
                          : "text-bone-faint hover:text-bone"
                      }`}
                    >
                      {label}
                      {/* The active marker is a short tick under the label,
                          like the cursor on an instrument's scale. */}
                      <span
                        aria-hidden="true"
                        className={`absolute inset-x-3 bottom-2 h-px origin-left bg-bone transition-transform duration-300 ease-signature ${
                          isActive ? "scale-x-100" : "scale-x-0"
                        }`}
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {resume ? (
            <a
              href={resume.href}
              download={resume.fileName}
              className="label flex min-h-[2.25rem] items-center gap-2 border border-ink-ruleHi px-3 text-bone transition-colors duration-200 ease-signature hover:border-bone"
            >
              Resume
              <span aria-hidden="true">↓</span>
              <span className="sr-only">(downloads a PDF)</span>
            </a>
          ) : null}
        </div>
      </div>
    </header>
  );
}
