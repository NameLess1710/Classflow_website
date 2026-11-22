import { useSyncExternalStore } from "react";

type Updater<T> = T | ((prev: T) => T);

/**
 * Tiny localStorage-backed store shared across components.
 * Values load lazily on first browser access, so it is only read after hydration
 * (the student layout renders its pages client-side once hydrated).
 */
export function createPersistedStore<T>(key: string, init: () => T) {
  const storageKey = `campuspulse:${key}`;
  let value: T | undefined;
  const listeners = new Set<() => void>();

  const load = (): T => {
    if (value !== undefined) return value;
    if (typeof window === "undefined") return init();
    try {
      const raw = window.localStorage.getItem(storageKey);
      value = raw ? (JSON.parse(raw) as T) : init();
    } catch {
      value = init();
    }
    return value as T;
  };

  const set = (next: Updater<T>) => {
    value = typeof next === "function" ? (next as (p: T) => T)(load()) : next;
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

  const subscribe = (listener: () => void) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  function useStore() {
    const v = useSyncExternalStore(subscribe, load, load);
    return [v, set] as const;
  }

  return { useStore, get: load, set, reset };
}
