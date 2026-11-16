"use client";

import {
  createElement,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from "react";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before starting. Use for small offsets within a group. */
  delay?: number;
  /** Instead of moving as one block, the direct children arrive in order. */
  stagger?: boolean;
  className?: string;
  /** Renders as this element instead of a div. Keeps markup semantic. */
  as?: "div" | "li" | "article" | "section" | "ol" | "ul" | "dl";
};

/**
 * One IntersectionObserver for the whole page, shared by every <Reveal>.
 * It runs off the main thread and only calls back when an element crosses
 * into view, so scrolling never waits on JavaScript.
 */
let sharedObserver: IntersectionObserver | null = null;

function getObserver(): IntersectionObserver {
  if (!sharedObserver) {
    sharedObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.setAttribute("data-revealed", "");
          sharedObserver?.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -6% 0px", threshold: 0 },
    );
  }
  return sharedObserver;
}

/**
 * The site's scroll-triggered animation: a short rise and fade, once.
 *
 * This component only does one thing in JavaScript: it sets `data-revealed`
 * on the element the first time it scrolls into view. The animation itself is
 * CSS (see "SCROLL REVEALS" in globals.css), which is also where reduced
 * motion and the no-JavaScript fallback are handled.
 */
export default function Reveal({
  children,
  delay = 0,
  stagger = false,
  className,
  as = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = getObserver();
    observer.observe(element);
    return () => observer.unobserve(element);
  }, []);

  const style = delay
    ? ({ "--reveal-delay": `${Math.round(delay * 1000)}ms` } as CSSProperties)
    : undefined;

  return createElement(
    as,
    {
      ref,
      className,
      style,
      "data-reveal": stagger ? "stagger" : "",
    },
    children,
  );
}
