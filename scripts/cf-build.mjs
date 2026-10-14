// Builds the Cloudflare Worker without leaking secrets.
//
// @opennextjs/cloudflare compiles every .env* file into the worker bundle, so a
// key in .env.local would be uploaded with the code. This script sets those
// files aside during the build, restores them afterwards, and fails the build
// if anything that looks like an Anthropic key ends up in .open-next/.
// In production the key comes from a Worker secret (wrangler secret put).
import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const ENV_FILES = [".env", ".env.local", ".env.production", ".env.production.local", ".env.development", ".env.development.local"];
const STASH = ".cf-build-stash";
const stashed = [];

function restore() {
  for (const f of stashed.splice(0)) fs.renameSync(path.join(STASH, f), f);
  fs.rmSync(STASH, { recursive: true, force: true });
}

process.on("SIGINT", () => {
  restore();
  process.exit(130);
});

let status = 1;
try {
  fs.mkdirSync(STASH, { recursive: true });
  for (const f of ENV_FILES) {
    if (fs.existsSync(f)) {
      fs.renameSync(f, path.join(STASH, f));
      stashed.push(f);
    }
  }
  status = spawnSync("npx", ["opennextjs-cloudflare", "build"], { stdio: "inherit" }).status ?? 1;
} finally {
  restore();
}
if (status !== 0) process.exit(status);

const KEY_PATTERN = /sk-ant-[A-Za-z0-9_-]{20,}/;
function scan(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) scan(p);
    else if (entry.isFile() && KEY_PATTERN.test(fs.readFileSync(p, "latin1"))) {
      console.error(`\n✖ Found what looks like an Anthropic API key in ${p}. Not deploying.`);
      fs.rmSync(".open-next", { recursive: true, force: true });
      process.exit(1);
    }
  }
}
scan(".open-next");
console.log("✓ Secret scan passed: no API keys in the worker bundle.");
