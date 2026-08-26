"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/utils";

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1.5 px-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block size-1.5 rounded-full bg-muted/50"
          animate={{
            y: [0, -4, 0],
            opacity: [0.4, 1, 0.4],
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.15,
            repeat: Infinity,
            ease: EASE,
          }}
        />
      ))}
    </div>
  );
}
