"use client";

import { useRef } from "react";
import { motion, useSpring } from "motion/react";
import { useIsPointerFine } from "@/lib/hooks";

interface MagneticButtonProps {
  children: React.ReactNode;
  /** How strongly the element is pulled toward the cursor. */
  strength?: number;
  className?: string;
}

/**
 * Subtly pulls its child toward the cursor (desktop only). Disabled on
 * touch devices so buttons never drift under a finger.
 */
export function MagneticButton({
  children,
  strength = 0.22,
  className,
}: MagneticButtonProps) {
  const ref = useRef<HTMLDivElement>(null);
  const fine = useIsPointerFine();

  const x = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });
  const y = useSpring(0, { stiffness: 220, damping: 18, mass: 0.6 });

  if (!fine) return <div className={className}>{children}</div>;

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(dx * strength);
    y.set(dy * strength);
  };

  const handleLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x, y }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
