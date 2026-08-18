// Error monitoring seam. The DSN is a PUBLIC value baked in at build time (see
// vite.config.ts). When it's empty this is a safe no-op, so the app runs the
// same with or without Sentry configured.
import * as Sentry from "@sentry/react";

export function initSentry(): void {
  const dsn = import.meta.env.SENTRY_DSN;
  if (!dsn) return; // no DSN configured — nothing to do
  Sentry.init({
    dsn,
    tracesSampleRate: 0.1,
  });
}
