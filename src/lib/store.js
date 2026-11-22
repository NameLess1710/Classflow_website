import { useSyncExternalStore } from "react";

/**
 * Tiny localStorage-backed store shared across components.
 * Values load lazily on first browser access, so it is only read after hydration
 * (the student layout renders its pages client-side once hydrated).
 */
export function createPersistedStore(key, init) {
  const storageKey = `campuspulse:${key}`;
  let value;
  const listeners = new Set();

  const load = () => {
    if (value !== undefined) return value;
    if (typeof window === "undefined") return init();
    try {
      const raw = window.localStorage.getItem(storageKey);
      value = raw ? JSON.parse(raw) : init();
    } catch {
      value = init();
    }
    return value;
  };

  const set = (next) => {
    value = typeof next === "function" ? next(load()) : next;
    try {
      window.localStorage.setItem(storageKey, JSON.stringify(value));
    } catch {
      /* storage full or unavailable: keep in-memory value */
    }
    listeners.forEach((l) => l());
  };

  const reset = () => {
    try {
      window.localStorage.removeItem(storageKey);
    } catch {
      /* ignore */
    }
    value = undefined;
    listeners.forEach((l) => l());
  };

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  function useStore() {
    const v = useSyncExternalStore(subscribe, load, load);
    return [v, set];
  }

  return { useStore, get: load, set, reset };
}
