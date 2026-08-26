"use client";

import {
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Trash2, MessageSquare } from "lucide-react";
import { cn, EASE } from "@/lib/utils";
import { ChatMessage, type Message } from "./ChatMessage";
import { ChatInput } from "./ChatInput";
import { TypingIndicator } from "./TypingIndicator";
import { SuggestedQuestions } from "./SuggestedQuestions";

interface ChatbotPanelProps {
  open: boolean;
  onClose: () => void;
}

const WELCOME_MESSAGE: Message = {
  id: "welcome",
  role: "assistant",
  content:
    "Hey! I'm Abdullah's AI portfolio assistant. Ask me about his projects, education, skills, or experience.",
};

export function ChatbotPanel({ open, onClose }: ChatbotPanelProps) {
  const [messages, setMessages] = useState<Message[]>([WELCOME_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  // Focus trap and escape handling
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const sendMessage = useCallback(
    async (content: string) => {
      const userMessage: Message = {
        id: Date.now().toString(),
        role: "user",
        content,
      };

      setMessages((prev) => [...prev, userMessage]);
      setLoading(true);

      try {
        // Build conversation history for context
        const history = [...messages, userMessage]
          .filter((m) => m.id !== "welcome")
          .map((m) => ({ role: m.role, content: m.content }));

        let res: Response;
        try {
          res = await fetch("/api/chat", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: content, history }),
          });
        } catch {
          // fetch() itself failed — true network error
          const networkError: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "Network error. Please check your connection and try again.",
            error: true,
          };
          setMessages((prev) => [...prev, networkError]);
          return;
        }

        // Parse response — handle non-JSON responses gracefully
        let data: Record<string, unknown>;
        try {
          data = await res.json();
        } catch {
          const serverError: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content:
              "The server returned an unexpected response. Please try again.",
            error: true,
          };
          setMessages((prev) => [...prev, serverError]);
          return;
        }

        if (!res.ok) {
          const errorMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: (data.error as string) || "Something went wrong. Please try again.",
            error: true,
          };
          setMessages((prev) => [...prev, errorMsg]);
        } else {
          const assistantMessage: Message = {
            id: (Date.now() + 1).toString(),
            role: "assistant",
            content: data.content as string,
            sources: data.sources as { title: string; source: string }[],
          };
          setMessages((prev) => [...prev, assistantMessage]);
        }
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  const clearConversation = useCallback(() => {
    setMessages([WELCOME_MESSAGE]);
    setLoading(false);
  }, []);

  const retryLastMessage = useCallback(() => {
    // Find the last user message and resend it
    const lastUserMsg = [...messages]
      .reverse()
      .find((m) => m.role === "user");
    if (lastUserMsg) {
      // Remove the error message
      setMessages((prev) => prev.filter((m) => !m.error));
      sendMessage(lastUserMsg.content);
    }
  }, [messages, sendMessage]);

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Mobile: full-screen backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[99] bg-black/40 sm:hidden"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Panel */}
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-label="Portfolio assistant"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: EASE }}
            className={cn(
              // Mobile: bottom sheet
              "fixed inset-x-0 bottom-0 z-[100] flex flex-col rounded-t-2xl border-t border-line bg-surface/95 backdrop-blur-xl",
              "max-h-[85vh] sm:max-h-[520px]",
              // Desktop: bottom-right corner
              "sm:bottom-24 sm:right-5 sm:inset-x-auto sm:w-[400px] sm:rounded-2xl sm:border sm:border-line"
            )}
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <div className="flex items-center gap-2.5">
                <div className="grid size-8 place-items-center rounded-lg bg-accent/10 text-accent">
                  <MessageSquare className="size-4" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-fg">
                    Abdullah&apos;s Assistant
                  </h2>
                  <p className="text-[10px] text-faint">AI Portfolio</p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={clearConversation}
                  aria-label="Clear conversation"
                  className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
                >
                  <Trash2 className="size-3.5" />
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="Close chat"
                  className="grid size-8 place-items-center rounded-lg text-muted transition-colors hover:bg-white/[0.05] hover:text-fg"
                >
                  <X className="size-4" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto p-4">
              {messages.map((msg) => (
                <ChatMessage
                  key={msg.id}
                  message={msg}
                  onRetry={
                    msg.error && !loading ? retryLastMessage : undefined
                  }
                />
              ))}

              {loading && (
                <div className="flex justify-start">
                  <div className="rounded-2xl border border-line bg-white/[0.03] px-4 py-3">
                    <TypingIndicator />
                  </div>
                </div>
              )}

              {/* Suggested questions — only show when conversation is fresh */}
              {messages.length === 1 && !loading && (
                <SuggestedQuestions onSelect={sendMessage} />
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <ChatInput onSend={sendMessage} disabled={loading} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
