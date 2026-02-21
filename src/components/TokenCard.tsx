"use client";

import { motion, useMotionValue, useTransform, useAnimation, PanInfo } from "framer-motion";
import { SurvivalMeter } from "./SurvivalMeter";
import { ArrowUpRight, ArrowDownRight, Droplets, Users, ShoppingCart, TrendingDown, Eye, Bookmark, Star, Wallet } from "lucide-react";
import type { AgentToken } from "@/data/mockData";
import { useState, useCallback, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { toast } from "@/hooks/use-toast";
import { formatNumber } from "@/lib/utils";
import { QuickTradeDialog } from "./QuickTradeDialog";
import { useAppStore } from "@/hooks/use-app-store";

interface TokenCardProps {
  token: AgentToken;
  index: number;
  onClick?: () => void;
  enableKeyboard?: boolean;
}

const SWIPE_THRESHOLD = 80;

const swipeOverlays = {
  right: { icon: ShoppingCart, label: "BUY", color: "from-neon-green/30 to-transparent", textColor: "text-neon-green" },
  left: { icon: TrendingDown, label: "SELL", color: "from-transparent to-destructive/30", textColor: "text-destructive" },
  up: { icon: Eye, label: "DETAILS", color: "from-transparent to-primary/30", textColor: "text-primary" },
  down: { icon: Bookmark, label: "WATCHLIST", color: "from-tier-gold/30 to-transparent", textColor: "text-tier-gold" },
};

export function TokenCard({ token, index, onClick, enableKeyboard = false }: TokenCardProps) {
  const isPositive = token.change24h >= 0;
  const router = useRouter();
  const { state, toggleWatch } = useAppStore();
  const isWatched = state.watchlist.includes(token.id);
  const hasPosition = !!state.portfolio[token.id];
  const [swipeDir, setSwipeDir] = useState<"right" | "left" | "up" | "down" | null>(null);
  const [swiping, setSwiping] = useState(false);
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [tradeType, setTradeType] = useState<"buy" | "sell">("buy");
  const cardRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const controls = useAnimation();

  const overlayOpacity = useTransform(
    [x, y],
    ([latestX, latestY]: number[]) => {
      const absX = Math.abs(latestX);
      const absY = Math.abs(latestY);
      const max = Math.max(absX, absY);
      return Math.min(max / SWIPE_THRESHOLD, 1);
    }
  );

  // Keyboard controls
  useEffect(() => {
    if (!enableKeyboard || !isFocused) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (tradeDialogOpen) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        setTradeType("sell");
        setTradeDialogOpen(true);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        setTradeType("buy");
        setTradeDialogOpen(true);
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        router.push(`/token/${token.id}`);
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        toggleWatch(token.id);
        toast({
          title: isWatched ? `Removed from watchlist` : `⭐ Added to watchlist`,
          description: token.name,
        });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, isFocused, tradeDialogOpen, token, router, toggleWatch, isWatched]);

  const handleDrag = useCallback((_: any, info: PanInfo) => {
    const { x: dx, y: dy } = info.offset;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > absY && absX > 15) {
      setSwipeDir(dx > 0 ? "right" : "left");
    } else if (absY > absX && absY > 15) {
      setSwipeDir(dy < 0 ? "up" : "down");
    }
    setSwiping(true);
  }, []);

  const handleDragEnd = useCallback((_: any, info: PanInfo) => {
    const { x: dx, y: dy } = info.offset;
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);

    if (absX > SWIPE_THRESHOLD && absX > absY) {
      if (dx > 0) {
        setTradeType("buy");
        setTradeDialogOpen(true);
      } else {
        setTradeType("sell");
        setTradeDialogOpen(true);
      }
    } else if (absY > SWIPE_THRESHOLD && absY > absX) {
      if (dy < 0) {
        router.push(`/token/${token.id}`);
        return;
      } else {
        toggleWatch(token.id);
        toast({
          title: isWatched ? `Removed from watchlist` : `⭐ Added to watchlist`,
          description: token.name,
        });
      }
    }

    setSwipeDir(null);
    setSwiping(false);
    controls.start({ x: 0, y: 0, transition: { type: "spring", stiffness: 500, damping: 30 } });
  }, [token, router, controls, toggleWatch, isWatched]);

  const overlay = swipeDir ? swipeOverlays[swipeDir] : null;

  return (
    <>
      <motion.div
        ref={cardRef}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: index * 0.08 }}
        className="relative touch-none"
        tabIndex={enableKeyboard ? 0 : undefined}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      >
        <motion.div
          style={{ x, y }}
          drag
          dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
          dragElastic={0.7}
          onDrag={handleDrag}
          onDragEnd={handleDragEnd}
          animate={controls}
          whileHover={swiping ? undefined : { scale: 1.02, y: -4 }}
          onClick={swiping ? undefined : onClick}
          className={`glass rounded-xl p-3 sm:p-4 cursor-pointer group relative overflow-hidden ${
            isFocused && enableKeyboard ? "ring-2 ring-primary" : ""
          }`}
        >
        {/* Swipe overlay */}
        {overlay && (
          <motion.div
            className={`absolute inset-0 z-20 bg-gradient-to-r ${overlay.color} flex items-center justify-center pointer-events-none rounded-xl`}
            style={{ opacity: overlayOpacity }}
          >
            <div className={`flex flex-col items-center gap-1 ${overlay.textColor}`}>
              <overlay.icon className="w-8 h-8" />
              <span className="font-display text-xs uppercase tracking-widest font-bold">{overlay.label}</span>
            </div>
          </motion.div>
        )}

        {/* Glow on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

        <div className="flex items-start justify-between mb-2 sm:mb-3">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="text-xl sm:text-2xl flex-shrink-0">{token.agentAvatar}</div>
            <div className="min-w-0">
              <h3 className="font-display text-xs sm:text-sm font-semibold text-foreground truncate">{token.symbol}</h3>
              <p className="text-[10px] sm:text-xs text-muted-foreground truncate">{token.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isWatched && <Star className="w-3 h-3 text-tier-gold fill-tier-gold" />}
            {hasPosition && <Wallet className="w-3 h-3 text-primary" />}
            <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full font-medium ml-1 ${
              token.status === "thriving" ? "bg-neon-green/10 text-neon-green" :
              token.status === "stable" ? "bg-primary/10 text-primary" :
              token.status === "at-risk" ? "bg-destructive/10 text-destructive" :
              "bg-muted text-muted-foreground"
            }`}>
              {token.status}
            </span>
          </div>
        </div>

        <div className="flex items-end justify-between mb-2 sm:mb-3">
          <span className="text-lg sm:text-xl font-semibold text-foreground">${token.price.toFixed(2)}</span>
          <span className={`flex items-center gap-0.5 text-xs sm:text-sm font-medium ${isPositive ? "text-neon-green" : "text-destructive"}`}>
            {isPositive ? <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> : <ArrowDownRight className="w-3 h-3 sm:w-3.5 sm:h-3.5" />}
            {Math.abs(token.change24h)}%
          </span>
        </div>

        <SurvivalMeter credits={token.survivalCredits} max={token.survivalMax} status={token.status} compact />

        <div className="flex items-center gap-3 sm:gap-4 mt-2 sm:mt-3 text-[10px] sm:text-xs text-muted-foreground">
          <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{token.liquidityDepth}%</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{formatNumber(token.holders)}</span>
          <span className="ml-auto">{token.type}</span>
        </div>
      </motion.div>

      {/* Keyboard hint */}
      {isFocused && enableKeyboard && (
        <motion.div
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-0 right-0 text-center text-[10px] text-muted-foreground"
        >
          Press ← to sell or → to buy
        </motion.div>
      )}
    </motion.div>

    <QuickTradeDialog
      token={token}
      type={tradeType}
      isOpen={tradeDialogOpen}
      onClose={() => setTradeDialogOpen(false)}
    />
  </>
  );
}
