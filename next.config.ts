import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Common variations of the legal page addresses. Vercel matches redirect sources
  // case-insensitively, so never list a case-only variant of the destination (it loops).
  async redirects() {
    const to = (dest: string, sources: string[]) => sources.map((source) => ({ source, destination: dest, permanent: true }));
    return [
      ...to("/privacy", ["/privacy-policy", "/privacypolicy", "/policy"]),
      ...to("/terms", ["/terms-of-service", "/termsofservice", "/terms-and-conditions", "/tos"]),
    ];
  },
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
