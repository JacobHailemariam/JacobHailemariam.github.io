import Image from "next/image";
import type { AssetRef } from "@/lib/site-content";

type AssetImageProps = {
  asset: AssetRef;
  /** Fallback framing, used when the asset doesn't specify its own. */
  defaultAspect?: string;
  defaultFit?: "cover" | "contain";
  /** Loads eagerly and gets fetch priority. Only for above-the-fold images. */
  priority?: boolean;
  /** Responsive sizes hint. */
  sizes?: string;
  /** Classes for the outer <figure>, e.g. a grid column span. */
  wrapperClassName?: string;
  /** Shown before the caption in the mono label style, e.g. "Fig. 2". */
  figureLabel?: string;
  showCaption?: boolean;
};

/**
 * Every image on the site goes through here.
 *
 * 1. PLACEHOLDER HANDLING. When `asset.src` is null the component renders a
 *    dashed frame naming what's missing. Nothing 404s, and nothing renders as
 *    a broken-image glyph.
 *
 * 2. LAYOUT RESERVATION. Width and height come from the content file, so the
 *    browser reserves the correct box before the image arrives and the page
 *    doesn't reflow. Images below the fold are lazy-loaded by next/image.
 *
 * 3. FRAMING FROM CONTENT. Aspect, fit, and crop anchor come off the asset
 *    itself, so adding a project never means editing a component.
 *
 * The frame is the site's square, corner-ticked `.frame`. The image sits in an
 * inner clipping box so the ticks, which sit on the border, aren't cut off.
 */
export default function AssetImage({
  asset,
  defaultAspect,
  defaultFit = "contain",
  priority = false,
  sizes = "(max-width: 768px) 100vw, 50vw",
  wrapperClassName = "",
  figureLabel,
  showCaption = true,
}: AssetImageProps) {
  const aspect = asset.display?.aspect ?? defaultAspect;
  const fit = asset.display?.fit ?? defaultFit;
  const objectPosition = asset.display?.objectPosition ?? "";

  const caption =
    showCaption && (asset.caption || figureLabel) ? (
      <figcaption className="mt-3 max-w-prose text-meta leading-relaxed text-bone-faint">
        {figureLabel ? (
          <span className="label mr-2 text-bone-muted">{figureLabel}</span>
        ) : null}
        {asset.caption}
      </figcaption>
    ) : null;

  // -- Missing asset: render the instruction, not a broken image -------------
  if (!asset.src) {
    return (
      <figure className={`w-full ${wrapperClassName}`}>
        <div
          className={`frame border-dashed bg-ink-panel ${aspect ?? ""}`}
          role="img"
          aria-label={`Image not yet added: ${asset.alt}`}
        >
          <div className="flex h-full min-h-[9rem] flex-col items-start justify-center gap-2 p-6">
            <span className="label text-bone-muted">asset pending</span>
            <p className="max-w-prose text-meta text-bone-muted">{asset.alt}</p>
          </div>
        </div>
        {caption}
      </figure>
    );
  }

  // -- Real asset -----------------------------------------------------------
  const objectClasses = [
    fit === "cover" ? "object-cover" : "object-contain",
    objectPosition,
    // Photographs ease in a touch on card hover. Diagrams stay still.
    fit === "cover"
      ? "transition-transform duration-700 ease-signature group-hover:scale-[1.03]"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <figure className={`w-full ${wrapperClassName}`}>
      <div className="frame bg-ink-panel">
        <div className={`relative overflow-hidden ${aspect ?? ""}`}>
          {aspect ? (
            // `fill` requires a positioned parent, which the box above is.
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
      </div>
      {caption}
    </figure>
  );
}
