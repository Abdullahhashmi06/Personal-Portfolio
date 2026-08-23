import { cn } from "@/lib/utils";

interface IconButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  ariaLabel: string;
  className?: string;
  /** Visually dimmed and non-interactive. */
  disabled?: boolean;
  /** Opens external links in a new tab. */
  external?: boolean;
}

/** Circular icon-only button used for socials, carousel arrows, etc. */
export function IconButton({
  children,
  href,
  onClick,
  ariaLabel,
  className,
  disabled = false,
  external = false,
}: IconButtonProps) {
  const classes = cn(
    "grid size-10 sm:size-11 place-items-center rounded-full border border-line bg-white/[0.02] text-muted",
    "transition-all duration-300 hover:border-white/25 hover:bg-white/[0.06] hover:text-fg",
    "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-2",
    disabled && "pointer-events-none opacity-35",
    className
  );

  if (href) {
    return (
      <a
        href={href}
        aria-label={ariaLabel}
        aria-disabled={disabled || undefined}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={classes}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel}
      aria-disabled={disabled || undefined}
      disabled={disabled}
      className={classes}
    >
      {children}
    </button>
  );
}
