/**
 * Conway Automaton API Client
 * 
 * Facade that communicates with the Conway automaton runtime
 * via its HTTP API. In production, this connects to api.conway.tech
 * and each agent's sandbox. In development/demo, returns simulated data.
 */

import type {
  ConwayAutomatonAPI,
  TradingAgentConfig,
  AgentPerformance,
  AgentTrade,
  AgentDecision,
  MarketSignal,
} from "./types";
import type { AgentToken } from "@/data/mockData";

const CONWAY_API_BASE = process.env.NEXT_PUBLIC_CONWAY_API_URL ?? "https://api.conway.tech";
const CONWAY_API_KEY = process.env.NEXT_PUBLIC_CONWAY_API_KEY ?? "";

async function conwayFetch(path: string, options?: RequestInit) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (CONWAY_API_KEY) {
    headers["Authorization"] = `Bearer ${CONWAY_API_KEY}`;
  }

  const res = await fetch(`${CONWAY_API_BASE}${path}`, {
    ...options,
    headers: { ...headers, ...options?.headers },
  });

  if (!res.ok) {
    throw new Error(`Conway API error: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// ─── Status ──────────────────────────────────────────────────────

export async function getAutomatonStatus(sandboxId: string): Promise<ConwayAutomatonAPI> {
  // In demo/dev mode, return simulated status based on sandbox ID
  if (!CONWAY_API_KEY) {
    return simulateAutomatonStatus(sandboxId);
  }

  return conwayFetch(`/v1/sandboxes/${sandboxId}/status`);
}

// ─── Trading Decisions ────────────────────────────────────────────

export async function getAgentDecision(
  sandboxId: string,
  token: AgentToken,
): Promise<AgentDecision> {
  if (!CONWAY_API_KEY) {
    return simulateAgentDecision(sandboxId, token);
  }

  return conwayFetch(`/v1/sandboxes/${sandboxId}/decision`, {
    method: "POST",
    body: JSON.stringify({
      tokenId: token.id,
      tokenSymbol: token.symbol,
      price: token.price,
      change24h: token.change24h,
      volume24h: token.volume24h,
      liquidityDepth: token.liquidityDepth,
      holders: token.holders,
      status: token.status,
    }),
  });
}

// ─── Market Signals ───────────────────────────────────────────────

export function computeMarketSignal(token: AgentToken): MarketSignal {
  const momentum = Math.max(0, Math.min(1, (token.change24h + 20) / 40));
  const volumeScore = Math.min(1, token.volume24h / 500000);
  const liquidityScore = token.liquidityDepth / 100;
  const holderScore = Math.min(1, token.holders / 10000);
  const survivalScore =
    token.status === "thriving"
      ? 1
      : token.status === "stable"
      ? 0.7
      : token.status === "at-risk"
      ? 0.3
      : 0;

  const composite =
    momentum * 0.3 +
    volumeScore * 0.2 +
    liquidityScore * 0.2 +
    holderScore * 0.15 +
    survivalScore * 0.15;

  let signal: MarketSignal["signal"];
  if (composite > 0.75) signal = "strong_buy";
  else if (composite > 0.55) signal = "buy";
  else if (composite > 0.4) signal = "hold";
  else if (composite > 0.25) signal = "sell";
  else signal = "strong_sell";

  return {
    tokenId: token.id,
    signal,
    strength: composite,
    indicators: {
      price_momentum: momentum,
      volume_trend: volumeScore,
      liquidity_depth: liquidityScore,
      holder_growth: holderScore,
      survival_tier: token.status,
    },
    timestamp: new Date().toISOString(),
  };
}

// ─── Performance ──────────────────────────────────────────────────

export async function getAgentPerformance(agentConfig: TradingAgentConfig): Promise<AgentPerformance> {
  if (!CONWAY_API_KEY) {
    return simulateAgentPerformance(agentConfig);
  }

  return conwayFetch(`/v1/agents/${agentConfig.id}/performance`);
}

export async function getAgentTrades(agentId: string, limit = 20): Promise<AgentTrade[]> {
  if (!CONWAY_API_KEY) {
    return simulateAgentTrades(agentId, limit);
  }

  return conwayFetch(`/v1/agents/${agentId}/trades?limit=${limit}`);
}

// ─── Simulation (Dev/Demo mode) ───────────────────────────────────

function simulateAutomatonStatus(sandboxId: string): ConwayAutomatonAPI {
  const seed = sandboxId.charCodeAt(sandboxId.length - 1);
  const statuses: ConwayAutomatonAPI["status"][] = ["running", "running", "running", "sleeping", "waking", "low_compute"];
  const status = statuses[seed % statuses.length];

  return {
    status,
    credits: 200 + (seed * 37) % 9800,
    usdcBalance: parseFloat((0.5 + (seed * 13) % 99).toFixed(4)),
    sandboxId,
    lastHeartbeat: new Date(Date.now() - (seed * 10000) % 300000).toISOString(),
    uptime: (seed * 17) % 720 + 1,
    turnCount: (seed * 43) % 2000,
  };
}

function simulateAgentDecision(sandboxId: string, token: AgentToken): AgentDecision {
  const signal = computeMarketSignal(token);
  const seed = sandboxId.charCodeAt(0) + token.id.charCodeAt(0);
  const confidence = 0.5 + (seed % 40) / 100;

  const action: AgentDecision["action"] =
    signal.signal === "strong_buy" || signal.signal === "buy"
      ? "buy"
      : signal.signal === "sell" || signal.signal === "strong_sell"
      ? "sell"
      : "hold";

  const reasonMap: Record<string, string> = {
    buy: `${token.symbol} shows strong momentum (${token.change24h > 0 ? "+" : ""}${token.change24h}%). Liquidity depth at ${token.liquidityDepth}% supports entry. Agent status: ${token.status}.`,
    sell: `${token.symbol} exhibiting weakness. Survival tier: ${token.status}. Liquidity dropping. Risk-adjusted exit recommended.`,
    hold: `${token.symbol} in consolidation. Monitoring for breakout signal. Current status: ${token.status}.`,
  };

  return {
    agentId: sandboxId,
    tokenId: token.id,
    action,
    confidence,
    reasoning: reasonMap[action],
    factors: {
      technicalScore: signal.indicators.price_momentum,
      sentimentScore: signal.indicators.holder_growth,
      riskScore: signal.indicators.survival_tier === "thriving" ? 0.1 : 0.5,
      liquidityScore: signal.indicators.liquidity_depth,
    },
    timestamp: new Date().toISOString(),
  };
}

function simulateAgentPerformance(config: TradingAgentConfig): AgentPerformance {
  const seed = config.id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const totalTrades = 20 + (seed % 180);
  const winRate = 0.45 + (seed * 7 % 30) / 100;
  const successfulTrades = Math.floor(totalTrades * winRate);
  const avgPnL = config.strategy === "aggressive" ? 12 : config.strategy === "conservative" ? 4 : 7;

  return {
    agentId: config.id,
    totalTrades,
    successfulTrades,
    totalPnL: parseFloat(((successfulTrades * avgPnL) - ((totalTrades - successfulTrades) * avgPnL * 0.8)).toFixed(2)),
    totalVolume: parseFloat((totalTrades * config.maxPositionSize * 0.7).toFixed(2)),
    winRate: parseFloat(winRate.toFixed(3)),
    sharpeRatio: parseFloat((0.8 + (seed % 20) / 10).toFixed(2)),
    maxDrawdown: parseFloat((5 + (seed % 20)).toFixed(2)),
    currentPositions: seed % 5,
    lastTradeAt: new Date(Date.now() - (seed % 86400) * 1000).toISOString(),
  };
}

const TRADE_REASONS = [
  "RSI oversold + volume spike",
  "Bullish divergence on 15m chart",
  "Holder growth acceleration",
  "Survival tier upgraded to thriving",
  "Liquidity depth surged > 80%",
  "Stop-loss triggered — risk limit",
  "Take profit target reached",
  "Rebalance — overweight position",
  "Momentum fading — partial exit",
  "Genesis prompt directive: accumulate during dips",
];

function simulateAgentTrades(agentId: string, limit: number): AgentTrade[] {
  const seed = agentId.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  const tokens = ["NCB", "SDX", "VRX", "MNT", "PLX"];

  return Array.from({ length: Math.min(limit, 12) }, (_, i) => {
    const s = (seed + i * 31) % 100;
    const type = s % 2 === 0 ? "buy" : "sell";
    const price = 0.5 + (s * 0.13) % 9.5;
    const amount = 2 + (s * 7) % 48;
    const pnl = type === "sell" ? parseFloat(((s % 3 === 0 ? 1 : -1) * (s % 800) / 100).toFixed(2)) : undefined;

    return {
      id: `trade-${agentId}-${i}`,
      agentId,
      tokenId: `token-${i % 5}`,
      tokenSymbol: tokens[i % tokens.length],
      type,
      amount,
      price: parseFloat(price.toFixed(4)),
      reason: TRADE_REASONS[(seed + i) % TRADE_REASONS.length],
      timestamp: new Date(Date.now() - (i * 1800 + s * 600) * 1000).toISOString(),
      pnl,
    };
  });
}
