import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Every page is prerendered at build time and nothing is revalidated,
// so prerendered pages can be served straight from the Worker's static assets.
export default defineCloudflareConfig({
  incrementalCache: staticAssetsIncrementalCache,
});
