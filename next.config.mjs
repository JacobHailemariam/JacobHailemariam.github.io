/** @type {import('next').NextConfig} */
const nextConfig = {
  /**
   * Produces a fully static site in an `out/` folder at build time.
   *
   * GitHub Pages is a static file host — it serves files and nothing else. It
   * cannot run a Node server, so anything Next.js would normally do at request
   * time has to happen at build time instead. This site has no API routes, no
   * server actions, and no server-side data fetching, so nothing is lost.
   */
  output: "export",

  reactStrictMode: true,

  images: {
    /**
     * Required for static export.
     *
     * next/image normally resizes and reformats images on demand through a
     * server route. With no server, that route doesn't exist, and the build
     * fails outright unless this is set. Images are served exactly as they sit
     * in /public instead.
     *
     * What still works: layout reservation (no page reflow as images load) and
     * lazy loading. What's lost: automatic resizing and AVIF/WebP conversion —
     * which is why the largest image was converted to WebP by hand.
     */
    unoptimized: true,
  },
};

export default nextConfig;
