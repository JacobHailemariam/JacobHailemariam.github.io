import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { profile } from "@/lib/site-content";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

const SITE_URL = "https://jacobhailemariam.github.io";

/**
 * The link-preview card. The image is a 1200×630 screenshot of the fusion
 * explorer in its "Fused" state (public/og-fusion.png). Its URL is written out in
 * full because some scrapers ignore relative og:image paths.
 */
const PREVIEW_IMAGE = `${SITE_URL}/og-fusion.png`;
const PREVIEW_DESCRIPTION =
  "Electrical and Computer Engineering student at the University of Calgary";

/**
 * Metadata is generated from lib/site-content so the browser tab, the search
 * result, and the Slack/LinkedIn link preview all stay in sync with the page
 * itself. Recruiters paste links into Slack constantly — the preview is often
 * the first impression, before anyone loads the site.
 */
export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${profile.name} — ${profile.identity}`,
    template: `%s — ${profile.name}`,
  },
  description: profile.tagline,
  keywords: [
    "software engineering intern",
    "machine learning",
    "PyTorch",
    "embedded systems",
    "PCB design",
    "University of Calgary",
  ],
  authors: [{ name: profile.name, url: profile.github }],
  openGraph: {
    type: "website",
    url: SITE_URL,
    title: profile.name,
    description: PREVIEW_DESCRIPTION,
    siteName: profile.name,
    images: [
      {
        url: PREVIEW_IMAGE,
        width: 1200,
        height: 630,
        alt: "Interactive isometric city classified by fusing hyperspectral and LiDAR data, at 99.6% accuracy.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: profile.name,
    description: PREVIEW_DESCRIPTION,
    images: [PREVIEW_IMAGE],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#0A0A0B",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={fontVariables}>
      <body className="min-h-screen bg-ink-void">
        {/* First tab stop on the page. Visually hidden until focused. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-6 focus:top-6 focus:z-50 focus:rounded-full focus:bg-ember focus:px-5 focus:py-2.5 focus:text-meta focus:font-semibold focus:text-ink-void"
        >
          Skip to content
        </a>

        <SiteHeader />
        <main id="main">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
