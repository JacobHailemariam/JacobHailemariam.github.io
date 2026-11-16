"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Marks its element `data-inview` while it is on screen and removes the mark
 * when it leaves. CSS uses that to pause looping animations nobody can see,
 * which keeps scrolling smooth and saves battery on phones.
 */
export default function PlayInView({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        element.toggleAttribute("data-inview", entry.isIntersecting);
      },
      { rootMargin: "10% 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
