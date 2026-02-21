"use client";

import { motion } from "framer-motion";
import { useParams, useRouter } from "next/navigation";
import { MOCK_TOKENS } from "@/data/mockData";
import { SurvivalMeter } from "@/components/SurvivalMeter";
import { VoiceMic } from "@/components/VoiceMic";
import { QuickTradeDialog } from "@/components/QuickTradeDialog";
import { useAppStore } from "@/hooks/use-app-store";
import { formatNumber } from "@/lib/utils";
import { ArrowLeft, Droplets, Users, BarChart3, Shield, Clock, ArrowUpRight, ArrowDownRight, Star, TrendingUp, TrendingDown } from "lucide-react";
import { useState } from "react";

export default function TokenDetail() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const token = MOCK_TOKENS.find((t) => t.id === id);
  const { state, toggleWatch } = useAppStore();
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const [tradeOpen, setTradeOpen] = useState(false);

  if (!token) {
    return (
      <div className="pt-20 px-4 text-center text-muted-foreground">
        Token not found.
        <button onClick={() => router.push("/marketplace")} className="block mx-auto mt-4 text-primary text-sm">Back to marketplace</button>
      </div>
    );
  }

  const isPositive = token.change24h >= 0;
  const isWatched = state.watchlist.includes(token.id);
  const position = state.portfolio[token.id];
  const pnl = position ? (token.price - position.avgPrice) * position.tokens : null;

  const openTrade = (type: "buy" | "sell") => {
    setTradeType(type);
    setTradeOpen(true);
  };

  const auditEntries = [
    { action: "Token Deployed", time: "2026-02-10 09:14", hash: "0xa1b2...c3d4" },
    { action: "Liquidity Added", time: "2026-02-10 09:30", hash: "0xe5f6...g7h8" },
    { action: "First Sale", time: "2026-02-11 14:22", hash: "0xi9j0...k1l2" },
    { action: "Survival Credits +500", time: "2026-02-15 11:08", hash: "0xm3n4...o5p6" },
  ];

  return (
    <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-4xl mx-auto space-y-4 sm:space-y-6">
      <QuickTradeDialog token={token} type={tradeType} isOpen={tradeOpen} onClose={() => setTradeOpen(false)} />

      <div className="flex items-center justify-between">
        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} onClick={() => router.back()} className="flex items-center gap-1 text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Back
        </motion.button>
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => toggleWatch(token.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs transition-colors ${isWatched ? "bg-tier-gold/10 text-tier-gold border border-tier-gold/30" : "glass text-muted-foreground hover:text-foreground"}`}
        >
          <Star className={`w-3.5 h-3.5 ${isWatched ? "fill-tier-gold" : ""}`} />
          {isWatched ? "Watching" : "Watch"}
        </motion.button>
      </div>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl sm:rounded-2xl p-4 sm:p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-neon-pink/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
          <div className="flex items-center gap-3 sm:gap-4">
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl sm:text-5xl">
              {token.agentAvatar}
            </motion.span>
            <div>
              <h1 className="font-display text-xl sm:text-2xl font-bold text-foreground">{token.name}</h1>
              <p className="text-muted-foreground text-xs sm:text-sm">{token.agentName} • {token.symbol} • {token.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-4 sm:gap-6 sm:ml-auto">
            <div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">${token.price.toFixed(2)}</p>
              <p className={`text-xs sm:text-sm flex items-center gap-1 ${isPositive ? "text-neon-green" : "text-destructive"}`}>
                {isPositive ? <ArrowUpRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> : <ArrowDownRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                {Math.abs(token.change24h)}% (24h)
              </p>
            </div>
            <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-display uppercase tracking-wider ${
              token.status === "thriving" ? "bg-neon-green/10 text-neon-green" :
              token.status === "stable" ? "bg-primary/10 text-primary" :
              token.status === "at-risk" ? "bg-destructive/10 text-destructive" :
              "bg-muted text-muted-foreground"
            }`}>{token.status}</span>
          </div>
        </div>
      </motion.div>

      {/* My Position */}
      {position && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-4 border border-primary/20">
          <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-3">My Position</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <p className="text-lg font-bold text-foreground">{position.tokens.toFixed(4)}</p>
              <p className="text-[10px] text-muted-foreground">Tokens held</p>
            </div>
            <div>
              <p className="text-lg font-bold text-foreground">${(position.tokens * token.price).toFixed(2)}</p>
              <p className="text-[10px] text-muted-foreground">Current value</p>
            </div>
            <div>
              {pnl !== null && (
                <>
                  <p className={`text-lg font-bold ${pnl >= 0 ? "text-neon-green" : "text-destructive"} flex items-center gap-1`}>
                    {pnl >= 0 ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
                    {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                  </p>
                  <p className="text-[10px] text-muted-foreground">Unrealized P&L</p>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {[
          { icon: BarChart3, label: "24h Volume", value: `$${(token.volume24h / 1000).toFixed(0)}K`, color: "text-primary" },
          { icon: Droplets, label: "Liquidity", value: `${token.liquidityDepth}%`, color: "text-neon-cyan" },
          { icon: Users, label: "Holders", value: formatNumber(token.holders), color: "text-tier-gold" },
          { icon: Shield, label: "Supply", value: formatNumber(token.supply), color: "text-neon-purple" },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-3 sm:p-4 text-center">
            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto mb-1 ${color}`} />
            <p className="text-base sm:text-lg font-bold text-foreground">{value}</p>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-display uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Survival */}
      <div className="glass rounded-xl p-4 sm:p-5">
        <SurvivalMeter credits={token.survivalCredits} max={token.survivalMax} status={token.status} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 sm:gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openTrade("buy")}
          className="flex-1 py-2.5 sm:py-3 rounded-xl bg-neon-green/10 text-neon-green font-display text-[10px] sm:text-sm uppercase tracking-wider font-semibold border border-neon-green/20 hover:bg-neon-green/20 transition-colors"
        >
          Buy {token.symbol}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => openTrade("sell")}
          disabled={!position}
          className="flex-1 py-2.5 sm:py-3 rounded-xl bg-destructive/10 text-destructive font-display text-[10px] sm:text-sm uppercase tracking-wider font-semibold border border-destructive/20 hover:bg-destructive/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Sell {token.symbol}
        </motion.button>
        <VoiceMic onTranscript={(text) => {
          if (text.includes("buy")) openTrade("buy");
          else if (text.includes("sell")) openTrade("sell");
        }} />
      </div>

      {/* Audit Log */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-display text-xs sm:text-sm uppercase tracking-wider text-foreground">Audit Log</h2>
        </div>
        <div className="space-y-2">
          {auditEntries.map((entry, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="glass rounded-lg p-2.5 sm:p-3 flex items-center justify-between text-xs sm:text-sm gap-2">
              <div className="min-w-0">
                <span className="text-foreground font-medium">{entry.action}</span>
                <span className="text-muted-foreground text-[10px] sm:text-xs ml-2 hidden sm:inline">{entry.time}</span>
              </div>
              <a href={`https://basescan.org/tx/${entry.hash}`} target="_blank" rel="noopener noreferrer" className="text-[10px] sm:text-xs text-primary font-mono flex-shrink-0 hover:underline">{entry.hash}</a>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
