"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useIsPointerFine, usePrefersReducedMotion } from "@/lib/hooks";

/**
 * Desktop-only cursor companions: a large, very soft ambient glow that
 * trails the pointer, and a small ring that reacts to interactive elements.
 * The native cursor stays fully visible and usable.
 */
export function CursorEffect() {
  const fine = useIsPointerFine();
  const reduced = usePrefersReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);

  const glowX = useSpring(x, { stiffness: 55, damping: 22, mass: 0.9 });
  const glowY = useSpring(y, { stiffness: 55, damping: 22, mass: 0.9 });
  const ringX = useSpring(x, { stiffness: 380, damping: 30, mass: 0.35 });
  const ringY = useSpring(y, { stiffness: 380, damping: 30, mass: 0.35 });

  useEffect(() => {
    if (!fine || reduced) return;

    const onMove = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setEnabled(true);
    };
    const onOver = (e: MouseEvent) => {
      const target = e.target as Element | null;
      setHovering(
        !!target?.closest(
          "a, button, [role='button'], [data-cursor='pointer'], input, textarea"
        )
      );
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseover", onOver, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
    };
  }, [fine, reduced, x, y]);

  if (!fine || reduced) return null;

  return (
    <div aria-hidden="true" className={enabled ? "" : "opacity-0"}>
      <motion.div
        style={{ x: glowX, y: glowY }}
        className="pointer-events-none fixed left-0 top-0 z-[95] hidden lg:block"
      >
        <div className="-translate-x-1/2 -translate-y-1/2">
          <div className="size-[560px] rounded-full bg-[radial-gradient(circle,rgb(154_160_255/0.07),transparent_62%)] mix-blend-screen" />
        </div>
      </motion.div>

      <motion.div
        style={{ x: ringX, y: ringY }}
        className="pointer-events-none fixed left-0 top-0 z-[100] hidden lg:block"
      >
        <motion.div
          animate={{
            scale: hovering ? 1.7 : 1,
            backgroundColor: hovering
              ? "rgb(154 160 255 / 0.10)"
              : "rgb(255 255 255 / 0)",
            borderColor: hovering
              ? "rgb(154 160 255 / 0.7)"
              : "rgb(255 255 255 / 0.28)",
          }}
          transition={{ duration: 0.25, ease: "easeOut" }}
          className="size-8 -translate-x-1/2 -translate-y-1/2 rounded-full border"
        />
      </motion.div>
    </div>
  );
}
