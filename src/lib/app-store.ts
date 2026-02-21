// Central app state types + localStorage persistence

export interface Position {
  tokenId: string;
  symbol: string;
  name: string;
  agentAvatar: string;
  amount: number;   // USD amount invested
  tokens: number;   // token units held
  avgPrice: number; // USD per token at purchase
}

export interface ChatMessage {
  id: string;
  user: string;
  message: string;
  tier: "bronze" | "gold" | "platinum" | "diamond";
  timestamp: string;
  isOwn?: boolean;
}

export interface Bid {
  auctionId: string;
  amount: number;
  timestamp: string;
}

export interface AppState {
  portfolio: Record<string, Position>;
  watchlist: string[];
  endorsements: string[];       // proposal IDs
  chatMessages: Record<string, ChatMessage[]>; // room -> messages
  bids: Bid[];
  walletBalance: number;        // USDC balance
  scCredits: number;            // survival credits
}

const STORAGE_KEY = "tragent_state";

const DEFAULT_STATE: AppState = {
  portfolio: {},
  watchlist: [],
  endorsements: [],
  chatMessages: {},
  bids: [],
  walletBalance: 1000,  // start with $1,000 USDC
  scCredits: 8200,
};

export function loadState(): AppState {
  if (typeof window === "undefined") return DEFAULT_STATE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULT_STATE;
    return { ...DEFAULT_STATE, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_STATE;
  }
}

export function saveState(state: AppState): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Ignore storage errors
  }
}

export function executeBuy(
  state: AppState,
  tokenId: string,
  symbol: string,
  name: string,
  agentAvatar: string,
  usdAmount: number,
  price: number
): AppState {
  if (usdAmount > state.walletBalance) throw new Error("Insufficient balance");
  const tokensBought = usdAmount / price;
  const existing = state.portfolio[tokenId];
  const newPosition: Position = existing
    ? {
        ...existing,
        amount: existing.amount + usdAmount,
        tokens: existing.tokens + tokensBought,
        avgPrice: (existing.amount + usdAmount) / (existing.tokens + tokensBought),
      }
    : { tokenId, symbol, name, agentAvatar, amount: usdAmount, tokens: tokensBought, avgPrice: price };

  return {
    ...state,
    walletBalance: state.walletBalance - usdAmount,
    portfolio: { ...state.portfolio, [tokenId]: newPosition },
  };
}

export function executeSell(
  state: AppState,
  tokenId: string,
  percentage: number,
  currentPrice: number
): AppState {
  const pos = state.portfolio[tokenId];
  if (!pos) throw new Error("No position");
  const tokensSold = (pos.tokens * percentage) / 100;
  const usdReceived = tokensSold * currentPrice;
  const remaining = pos.tokens - tokensSold;
  const newPortfolio = { ...state.portfolio };
  if (remaining < 0.0001) {
    delete newPortfolio[tokenId];
  } else {
    newPortfolio[tokenId] = { ...pos, tokens: remaining, amount: remaining * pos.avgPrice };
  }
  return {
    ...state,
    walletBalance: state.walletBalance + usdReceived,
    portfolio: newPortfolio,
  };
}

export function toggleWatchlist(state: AppState, tokenId: string): AppState {
  const has = state.watchlist.includes(tokenId);
  return {
    ...state,
    watchlist: has ? state.watchlist.filter((id) => id !== tokenId) : [...state.watchlist, tokenId],
  };
}

export function toggleEndorsement(state: AppState, proposalId: string): AppState {
  const has = state.endorsements.includes(proposalId);
  return {
    ...state,
    endorsements: has
      ? state.endorsements.filter((id) => id !== proposalId)
      : [...state.endorsements, proposalId],
  };
}

export function addChatMessage(
  state: AppState,
  room: string,
  message: ChatMessage
): AppState {
  const existing = state.chatMessages[room] ?? [];
  return {
    ...state,
    chatMessages: {
      ...state.chatMessages,
      [room]: [...existing, message].slice(-100), // keep last 100
    },
  };
}

export function placeBid(state: AppState, auctionId: string, amount: number): AppState {
  const bid: Bid = { auctionId, amount, timestamp: new Date().toISOString() };
  return {
    ...state,
    bids: [...state.bids.filter((b) => b.auctionId !== auctionId), bid],
  };
}
