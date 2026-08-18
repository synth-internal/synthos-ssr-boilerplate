# SynthOS Full-App (SSR) Boilerplate

A **server-rendered / full-stack** starter — TanStack Start + React + TypeScript
+ Tailwind — with Supabase, Sentry, Google Analytics and the SynthOS feedback
widget already wired in as guarded no-op seams (`src/lib/`).

New SynthOS projects created as a **Full app** are generated from this template.

## How it's built & hosted

Unlike the static boilerplate, this project has **no committed build**. SynthOS
provisions a git-connected Netlify site that **builds this repo on every push**
and runs the server as a Netlify Function. So:

- **Never commit build output** (`dist/`, `.output/`, `.nitro/`) — it's produced
  at deploy time and is git-ignored.
- Just push source; Netlify builds and serves it.
- `SERVER_PRESET=netlify` is injected into the build environment by SynthOS, so
  the build targets Netlify even if the repo also carries another host's config.

## Env

The PUBLIC values (`SUPABASE_URL`, `SUPABASE_ANON_KEY`, `SENTRY_DSN`,
`GA4_MEASUREMENT_ID`, …) are baked in at build time from the build environment
(see `vite.config.ts`). Server-side secrets are read at runtime via `process.env`
inside server functions — never baked into the client bundle.

## Local dev

```bash
npm install
npm run dev     # http://localhost:3000
npm run build   # production build (targets Netlify)
```
