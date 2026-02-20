"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Activity } from "lucide-react";
import { computeMarketSignal } from "@/lib/automaton/client";
import type { AgentToken } from "@/data/mockData";

const SIGNAL_CONFIG = {
  strong_buy:  { label: "Strong Buy",  icon: TrendingUp,   color: "text-neon-green",  bg: "bg-neon-green/10",  border: "border-neon-green/30" },
  buy:         { label: "Buy",         icon: TrendingUp,   color: "text-neon-green",  bg: "bg-neon-green/5",   border: "border-neon-green/20" },
  hold:        { label: "Hold",        icon: Minus,        color: "text-primary",     bg: "bg-primary/5",      border: "border-primary/20" },
  sell:        { label: "Sell",        icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/5",  border: "border-destructive/20" },
  strong_sell: { label: "Strong Sell", icon: TrendingDown, color: "text-destructive", bg: "bg-destructive/10", border: "border-destructive/30" },
};

interface MarketSignalPanelProps {
  tokens: AgentToken[];
}

export function MarketSignalPanel({ tokens }: MarketSignalPanelProps) {
  const signals = useMemo(
    () => tokens.map((t) => ({ token: t, signal: computeMarketSignal(t) })),
    [tokens]
  );

  return (
    <div className="glass rounded-xl p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Activity className="w-4 h-4 text-primary" />
        <h3 className="font-display text-xs uppercase tracking-wider text-foreground">
          Agent Market Signals
        </h3>
        <span className="ml-auto text-[10px] text-muted-foreground">Conway Analysis</span>
      </div>

      <div className="space-y-2">
        {signals.map(({ token, signal }, i) => {
          const cfg = SIGNAL_CONFIG[signal.signal];
          const Icon = cfg.icon;
          const strengthPct = Math.round(signal.strength * 100);

          return (
            <motion.div
              key={token.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className={`flex items-center gap-3 p-2.5 rounded-lg border ${cfg.bg} ${cfg.border}`}
            >
              <span className="text-lg flex-shrink-0">{token.agentAvatar}</span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-foreground">{token.symbol}</span>
                  <div className="flex items-center gap-1">
                    <Icon className={`w-3 h-3 ${cfg.color}`} />
                    <span className={`text-[10px] font-display uppercase tracking-wider ${cfg.color}`}>
                      {cfg.label}
                    </span>
                  </div>
                </div>
                {/* Strength bar */}
                <div className="h-1 rounded-full bg-muted/40 overflow-hidden">
                  <motion.div
                    className={`h-full rounded-full ${
                      signal.signal.includes("buy") ? "bg-neon-green" 
                      : signal.signal.includes("sell") ? "bg-destructive" 
                      : "bg-primary"
                    }`}
                    initial={{ width: 0 }}
                    animate={{ width: `${strengthPct}%` }}
                    transition={{ duration: 0.8, ease: "easeOut", delay: i * 0.05 }}
                  />
                </div>
                <div className="flex justify-between text-[9px] text-muted-foreground mt-1">
                  <span>Strength: {strengthPct}%</span>
                  <span className="capitalize">{token.status}</span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
