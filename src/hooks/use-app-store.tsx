"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import {
  AppState,
  loadState,
  saveState,
  executeBuy,
  executeSell,
  toggleWatchlist,
  toggleEndorsement,
  addChatMessage,
  placeBid,
  type ChatMessage,
} from "@/lib/app-store";

interface AppStoreContextValue {
  state: AppState;
  buy: (tokenId: string, symbol: string, name: string, agentAvatar: string, usdAmount: number, price: number) => void;
  sell: (tokenId: string, percentage: number, currentPrice: number) => void;
  toggleWatch: (tokenId: string) => void;
  endorse: (proposalId: string) => void;
  sendChat: (room: string, message: string) => void;
  bid: (auctionId: string, amount: number) => void;
}

const AppStoreContext = createContext<AppStoreContextValue | null>(null);

export function AppStoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(loadState);

  // Persist to localStorage on every change
  useEffect(() => {
    saveState(state);
  }, [state]);

  const update = useCallback((updater: (s: AppState) => AppState) => {
    setState((prev) => {
      try {
        return updater(prev);
      } catch {
        return prev;
      }
    });
  }, []);

  const buy = useCallback(
    (tokenId: string, symbol: string, name: string, agentAvatar: string, usdAmount: number, price: number) =>
      update((s) => executeBuy(s, tokenId, symbol, name, agentAvatar, usdAmount, price)),
    [update]
  );

  const sell = useCallback(
    (tokenId: string, percentage: number, currentPrice: number) =>
      update((s) => executeSell(s, tokenId, percentage, currentPrice)),
    [update]
  );

  const toggleWatch = useCallback(
    (tokenId: string) => update((s) => toggleWatchlist(s, tokenId)),
    [update]
  );

  const endorse = useCallback(
    (proposalId: string) => update((s) => toggleEndorsement(s, proposalId)),
    [update]
  );

  const sendChat = useCallback(
    (room: string, message: string) => {
      const msg: ChatMessage = {
        id: Date.now().toString(),
        user: "You",
        message,
        tier: "gold",
        timestamp: "just now",
        isOwn: true,
      };
      update((s) => addChatMessage(s, room, msg));
    },
    [update]
  );

  const bid = useCallback(
    (auctionId: string, amount: number) => update((s) => placeBid(s, auctionId, amount)),
    [update]
  );

  return (
    <AppStoreContext.Provider value={{ state, buy, sell, toggleWatch, endorse, sendChat, bid }}>
      {children}
    </AppStoreContext.Provider>
  );
}

export function useAppStore() {
  const ctx = useContext(AppStoreContext);
  if (!ctx) throw new Error("useAppStore must be used inside AppStoreProvider");
  return ctx;
}
