import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: false,
  cacheComponents: true,
  partialPrefetching: true,
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
  async redirects() {
    return [
      // Preserve legacy URLs that already have Google Search Console visibility.
      { source: "/ai-photo-booth-experiences", destination: "/photo-booths", permanent: true },
      { source: "/vr-engagement", destination: "/games-vr", permanent: true },
      { source: "/wedding-photo-booth-bangalore", destination: "/photo-booths", permanent: true },

      { source: "/classic", destination: "/", permanent: true },
      { source: "/classic/:path*", destination: "/", permanent: true },
      { source: "/live", destination: "/", permanent: true },
      { source: "/live/:path*", destination: "/", permanent: true },

      { source: "/review", destination: "/reviews", permanent: true },
      { source: "/contact", destination: "/quote", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          {
            key: "Permissions-Policy",
            value: "camera=(self), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
