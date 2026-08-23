"use client";

import { motion } from "motion/react";
import { Container } from "../ui/Container";
import { Reveal } from "../ui/Reveal";
import { cn } from "@/lib/utils";

interface CaseStudySectionProps {
  children: React.ReactNode;
  className?: string;
  /** Optional section label shown above the heading. */
  label?: string;
}

/**
 * Consistent section wrapper for case-study pages. Provides animated
 * entrance, container padding, and optional section label.
 */
export function CaseStudySection({
  children,
  className,
  label,
}: CaseStudySectionProps) {
  return (
    <section className={cn("relative py-20 sm:py-28", className)}>
      <Container>
        {label && (
          <Reveal>
            <p className="mb-8 font-mono text-[11px] uppercase tracking-[0.24em] text-faint">
              {label}
            </p>
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
