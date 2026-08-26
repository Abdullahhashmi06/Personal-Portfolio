"use client";

import { useState, useCallback } from "react";
import { ChatbotButton } from "./ChatbotButton";
import { ChatbotPanel } from "./ChatbotPanel";

/**
 * Portfolio AI Chatbot — floating assistant in the bottom-right corner.
 * Manages the open/close state for the launcher button and chat panel.
 */
export function Chatbot() {
  const [open, setOpen] = useState(false);

  const toggle = useCallback(() => setOpen((v) => !v), []);
  const close = useCallback(() => setOpen(false), []);

  return (
    <>
      <ChatbotButton open={open} onClick={toggle} />
      <ChatbotPanel open={open} onClose={close} />
    </>
  );
}
