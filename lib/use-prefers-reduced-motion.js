import { useSyncExternalStore } from "react";

// The visitor's "reduce motion" setting, kept up to date while the page is open.
//
// useSyncExternalStore gives `false` on the server and during hydration (so the HTML matches
// the server render), then the real value right after, without a setState inside an effect.
// (motion/react's useReducedMotion reads the setting in the first client render instead,
// which would make server and client HTML differ for visitors with reduced motion on.)
const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(onChange) {
  const media = window.matchMedia(QUERY);
  media.addEventListener("change", onChange);
  return () => media.removeEventListener("change", onChange);
}

const getSnapshot = () => window.matchMedia(QUERY).matches;
const getServerSnapshot = () => false;

export function usePrefersReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}
