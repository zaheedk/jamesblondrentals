import { lazy, type ComponentType } from "react";

// Retries a failed dynamic import once, then reloads the page once so a stale
// module/chunk URL (after a deploy or dev-server refresh) recovers instead of blanking.
export function lazyWithRetry<T extends ComponentType<any>>(factory: () => Promise<{ default: T }>) {
  return lazy(async () => {
    try {
      return await factory();
    } catch (err) {
      await new Promise((r) => setTimeout(r, 800));
      try {
        return await factory();
      } catch (err2) {
        const key = "lazy-reload-at";
        const last = Number(sessionStorage.getItem(key) || 0);
        if (Date.now() - last > 10000) {
          sessionStorage.setItem(key, String(Date.now()));
          window.location.reload();
          return new Promise<{ default: T }>(() => {});
        }
        throw err2;
      }
    }
  });
}
