"use client";

import { motion } from "framer-motion";
import { TokenCard } from "@/components/TokenCard";
import { VoiceMic } from "@/components/VoiceMic";
import { SwipeHint } from "@/components/SwipeHint";
import { MOCK_TOKENS } from "@/data/mockData";
import { Store, Search, Filter } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Marketplace() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const filtered = filter === "all" ? MOCK_TOKENS : MOCK_TOKENS.filter((t) => t.status === filter);
  const statuses = ["all", "thriving", "stable", "at-risk", "retired"];

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
            <input className="bg-transparent text-xs sm:text-sm text-foreground placeholder:text-muted-foreground outline-none flex-1 min-w-0" placeholder="Search tokens..." />
          </div>
          <VoiceMic />
        </div>
      </motion.div>

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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {filtered.map((token, i) => (
          <TokenCard key={token.id} token={token} index={i} enableKeyboard onClick={() => router.push(`/token/${token.id}`)} />
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">No tokens found with status &quot;{filter}&quot;</div>
      )}
    </div>
  );
}
