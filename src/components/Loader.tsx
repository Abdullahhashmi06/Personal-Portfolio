"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { site } from "@/data/site";
import { useMounted, usePrefersReducedMotion } from "@/lib/hooks";

const INTRO_MS = 750;

/**
 * Quick non-blocking intro: monogram + progress line, then a curtain that
 * lifts to reveal the page. Shows once per session, skipped entirely for
 * reduced-motion users. Never renders before mount, so there is no flash.
 */
export function Loader() {
  const mounted = useMounted();
  const reduced = usePrefersReducedMotion();

  const [done, setDone] = useState(() => {
    if (typeof window === "undefined" || typeof sessionStorage === "undefined") {
      return false;
    }
    try {
      return !!sessionStorage.getItem("fb-intro");
    } catch {
      return false;
    }
  });

  // Start the timer only when we actually intend to show the intro.
  useEffect(() => {
    if (done) return;
    const t = window.setTimeout(() => {
      setDone(true);
      try {
        sessionStorage.setItem("fb-intro", "1");
      } catch {
        /* private mode — ignore */
      }
    }, INTRO_MS);
    return () => window.clearTimeout(t);
  }, [done]);

  if (!mounted || reduced || done) return null;

  return (
    <AnimatePresence>
      <motion.div
        aria-hidden="true"
        exit={{ y: "-100%" }}
        transition={{ duration: 0.65, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[80] flex items-center justify-center bg-ink"
      >
        <div className="flex flex-col items-center gap-6">
          <motion.span
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="font-mono text-sm tracking-[0.5em] text-fg"
          >
            {site.monogram}
          </motion.span>
          <div className="h-px w-32 overflow-hidden rounded-full bg-white/10">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.75, ease: "easeInOut" }}
              className="h-full w-full origin-left bg-gradient-to-r from-accent-deep via-accent to-cyan-soft"
            />
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
