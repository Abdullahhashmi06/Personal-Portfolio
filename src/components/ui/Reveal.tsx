"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before animating. */
  delay?: number;
  /** Initial vertical offset in px. */
  y?: number;
  /** Animate only once (default) or every time it enters the viewport. */
  once?: boolean;
}

/**
 * Scroll-triggered fade + rise. Replays every time the element enters
 * the viewport (once=false by default). Respects prefers-reduced-motion
 * via MotionConfig in the layout.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  y = 26,
  once = false,
}: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, amount: 0.15, margin: "-40px 0px" }}
      transition={{ duration: 0.7, delay, ease: EASE }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
