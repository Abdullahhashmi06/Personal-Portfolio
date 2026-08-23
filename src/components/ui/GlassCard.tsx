import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
}

/** Frosted, softly-bordered surface for layered content. */
export function GlassCard({ children, className }: GlassCardProps) {
  return (
    <div
      className={cn(
        "glass rounded-3xl shadow-card",
        className
      )}
    >
      {children}
    </div>
  );
}
