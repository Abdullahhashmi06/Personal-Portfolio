"use client";

import { motion } from "motion/react";
import { EASE } from "@/lib/utils";

const suggestions = [
  "Who is Abdullah Hashmi?",
  "What projects has he built?",
  "Tell me about InternIQ",
  "What is the MLP project?",
  "How can I contact Abdullah?",
];

interface SuggestedQuestionsProps {
  onSelect: (question: string) => void;
}

export function SuggestedQuestions({ onSelect }: SuggestedQuestionsProps) {
  return (
    <div className="flex flex-wrap gap-2 px-1">
      {suggestions.map((question, i) => (
        <motion.button
          key={question}
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 + i * 0.06, ease: EASE }}
          onClick={() => onSelect(question)}
          className="rounded-full border border-line bg-white/[0.03] px-3.5 py-1.5 text-xs text-muted transition-all duration-200 hover:border-accent/40 hover:bg-accent/5 hover:text-fg"
        >
          {question}
        </motion.button>
      ))}
    </div>
  );
}
