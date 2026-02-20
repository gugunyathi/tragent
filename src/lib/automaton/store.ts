/**
 * Trading Agent Store
 * 
 * Client-side state management for Conway trading agents
 * using localStorage for persistence and React hooks for reactivity.
 */

import type { TradingAgentConfig, AgentStrategy } from "./types";

const STORAGE_KEY = "tragent:agents";

function generateId(): string {
  return `agent-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

function generateSandboxId(): string {
  return `sbx_${Math.random().toString(36).slice(2, 12)}`;
}

export const DEFAULT_AGENT_CONFIG: Omit<TradingAgentConfig, "id" | "name" | "walletAddress" | "createdAt"> = {
  strategy: "balanced",
  riskTolerance: 0.5,
  maxPositionSize: 25,
  maxDailyTrades: 10,
  autoTrade: false,
  status: "setup",
};

export function loadAgents(): TradingAgentConfig[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveAgents(agents: TradingAgentConfig[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(agents));
}

export function createAgent(
  name: string,
  strategy: AgentStrategy,
  overrides?: Partial<TradingAgentConfig>,
): TradingAgentConfig {
  const agent: TradingAgentConfig = {
    ...DEFAULT_AGENT_CONFIG,
    ...overrides,
    id: generateId(),
    name,
    strategy,
    walletAddress: generateSandboxId(), // sandbox ID used as wallet placeholder
    createdAt: new Date().toISOString(),
    status: "waking",
  };

  const agents = loadAgents();
  agents.push(agent);
  saveAgents(agents);

  return agent;
}

export function updateAgent(id: string, updates: Partial<TradingAgentConfig>): TradingAgentConfig | null {
  const agents = loadAgents();
  const idx = agents.findIndex((a) => a.id === id);
  if (idx === -1) return null;

  agents[idx] = { ...agents[idx], ...updates };
  saveAgents(agents);
  return agents[idx];
}

export function deleteAgent(id: string): void {
  const agents = loadAgents();
  saveAgents(agents.filter((a) => a.id !== id));
}

export function getAgent(id: string): TradingAgentConfig | null {
  return loadAgents().find((a) => a.id === id) ?? null;
}

export const STRATEGY_METADATA: Record<AgentStrategy, {
  label: string;
  description: string;
  emoji: string;
  color: string;
}> = {
  conservative: {
    label: "Conservative",
    description: "Low risk, steady gains. Targets thriving/stable tokens only.",
    emoji: "🛡️",
    color: "text-neon-cyan",
  },
  balanced: {
    label: "Balanced",
    description: "Balanced risk/reward. Trades across all tiers with position limits.",
    emoji: "⚖️",
    color: "text-primary",
  },
  aggressive: {
    label: "Aggressive",
    description: "High risk, high reward. Chases momentum and at-risk recoveries.",
    emoji: "⚡",
    color: "text-neon-pink",
  },
  scalp: {
    label: "Scalper",
    description: "High-frequency micro-trades on short-term price movements.",
    emoji: "🎯",
    color: "text-tier-gold",
  },
  hodl: {
    label: "HODL",
    description: "Accumulate and hold. Buys dips, ignores short-term volatility.",
    emoji: "💎",
    color: "text-neon-purple",
  },
};
