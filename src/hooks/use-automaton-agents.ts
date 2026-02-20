"use client";

import { useState, useEffect, useCallback } from "react";
import type { TradingAgentConfig, AgentPerformance, AgentTrade, ConwayAutomatonAPI, AgentStrategy } from "@/lib/automaton/types";
import {
  loadAgents,
  createAgent,
  updateAgent,
  deleteAgent,
  STRATEGY_METADATA,
} from "@/lib/automaton/store";
import { getAgentPerformance, getAgentTrades, getAutomatonStatus } from "@/lib/automaton/client";

export { STRATEGY_METADATA };

interface AgentWithRuntime extends TradingAgentConfig {
  performance?: AgentPerformance;
  runtime?: ConwayAutomatonAPI;
}

export function useAutomatonAgents() {
  const [agents, setAgents] = useState<AgentWithRuntime[]>([]);
  const [trades, setTrades] = useState<Record<string, AgentTrade[]>>({});
  const [loading, setLoading] = useState(true);

  const loadAll = useCallback(async () => {
    const raw = loadAgents();
    setAgents(raw);

    // Fetch performance + runtime for each agent
    const enriched = await Promise.all(
      raw.map(async (agent) => {
        try {
          const [performance, runtime] = await Promise.all([
            getAgentPerformance(agent),
            getAutomatonStatus(agent.walletAddress),
          ]);
          return { ...agent, performance, runtime };
        } catch {
          return agent;
        }
      })
    );
    setAgents(enriched);
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  const create = useCallback(
    async (name: string, strategy: AgentStrategy, overrides?: Partial<TradingAgentConfig>) => {
      const agent = createAgent(name, strategy, overrides);
      await loadAll();
      return agent;
    },
    [loadAll]
  );

  const update = useCallback(
    async (id: string, updates: Partial<TradingAgentConfig>) => {
      updateAgent(id, updates);
      await loadAll();
    },
    [loadAll]
  );

  const remove = useCallback(
    (id: string) => {
      deleteAgent(id);
      setAgents((prev) => prev.filter((a) => a.id !== id));
    },
    []
  );

  const fetchTrades = useCallback(async (agentId: string) => {
    const t = await getAgentTrades(agentId);
    setTrades((prev) => ({ ...prev, [agentId]: t }));
    return t;
  }, []);

  const toggleAutoTrade = useCallback(
    (id: string) => {
      const agent = agents.find((a) => a.id === id);
      if (!agent) return;
      update(id, { autoTrade: !agent.autoTrade });
    },
    [agents, update]
  );

  return {
    agents,
    trades,
    loading,
    create,
    update,
    remove,
    fetchTrades,
    toggleAutoTrade,
    reload: loadAll,
  };
}
