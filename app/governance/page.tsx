"use client";

import { motion } from "framer-motion";
import { MOCK_PROPOSALS } from "@/data/mockData";
import { TierBadge } from "@/components/TierBadge";
import { VoiceMic } from "@/components/VoiceMic";
import { Vote, Zap, ThumbsUp, ScrollText, Users } from "lucide-react";

export default function Governance() {
  return (
    <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-5xl mx-auto space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-tier-gold" />
          <h1 className="font-display text-lg sm:text-xl font-bold text-foreground">Governance</h1>
        </div>
        <VoiceMic />
      </motion.div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "Active Proposals", value: MOCK_PROPOSALS.filter(p => p.status === "active").length, icon: ScrollText, color: "text-primary" },
          { label: "Council Members", value: 24, icon: Users, color: "text-tier-platinum" },
          { label: "Total Votes", value: "1.2K", icon: ThumbsUp, color: "text-tier-gold" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-3 sm:p-4 text-center">
            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto mb-1 ${color}`} />
            <p className="text-lg sm:text-xl font-bold text-foreground">{value}</p>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-display uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      <section>
        <h2 className="font-display text-xs sm:text-sm uppercase tracking-wider text-foreground mb-3">Proposal Leaderboard</h2>
        <div className="space-y-2 sm:space-y-3">
          {[...MOCK_PROPOSALS].sort((a, b) => b.endorsements - a.endorsements).map((p, i) => (
            <motion.div key={p.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-3 sm:p-4">
              <div className="flex items-start justify-between gap-2 sm:gap-4">
                <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                  <span className="font-display text-base sm:text-lg text-muted-foreground w-5 sm:w-6 text-right flex-shrink-0">#{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-xs sm:text-sm font-medium text-foreground">{p.title}</p>
                    <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                      <TierBadge tier={p.tier} showLabel />
                      <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{p.author}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-display uppercase tracking-wider ${
                    p.status === "active" ? "bg-primary/10 text-primary" :
                    p.status === "passed" ? "bg-neon-green/10 text-neon-green" :
                    "bg-destructive/10 text-destructive"
                  }`}>{p.status}</span>
                  <div className="flex items-center gap-0.5 sm:gap-1">
                    <Zap className="w-3 h-3 text-tier-gold" />
                    <span className="text-xs sm:text-sm font-semibold text-foreground">{p.endorsements}</span>
                  </div>
                </div>
              </div>
              {p.status === "active" && (
                <div className="mt-2 sm:mt-3 flex items-center gap-2">
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg bg-primary/10 text-primary text-[10px] sm:text-xs font-display uppercase tracking-wider border border-primary/20 hover:bg-primary/20 transition-colors">
                    Endorse
                  </motion.button>
                  <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg glass text-muted-foreground text-[10px] sm:text-xs font-display uppercase tracking-wider hover:text-foreground transition-colors">
                    Co-Sign
                  </motion.button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
