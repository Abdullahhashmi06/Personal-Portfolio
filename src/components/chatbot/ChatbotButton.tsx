"use client";

import { motion, AnimatePresence } from "motion/react";
import { MessageSquare, X } from "lucide-react";
import { cn, EASE } from "@/lib/utils";

interface ChatbotButtonProps {
  open: boolean;
  onClick: () => void;
}

export function ChatbotButton({ open, onClick }: ChatbotButtonProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      aria-label={open ? "Close chat" : "Open chat assistant"}
      className={cn(
        "group fixed bottom-5 right-5 z-[98] flex items-center gap-2.5 rounded-full border border-line bg-surface/90 px-4 py-3 shadow-lift backdrop-blur-xl",
        "transition-all duration-300 hover:border-accent/40 hover:bg-raised hover:shadow-glow",
        "sm:bottom-6 sm:right-6"
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.97 }}
    >
      <AnimatePresence mode="wait" initial={false}>
        {open ? (
          <motion.span
            key="close"
            initial={{ rotate: -90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="grid size-5 place-items-center text-muted"
          >
            <X className="size-4" />
          </motion.span>
        ) : (
          <motion.span
            key="open"
            initial={{ rotate: 90, opacity: 0 }}
            animate={{ rotate: 0, opacity: 1 }}
            exit={{ rotate: -90, opacity: 0 }}
            transition={{ duration: 0.2, ease: EASE }}
            className="grid size-5 place-items-center text-accent"
          >
            <MessageSquare className="size-4" />
          </motion.span>
        )}
      </AnimatePresence>

      <span className="hidden text-sm font-medium text-muted transition-colors group-hover:text-fg sm:inline">
        {open ? "Close" : "Ask about Abdullah"}
      </span>
    </motion.button>
  );
}
