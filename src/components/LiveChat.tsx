"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MOCK_CHAT } from "@/data/mockData";
import { TierBadge } from "./TierBadge";
import { MessageSquare, Send } from "lucide-react";
import { useState, useEffect, useRef, KeyboardEvent } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import type { ChatMessage } from "@/lib/app-store";

interface LiveChatProps {
  room?: string;
}

const INITIAL_MESSAGES: ChatMessage[] = MOCK_CHAT.map((m) => ({
  id: m.id,
  user: m.user,
  message: m.message,
  tier: m.tier,
  timestamp: m.timestamp,
}));

export function LiveChat({ room = "livestream" }: LiveChatProps) {
  const { state, sendChat } = useAppStore();
  const [draft, setDraft] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const stored = state.chatMessages[room];
  const messages: ChatMessage[] = stored && stored.length > 0 ? stored : INITIAL_MESSAGES;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  const handleSend = () => {
    const text = draft.trim();
    if (!text) return;
    sendChat(room, text);
    setDraft("");
    inputRef.current?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="glass rounded-xl flex flex-col h-full max-h-96">
      <div className="flex items-center gap-2 px-4 pt-4 pb-2 border-b border-border/30">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="font-display text-xs uppercase tracking-wider text-primary">Live Chat</span>
        <span className="ml-auto w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
        <span className="text-[10px] text-muted-foreground">{messages.length} msgs</span>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 space-y-2">
        <AnimatePresence initial={false}>
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={`leading-snug ${msg.isOwn ? "text-right" : ""}`}
            >
              {msg.isOwn ? (
                <div className="inline-flex flex-col items-end gap-0.5">
                  <span className="px-3 py-1.5 rounded-xl bg-primary/20 text-foreground text-xs">
                    {msg.message}
                  </span>
                  <span className="text-[9px] text-muted-foreground/50">{msg.timestamp}</span>
                </div>
              ) : (
                <div>
                  <span className="inline-flex items-center gap-1">
                    <TierBadge tier={msg.tier} />
                    <span className="font-semibold text-foreground text-xs">{msg.user}</span>
                    <span className="text-[9px] text-muted-foreground/50 ml-1">{msg.timestamp}</span>
                  </span>
                  <p className="text-muted-foreground text-xs ml-5 mt-0.5">{msg.message}</p>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="px-3 pb-3 pt-2 border-t border-border/30">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Say something..."
            maxLength={200}
            className="flex-1 bg-muted/40 border border-border/50 rounded-lg px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 min-w-0"
          />
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={!draft.trim()}
            className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center text-primary hover:bg-primary/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5" />
          </motion.button>
        </div>
      </div>
    </div>
  );
}
