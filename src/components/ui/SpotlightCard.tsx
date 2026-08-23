"use client";

import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import { cn } from "@/lib/utils";

interface SpotlightCardProps {
  children: React.ReactNode;
  className?: string;
  /** Disable the cursor-tracking highlight (e.g. inside carousels). */
  noSpotlight?: boolean;
}

/**
 * Card with a cursor-tracking spotlight:
 *  - a radial glow follows the cursor across the surface
 *  - the border lights up near the cursor (border-follow effect)
 *  - gentle lift + deepened shadow on hover
 *
 * On touch devices there is no hover, so the effects simply never trigger.
 */
export function SpotlightCard({
  children,
  className,
  noSpotlight = false,
}: SpotlightCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [spot, setSpot] = useState<{ x: number; y: number } | null>(null);

  const handleMove = (e: React.MouseEvent) => {
    if (noSpotlight) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    setSpot({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const style = spot
    ? ({ "--spot-x": `${spot.x}px`, "--spot-y": `${spot.y}px` } as CSSProperties)
    : undefined;

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      style={style}
      className={cn(
        "group relative rounded-3xl border border-line bg-surface shadow-card",
        "transition-[transform,border-color,box-shadow,background-color] duration-300",
        "hover:-translate-y-1 hover:border-line-strong hover:bg-raised hover:shadow-lift",
        !noSpotlight && "spotlight-border",
        className
      )}
    >
      {children}
    </div>
  );
}
