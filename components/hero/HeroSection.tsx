"use client";

import { motion, useReducedMotion } from "framer-motion";
import SensorField from "./SensorField";
import { ActionLink } from "@/components/ui/Primitives";
import { profile } from "@/lib/site-content";
import { SIGNATURE_EASE } from "@/lib/motion";

/**
 * The hero is the site's one orchestrated moment: a single load sequence where
 * the name, identity line, tagline, and CTAs arrive in order, and the sensor
 * field fades up underneath them.
 *
 * The layout is deliberately asymmetric — text occupies seven of twelve
 * columns, and the canvas bleeds off the right edge of the viewport rather
 * than sitting politely inside the container. Centred hero text over a full-
 * width background is the default composition, so this isn't that.
 *
 * The name is set in the display face at up to 8.5rem with -0.045em tracking.
 * At that size the type IS the graphic; nothing else is competing with it.
 */

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.09, delayChildren: 0.12 },
  },
};

const item = {
  hidden: { opacity: 0, y: 22 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.75, ease: SIGNATURE_EASE },
  },
};

export default function HeroSection() {
  const prefersReducedMotion = useReducedMotion();

  // With reduced motion we hand Framer identical initial and animate states,
  // so everything is simply present on load.
  const variants = prefersReducedMotion
    ? { hidden: { opacity: 1, y: 0 }, visible: { opacity: 1, y: 0 } }
    : item;

  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden"
    >
      {/* ── Sensor field ────────────────────────────────────────────────────
          Absolutely positioned behind the text, pushed to the right half on
          desktop so it reads as a companion to the type rather than a
          background texture beneath it. Pointer events stay live because the
          cursor interaction is the point; the text above sets its own
          pointer-events so links still work. */}
      <div
        className="absolute inset-y-0 right-0 -z-10 w-full opacity-40 lg:w-[62%] lg:opacity-100"
        aria-hidden="true"
      >
        <motion.div
          className="h-full w-full"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
        >
          <SensorField />
        </motion.div>

        {/* Feathers the canvas into the page background on its left edge so
            there's no visible seam where the lattice starts. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-ink-void to-transparent" />
      </div>

      <div className="shell relative flex min-h-[92svh] flex-col justify-center py-28 sm:py-32">
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="max-w-4xl"
        >
          {/* Name. The h1 carries both the name and the identity line so the
              document has exactly one h1 and it says who this is. */}
          <motion.h1
            id="hero-heading"
            variants={variants}
            className="text-h1 font-bold text-bone"
          >
            Jacob
            <br />
            Hailemariam
          </motion.h1>

          <motion.p
            variants={variants}
            className="mt-8 max-w-2xl text-lede text-bone sm:text-h3"
          >
            {profile.identity}.
          </motion.p>

          <motion.p
            variants={variants}
            className="mt-5 max-w-prose text-body text-bone-muted"
          >
            {profile.tagline}
          </motion.p>

          <motion.div
            variants={variants}
            className="mt-10 flex flex-wrap items-center gap-3"
          >
            <ActionLink href="#work" variant="solid">
              View work
            </ActionLink>
            <ActionLink href={profile.github} external>
              GitHub
            </ActionLink>
            <ActionLink href={profile.linkedin} external>
              LinkedIn
            </ActionLink>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
