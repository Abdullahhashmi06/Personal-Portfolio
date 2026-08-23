import { cn } from "@/lib/utils";
import { AnimatedText } from "./AnimatedText";
import { Reveal } from "./Reveal";

interface SectionHeadingProps {
  index: string;
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}

/**
 * Consistent section header: mono index + eyebrow, then a progressively
 * revealed title and optional description.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <header
      className={cn(
        "max-w-2xl",
        centered && "mx-auto flex flex-col items-center text-center",
        className
      )}
    >
      <Reveal>
        <div className="flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.24em] text-faint">
          <span className="text-accent">{index}</span>
          <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
          <span>{eyebrow}</span>
        </div>
      </Reveal>

      <AnimatedText
        as="h2"
        text={title}
        stagger={0.045}
        className={cn(
          "mt-5 text-3xl font-semibold tracking-tight text-fg sm:text-4xl lg:text-[2.75rem] lg:leading-[1.08]",
          centered && "text-balance"
        )}
      />

      {description ? (
        <Reveal delay={0.15}>
          <p
            className={cn(
              "mt-5 text-base leading-relaxed text-muted sm:text-lg",
              centered ? "max-w-xl" : "max-w-xl"
            )}
          >
            {description}
          </p>
        </Reveal>
      ) : null}
    </header>
  );
}
