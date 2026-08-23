import { cn } from "@/lib/utils";

interface ArrowLinkProps {
  children: React.ReactNode;
  href: string;
  icon?: React.ReactNode;
  external?: boolean;
  className?: string;
}

/**
 * Inline link with an animated underline and a nudging icon. Icons provided
 * as children of the link inherit the motion.
 */
export function ArrowLink({
  children,
  href,
  icon,
  external = false,
  className,
}: ArrowLinkProps) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className={cn(
        "group/link inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors duration-300 hover:text-fg",
        className
      )}
    >
      <span className="relative">
        {children}
        <span
          aria-hidden="true"
          className="absolute -bottom-0.5 left-0 h-px w-full origin-left scale-x-0 bg-current transition-transform duration-300 group-hover/link:scale-x-100"
        />
      </span>
      {icon ? (
        <span className="transition-transform duration-300 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5">
          {icon}
        </span>
      ) : null}
    </a>
  );
}
