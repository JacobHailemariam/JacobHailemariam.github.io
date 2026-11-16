import Image from "next/image";
import type { CSSProperties } from "react";
import SensorField from "./SensorField";
import { ActionLink, ChannelDot } from "@/components/ui/Primitives";
import { profile, resume } from "@/lib/site-content";

/**
 * The hero is the site's one orchestrated moment: a single load sequence where
 * the roles, the name, the identity line and the buttons arrive in order, and
 * the sensor field fades up underneath them.
 *
 * KINETIC TYPE. Each line of the name sits in a clipping box and rises into
 * it, one after the other. The animation is pure CSS (transform only), so it
 * runs before any JavaScript has loaded and costs nothing afterwards. With
 * reduced motion on, the global rule in globals.css skips straight to the end
 * state.
 *
 * THE TWO CHANNELS are introduced here: each current role carries its channel
 * marker, and the legend under the buttons names them. The sensor field does
 * the same thing wordlessly: the sweep is teal, the cursor lights amber.
 *
 * This is a Server Component. The only client JavaScript in the hero is the
 * canvas.
 */

/** Delay helper: keeps the load sequence readable as a list of beats. */
const at = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

const NAME_LINES = ["Jacob", "Hailemariam"];

export default function HeroSection() {
  return (
    <section
      aria-labelledby="hero-heading"
      className="relative isolate overflow-hidden border-b border-ink-rule"
    >
      {/* ── Sensor field ────────────────────────────────────────────────────
          Behind the text, pushed to the right on desktop so it reads as a
          companion to the type rather than a texture beneath it. */}
      <div
        className="absolute inset-y-0 right-0 -z-10 w-full opacity-30 lg:w-[62%] lg:opacity-100"
        aria-hidden="true"
      >
        <div className="h-full w-full animate-fade-in" style={at(200)}>
          <SensorField />
        </div>
        {/* Feathers the canvas into the page on its left edge. */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-2/5 bg-gradient-to-r from-ink-void to-transparent" />
      </div>

      <div className="shell relative flex min-h-[92svh] flex-col justify-center pb-20 pt-28 sm:pb-24 sm:pt-32 xl:flex-row xl:items-center xl:justify-between xl:gap-16">
        <div className="min-w-0 max-w-4xl">
          {/* Below xl the name fills the width, so the portrait moves above
              it instead of competing for a column. */}
          <div className="mb-9 animate-fade-rise xl:hidden" style={at(80)}>
            <div className="frame w-40 bg-ink-panel sm:w-52">
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={profile.headshot.src}
                  alt={profile.headshot.alt}
                  fill
                  priority
                  sizes="13rem"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Current roles, one per channel. The first thing a recruiter
              reads, so it names the jobs outright. */}
          <ul
            className="mb-7 flex animate-fade-rise flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-6"
            style={at(120)}
          >
            {profile.roles.map((role) => (
              <li
                key={role.title}
                className="flex items-center gap-2.5 text-meta"
              >
                <ChannelDot channel={role.channel} />
                <span className="font-semibold text-bone">{role.title}</span>
                <span className="text-bone-muted">· {role.org}</span>
              </li>
            ))}
          </ul>

          {/* Name. One h1 for the document, and it says who this is. Each
              line is clipped by its wrapper and rises into view. */}
          <h1 id="hero-heading" className="text-h1 font-bold text-bone">
            {NAME_LINES.map((line, index) => (
              <span
                key={line}
                className="block overflow-hidden pb-[0.08em] [margin-bottom:-0.08em]"
              >
                <span
                  className="block animate-line-rise"
                  style={at(220 + index * 110)}
                >
                  {line}
                </span>
              </span>
            ))}
          </h1>

          <p
            className="mt-8 max-w-2xl animate-fade-rise text-lede text-bone sm:text-h3"
            style={at(520)}
          >
            {profile.identity}.
          </p>

          <p
            className="mt-5 max-w-prose animate-fade-rise text-body text-bone-muted"
            style={at(600)}
          >
            {profile.tagline}
          </p>

          <div
            className="mt-9 flex animate-fade-rise flex-wrap items-center gap-3"
            style={at(680)}
          >
            <ActionLink href="#work" variant="solid">
              View work
            </ActionLink>
            {resume ? (
              <ActionLink href={resume.href} download={resume.fileName}>
                Resume
              </ActionLink>
            ) : null}
            <ActionLink href={profile.github} external>
              GitHub
            </ActionLink>
            <ActionLink href={profile.linkedin} external>
              LinkedIn
            </ActionLink>
          </div>

          {/* The legend: what the two colours on this site mean. */}
          <dl
            className="mt-12 grid max-w-xl animate-fade-rise grid-cols-1 border-t border-ink-rule sm:grid-cols-2"
            style={at(780)}
          >
            <div className="border-b border-ink-rule py-4 sm:border-b-0 sm:pr-6">
              <dt className="label flex items-center gap-2 text-ch1">
                <ChannelDot channel="ml" />
                CH1 · Machine learning
              </dt>
              <dd className="mt-2 text-meta text-bone-muted">
                Models I design, train and benchmark.
              </dd>
            </div>
            <div className="py-4 sm:border-l sm:border-ink-rule sm:pl-6">
              <dt className="label flex items-center gap-2 text-ch2">
                <ChannelDot channel="hw" />
                CH2 · Hardware
              </dt>
              <dd className="mt-2 text-meta text-bone-muted">
                Firmware and boards they have to run on.
              </dd>
            </div>
          </dl>
        </div>

        {/* On wide screens the portrait gets its own column, sitting over the
            sensor field so the two read as one composition. */}
        <div
          className="hidden w-80 shrink-0 animate-fade-rise xl:block 2xl:w-96"
          style={at(450)}
        >
          <div className="frame bg-ink-panel">
            <div className="relative aspect-[3/4] overflow-hidden">
              <Image
                src={profile.headshot.src}
                alt={profile.headshot.alt}
                fill
                priority
                sizes="24rem"
                className="object-cover"
              />
            </div>
          </div>
          <p className="label mt-3 flex justify-between text-bone-faint">
            <span>{profile.location}</span>
            <span>ECE</span>
          </p>
        </div>
      </div>
    </section>
  );
}
