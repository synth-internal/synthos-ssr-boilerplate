import { HeadContent, Outlet, Scripts, createRootRoute } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { useEffect } from "react";
import { initSentry } from "../lib/sentry";
import { initAnalytics } from "../lib/analytics";
import { initFeedbackWidget } from "../lib/feedback";
import { initPreviewBridge } from "../lib/previewBridge";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "SynthOS App" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  // Platform defaults — client-only, guarded no-ops when unconfigured. Wired in
  // by SynthOS for EVERY project; do NOT remove initFeedbackWidget() (it embeds
  // SynthOS's own feedback widget — never replace it with a hand-built one).
  useEffect(() => {
    initSentry();
    initAnalytics();
    initFeedbackWidget();
    // Report in-frame navigation to a framing SynthOS editor's preview address
    // bar (always on, independent of feedback config). Do NOT remove.
    initPreviewBridge();
  }, []);

  return (
    <RootDocument>
      <Outlet />
    </RootDocument>
  );
}

function RootDocument({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}
