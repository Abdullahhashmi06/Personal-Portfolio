"use client";

import { Reveal } from "../ui/Reveal";

interface WorkflowStepProps {
  number: string;
  title: string;
  description: string;
  index?: number;
}

/**
 * Numbered workflow step with staggered reveal. Used in "How it works"
 * and process-flow sections of case studies.
 */
export function WorkflowStep({
  number,
  title,
  description,
  index = 0,
}: WorkflowStepProps) {
  return (
    <Reveal delay={index * 0.12}>
      <div className="relative flex gap-5 sm:gap-7">
        {/* Vertical connector line */}
        <div className="flex flex-col items-center">
          <span className="grid size-10 shrink-0 place-items-center rounded-full border border-line bg-white/[0.03] font-mono text-sm font-semibold text-accent">
            {number}
          </span>
          <div className="mt-2 h-full w-px bg-line" />
        </div>

        <div className="pb-10">
          <h3 className="text-lg font-semibold tracking-tight text-fg sm:text-xl">
            {title}
          </h3>
          <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted sm:text-base">
            {description}
          </p>
        </div>
      </div>
    </Reveal>
  );
}
