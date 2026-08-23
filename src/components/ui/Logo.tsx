import { site } from "@/data/site";
import { cn } from "@/lib/utils";

/** Monogram mark + wordmark, used in the navbar and footer. */
export function Logo({ className }: { className?: string }) {
  return (
    <a
      href="#top"
      aria-label={`${site.name} — back to top`}
      className={cn("group flex items-center gap-3", className)}
    >
      <span className="relative grid size-9 place-items-center overflow-hidden rounded-xl border border-line bg-white/[0.03] font-mono text-[13px] font-semibold tracking-tight text-fg transition-colors duration-300 group-hover:border-accent/40">
        {site.monogram}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -right-2 -top-2 size-5 rounded-full bg-accent/20 blur-[6px] transition-opacity duration-300 group-hover:opacity-100 opacity-0"
        />
      </span>
      <span className="hidden text-sm font-medium tracking-tight text-fg sm:block">
        {site.name}
      </span>
    </a>
  );
}
