import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "ghost";
type Size = "md" | "lg";

interface ButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: Variant;
  size?: Size;
  className?: string;
  /** Opens external links in a new tab. */
  external?: boolean;
  type?: "button" | "submit";
  ariaLabel?: string;
}

const base =
  "group relative inline-flex items-center justify-center gap-2 rounded-full font-medium tracking-tight transition-all duration-300 select-none cursor-pointer " +
  "focus-visible:outline-2 focus-visible:outline-accent focus-visible:outline-offset-4";

const variants: Record<Variant, string> = {
  primary:
    "bg-fg text-ink shadow-card hover:shadow-glow hover:bg-white",
  secondary:
    "border border-line-strong bg-white/[0.02] text-fg hover:border-white/25 hover:bg-white/[0.06]",
  ghost: "text-muted hover:text-fg",
};

const sizes: Record<Size, string> = {
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-[15px]",
};

/** Primary/secondary button. Renders <a> for hrefs, <button> otherwise. */
export function Button({
  children,
  href,
  onClick,
  variant = "primary",
  size = "md",
  className,
  external = false,
  type = "button",
  ariaLabel,
}: ButtonProps) {
  const classes = cn(base, variants[variant], sizes[size], className);

  if (href) {
    return (
      <a
        href={href}
        className={classes}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        aria-label={ariaLabel}
      >
        {children}
      </a>
    );
  }

  return (
    <button
      type={type}
      onClick={onClick}
      className={classes}
      aria-label={ariaLabel}
    >
      {children}
    </button>
  );
}
