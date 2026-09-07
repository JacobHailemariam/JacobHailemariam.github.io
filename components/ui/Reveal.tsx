"use client";

import { createElement, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { SIGNATURE_EASE } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  /** Seconds to wait before starting. Use for small staggers within a group. */
  delay?: number;
  className?: string;
  /** Renders as this element instead of a div. Keeps markup semantic. */
  as?: "div" | "li" | "article" | "section";
};

/**
 * The site's only scroll-triggered animation.
 *
 * Design note: this is deliberately understated — 14px of rise and an opacity
 * fade, once, and then it never runs again (`once: true`). A portfolio where
 * every element swoops in from a different direction reads as a template. The
 * one genuinely expressive animation on this site lives in the hero, and
 * spending the boldness in a single place is what lets it land.
 *
 * Accessibility: if the visitor has asked their OS for reduced motion,
 * useReducedMotion() returns true and we render a plain element with no
 * Framer wrapper at all. Not a shortened animation — no animation, and no
 * animation library in the render path either.
 *
 * `createElement` rather than `<Tag />`: assigning a string-union to a
 * capitalised variable and rendering it works, but TypeScript's inference on
 * that pattern is fragile and breaks in confusing ways when the union grows.
 * createElement is explicit and always correct.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return createElement(as, { className }, children);
  }

  const MotionTag = motion[as];

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: SIGNATURE_EASE }}
    >
      {children}
    </MotionTag>
  );
}
