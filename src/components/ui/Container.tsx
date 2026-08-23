import { cn } from "@/lib/utils";

/** Page-width content wrapper with consistent responsive padding. */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-6xl px-5 sm:px-8 lg:px-12", className)}>
      {children}
    </div>
  );
}
