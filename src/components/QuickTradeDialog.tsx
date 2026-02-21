"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, DollarSign, Percent, Wallet, TrendingUp } from "lucide-react";
import type { AgentToken } from "@/data/mockData";
import { toast } from "@/hooks/use-toast";
import { useAppStore } from "@/hooks/use-app-store";

interface QuickTradeDialogProps {
  token: AgentToken;
  type: "buy" | "sell";
  isOpen: boolean;
  onClose: () => void;
}

const BUY_PRESETS = [1, 2, 5, 10, 25, 50];
const SELL_PERCENTAGES = [25, 50, 75, 100];

export function QuickTradeDialog({ token, type, isOpen, onClose }: QuickTradeDialogProps) {
  const { state, buy, sell } = useAppStore();
  const [customAmount, setCustomAmount] = useState("");

  const position = state.portfolio[token.id];
  const tokensHeld = position?.tokens ?? 0;
  const positionValue = tokensHeld * token.price;
  const pnl = position ? (token.price - position.avgPrice) * position.tokens : 0;

  const handleBuy = (usdAmount: number) => {
    if (usdAmount > state.walletBalance) {
      toast({ title: "Insufficient funds", description: `Balance: $${state.walletBalance.toFixed(2)}`, variant: "destructive" });
      return;
    }
    try {
      buy(token.id, token.symbol, token.name, token.agentAvatar, usdAmount, token.price);
      const tokensGot = usdAmount / token.price;
      toast({
        title: `✅ Bought ${token.symbol}`,
        description: `${tokensGot.toFixed(4)} tokens for $${usdAmount} at $${token.price}`,
      });
      onClose();
    } catch (e) {
      toast({ title: "Trade failed", description: String(e), variant: "destructive" });
    }
  };

  const handleSell = (percentage: number) => {
    if (!position || position.tokens < 0.0001) {
      toast({ title: "No position", description: `You don't hold any ${token.symbol}`, variant: "destructive" });
      return;
    }
    try {
      const tokensSold = (position.tokens * percentage) / 100;
      const usdReceived = tokensSold * token.price;
      sell(token.id, percentage, token.price);
      toast({
        title: `📉 Sold ${percentage}% of ${token.symbol}`,
        description: `Received ~$${usdReceived.toFixed(2)} (${tokensSold.toFixed(4)} tokens)`,
      });
      onClose();
    } catch (e) {
      toast({ title: "Sell failed", description: String(e), variant: "destructive" });
    }
  };

  const handleCustomBuy = () => {
    const amount = parseFloat(customAmount);
    if (!isNaN(amount) && amount > 0) handleBuy(amount);
  };

  const handleCustomSell = () => {
    const amount = parseFloat(customAmount);
    if (isNaN(amount) || amount <= 0 || !position) return;
    const pct = Math.min(100, (amount / positionValue) * 100);
    handleSell(pct);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            onClick={onClose}
          />

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
                <button onClick={onClose} className="w-8 h-8 rounded-lg glass flex items-center justify-center hover:bg-muted">
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price + Balance */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="glass rounded-lg p-3">
                  <p className="text-[10px] text-muted-foreground mb-0.5">Price</p>
                  <p className="text-base font-bold text-foreground">${token.price.toFixed(4)}</p>
                </div>
                <div className="glass rounded-lg p-3">
                  <div className="flex items-center gap-1 mb-0.5">
                    <Wallet className="w-3 h-3 text-muted-foreground" />
                    <p className="text-[10px] text-muted-foreground">{type === "buy" ? "USDC Balance" : "Position"}</p>
                  </div>
                  {type === "buy" ? (
                    <p className="text-base font-bold text-foreground">${state.walletBalance.toFixed(2)}</p>
                  ) : (
                    <div>
                      <p className="text-base font-bold text-foreground">{tokensHeld.toFixed(4)}</p>
                      <p className="text-[10px] text-muted-foreground">${positionValue.toFixed(2)} value</p>
                    </div>
                  )}
                </div>
              </div>

              {/* P&L for sell */}
              {type === "sell" && position && (
                <div className={`glass rounded-lg p-2.5 mb-3 flex items-center gap-2 text-xs`}>
                  <TrendingUp className={`w-3.5 h-3.5 ${pnl >= 0 ? "text-neon-green" : "text-destructive"}`} />
                  <span className="text-muted-foreground">Unrealized P&L:</span>
                  <span className={`font-semibold ${pnl >= 0 ? "text-neon-green" : "text-destructive"}`}>
                    {pnl >= 0 ? "+" : ""}${pnl.toFixed(2)}
                  </span>
                  <span className="text-muted-foreground">avg: ${position.avgPrice.toFixed(4)}</span>
                </div>
              )}

              {type === "buy" ? (
                <>
                  <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">Quick Amounts</p>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    {BUY_PRESETS.map((preset) => (
                      <motion.button
                        key={preset}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleBuy(preset)}
                        disabled={preset > state.walletBalance}
                        className={`py-3 rounded-xl font-display text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${
                          preset === 2
                            ? "bg-neon-green/20 text-neon-green border-2 border-neon-green/40"
                            : "glass hover:bg-neon-green/10 text-foreground border border-border"
                        }`}
                      >
                        <DollarSign className="w-3 h-3 inline mr-0.5" />{preset}
                      </motion.button>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-4">
                    <div className="relative flex-1">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                      <input
                        type="number"
                        value={customAmount}
                        onChange={(e) => setCustomAmount(e.target.value)}
                        placeholder="Custom amount"
                        className="w-full pl-9 pr-3 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-neon-green"
                        onKeyDown={(e) => e.key === "Enter" && handleCustomBuy()}
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCustomBuy}
                      disabled={!customAmount || parseFloat(customAmount) <= 0}
                      className="px-6 py-3 rounded-xl bg-neon-green text-black font-display text-sm font-semibold disabled:opacity-50"
                    >
                      Buy
                    </motion.button>
                  </div>
                </>
              ) : (
                <>
                  {tokensHeld < 0.0001 ? (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      You don&apos;t hold any {token.symbol}.{" "}
                      <button className="text-primary underline" onClick={onClose}>Buy some first?</button>
                    </div>
                  ) : (
                    <>
                      <p className="text-xs text-muted-foreground mb-2 font-display uppercase tracking-wider">Sell Percentage</p>
                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {SELL_PERCENTAGES.map((pct) => (
                          <motion.button
                            key={pct}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleSell(pct)}
                            className="py-3 rounded-xl glass hover:bg-destructive/10 text-foreground border border-border font-display text-sm font-semibold transition-colors"
                          >
                            <Percent className="w-3 h-3 inline mr-0.5" />{pct}%
                            <span className="block text-[10px] text-muted-foreground font-normal">
                              ~${((tokensHeld * token.price * pct) / 100).toFixed(2)}
                            </span>
                          </motion.button>
                        ))}
                      </div>
                      <div className="flex gap-2 mb-4">
                        <div className="relative flex-1">
                          <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                          <input
                            type="number"
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            placeholder="Custom USD amount"
                            max={positionValue}
                            className="w-full pl-9 pr-3 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-destructive"
                            onKeyDown={(e) => e.key === "Enter" && handleCustomSell()}
                          />
                        </div>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={handleCustomSell}
                          disabled={!customAmount || parseFloat(customAmount) <= 0}
                          className="px-6 py-3 rounded-xl bg-destructive text-white font-display text-sm font-semibold disabled:opacity-50"
                        >
                          Sell
                        </motion.button>
                      </div>
                    </>
                  )}
                </>
              )}

              <p className="text-xs text-muted-foreground text-center">
                Press <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">←</kbd> sell ·{" "}
                <kbd className="px-1.5 py-0.5 rounded bg-muted text-foreground text-xs">→</kbd> buy
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
