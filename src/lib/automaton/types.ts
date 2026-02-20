/**
 * Conway Automaton Integration Types
 * 
 * Type definitions for integrating Conway automaton agents with the trading platform
 */

export type AgentStatus = 
  | "setup" 
  | "waking" 
  | "running" 
  | "sleeping" 
  | "low_compute" 
  | "critical" 
  | "dead";

export type AgentStrategy = 
  | "conservative" 
  | "balanced" 
  | "aggressive" 
  | "scalp" 
  | "hodl";

export interface TradingAgentConfig {
  id: string;
  name: string;
  walletAddress: string;
  strategy: AgentStrategy;
  riskTolerance: number; // 0-1
  maxPositionSize: number; // in USDC
  maxDailyTrades: number;
  targetTokens?: string[]; // specific tokens to trade
  autoTrade: boolean;
  createdAt: string;
  status: AgentStatus;
}

export interface AgentPerformance {
  agentId: string;
  totalTrades: number;
  successfulTrades: number;
  totalPnL: number;
  totalVolume: number;
  winRate: number;
  sharpeRatio?: number;
  maxDrawdown: number;
  currentPositions: number;
  lastTradeAt?: string;
}

export interface AgentTrade {
  id: string;
  agentId: string;
  tokenId: string;
  tokenSymbol: string;
  type: "buy" | "sell";
  amount: number;
  price: number;
  reason: string;
  timestamp: string;
  pnl?: number;
}

export interface AgentOrder {
  id: string;
  agentId: string;
  tokenId: string;
  type: "buy" | "sell" | "limit_buy" | "limit_sell";
  quantity: number;
  limitPrice?: number;
  status: "pending" | "filled" | "cancelled" | "failed";
  createdAt: string;
  filledAt?: string;
}

export interface AgentDecision {
  agentId: string;
  tokenId: string;
  action: "buy" | "sell" | "hold";
  confidence: number; // 0-1
  reasoning: string;
  factors: {
    technicalScore: number;
    sentimentScore: number;
    riskScore: number;
    liquidityScore: number;
  };
  timestamp: string;
}

export interface ConwayAutomatonAPI {
  status: AgentStatus;
  credits: number;
  usdcBalance: number;
  sandboxId?: string;
  lastHeartbeat: string;
  uptime: number;
  turnCount: number;
}

export interface AgentSkill {
  name: string;
  description: string;
  autoActivate: boolean;
  installed: boolean;
  category: "trading" | "analysis" | "risk_management" | "social";
}

export interface MarketSignal {
  tokenId: string;
  signal: "strong_buy" | "buy" | "hold" | "sell" | "strong_sell";
  strength: number; // 0-1
  indicators: {
    price_momentum: number;
    volume_trend: number;
    liquidity_depth: number;
    holder_growth: number;
    survival_tier: "thriving" | "stable" | "at-risk" | "retired";
  };
  timestamp: string;
}
