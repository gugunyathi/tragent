"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { X, Bot, ChevronRight } from "lucide-react";
import { STRATEGY_METADATA } from "@/lib/automaton/store";
import type { AgentStrategy, TradingAgentConfig } from "@/lib/automaton/types";

interface CreateAgentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (name: string, strategy: AgentStrategy, overrides: Partial<TradingAgentConfig>) => void;
}

const STRATEGIES: AgentStrategy[] = ["conservative", "balanced", "aggressive", "scalp", "hodl"];

export function CreateAgentDialog({ isOpen, onClose, onCreate }: CreateAgentDialogProps) {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [strategy, setStrategy] = useState<AgentStrategy>("balanced");
  const [maxPosition, setMaxPosition] = useState(25);
  const [maxTrades, setMaxTrades] = useState(10);
  const [riskTolerance, setRiskTolerance] = useState(0.5);

  const handleCreate = () => {
    if (!name.trim()) return;
    onCreate(name.trim(), strategy, {
      maxPositionSize: maxPosition,
      maxDailyTrades: maxTrades,
      riskTolerance,
    });
    setStep(0);
    setName("");
    setStrategy("balanced");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="glass-strong rounded-2xl w-full max-w-lg overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4 text-primary" />
            </div>
            <div>
              <h2 className="font-display text-sm font-semibold text-foreground">Deploy Trading Agent</h2>
              <p className="text-xs text-muted-foreground">Powered by Conway Automaton</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Steps */}
        <div className="p-5 space-y-5">
          {/* Step 0: Name */}
          <div className="space-y-2">
            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
              Agent Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Atlas, Nexus, Cipher..."
              className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
              maxLength={32}
            />
          </div>

          {/* Strategy Picker */}
          <div className="space-y-2">
            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
              Trading Strategy
            </label>
            <div className="grid grid-cols-1 gap-2">
              {STRATEGIES.map((s) => {
                const meta = STRATEGY_METADATA[s];
                return (
                  <button
                    key={s}
                    onClick={() => setStrategy(s)}
                    className={`flex items-center gap-3 p-3 rounded-xl border text-left transition-all ${
                      strategy === s
                        ? "border-primary/50 bg-primary/10"
                        : "border-border glass hover:border-border/80"
                    }`}
                  >
                    <span className="text-xl">{meta.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${strategy === s ? meta.color : "text-foreground"}`}>
                        {meta.label}
                      </p>
                      <p className="text-xs text-muted-foreground truncate">{meta.description}</p>
                    </div>
                    {strategy === s && <ChevronRight className={`w-4 h-4 ${meta.color} flex-shrink-0`} />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Risk settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                Max Position ($)
              </label>
              <input
                type="number"
                value={maxPosition}
                onChange={(e) => setMaxPosition(Number(e.target.value))}
                min={1}
                max={500}
                className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-display uppercase tracking-wider text-muted-foreground">
                Max Trades/Day
              </label>
              <input
                type="number"
                value={maxTrades}
                onChange={(e) => setMaxTrades(Number(e.target.value))}
                min={1}
                max={100}
                className="w-full px-3 py-2.5 rounded-xl bg-muted/50 border border-border text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-display uppercase tracking-wider text-muted-foreground flex justify-between">
              <span>Risk Tolerance</span>
              <span className="text-foreground">{Math.round(riskTolerance * 100)}%</span>
            </label>
            <input
              type="range"
              value={riskTolerance}
              onChange={(e) => setRiskTolerance(Number(e.target.value))}
              min={0}
              max={1}
              step={0.05}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Conservative</span>
              <span>Degen</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center gap-3 p-5 border-t border-border/50">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl glass text-muted-foreground text-sm font-display uppercase tracking-wider hover:text-foreground transition-colors"
          >
            Cancel
          </button>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCreate}
            disabled={!name.trim()}
            className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-display uppercase tracking-wider font-semibold disabled:opacity-40 disabled:cursor-not-allowed glow-cyan"
          >
            Deploy Agent
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
