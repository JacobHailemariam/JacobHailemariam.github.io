import Image from "next/image";
import type { AssetRef } from "@/lib/site-content";

type AssetImageProps = {
  asset: AssetRef;
  /** Fallback framing, used when the asset doesn't specify its own. */
  defaultAspect?: string;
  defaultFit?: "cover" | "contain";
  /** Loads eagerly and gets fetch priority. Only for above-the-fold images. */
  priority?: boolean;
  /** Responsive sizes hint. Getting this right is most of next/image's value. */
  sizes?: string;
  className?: string;
  showCaption?: boolean;
};

/**
 * Every image on the site goes through here, for three reasons.
 *
 * 1. PLACEHOLDER HANDLING. When `asset.src` is null the component renders a
 *    dashed frame naming what's missing. This is why the site can ship today
 *    with half the screenshots outstanding: nothing 404s, nothing renders as a
 *    broken-image glyph, and you can see at a glance what's left to supply.
 *    Every one of these is listed in the README.
 *
 * 2. next/image DISCIPLINE. Width and height come from the content file, so
 *    the browser reserves the correct box before the image arrives and the
 *    page doesn't reflow (no cumulative layout shift). `sizes` tells Next
 *    which resolution to actually serve — omit it and a phone downloads the
 *    desktop-sized variant.
 *
 * 3. FRAMING FROM CONTENT. Aspect, fit, and crop anchor come off the asset
 *    itself, so adding a project never means editing a component.
 */
export default function AssetImage({
  asset,
  defaultAspect,
  defaultFit = "contain",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  className = "",
  showCaption = true,
}: AssetImageProps) {
  const aspect = asset.display?.aspect ?? defaultAspect;
  const fit = asset.display?.fit ?? defaultFit;
  const objectPosition = asset.display?.objectPosition ?? "";

  const frameClasses = [
    "relative overflow-hidden rounded-lg border border-ink-rule bg-ink-panel",
    aspect ?? "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  // -- Missing asset: render the instruction, not a broken image -------------
  if (!asset.src) {
    return (
      <figure className="w-full">
        <div
          className={`${frameClasses} border-dashed border-ink-ruleHi`}
          role="img"
          aria-label={`Image not yet added: ${asset.alt}`}
        >
          <div className="flex h-full min-h-[9rem] flex-col items-start justify-center gap-2 p-6">
            <span className="font-mono text-micro text-volt-hi">
              asset pending
            </span>
            <p className="max-w-prose text-meta text-bone-muted">{asset.alt}</p>
          </div>
        </div>
        {showCaption && asset.caption ? (
          <figcaption className="mt-3 max-w-prose text-meta leading-relaxed text-bone-faint">
            {asset.caption}
          </figcaption>
        ) : null}
      </figure>
    );
  }

  // -- Real asset -----------------------------------------------------------
  const objectClasses = [
    fit === "cover" ? "object-cover" : "object-contain",
    objectPosition,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className="w-full">
      <div className={frameClasses}>
        {aspect ? (
          // `fill` requires a positioned parent, which frameClasses provides.
          <Image
            src={asset.src}
            alt={asset.alt}
            fill
            sizes={sizes}
            priority={priority}
            className={objectClasses}
          />
        ) : (
          // No aspect given: let the image set its own height. Used for the
          // hyperspectral strip, whose unusual proportions are the point.
          <Image
            src={asset.src}
            alt={asset.alt}
            width={asset.width}
            height={asset.height}
            sizes={sizes}
            priority={priority}
            className="h-auto w-full"
          />
        )}
      </div>
      {showCaption && asset.caption ? (
        <figcaption className="mt-3 max-w-prose text-meta leading-relaxed text-bone-faint">
          {asset.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
