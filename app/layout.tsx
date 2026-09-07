import type { Metadata, Viewport } from "next";
import "./globals.css";
import { fontVariables } from "./fonts";
import { profile } from "@/lib/site-content";
import SiteHeader from "@/components/layout/SiteHeader";
import SiteFooter from "@/components/layout/SiteFooter";

/**
 * Metadata is generated from lib/site-content so the browser tab, the search
 * result, and the Slack/LinkedIn link preview all stay in sync with the page
 * itself. Recruiters paste links into Slack constantly — the preview is often
 * the first impression, before anyone loads the site.
 */
export const metadata: Metadata = {
  metadataBase: new URL("https://jacobhailemariam.github.io"),
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
    type: "profile",
    title: `${profile.name} — ${profile.identity}`,
    description: profile.tagline,
    siteName: profile.name,
  },
  twitter: {
    card: "summary_large_image",
    title: `${profile.name} — ${profile.identity}`,
    description: profile.tagline,
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
