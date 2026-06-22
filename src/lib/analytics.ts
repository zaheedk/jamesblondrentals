/**
 * Lightweight GA4 / dataLayer event helper.
 * Pushes to window.dataLayer and calls window.gtag if available.
 * Safe to call on the server / in tests (no-ops when window is undefined).
 */
export type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

export const trackEvent = (eventName: string, params: AnalyticsParams = {}): void => {
  if (typeof window === "undefined") return;
  try {
    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    w.dataLayer.push({ event: eventName, ...params });
    if (typeof w.gtag === "function") {
      w.gtag("event", eventName, params);
    }
  } catch (err) {
    // Never let analytics break the app
    console.warn("trackEvent failed:", err);
  }
};