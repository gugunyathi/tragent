"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, TrendingUp, TrendingDown, Activity, MoreHorizontal,
  Power, Trash2, Eye, ArrowUpRight, ArrowDownRight, Zap,
} from "lucide-react";
import { AutomatonStatusBadge } from "./AutomatonStatusBadge";
import { STRATEGY_METADATA } from "@/lib/automaton/store";
import type { TradingAgentConfig, AgentPerformance, ConwayAutomatonAPI, AgentTrade } from "@/lib/automaton/types";
import { formatNumber } from "@/lib/utils";

interface AgentCardProps {
  agent: TradingAgentConfig;
  performance?: AgentPerformance;
  runtime?: ConwayAutomatonAPI;
  trades?: AgentTrade[];
  onToggleAutoTrade: () => void;
  onDelete: () => void;
  onViewTrades: () => void;
}

export function AgentCard({
  agent, performance, runtime, trades, onToggleAutoTrade, onDelete, onViewTrades,
}: AgentCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const meta = STRATEGY_METADATA[agent.strategy];
  const pnlPositive = (performance?.totalPnL ?? 0) >= 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="glass rounded-xl p-4 space-y-4 relative"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-neon-purple/20 flex items-center justify-center text-xl">
            {meta.emoji}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground font-display">{agent.name}</h3>
            <AutomatonStatusBadge status={agent.status} runtime={runtime} compact />
          </div>
        </div>

        <div className="relative">
          <button
            onClick={() => setShowMenu((v) => !v)}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-muted transition-colors"
          >
            <MoreHorizontal className="w-4 h-4 text-muted-foreground" />
          </button>
          <AnimatePresence>
            {showMenu && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -4 }}
                className="absolute right-0 top-10 z-20 glass-strong rounded-xl p-1 min-w-40 border border-border shadow-xl"
                onMouseLeave={() => setShowMenu(false)}
              >
                <button
                  onClick={() => { onViewTrades(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs hover:bg-muted transition-colors text-foreground"
                >
                  <Eye className="w-3 h-3" /> View Trade Log
                </button>
                <button
                  onClick={() => { onToggleAutoTrade(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs hover:bg-muted transition-colors text-foreground"
                >
                  <Power className="w-3 h-3" />
                  {agent.autoTrade ? "Disable" : "Enable"} Auto-Trade
                </button>
                <button
                  onClick={() => { onDelete(); setShowMenu(false); }}
                  className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-xs hover:bg-destructive/10 text-destructive transition-colors"
                >
                  <Trash2 className="w-3 h-3" /> Remove Agent
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Stats */}
      {performance && (
        <div className="grid grid-cols-3 gap-2">
          <div className="glass rounded-lg p-2 text-center">
            <p className={`text-sm font-bold ${pnlPositive ? "text-neon-green" : "text-destructive"} flex items-center justify-center gap-0.5`}>
              {pnlPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              ${Math.abs(performance.totalPnL).toFixed(2)}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">P&L</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-sm font-bold text-foreground">
              {Math.round(performance.winRate * 100)}%
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Win Rate</p>
          </div>
          <div className="glass rounded-lg p-2 text-center">
            <p className="text-sm font-bold text-foreground">
              {performance.totalTrades}
            </p>
            <p className="text-[9px] text-muted-foreground uppercase tracking-wider mt-0.5">Trades</p>
          </div>
        </div>
      )}

      {/* Config Pills */}
      <div className="flex flex-wrap gap-1.5">
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-display uppercase tracking-wider bg-muted/40 ${meta.color}`}>
          {meta.label}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] glass text-muted-foreground">
          Max ${agent.maxPositionSize}
        </span>
        <span className="px-2 py-0.5 rounded-full text-[10px] glass text-muted-foreground">
          {agent.maxDailyTrades} trades/day
        </span>
        <span className={`px-2 py-0.5 rounded-full text-[10px] font-display uppercase tracking-wider ${
          agent.autoTrade ? "bg-neon-green/10 text-neon-green" : "glass text-muted-foreground"
        }`}>
          {agent.autoTrade ? "Auto ●" : "Manual"}
        </span>
      </div>

      {/* Recent Trades */}
      {trades && trades.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">Recent</p>
          {trades.slice(0, 3).map((t) => (
            <div key={t.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                {t.type === "buy" ? (
                  <TrendingUp className="w-3 h-3 text-neon-green" />
                ) : (
                  <TrendingDown className="w-3 h-3 text-destructive" />
                )}
                <span className="text-muted-foreground">{t.tokenSymbol}</span>
                <span className="text-foreground">${t.amount.toFixed(2)}</span>
              </div>
              {t.pnl !== undefined && (
                <span className={t.pnl >= 0 ? "text-neon-green" : "text-destructive"}>
                  {t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Conway Runtime Badge */}
      {runtime && (
        <div className="flex items-center justify-between text-xs text-muted-foreground border-t border-border/30 pt-3">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>Conway Runtime</span>
          </div>
          <div className="flex items-center gap-2">
            <span>${(runtime.credits / 100).toFixed(2)} credits</span>
            <Zap className="w-3 h-3 text-tier-gold" />
            <span>{runtime.turnCount} turns</span>
          </div>
        </div>
      )}
    </motion.div>
  );
}
