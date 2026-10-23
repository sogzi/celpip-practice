import type { MetadataRoute } from "next";
import { SITE } from "@/lib/site";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE.name,
    short_name: SITE.name,
    description: "Timed CELPIP-General practice for all four skills, scored on the official 1–12 scale.",
    start_url: "/",
    display: "standalone",
    background_color: "#f8f7f4",
    theme_color: "#c8102e",
    icons: [
      { src: "/brand/logo-a-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/brand/logo-a-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/brand/logo-a-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/brand/logo-a-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
