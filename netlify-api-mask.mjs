// Post-build step (see netlify.toml): prepend the SynthOS API-mask rule to the
// publish output's `_redirects` so the deployed site serves this project's
// backend at /api/* on its own domain (proxied to the Supabase edge functions,
// masking *.supabase.co). Nitro's netlify preset writes `dist/` with its own
// `/* /.netlify/functions/server 200` catch-all — the /api rule must come
// FIRST because Netlify takes the first matching rule. The platform cannot
// inject files into a git-built Netlify site at deploy time, so the repo does
// it itself. Never fails the build: on any missing precondition it logs and
// exits 0.
import { existsSync, readFileSync, writeFileSync } from "node:fs";

const supabaseUrl = (process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || "").replace(/\/+$/, "");
if (!supabaseUrl.startsWith("https://")) {
  console.log("netlify-api-mask: no https SUPABASE_URL in the build environment; skipping /api mask.");
  process.exit(0);
}

const dist = "dist";
if (!existsSync(dist)) {
  console.log("netlify-api-mask: no dist/ output; skipping /api mask.");
  process.exit(0);
}

const redirectsPath = `${dist}/_redirects`;
const existing = existsSync(redirectsPath) ? readFileSync(redirectsPath, "utf8") : "";
if (existing.split("\n").some((line) => /^\s*\/api(\/|\*|\s)/i.test(line))) {
  console.log("netlify-api-mask: dist/_redirects already routes /api; leaving it alone.");
  process.exit(0);
}

const rule =
  "# SynthOS API mask: this project's backend, served from the site's own domain.\n" +
  `/api/*  ${supabaseUrl}/functions/v1/:splat  200\n`;
writeFileSync(redirectsPath, existing ? `${rule}\n${existing}` : rule);
console.log(`netlify-api-mask: prepended /api/* -> ${supabaseUrl}/functions/v1 to dist/_redirects.`);
