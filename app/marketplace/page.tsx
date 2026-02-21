"use client";

import { motion, AnimatePresence } from "framer-motion";
import { TokenCard } from "@/components/TokenCard";
import { VoiceMic } from "@/components/VoiceMic";
import { SwipeHint } from "@/components/SwipeHint";
import { MOCK_TOKENS } from "@/data/mockData";
import { Store, Search, Filter, Star, Wallet, X } from "lucide-react";
import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/hooks/use-app-store";

export default function Marketplace() {
  const router = useRouter();
  const { state } = useAppStore();
  const [filter, setFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [tab, setTab] = useState<"all" | "watchlist" | "portfolio">("all");
  const statuses = ["all", "thriving", "stable", "at-risk", "retired"];

  const filtered = useMemo(() => {
    let list = MOCK_TOKENS;

    // Tab filter
    if (tab === "watchlist") list = list.filter((t) => state.watchlist.includes(t.id));
    else if (tab === "portfolio") list = list.filter((t) => !!state.portfolio[t.id]);

    // Status filter
    if (filter !== "all") list = list.filter((t) => t.status === filter);

    // Search
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.symbol.toLowerCase().includes(q) ||
          t.agentName.toLowerCase().includes(q)
      );
    }

    return list;
  }, [filter, search, tab, state.watchlist, state.portfolio]);

  const portfolioCount = Object.keys(state.portfolio).length;
  const watchlistCount = state.watchlist.length;

  return (
    <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2">
          <Store className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h1 className="font-display text-lg sm:text-xl font-bold text-foreground">Token Marketplace</h1>
        </div>
        <div className="flex items-center gap-2 sm:gap-3 w-full sm:w-auto">
          <div className="flex-1 sm:w-64 flex items-center gap-2 glass rounded-lg px-2.5 sm:px-3 py-1.5 sm:py-2">
            <Search className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
            <input
              className="bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0"
              placeholder="Search tokens, agents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch("")} className="text-muted-foreground hover:text-foreground">
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
          <VoiceMic onTranscript={(text) => setSearch(text)} />
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-2">
        {[
          { key: "all", label: `All (${MOCK_TOKENS.length})` },
          { key: "portfolio", label: `Portfolio${portfolioCount > 0 ? ` (${portfolioCount})` : ""}`, icon: Wallet },
          { key: "watchlist", label: `Watchlist${watchlistCount > 0 ? ` (${watchlistCount})` : ""}`, icon: Star },
        ].map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key as typeof tab)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] sm:text-xs font-display uppercase tracking-wider transition-colors ${
              tab === key ? "bg-primary/10 text-primary border border-primary/30" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {Icon && <Icon className="w-3 h-3" />}
            {label}
          </button>
        ))}
      </div>

      {/* Status filters */}
      <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto pb-2 -mx-3 px-3 sm:mx-0 sm:px-0">
        <Filter className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
        {statuses.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-2.5 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-display uppercase tracking-wider flex-shrink-0 transition-colors ${
              filter === s ? "bg-primary/10 text-primary border border-primary/30" : "glass text-muted-foreground hover:text-foreground"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <SwipeHint />

      <AnimatePresence mode="popLayout">
        {filtered.length > 0 ? (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
            {filtered.map((token, i) => (
              <TokenCard key={token.id} token={token} index={i} enableKeyboard onClick={() => router.push(`/token/${token.id}`)} />
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 space-y-2"
          >
            <p className="text-muted-foreground text-sm">
              {search ? `No tokens matching "${search}"` : tab === "portfolio" ? "No positions yet" : tab === "watchlist" ? "Nothing on your watchlist" : `No tokens with status "${filter}"`}
            </p>
            {tab !== "all" && (
              <button onClick={() => { setTab("all"); setFilter("all"); setSearch(""); }} className="text-xs text-primary hover:underline">
                Show all tokens
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
