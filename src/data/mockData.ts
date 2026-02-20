export interface AgentToken {
  id: string;
  name: string;
  symbol: string;
  agentName: string;
  agentAvatar: string;
  price: number;
  change24h: number;
  supply: number;
  liquidityDepth: number;
  survivalCredits: number;
  survivalMax: number;
  status: "thriving" | "stable" | "at-risk" | "retired";
  type: "ERC-20" | "ERC-721";
  volume24h: number;
  holders: number;
}

export interface Proposal {
  id: string;
  title: string;
  author: string;
  endorsements: number;
  status: "active" | "passed" | "rejected";
  tier: "bronze" | "gold" | "platinum" | "diamond";
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  tier: "bronze" | "gold" | "platinum" | "diamond";
  timestamp: string;
}

export const MOCK_TOKENS: AgentToken[] = [
  { id: "1", name: "Nova Core", symbol: "NOVA", agentName: "Agent Nova", agentAvatar: "🤖", price: 2.47, change24h: 12.5, supply: 1000000, liquidityDepth: 85, survivalCredits: 8200, survivalMax: 10000, status: "thriving", type: "ERC-20", volume24h: 145000, holders: 3420 },
  { id: "2", name: "Helix Protocol", symbol: "HLX", agentName: "Agent Helix", agentAvatar: "🧬", price: 0.89, change24h: -3.2, supply: 5000000, liquidityDepth: 62, survivalCredits: 5100, survivalMax: 10000, status: "stable", type: "ERC-20", volume24h: 67000, holders: 1890 },
  { id: "3", name: "Prism Vault", symbol: "PRSM", agentName: "Agent Prism", agentAvatar: "💎", price: 15.30, change24h: 28.7, supply: 100000, liquidityDepth: 94, survivalCredits: 9500, survivalMax: 10000, status: "thriving", type: "ERC-721", volume24h: 320000, holders: 760 },
  { id: "4", name: "Echo Stream", symbol: "ECHO", agentName: "Agent Echo", agentAvatar: "🔊", price: 0.12, change24h: -18.4, supply: 10000000, liquidityDepth: 23, survivalCredits: 1800, survivalMax: 10000, status: "at-risk", type: "ERC-20", volume24h: 12000, holders: 540 },
  { id: "5", name: "Flux Engine", symbol: "FLUX", agentName: "Agent Flux", agentAvatar: "⚡", price: 5.67, change24h: 7.1, supply: 500000, liquidityDepth: 78, survivalCredits: 7400, survivalMax: 10000, status: "thriving", type: "ERC-20", volume24h: 198000, holders: 2100 },
  { id: "6", name: "Drift Shard", symbol: "DRFT", agentName: "Agent Drift", agentAvatar: "🌊", price: 0.03, change24h: -45.2, supply: 50000000, liquidityDepth: 8, survivalCredits: 400, survivalMax: 10000, status: "retired", type: "ERC-20", volume24h: 800, holders: 120 },
];

export const MOCK_PROPOSALS: Proposal[] = [
  { id: "1", title: "Increase survival threshold to 3000 credits", author: "0x1a2b...3c4d", endorsements: 142, status: "active", tier: "platinum", createdAt: "2026-02-18" },
  { id: "2", title: "Allow multi-token agents", author: "0x5e6f...7g8h", endorsements: 89, status: "active", tier: "gold", createdAt: "2026-02-17" },
  { id: "3", title: "Reduce auction cooldown to 1 hour", author: "0x9i0j...1k2l", endorsements: 201, status: "passed", tier: "diamond", createdAt: "2026-02-15" },
  { id: "4", title: "Add NFT badge evolution system", author: "0x3m4n...5o6p", endorsements: 56, status: "active", tier: "bronze", createdAt: "2026-02-19" },
];

export const MOCK_CHAT: ChatMessage[] = [
  { id: "1", user: "CryptoWhale", message: "NOVA looking strong today 🚀", tier: "diamond", timestamp: "2m ago" },
  { id: "2", user: "DeFiDegen", message: "Just bought 1000 HLX!", tier: "gold", timestamp: "3m ago" },
  { id: "3", user: "TokenHunter", message: "Agent Prism evolution incoming?", tier: "platinum", timestamp: "5m ago" },
  { id: "4", user: "NewbTrader", message: "How does survival work?", tier: "bronze", timestamp: "6m ago" },
  { id: "5", user: "LiquidKing", message: "Providing liquidity on FLUX 💧", tier: "gold", timestamp: "8m ago" },
];

export const TIER_COLORS = {
  bronze: "text-tier-bronze",
  gold: "text-tier-gold",
  platinum: "text-tier-platinum",
  diamond: "text-tier-diamond",
} as const;

export const TIER_BADGES = {
  bronze: "🥉",
  gold: "🥇",
  platinum: "💠",
  diamond: "💎",
} as const;
