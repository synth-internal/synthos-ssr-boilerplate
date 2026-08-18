/// <reference types="vite/client" />

// The PUBLIC build-time values baked in by vite.config.ts (never secrets).
interface ImportMetaEnv {
  readonly SUPABASE_URL: string;
  readonly SUPABASE_ANON_KEY: string;
  readonly SENTRY_DSN: string;
  readonly GA4_MEASUREMENT_ID: string;
  readonly GOOGLE_ADS_CONVERSION_ID: string;
  readonly APP_BASE_URL: string;
  readonly FEEDBACK_PROJECT_ID: string;
  readonly FEEDBACK_WIDGET_URL: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
