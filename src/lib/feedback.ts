// Feedback widget seam. The project id and widget URL are PUBLIC values baked
// in at build time (see vite.config.ts). When either is empty this is a safe
// no-op — no script is injected and no global is set.
declare global {
  interface Window {
    __SYNTH_FEEDBACK__?: { projectId: string; url: string; accent?: string; intro?: string };
  }
}

const SCRIPT_ID = "synth-feedback-widget";

export function initFeedbackWidget(): void {
  const projectId = import.meta.env.FEEDBACK_PROJECT_ID;
  const url = import.meta.env.FEEDBACK_WIDGET_URL;
  if (!projectId || !url) return; // widget not configured — nothing to do

  try {
    if (document.getElementById(SCRIPT_ID)) return; // already injected

    window.__SYNTH_FEEDBACK__ = { projectId, url };

    const script = document.createElement("script");
    script.id = SCRIPT_ID;
    script.async = true;
    script.src = `${url}?asset=js`;
    document.head.appendChild(script);
  } catch {
    // The widget must never break the app — swallow and move on.
  }
}
