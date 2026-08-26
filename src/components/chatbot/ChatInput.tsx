"use client";

import { useState, useRef, useCallback } from "react";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean;
}

export function ChatInput({ onSend, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if (!trimmed || disabled) return;
    onSend(trimmed);
    setValue("");
    // Reset textarea height
    if (inputRef.current) {
      inputRef.current.style.height = "auto";
    }
  }, [value, disabled, onSend]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-resize
    const el = e.target;
    el.style.height = "auto";
    el.style.height = Math.min(el.scrollHeight, 120) + "px";
  };

  const isEmpty = value.trim().length === 0;

  return (
    <div className="flex items-end gap-2 border-t border-line p-3">
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        placeholder="Ask about Abdullah..."
        disabled={disabled}
        rows={1}
        className={cn(
          "flex-1 resize-none rounded-xl border border-line bg-white/[0.03] px-4 py-2.5 text-sm text-fg",
          "placeholder:text-faint/60 outline-none transition-all duration-200",
          "focus:border-accent/50 focus:bg-white/[0.05]",
          "disabled:opacity-50",
          "max-h-[120px]"
        )}
      />
      <button
        type="button"
        onClick={handleSend}
        disabled={disabled || isEmpty}
        aria-label="Send message"
        className={cn(
          "grid size-10 shrink-0 place-items-center rounded-xl transition-all duration-200",
          disabled || isEmpty
            ? "cursor-not-allowed bg-white/[0.03] text-faint"
            : "bg-fg text-ink hover:bg-white"
        )}
      >
        <Send className="size-4" />
      </button>
    </div>
  );
}
