"use client";

import { motion } from "motion/react";
import { AlertCircle, RefreshCw } from "lucide-react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn, EASE } from "@/lib/utils";

export interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources?: { title: string; source: string }[];
  error?: boolean;
}

interface ChatMessageProps {
  message: Message;
  onRetry?: () => void;
}

function SourceIndicator({ sources }: { sources: { title: string; source: string }[] }) {
  const uniqueSources = [...new Set(sources.map((s) => s.title))].slice(0, 2);
  if (uniqueSources.length === 0) return null;

  return (
    <div className="mt-2.5 border-t border-line pt-2">
      <p className="text-[10px] text-faint">
        From: {uniqueSources.join(", ")}
      </p>
    </div>
  );
}

/** Tailwind prose-like classes for Markdown rendered inside chat bubbles */
const markdownComponents = {
  p: ({ children, ...props }: React.HTMLAttributes<HTMLParagraphElement>) => (
    <p className="mb-2 last:mb-0" {...props}>{children}</p>
  ),
  strong: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <strong className="font-semibold" {...props}>{children}</strong>
  ),
  em: ({ children, ...props }: React.HTMLAttributes<HTMLElement>) => (
    <em className="italic" {...props}>{children}</em>
  ),
  ul: ({ children, ...props }: React.HTMLAttributes<HTMLUListElement>) => (
    <ul className="mb-2 list-disc pl-4" {...props}>{children}</ul>
  ),
  ol: ({ children, ...props }: React.HTMLAttributes<HTMLOListElement>) => (
    <ol className="mb-2 list-decimal pl-4" {...props}>{children}</ol>
  ),
  li: ({ children, ...props }: React.HTMLAttributes<HTMLLIElement>) => (
    <li className="mb-0.5" {...props}>{children}</li>
  ),
  h1: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h1 className="mb-2 text-base font-bold" {...props}>{children}</h1>
  ),
  h2: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h2 className="mb-2 text-sm font-bold" {...props}>{children}</h2>
  ),
  h3: ({ children, ...props }: React.HTMLAttributes<HTMLHeadingElement>) => (
    <h3 className="mb-1.5 text-sm font-semibold" {...props}>{children}</h3>
  ),
  code: ({ className, children, ...props }: React.HTMLAttributes<HTMLElement>) => {
    const isInline = !className?.includes("language-");
    return isInline ? (
      <code className="rounded bg-white/[0.06] px-1.5 py-0.5 text-[13px]" {...props}>{children}</code>
    ) : (
      <code className="block overflow-x-auto rounded-lg bg-white/[0.04] p-3 text-[13px]" {...props}>{children}</code>
    );
  },
  pre: ({ children, ...props }: React.HTMLAttributes<HTMLPreElement>) => (
    <pre className="mb-2 overflow-x-auto" {...props}>{children}</pre>
  ),
  a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-accent underline decoration-accent/30 underline-offset-2 transition-colors hover:decoration-accent/60"
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children, ...props }: React.HTMLAttributes<HTMLQuoteElement>) => (
    <blockquote className="mb-2 border-l-2 border-accent/30 pl-3 text-muted italic" {...props}>{children}</blockquote>
  ),
  hr: (props: React.HTMLAttributes<HTMLHRElement>) => (
    <hr className="my-3 border-line" {...props} />
  ),
};

export function ChatMessage({ message, onRetry }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: EASE }}
      className={cn("flex w-full", isUser ? "justify-end" : "justify-start")}
      role="article"
      aria-label={isUser ? "Your message" : "Assistant response"}
    >
      <div
        className={cn(
          "max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed",
          isUser
            ? "bg-fg text-ink"
            : message.error
              ? "border border-red-400/20 bg-red-400/5 text-muted"
              : "border border-line bg-white/[0.03] text-fg"
        )}
      >
        {message.error && (
          <div className="mb-2 flex items-center gap-1.5 text-red-400/80">
            <AlertCircle className="size-3.5" />
            <span className="text-xs">Error</span>
          </div>
        )}

        {isUser ? (
          <p className="whitespace-pre-wrap">{message.content}</p>
        ) : (
          <div className="prose-chat">
            <Markdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
              {message.content}
            </Markdown>
          </div>
        )}

        {/* Source indicator — subtle, only for assistant messages with sources */}
        {!isUser && !message.error && message.sources && message.sources.length > 0 && (
          <SourceIndicator sources={message.sources} />
        )}

        {/* Retry button for errors */}
        {message.error && onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-2 flex items-center gap-1.5 text-xs text-accent transition-colors hover:text-fg"
            aria-label="Retry sending message"
          >
            <RefreshCw className="size-3" />
            Retry
          </button>
        )}
      </div>
    </motion.div>
  );
}
