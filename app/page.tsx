"use client";

import { motion, AnimatePresence } from "framer-motion";
import { QuickTradeDialog } from "@/components/QuickTradeDialog";
import { LiveChat } from "@/components/LiveChat";
import { VoiceMic } from "@/components/VoiceMic";
import { MOCK_TOKENS } from "@/data/mockData";
import type { AgentToken } from "@/data/mockData";
import { useAppStore } from "@/hooks/use-app-store";
import {
  Radio, Eye, ArrowUpRight, ArrowDownRight,
  TrendingUp, Wallet, ChevronUp, ChevronDown,
  MessageCircle, X,
} from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";

const ACTIVE_TOKENS = MOCK_TOKENS.filter((t) => t.status !== "retired");
const QUICK_BUY = [5, 10, 25];

export default function LiveFeed() {
  const router = useRouter();
  const { state, buy } = useAppStore();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewers, setViewers] = useState<number[]>(() =>
    ACTIVE_TOKENS.map(() => Math.floor(900 + Math.random() * 800))
  );
  const [tradeToken, setTradeToken] = useState<AgentToken>(ACTIVE_TOKENS[0]);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeOpen, setTradeOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);

  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Fluctuate viewer count for visible slide
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((v) =>
        v.map((count, i) =>
          i === currentIndex
            ? Math.max(800, count + Math.floor(Math.random() * 21) - 10)
            : count
        )
      );
    }, 3000);
    return () => clearInterval(interval);
  }, [currentIndex]);

  // Track which slide is in view via IntersectionObserver
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = slideRefs.current.indexOf(entry.target as HTMLDivElement);
            if (idx !== -1) setCurrentIndex(idx);
          }
        });
      },
      { threshold: 0.55 }
    );
    const els = slideRefs.current;
    els.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, []);

  const scrollTo = useCallback((idx: number) => {
    slideRefs.current[Math.max(0, Math.min(idx, ACTIVE_TOKENS.length - 1))]
      ?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const openTrade = (tok: AgentToken, type: "buy" | "sell") => {
    setTradeToken(tok);
    setTradeType(type);
    setTradeOpen(true);
  };

  return (
    <>
      <QuickTradeDialog
        token={tradeToken}
        type={tradeType}
        isOpen={tradeOpen}
        onClose={() => setTradeOpen(false)}
      />

      {/* Mobile chat slide-over */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 300 }}
            className="fixed inset-y-0 right-0 w-80 max-w-[90vw] z-[60] flex flex-col lg:hidden"
          >
            <div className="flex flex-col h-full bg-background/95 backdrop-blur-xl border-l border-border pt-12 sm:pt-14 pb-16">
              <div className="flex items-center justify-between px-4 py-2 border-b border-border flex-shrink-0">
                <span className="text-sm font-semibold text-foreground">
                  {ACTIVE_TOKENS[currentIndex]?.agentName} · Live Chat
                </span>
                <button onClick={() => setChatOpen(false)}>
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>
              <div className="flex-1 min-h-0">
                <LiveChat room={`live-${ACTIVE_TOKENS[currentIndex]?.id}`} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* TikTok-style snap-scroll feed */}
      <div
        className="h-screen overflow-y-scroll snap-y snap-mandatory [&::-webkit-scrollbar]:hidden"
        style={{ scrollbarWidth: "none" }}
      >
        {ACTIVE_TOKENS.map((tok, i) => {
          const pos = state.portfolio[tok.id];
          const positive = tok.change24h >= 0;
          const pnl = pos ? (tok.price - pos.avgPrice) * pos.tokens : 0;

          return (
            <div
              key={tok.id}
              ref={(el) => { slideRefs.current[i] = el; }}
              className="h-screen snap-start relative flex overflow-hidden"
            >
              {/* Slide background */}
              <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-primary/5 pointer-events-none" />

              {/* Content */}
              <div className="relative z-10 flex w-full h-full pt-12 sm:pt-14 pb-16 lg:pb-0">

                {/* ── Stream column ── */}
                <div className="flex-1 flex flex-col min-w-0">
                  {/* Top badges */}
                  <div className="flex items-center gap-2 px-4 pt-3 flex-shrink-0">
                    <motion.span
                      animate={i === currentIndex ? { opacity: [1, 0.5, 1] } : {}}
                      transition={{ duration: 1.4, repeat: Infinity }}
                      className="flex items-center gap-1.5 bg-destructive/90 text-destructive-foreground px-2.5 py-0.5 rounded-full text-[10px] font-bold"
                    >
                      <Radio className="w-2.5 h-2.5" /> LIVE
                    </motion.span>
                    <span className="flex items-center gap-1 glass rounded-full px-2.5 py-0.5 text-[10px]">
                      <Eye className="w-2.5 h-2.5 text-primary" />
                      <span className="tabular-nums text-foreground">
                        {viewers[i]?.toLocaleString("en-US")}
                      </span>
                    </span>
                    <span className="ml-auto text-[10px] text-muted-foreground font-display uppercase tracking-wider">
                      {i + 1} / {ACTIVE_TOKENS.length}
                    </span>
                  </div>

                  {/* Agent card — centered */}
                  <div className="flex-1 flex items-center justify-center px-6">
                    <div className="text-center space-y-4 w-full max-w-sm">
                      <motion.div
                        animate={i === currentIndex ? { scale: [1, 1.07, 1] } : { scale: 1 }}
                        transition={{ duration: 2.5, repeat: Infinity }}
                        className="text-[80px] sm:text-[96px] leading-none select-none"
                      >
                        {tok.agentAvatar}
                      </motion.div>

                      <div>
                        <h2 className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                          {tok.agentName}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-0.5">{tok.type}</p>
                      </div>

                      <div className="flex items-center justify-center gap-3">
                        <span className="font-display text-3xl sm:text-4xl font-bold text-foreground">
                          ${tok.price.toFixed(2)}
                        </span>
                        <span
                          className={`inline-flex items-center gap-0.5 text-sm font-bold px-2.5 py-1 rounded-full ${
                            positive
                              ? "bg-neon-green/15 text-neon-green"
                              : "bg-destructive/15 text-destructive"
                          }`}
                        >
                          {positive
                            ? <ArrowUpRight className="w-4 h-4" />
                            : <ArrowDownRight className="w-4 h-4" />}
                          {Math.abs(tok.change24h)}%
                        </span>
                      </div>

                      {/* Position badge */}
                      {pos && (
                        <div className="inline-flex items-center gap-2 glass rounded-full px-3 py-1.5 text-xs">
                          <TrendingUp className="w-3 h-3 text-primary" />
                          <span className="text-muted-foreground">
                            {pos.tokens.toFixed(2)} {tok.symbol}
                          </span>
                          <span className={pnl >= 0 ? "text-neon-green font-semibold" : "text-destructive font-semibold"}>
                            {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <p className="text-[10px] text-muted-foreground">
                        <span className="text-primary font-display tracking-wider">MiCA</span>
                        {" "}· {tok.symbol} · ERC-20 · {(tok.supply / 1000).toFixed(0)}K supply · Conway Verified
                      </p>
                    </div>
                  </div>

                  {/* Bottom trade controls */}
                  <div className="px-4 pb-3 space-y-2.5 flex-shrink-0">
                    {/* Quick-buy pills */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-display uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                        Quick Buy
                      </span>
                      {QUICK_BUY.map((amt) => (
                        <motion.button
                          key={amt}
                          whileTap={{ scale: 0.91 }}
                          onClick={() =>
                            buy(tok.id, tok.symbol, tok.name, tok.agentAvatar, amt, tok.price)
                          }
                          className="flex-1 py-1.5 rounded-full bg-neon-green/15 border border-neon-green/40 text-neon-green text-xs font-bold hover:bg-neon-green/25 transition-colors"
                        >
                          +${amt}
                        </motion.button>
                      ))}
                    </div>

                    {/* Buy / Sell / Voice */}
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openTrade(tok, "buy")}
                        className="flex-1 py-3.5 rounded-2xl bg-primary text-primary-foreground text-sm font-display uppercase tracking-wider glow-cyan hover:bg-primary/90 transition-colors"
                      >
                        Buy {tok.symbol}
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.97 }}
                        onClick={() => openTrade(tok, "sell")}
                        disabled={!pos}
                        className="flex-1 py-3.5 rounded-2xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-display uppercase tracking-wider hover:bg-destructive/20 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                      >
                        Sell
                      </motion.button>
                      <VoiceMic
                        onTranscript={(text) => {
                          if (text.includes("buy")) openTrade(tok, "buy");
                          else if (text.includes("sell")) openTrade(tok, "sell");
                          else if (text.includes("next")) scrollTo(i + 1);
                          else if (text.includes("prev") || text.includes("previous")) scrollTo(i - 1);
                          else if (text.includes("detail") || text.includes("token")) router.push(`/token/${tok.id}`);
                        }}
                      />
                    </div>
                  </div>
                </div>

                {/* ── Right action strip (mobile/tablet) ── */}
                <div className="w-14 flex flex-col items-center justify-end pb-4 gap-3.5 pr-1 flex-shrink-0 lg:hidden">
                  {/* Chat */}
                  <button
                    onClick={() => { setCurrentIndex(i); setChatOpen((o) => !o); }}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="w-11 h-11 rounded-full glass flex items-center justify-center">
                      <MessageCircle className="w-5 h-5 text-foreground" />
                    </div>
                    <span className="text-[8px] text-muted-foreground">Chat</span>
                  </button>

                  {/* Token detail avatar */}
                  <button
                    onClick={() => router.push(`/token/${tok.id}`)}
                    className="flex flex-col items-center gap-0.5"
                  >
                    <div className="w-11 h-11 rounded-full glass flex items-center justify-center text-xl">
                      {tok.agentAvatar}
                    </div>
                    <span className="text-[8px] text-muted-foreground">Detail</span>
                  </button>

                  {/* Scroll up */}
                  {i > 0 && (
                    <button
                      onClick={() => scrollTo(i - 1)}
                      className="w-11 h-11 rounded-full glass flex items-center justify-center"
                    >
                      <ChevronUp className="w-5 h-5 text-foreground" />
                    </button>
                  )}

                  {/* Scroll down */}
                  {i < ACTIVE_TOKENS.length - 1 && (
                    <button
                      onClick={() => scrollTo(i + 1)}
                      className="w-11 h-11 rounded-full glass flex items-center justify-center"
                    >
                      <ChevronDown className="w-5 h-5 text-foreground" />
                    </button>
                  )}

                  {/* Dot indicators */}
                  <div className="flex flex-col gap-1.5 items-center">
                    {ACTIVE_TOKENS.map((_, j) => (
                      <button
                        key={j}
                        onClick={() => scrollTo(j)}
                        className={`rounded-full transition-all duration-200 ${
                          j === currentIndex
                            ? "h-4 w-1.5 bg-primary"
                            : "h-1.5 w-1.5 bg-muted-foreground/35"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* ── Desktop right panel ── */}
                <div className="hidden lg:flex w-80 flex-col gap-3 py-3 pr-4 flex-shrink-0">
                  {/* Trading card */}
                  <div className="glass rounded-xl p-4 space-y-3 flex-shrink-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{tok.agentAvatar}</span>
                        <div>
                          <p className="text-sm font-semibold text-foreground">{tok.symbol}</p>
                          <p className="text-[10px] text-muted-foreground">{tok.name}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-foreground">${tok.price.toFixed(2)}</p>
                        <span className={`text-[10px] ${positive ? "text-neon-green" : "text-destructive"}`}>
                          {positive ? "+" : ""}{tok.change24h}% 24h
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-1.5 text-center">
                      {[
                        { label: "Vol 24h", value: `$${(tok.volume24h / 1000).toFixed(0)}K` },
                        { label: "Supply", value: `${(tok.supply / 1000).toFixed(0)}K` },
                        { label: "SC", value: String(tok.survivalCredits) },
                      ].map(({ label, value }) => (
                        <div key={label} className="bg-muted/30 rounded-lg py-1.5 px-1">
                          <p className="text-[11px] font-semibold text-foreground">{value}</p>
                          <p className="text-[9px] text-muted-foreground">{label}</p>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/20 rounded-lg px-3 py-2">
                      <div className="flex items-center gap-1.5">
                        <Wallet className="w-3.5 h-3.5 text-primary" />
                        <span>Balance</span>
                      </div>
                      <span className="font-semibold text-foreground">
                        ${state.walletBalance.toFixed(2)} USDC
                      </span>
                    </div>

                    {pos && (
                      <div className="flex items-center justify-between text-xs bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                        <div className="flex items-center gap-1.5">
                          <TrendingUp className="w-3.5 h-3.5 text-primary" />
                          <span className="text-muted-foreground">{pos.tokens.toFixed(2)} {tok.symbol}</span>
                        </div>
                        <span className={`font-semibold ${pnl >= 0 ? "text-neon-green" : "text-destructive"}`}>
                          {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                        </span>
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-1.5">
                      {QUICK_BUY.map((amt) => (
                        <button
                          key={amt}
                          onClick={() => buy(tok.id, tok.symbol, tok.name, tok.agentAvatar, amt, tok.price)}
                          className="py-1.5 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-semibold hover:bg-neon-green/20 transition-colors"
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => openTrade(tok, "buy")}
                        className="py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-display uppercase tracking-wider glow-cyan hover:bg-primary/90 transition-colors"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => openTrade(tok, "sell")}
                        disabled={!pos}
                        className="py-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs font-display uppercase tracking-wider hover:bg-destructive/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                      >
                        Sell
                      </button>
                    </div>

                    <button
                      onClick={() => router.push(`/token/${tok.id}`)}
                      className="w-full py-1.5 text-[10px] text-primary hover:underline font-display uppercase tracking-wider"
                    >
                      View full token detail →
                    </button>
                  </div>

                  {/* Chat */}
                  <div className="flex-1 min-h-0">
                    <LiveChat room={`live-${tok.id}`} />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
