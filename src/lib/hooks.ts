"use client";

import { useEffect, useState, useSyncExternalStore } from "react";

/** True once the browser reports a fine pointer (mouse/trackpad). */
export function useIsPointerFine(): boolean {
  const [fine, setFine] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    const update = () => setFine(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return fine;
}

/** True when the user prefers reduced motion. */
export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  return reduced;
}

const emptySubscribe = () => () => {};

/**
 * True after the component has mounted on the client. Uses
 * useSyncExternalStore so the initial server/hydration render is always
 * false and flips to true immediately on the client without an effect.
 */
export function useMounted(): boolean {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}
