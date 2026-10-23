import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Common variations of the legal page addresses (paths are case-sensitive).
  async redirects() {
    const to = (dest: string, sources: string[]) => sources.map((source) => ({ source, destination: dest, permanent: true }));
    return [
      ...to("/privacy", ["/Privacy", "/PRIVACY", "/privacy-policy", "/privacypolicy", "/Privacy-Policy", "/policy"]),
      ...to("/terms", ["/Terms", "/TERMS", "/terms-of-service", "/termsofservice", "/terms-and-conditions", "/Terms-of-Service", "/tos"]),
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
