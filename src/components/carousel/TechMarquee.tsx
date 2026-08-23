import type { Technology } from "@/data/technologies";
import { cn } from "@/lib/utils";

interface TechMarqueeProps {
  items: Technology[];
  /** Reverse the direction of travel. */
  reverse?: boolean;
  className?: string;
}

function Row({
  items,
  ariaHidden,
}: {
  items: Technology[];
  ariaHidden?: boolean;
}) {
  return (
    <ul
      aria-hidden={ariaHidden || undefined}
      className="flex shrink-0 items-center gap-3 pr-3 sm:gap-4 sm:pr-4"
    >
      {items.map((tech) => (
        <li
          key={tech.name}
          className="flex items-center gap-3 rounded-full border border-line bg-white/[0.02] px-5 py-2.5 transition-colors duration-300 hover:border-accent/40 sm:gap-4 sm:px-6 sm:py-3"
        >
          <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-accent/60" />
          <span className="whitespace-nowrap text-sm font-medium text-muted sm:text-base">
            {tech.name}
          </span>
        </li>
      ))}
    </ul>
  );
}

/**
 * Infinite horizontal marquee. Pure CSS, GPU-friendly, pauses on hover,
 * and freezes (static, still readable) for reduced-motion users.
 */
export function TechMarquee({ items, reverse = false, className }: TechMarqueeProps) {
  return (
    <div className={cn("mask-fade-x group relative overflow-hidden", className)}>
      <div
        className={cn(
          "flex w-max",
          reverse ? "animate-marquee-reverse" : "animate-marquee",
          "group-hover:[animation-play-state:paused]"
        )}
      >
        <Row items={items} />
        <Row items={items} ariaHidden />
      </div>
    </div>
  );
}
