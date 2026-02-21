"use client";

import { motion, AnimatePresence } from "framer-motion";
import { LiveChat } from "@/components/LiveChat";
import { AuctionTimer } from "@/components/AuctionTimer";
import { VoiceMic } from "@/components/VoiceMic";
import { SwipeHint } from "@/components/SwipeHint";
import { MOCK_TOKENS } from "@/data/mockData";
import { Radio, Eye, ChevronLeft, ChevronRight, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ACTIVE_TOKENS = MOCK_TOKENS.filter((t) => t.status !== "retired");

export default function Livestream() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [viewers, setViewers] = useState(1247);
  const token = ACTIVE_TOKENS[currentIndex];

  // Simulate viewer count fluctuating
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
                <span className="text-foreground tabular-nums">{viewers.toLocaleString()}</span>
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
                else if (text.includes("buy")) router.push(`/token/${token.id}`);
              }} />
              <div className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5">
                <p>&quot;Next&quot; · &quot;Previous&quot; · &quot;Buy&quot;</p>
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
          <AuctionTimer />
          <LiveChat room="livestream" />
        </div>
      </div>
    </div>
  );
}
