import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";

// A server-rendered TanStack Start app. Unlike the static boilerplate, there is
// NO committed build — SynthOS provisions a git-connected Netlify site that
// builds this repo on every push and runs the server as a Netlify Function.
// Netlify auto-detects TanStack Start; SynthOS also sets SERVER_PRESET=netlify
// in the build environment so the build targets Netlify regardless of any other
// host config in the repo.
//
// The handful of PUBLIC values the app needs are baked in here at build time
// from the build environment (same set as the static boilerplate). NEVER expose
// a secret this way — server-side secrets are read at runtime via process.env.
const rawEnv = (...keys: string[]) =>
  keys.map((k) => process.env[k]).find((v) => v) ?? "";
const publicEnv = (...keys: string[]) => JSON.stringify(rawEnv(...keys));

// The deployed site serves this project's backend at /api/* on its own domain
// (netlify-api-mask.mjs writes the hosting rewrite to the Supabase edge
// functions at build time). Proxying /api in the dev server too means
// `fetch("/api/<fn>")` works the same locally. The proxy key is a regex (`^`
// prefix) so paths like /api-docs aren't proxied — plain string keys match by
// prefix, which would diverge from hosting's /api/*.
const supabaseUrl = rawEnv("SUPABASE_URL", "VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL");

// The Supabase coordinates accept aliased spellings because the platform
// exports all three; a spelling mismatch once baked in empty values and
// shipped a product with an unconfigured backend.
export default defineConfig({
  plugins: [tanstackStart({ customViteReactPlugin: true }), viteReact()],
  ...(supabaseUrl
    ? {
        server: {
          proxy: {
            "^/api(/|$)": {
              target: `${supabaseUrl.replace(/\/+$/, "")}/functions/v1`,
              changeOrigin: true,
              rewrite: (p) => p.replace(/^\/api/, ""),
            },
          },
        },
      }
    : {}),
  define: {
    "import.meta.env.SUPABASE_URL": publicEnv("SUPABASE_URL", "VITE_SUPABASE_URL", "NEXT_PUBLIC_SUPABASE_URL"),
    "import.meta.env.SUPABASE_ANON_KEY": publicEnv("SUPABASE_ANON_KEY", "VITE_SUPABASE_ANON_KEY", "NEXT_PUBLIC_SUPABASE_ANON_KEY"),
    "import.meta.env.SENTRY_DSN": publicEnv("SENTRY_DSN"),
    "import.meta.env.GA4_MEASUREMENT_ID": publicEnv("GA4_MEASUREMENT_ID"),
    "import.meta.env.GOOGLE_ADS_CONVERSION_ID": publicEnv("GOOGLE_ADS_CONVERSION_ID"),
    // The live site origin — auth email links anchor to this (see lib/auth.ts).
    "import.meta.env.APP_BASE_URL": publicEnv("APP_BASE_URL"),
    "import.meta.env.FEEDBACK_PROJECT_ID": publicEnv("FEEDBACK_PROJECT_ID"),
    "import.meta.env.FEEDBACK_WIDGET_URL": publicEnv("FEEDBACK_WIDGET_URL"),
  },
});
