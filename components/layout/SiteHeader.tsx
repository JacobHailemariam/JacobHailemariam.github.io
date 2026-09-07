"use client";

import { useEffect, useState } from "react";
import { navSections, profile } from "@/lib/site-content";

/**
 * A sticky header that does two small things well.
 *
 * 1. SCROLL SPY. An IntersectionObserver watches every section and marks the
 *    one currently in view. The visitor always knows where they are without a
 *    progress bar or a scrollytelling gimmick.
 *
 *    Why IntersectionObserver rather than a scroll listener: a scroll handler
 *    fires on every frame of every scroll and forces a layout read
 *    (getBoundingClientRect) each time, which is a reliable way to make a page
 *    feel heavy. IntersectionObserver does the same work off the main thread
 *    and only calls back when a threshold is actually crossed.
 *
 *    The rootMargin is asymmetric on purpose: "-45% 0px -50% 0px" shrinks the
 *    observation window to a thin horizontal band across the middle of the
 *    viewport, so a section becomes "active" when it reaches the centre of the
 *    screen rather than the moment its first pixel appears.
 *
 * 2. BACKDROP ON SCROLL. Transparent over the hero, then a blurred panel once
 *    you've scrolled past it, so the header never fights the hero type.
 */
/**
 * Which sections survive on a 375px-wide phone. All five labels plus padding
 * come to roughly 440px, which overflows — so the middle three are hidden
 * below the `sm` breakpoint. Work and Contact are kept because they're the two
 * things a recruiter on a phone actually wants to jump to.
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
          ? "border-b border-ink-rule bg-ink-void/80 backdrop-blur-md"
          : "border-b border-transparent"
      }`}
    >
      <div className="shell flex h-16 items-center justify-between gap-6">
        <a
          href="#main"
          className="font-display text-meta font-bold tracking-tight text-bone transition-colors hover:text-ember"
        >
          JH
          <span className="sr-only"> — {profile.name}, back to top</span>
        </a>

        <nav aria-label="Sections">
          <ul className="flex items-center gap-1 sm:gap-2">
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
                    href={`#${id}`}
                    aria-current={isActive ? "true" : undefined}
                    className={`relative block rounded-full px-3 py-2 text-meta transition-colors duration-200 ease-signature sm:px-4 ${
                      isActive
                        ? "text-bone"
                        : "text-bone-faint hover:text-bone-muted"
                    }`}
                  >
                    {label}
                    {/* The active marker is a 3px violet dot, not an underline
                        or a filled pill. It's the smallest mark that still
                        reads at a glance, and it keeps the nav quiet. */}
                    <span
                      aria-hidden="true"
                      className={`absolute inset-x-0 -bottom-0.5 mx-auto h-[3px] w-[3px] rounded-full bg-volt transition-opacity duration-200 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>
    </header>
  );
}
