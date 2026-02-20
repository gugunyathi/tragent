import { motion } from "framer-motion";
import { SurvivalMeter } from "./SurvivalMeter";
import { ArrowUpRight, ArrowDownRight, Droplets, Users } from "lucide-react";
import type { AgentToken } from "@/data/mockData";

interface TokenCardProps {
  token: AgentToken;
  index: number;
  onClick?: () => void;
}

export function TokenCard({ token, index, onClick }: TokenCardProps) {
  const isPositive = token.change24h >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ scale: 1.02, y: -4 }}
      onClick={onClick}
      className="glass rounded-xl p-4 cursor-pointer group relative overflow-hidden"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />

      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="text-2xl">{token.agentAvatar}</div>
          <div>
            <h3 className="font-display text-sm font-semibold text-foreground">{token.symbol}</h3>
            <p className="text-xs text-muted-foreground">{token.name}</p>
          </div>
        </div>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
          token.status === "thriving" ? "bg-neon-green/10 text-neon-green" :
          token.status === "stable" ? "bg-primary/10 text-primary" :
          token.status === "at-risk" ? "bg-destructive/10 text-destructive" :
          "bg-muted text-muted-foreground"
        }`}>
          {token.status}
        </span>
      </div>

      <div className="flex items-end justify-between mb-3">
        <span className="text-xl font-semibold text-foreground">${token.price.toFixed(2)}</span>
        <span className={`flex items-center gap-0.5 text-sm font-medium ${isPositive ? "text-neon-green" : "text-destructive"}`}>
          {isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
          {Math.abs(token.change24h)}%
        </span>
      </div>

      <SurvivalMeter credits={token.survivalCredits} max={token.survivalMax} status={token.status} compact />

      <div className="flex items-center gap-4 mt-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1"><Droplets className="w-3 h-3" />{token.liquidityDepth}%</span>
        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{token.holders.toLocaleString()}</span>
        <span className="ml-auto">{token.type}</span>
      </div>
    </motion.div>
  );
}
