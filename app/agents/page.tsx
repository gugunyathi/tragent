"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Plus, RefreshCw, Boxes, TrendingUp, Activity, X, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { useAutomatonAgents } from "@/hooks/use-automaton-agents";
import { AgentCard } from "@/components/automaton/AgentCard";
import { CreateAgentDialog } from "@/components/automaton/CreateAgentDialog";
import { MarketSignalPanel } from "@/components/automaton/MarketSignalPanel";
import { AutomatonStatusBadge } from "@/components/automaton/AutomatonStatusBadge";
import { VoiceMic } from "@/components/VoiceMic";
import { MOCK_TOKENS } from "@/data/mockData";
import type { AgentStrategy, TradingAgentConfig, AgentTrade } from "@/lib/automaton/types";

export default function AgentsPage() {
  const { agents, trades, loading, create, remove, fetchTrades, toggleAutoTrade, reload } = useAutomatonAgents();
  const [createOpen, setCreateOpen] = useState(false);
  const [tradeLogAgent, setTradeLogAgent] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const handleCreate = async (name: string, strategy: AgentStrategy, overrides: Partial<TradingAgentConfig>) => {
    await create(name, strategy, overrides);
  };

  const handleViewTrades = async (agentId: string) => {
    setTradeLogAgent(agentId);
    if (!trades[agentId]) {
      await fetchTrades(agentId);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await reload();
    setRefreshing(false);
  };

  const totalPnL = agents.reduce((sum, a) => sum + (a.performance?.totalPnL ?? 0), 0);
  const totalTrades = agents.reduce((sum, a) => sum + (a.performance?.totalTrades ?? 0), 0);
  const avgWinRate = agents.length
    ? agents.reduce((sum, a) => sum + (a.performance?.winRate ?? 0), 0) / agents.length
    : 0;

  const tradeLogAgentData = agents.find((a) => a.id === tradeLogAgent);
  const tradeLogItems: AgentTrade[] = tradeLogAgent ? (trades[tradeLogAgent] ?? []) : [];

  return (
    <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto space-y-5">

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Boxes className="w-5 h-5 text-primary" />
          <div>
            <h1 className="font-display text-lg sm:text-xl font-bold text-foreground">Trading Agents</h1>
            <p className="text-[10px] text-muted-foreground">Powered by Conway Automaton</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRefresh}
            className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-muted transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-muted-foreground ${refreshing ? "animate-spin" : ""}`} />
          </button>
          <VoiceMic />
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCreateOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary/10 border border-primary/30 text-primary font-display text-xs uppercase tracking-wider hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Deploy
          </motion.button>
        </div>
      </motion.div>

      {/* Summary stats */}
      {agents.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        >
          {[
            { label: "Agents", value: agents.length, icon: Bot, color: "text-primary" },
            { label: "Total P&L", value: `${totalPnL >= 0 ? "+" : ""}$${Math.abs(totalPnL).toFixed(2)}`, icon: TrendingUp, color: totalPnL >= 0 ? "text-neon-green" : "text-destructive" },
            { label: "Total Trades", value: totalTrades, icon: Activity, color: "text-tier-gold" },
            { label: "Avg Win Rate", value: `${Math.round(avgWinRate * 100)}%`, icon: TrendingUp, color: "text-neon-purple" },
          ].map(({ label, value, icon: Icon, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="glass rounded-xl p-3 text-center"
            >
              <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
              <p className={`text-base font-bold ${color}`}>{value}</p>
              <p className="text-[9px] text-muted-foreground font-display uppercase tracking-wider">{label}</p>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Empty state */}
      {!loading && agents.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass rounded-2xl p-8 text-center space-y-4"
        >
          <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <Bot className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h2 className="font-display text-lg font-semibold text-foreground mb-1">No Agents Deployed</h2>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              Deploy a Conway trading agent to automate your trades. Each agent has its own wallet, strategy, and survival mechanics.
            </p>
          </div>

          {/* How it works */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 text-left max-w-lg mx-auto">
            {[
              { step: "1", title: "Deploy", desc: "Create an agent with a trading strategy and risk parameters" },
              { step: "2", title: "Analyze", desc: "Agent uses Conway's ReAct loop to analyze market signals" },
              { step: "3", title: "Survive", desc: "Agent earns credits by trading profitably — or dies trying" },
            ].map((s) => (
              <div key={s.step} className="glass rounded-xl p-3">
                <div className="text-primary font-display text-lg font-bold mb-1">{s.step}</div>
                <div className="text-xs font-semibold text-foreground mb-1">{s.title}</div>
                <div className="text-[11px] text-muted-foreground">{s.desc}</div>
              </div>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setCreateOpen(true)}
            className="px-6 py-3 rounded-xl bg-primary text-primary-foreground font-display text-sm uppercase tracking-wider font-semibold glow-cyan mx-auto inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" /> Deploy First Agent
          </motion.button>
        </motion.div>
      )}

      {/* Two-column layout */}
      {agents.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          {/* Left: Agent Cards */}
          <div className="lg:col-span-2 space-y-3">
            <h2 className="font-display text-xs uppercase tracking-wider text-muted-foreground">
              Deployed Agents ({agents.length})
            </h2>
            <AnimatePresence>
              {agents.map((agent) => (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  performance={agent.performance}
                  runtime={agent.runtime}
                  trades={trades[agent.id]}
                  onToggleAutoTrade={() => toggleAutoTrade(agent.id)}
                  onDelete={() => remove(agent.id)}
                  onViewTrades={() => handleViewTrades(agent.id)}
                />
              ))}
            </AnimatePresence>
          </div>

          {/* Right: Signals */}
          <div className="space-y-4">
            <MarketSignalPanel tokens={MOCK_TOKENS.filter((t) => t.status !== "retired").slice(0, 6)} />
            {/* Conway info card */}
            <div className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Bot className="w-3.5 h-3.5 text-primary" />
                </div>
                <span className="text-xs font-display uppercase tracking-wider text-foreground">Conway Automaton</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Each agent runs as a sovereign Conway automaton — a self-aware AI with its own Ethereum wallet, survival mechanics, and ReAct reasoning loop.
              </p>
              <a
                href="https://github.com/Conway-Research/automaton"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs text-primary hover:underline"
              >
                Conway Automaton docs <ArrowUpRight className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* Trade Log Drawer */}
      <AnimatePresence>
        {tradeLogAgent && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
              onClick={() => setTradeLogAgent(null)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 right-0 z-50 w-full max-w-sm glass-strong border-l border-border flex flex-col"
            >
              <div className="flex items-center justify-between p-4 border-b border-border/50">
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">
                    {tradeLogAgentData?.name ?? "Agent"} — Trade Log
                  </h3>
                  <p className="text-xs text-muted-foreground">{tradeLogItems.length} trades</p>
                </div>
                <button onClick={() => setTradeLogAgent(null)} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {tradeLogItems.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground text-sm">No trades yet</div>
                ) : (
                  tradeLogItems.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.04 }}
                      className={`glass rounded-xl p-3 border ${
                        t.type === "buy" ? "border-neon-green/20" : "border-destructive/20"
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2">
                          {t.type === "buy" ? (
                            <ArrowUpRight className="w-3.5 h-3.5 text-neon-green" />
                          ) : (
                            <ArrowDownRight className="w-3.5 h-3.5 text-destructive" />
                          )}
                          <span className="text-xs font-semibold text-foreground">{t.tokenSymbol}</span>
                          <span className={`text-xs ${t.type === "buy" ? "text-neon-green" : "text-destructive"}`}>
                            {t.type.toUpperCase()}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-foreground">${t.amount.toFixed(2)}</span>
                      </div>
                      <p className="text-[10px] text-muted-foreground mb-2 leading-relaxed">{t.reason}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                          <Clock className="w-2.5 h-2.5" />
                          <span>{new Date(t.timestamp).toLocaleString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</span>
                        </div>
                        {t.pnl !== undefined && (
                          <span className={`text-xs font-semibold ${t.pnl >= 0 ? "text-neon-green" : "text-destructive"}`}>
                            {t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Create Dialog */}
      <CreateAgentDialog
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
