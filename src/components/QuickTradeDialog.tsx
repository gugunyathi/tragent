"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Percent } from "lucide-react";
import type { AgentToken } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";

interface QuickTradeDialogProps {
  token: AgentToken;
  type: "buy" | "sell";
  isOpen: boolean;
  onClose: () => void;
}

const BUY_PRESETS = [1, 2, 5, 10, 25, 50];
const SELL_PERCENTAGES = [25, 50, 75, 100];

export function QuickTradeDialog({ token, type, isOpen, onClose }: QuickTradeDialogProps) {
  const [amount, setAmount] = useState(2);
  const [customAmount, setCustomAmount] = useState("");

  const handleTrade = (tradeAmount: number) => {
    if (type === "buy") {
      toast({
        title: `🛒 Bought ${token.symbol}`,
        description: `Purchase order placed for $${tradeAmount} of ${token.name}`,
      });
    } else {
      toast({
        title: `📉 Sold ${token.symbol}`,
        description: `Sell order placed for $${tradeAmount} of ${token.name}`,
      });
    }
    onClose();
  };

  const handlePercentageSell = (percentage: number) => {
    const estimatedValue = (token.price * token.holders * percentage) / 10000; // Mock calculation
    toast({
      title: `📉 Sold ${percentage}% of ${token.symbol}`,
      description: `Sell order placed for ~$${estimatedValue.toFixed(2)} of ${token.name}`,
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
          >
            <div className="glass-strong rounded-2xl p-4 sm:p-6">
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{token.agentAvatar}</span>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">
                      {type === "buy" ? "Buy" : "Sell"} {token.symbol}
                    </h3>
                    <p className="text-xs text-muted-foreground">{token.name}</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-muted transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Current Price */}
              <div className="glass rounded-lg p-3 mb-4">
                <p className="text-xs text-muted-foreground mb-1">Current Price</p>
                <p className="text-xl font-bold text-foreground">${token.price.toFixed(4)}</p>
              </div>

              {type === "buy" ? (
                <>
                  {/* Buy Presets */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">
                      Quick Amounts
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {BUY_PRESETS.map((preset) => (
                        <motion.button
                          key={preset}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTrade(preset)}
                          className={`py-3 rounded-xl font-display text-sm font-semibold transition-colors ${
                            preset === 2
                              ? "bg-neon-green/20 text-neon-green border-2 border-neon-green/40"
                              : "glass hover:bg-neon-green/10 text-foreground hover:border-neon-green/20 border border-border"
                          }`}
                        >
                          <DollarSign className="w-3 h-3 inline mr-0.5" />
                          {preset}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">
                      Custom Amount
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full pl-9 pr-3 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-green"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => customAmount && handleTrade(parseFloat(customAmount))}
                        disabled={!customAmount || parseFloat(customAmount) <= 0}
                        className="px-6 py-3 rounded-xl bg-neon-green text-black font-display text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Buy
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Sell Percentages */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">
                      Sell Percentage
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                      {SELL_PERCENTAGES.map((percentage) => (
                        <motion.button
                          key={percentage}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handlePercentageSell(percentage)}
                          className="py-3 rounded-xl glass hover:bg-destructive/10 text-foreground hover:border-destructive/20 border border-border font-display text-sm font-semibold transition-colors"
                        >
                          <Percent className="w-3 h-3 inline mr-0.5" />
                          {percentage}%
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Sell Presets */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">
                      Quick Amounts
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {BUY_PRESETS.map((preset) => (
                        <motion.button
                          key={preset}
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleTrade(preset)}
                          className={`py-3 rounded-xl font-display text-sm font-semibold transition-colors ${
                            preset === 2
                              ? "bg-destructive/20 text-destructive border-2 border-destructive/40"
                              : "glass hover:bg-destructive/10 text-foreground hover:border-destructive/20 border border-border"
                          }`}
                        >
                          <DollarSign className="w-3 h-3 inline mr-0.5" />
                          {preset}
                        </motion.button>
                      ))}
                    </div>
                  </div>

                  {/* Custom Amount */}
                  <div className="mb-4">
                    <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">
                      Custom Amount
                    </p>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <input
                          type="number"
                          value={customAmount}
                          onChange={(e) => setCustomAmount(e.target.value)}
                          placeholder="Enter amount"
                          className="w-full pl-9 pr-3 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
                        />
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => customAmount && handleTrade(parseFloat(customAmount))}
                        disabled={!customAmount || parseFloat(customAmount) <= 0}
                        className="px-6 py-3 rounded-xl bg-destructive text-white font-display text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Sell
                      </motion.button>
                    </div>
                  </div>
                </>
              )}

              {/* Info */}
              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">←</kbd> to sell or{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">→</kbd> to buy
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
