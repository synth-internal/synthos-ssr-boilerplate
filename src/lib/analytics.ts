// Google Analytics (GA4) seam. The Measurement ID is a PUBLIC value baked in at
// build time (see vite.config.ts). When it's empty this is a safe no-op — no
// script is injected and no gtag calls fire.
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function initAnalytics(): void {
  const id = import.meta.env.GA4_MEASUREMENT_ID;
  // The Google Ads conversion id (AW-…) is also PUBLIC and baked in per project;
  // empty when the project has no Google Ads account. When Tag Manager is wired
  // the container already fires this tag — loading it here too is harmless.
  const adsId = import.meta.env.GOOGLE_ADS_CONVERSION_ID;
  const gtagId = id || adsId;
  if (!gtagId) return; // nothing configured — no-op

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${gtagId}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  if (id) window.gtag("config", id);
  if (adsId) window.gtag("config", adsId);
}
