// Preview bridge. When this app runs inside a framing SynthOS editor (the mock
// browser in the Preview panel), the parent is cross-origin and can't read the
// frame's location. This posts the current URL to the parent on load and on
// every client-side route change so the editor's address bar tracks in-frame
// navigation.
//
// This is intentionally independent of the feedback widget (which only loads
// when feedback is configured) — every app must report its URL, whether or not
// feedback is turned on. Harmless for real visitors: with no framing parent the
// messages go nowhere, and it never touches the page's own behaviour.

export function initPreviewBridge(): void {
  try {
    if (typeof window === "undefined") return;
    if (!window.parent || window.parent === window) return; // not framed

    let lastReported = "";
    const report = () => {
      if (location.href === lastReported) return;
      lastReported = location.href;
      try {
        window.parent.postMessage({ type: "synthos-url-changed", url: location.href }, "*");
      } catch {
        // Cross-origin post can throw in odd sandboxes — never break the app.
      }
    };

    report();
    window.addEventListener("popstate", report);
    window.addEventListener("hashchange", report);

    // Wrap the history API so SPA pushState/replaceState navigations report too.
    const wrap = (name: "pushState" | "replaceState") => {
      const orig = history[name];
      if (typeof orig !== "function") return;
      history[name] = function (this: History, ...args: unknown[]) {
        const r = (orig as (...a: unknown[]) => unknown).apply(this, args);
        report();
        return r;
      } as typeof orig;
    };
    wrap("pushState");
    wrap("replaceState");

    // Belt-and-braces: some routers cache the native history methods before this
    // runs, so their pushState bypasses the wrappers above. A light poll of
    // location.href catches every navigation regardless of how it's performed.
    setInterval(report, 400);
  } catch {
    // The bridge must never break the app — swallow and move on.
  }
}
