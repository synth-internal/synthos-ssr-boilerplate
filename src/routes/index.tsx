import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
});

// Deliberately neutral starting page — NO visual opinion on purpose. Every real
// project designs its own look from its Brand Pack (palette, type, layout
// archetype); a styled hero here used to leak into finished sites and make them
// all look the same. Keep this plain: the build replaces it entirely.
function Home() {
  return (
    <main style={{ padding: "2rem", fontFamily: "system-ui, sans-serif" }}>
      <p>SynthOS full-app starter (server-rendered). TanStack Start + React + TypeScript + Tailwind on Netlify, with Supabase, Sentry and Google Analytics wired in. Replace this page with the product, designed from its Brand Pack.</p>
    </main>
  );
}
