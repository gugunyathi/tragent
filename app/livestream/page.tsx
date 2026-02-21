"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LiveChat } from "@/components/LiveChat";
import { QuickTradeDialog } from "@/components/QuickTradeDialog";
import { VoiceMic } from "@/components/VoiceMic";
import { SwipeHint } from "@/components/SwipeHint";
import { MOCK_TOKENS } from "@/data/mockData";
import { useAppStore } from "@/hooks/use-app-store";
import { Radio, Eye, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight, TrendingUp, Wallet } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ACTIVE_TOKENS = MOCK_TOKENS.filter((t) => t.status !== "retired");

export default function Livestream() {
  const router = useRouter();
  const { state, buy } = useAppStore();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewers, setViewers] = useState(1247);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeOpen, setTradeOpen] = useState(false);
  const token = ACTIVE_TOKENS[currentIndex];
  const position = state.portfolio[token.id];

  // Quick-buy presets (USD amounts)
  const QUICK_BUY = [5, 10, 25];

  const openTrade = (type: "buy" | "sell") => {
    setTradeType(type);
    setTradeOpen(true);
  };
  useEffect(() => {
    const interval = setInterval(() => {
      setViewers((v) => Math.max(800, v + Math.floor(Math.random() * 21) - 10));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Auto-advance every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((i) => (i + 1) % ACTIVE_TOKENS.length);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const prev = () => setCurrentIndex((i) => (i - 1 + ACTIVE_TOKENS.length) % ACTIVE_TOKENS.length);
  const next = () => setCurrentIndex((i) => (i + 1) % ACTIVE_TOKENS.length);

  const isPositive = token.change24h >= 0;

  return (
    <>
      <QuickTradeDialog token={token} type={tradeType} isOpen={tradeOpen} onClose={() => setTradeOpen(false)} />

      <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Video area */}
          <div className="lg:col-span-2 space-y-3 sm:space-y-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={token.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.3 }}
                className="aspect-video rounded-xl sm:rounded-2xl glass relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-background to-primary/10 flex items-center justify-center">
                  <div className="text-center space-y-2 sm:space-y-3">
                    <motion.div
                      key={token.agentAvatar}
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl sm:text-6xl"
                    >
                      {token.agentAvatar}
                    </motion.div>
                    <h2 className="font-display text-lg sm:text-xl text-foreground">{token.agentName}</h2>
                    <p className="text-xs sm:text-sm text-muted-foreground">
                      Presenting <span className="text-primary font-semibold">{token.symbol}</span>
                    </p>
                    <div className="flex items-center justify-center gap-3 text-sm">
                      <span className="text-foreground font-bold">${token.price.toFixed(2)}</span>
                      <span className={`flex items-center gap-0.5 text-xs ${isPositive ? "text-neon-green" : "text-destructive"}`}>
                        {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                        {Math.abs(token.change24h)}%
                      </span>
                    </div>
                  </div>
                </div>

                {/* Live badge */}
                <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2">
                  <span className="flex items-center gap-1 sm:gap-1.5 bg-destructive/90 text-destructive-foreground px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
                    <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3 animate-pulse" /> LIVE
                  </span>
                </div>

                {/* Viewer count */}
                <motion.div
                  className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs"
                  animate={{ opacity: [1, 0.8, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
                  <span className="text-foreground tabular-nums">{viewers.toLocaleString("en-US")}</span>
                </motion.div>

                {/* Nav buttons */}
                <button
                  onClick={prev}
                  className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={next}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full glass flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>

                {/* ── Floating quick-buy pills ── */}
                <div className="absolute bottom-14 sm:bottom-16 left-2 sm:left-3 flex items-center gap-1.5">
                  {QUICK_BUY.map((amt) => (
                    <motion.button
                      key={amt}
                      whileHover={{ scale: 1.06 }}
                      whileTap={{ scale: 0.94 }}
                      onClick={() => buy(token.id, token.symbol, token.name, token.agentAvatar, amt, token.price)}
                      className="px-2 sm:px-2.5 py-1 rounded-full bg-neon-green/20 border border-neon-green/40 text-neon-green text-[10px] sm:text-xs font-semibold backdrop-blur-sm hover:bg-neon-green/30 transition-colors"
                    >
                      +${amt}
                    </motion.button>
                  ))}
                </div>

                {/* ── Floating Buy / Sell buttons ── */}
                <div className="absolute bottom-14 sm:bottom-16 right-2 sm:right-3 flex items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => openTrade("sell")}
                    disabled={!position}
                    className="px-3 sm:px-4 py-1.5 rounded-full bg-destructive/20 border border-destructive/40 text-destructive text-[10px] sm:text-xs font-display uppercase tracking-wider backdrop-blur-sm hover:bg-destructive/30 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Sell
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.06 }}
                    whileTap={{ scale: 0.94 }}
                    onClick={() => openTrade("buy")}
                    className="px-3 sm:px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-[10px] sm:text-xs font-display uppercase tracking-wider backdrop-blur-sm hover:bg-primary/90 transition-colors glow-cyan"
                  >
                    Buy
                  </motion.button>
                </div>

                {/* Ticker */}
                <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[10px] text-muted-foreground flex items-center gap-1 sm:gap-2">
                  <span className="font-display uppercase tracking-wider text-primary">MiCA</span>
                  <span className="truncate">
                    {token.name} ({token.symbol}) — {token.type} — Supply: {(token.supply / 1000).toFixed(0)}K — Conway Registry Verified
                  </span>
                </div>

                {/* Agent dots */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {ACTIVE_TOKENS.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentIndex(i)}
                      className={`rounded-full transition-all ${i === currentIndex ? "w-4 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-muted-foreground/40"}`}
                    />
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Info bar */}
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3 sm:gap-4">
                <VoiceMic onTranscript={(text) => {
                  if (text.includes("next")) next();
                  else if (text.includes("previous") || text.includes("prev")) prev();
                  else if (text.includes("sell")) openTrade("sell");
                  else if (text.includes("buy")) openTrade("buy");
                }} />
                <div className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5">
                  <p>&quot;Buy&quot; · &quot;Sell&quot; · &quot;Next&quot; · &quot;Previous&quot;</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <SwipeHint />
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push(`/token/${token.id}`)}
                  className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-display uppercase tracking-wider hover:bg-primary/20 transition-colors"
                >
                  View {token.symbol}
                </motion.button>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-3 sm:space-y-4">
            {/* Live trading card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={token.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="glass rounded-xl p-4 space-y-4"
              >
                {/* Token header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{token.agentAvatar}</span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{token.symbol}</p>
                      <p className="text-[10px] text-muted-foreground">{token.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-foreground">${token.price.toFixed(2)}</p>
                    <span className={`flex items-center justify-end gap-0.5 text-[10px] ${isPositive ? "text-neon-green" : "text-destructive"}`}>
                      {isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                      {Math.abs(token.change24h)}% 24h
                    </span>
                  </div>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-3 gap-2 text-center">
                  {[
                    { label: "Vol 24h", value: `$${(token.volume24h / 1000).toFixed(0)}K` },
                    { label: "Supply", value: `${(token.supply / 1000).toFixed(0)}K` },
                    { label: "SC", value: token.survivalCredits },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-muted/30 rounded-lg py-1.5 px-1">
                      <p className="text-xs font-semibold text-foreground">{value}</p>
                      <p className="text-[9px] text-muted-foreground">{label}</p>
                    </div>
                  ))}
                </div>

                {/* Wallet balance */}
                <div className="flex items-center justify-between text-xs text-muted-foreground bg-muted/20 rounded-lg px-3 py-2">
                  <div className="flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5 text-primary" />
                    <span>Balance</span>
                  </div>
                  <span className="font-semibold text-foreground">${state.walletBalance.toFixed(2)} USDC</span>
                </div>

                {/* Position (if held) */}
                {position && (
                  <div className="flex items-center justify-between text-xs bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                    <div className="flex items-center gap-1.5">
                      <TrendingUp className="w-3.5 h-3.5 text-primary" />
                      <span className="text-muted-foreground">{position.tokens.toFixed(2)} {token.symbol}</span>
                    </div>
                    <span className={`font-semibold ${(token.price - position.avgPrice) * position.tokens >= 0 ? "text-neon-green" : "text-destructive"}`}>
                      {(token.price - position.avgPrice) * position.tokens >= 0 ? "+" : ""}
                      ${((token.price - position.avgPrice) * position.tokens).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Quick-buy amounts */}
                <div>
                  <p className="text-[10px] text-muted-foreground mb-2 font-display uppercase tracking-wider">Quick Buy</p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {QUICK_BUY.map((amt) => (
                      <motion.button
                        key={amt}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => buy(token.id, token.symbol, token.name, token.agentAvatar, amt, token.price)}
                        className="py-1.5 rounded-lg bg-neon-green/10 border border-neon-green/30 text-neon-green text-xs font-semibold hover:bg-neon-green/20 transition-colors"
                      >
                        ${amt}
                      </motion.button>
                    ))}
                  </div>
                </div>

                {/* Buy / Sell buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openTrade("buy")}
                    className="py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-display uppercase tracking-wider hover:bg-primary/90 transition-colors glow-cyan"
                  >
                    Buy
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => openTrade("sell")}
                    disabled={!position}
                    className="py-2.5 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm font-display uppercase tracking-wider hover:bg-destructive/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Sell
                  </motion.button>
                </div>
              </motion.div>
            </AnimatePresence>

            <LiveChat room="livestream" />
          </div>
        </div>
      </div>
    </>
  );
}
