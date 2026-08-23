"use client";

import { motion } from "motion/react";
import { cn, EASE } from "@/lib/utils";

interface AnimatedTextProps {
  /** Text to reveal. "\n" creates an intentional break on sm+ screens only. */
  text: string;
  className?: string;
  /** Seconds before the first word animates. */
  delay?: number;
  /** Seconds between words. */
  stagger?: number;
  /** Words rendered with the accent gradient (matched by substring). */
  highlight?: readonly string[];
  as?: "h1" | "h2" | "h3" | "p" | "span" | "div";
}

/**
 * Word-by-word masked reveal for headings. Each word rises out of an
 * overflow-hidden mask; words are staggered for a choreographed entrance.
 */
export function AnimatedText({
  text,
  className,
  delay = 0,
  stagger = 0.06,
  highlight = [],
  as = "span",
}: AnimatedTextProps) {
  const MotionTag = motion[as] as typeof motion.div;
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  return (
    <MotionTag
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, amount: 0.2, margin: "-4% 0px" }}
      aria-label={text.replace(/\n/g, " ")}
      className={cn(className)}
    >
      {lines.map((line, lineIndex) => {
        const words = line.split(" ");
        const wordsBefore = lines
          .slice(0, lineIndex)
          .reduce((acc, l) => acc + l.split(" ").length, 0);
        return (
          <span
            key={lineIndex}
            aria-hidden="true"
            className="sm:block"
          >
            {words.map((word, wordIndex) => {
              const index = wordsBefore + wordIndex;
              const isHighlight = highlight.some(
                (h) => word === h || word.startsWith(h) || word.endsWith(h)
              );
            return (
              <span
                key={`${lineIndex}-${index}`}
                className="inline-block overflow-hidden pb-[0.14em] -mb-[0.14em] align-bottom"
              >
                <motion.span
                  className={cn(
                    "inline-block will-change-transform",
                    isHighlight && "text-gradient-accent"
                  )}
                  variants={{
                    hidden: { y: "115%", opacity: 0 },
                    visible: {
                      y: "0%",
                      opacity: 1,
                      transition: {
                        duration: 0.75,
                        ease: EASE,
                        delay: delay + index * stagger,
                      },
                    },
                  }}
                >
                  {word}
                  {"\u00A0"}
                </motion.span>
              </span>
            );
          })}
          </span>
        );
      })}
    </MotionTag>
  );
}
