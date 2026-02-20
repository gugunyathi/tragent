import { motion } from "framer-motion";
import { MOCK_PROPOSALS } from "@/data/mockData";
import { TierBadge } from "@/components/TierBadge";
import { VoiceMic } from "@/components/VoiceMic";
import { Vote, Zap, ThumbsUp, ScrollText, Users } from "lucide-react";

const Governance = () => {
  return (
    <div className="pt-20 md:pt-16 pb-8 px-4 max-w-5xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="w-5 h-5 text-tier-gold" />
          <h1 className="font-display text-xl font-bold text-foreground">Governance</h1>
        </div>
        <VoiceMic />
      </motion.div>

      {/* Council stats */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Active Proposals", value: MOCK_PROPOSALS.filter(p => p.status === "active").length, icon: ScrollText, color: "text-primary" },
          { label: "Council Members", value: 24, icon: Users, color: "text-tier-platinum" },
          { label: "Total Votes", value: "1.2K", icon: ThumbsUp, color: "text-tier-gold" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4 text-center"
          >
            <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
            <p className="text-xl font-bold text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Proposal leaderboard */}
      <section>
        <h2 className="font-display text-sm uppercase tracking-wider text-foreground mb-3">Proposal Leaderboard</h2>
        <div className="space-y-3">
          {MOCK_PROPOSALS.sort((a, b) => b.endorsements - a.endorsements).map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-3">
                  <span className="font-display text-lg text-muted-foreground w-6 text-right">#{i + 1}</span>
                  <div>
                    <p className="text-sm font-medium text-foreground">{p.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <TierBadge tier={p.tier} showLabel />
                      <span className="text-xs text-muted-foreground">{p.author}</span>
                      <span className="text-xs text-muted-foreground">{p.createdAt}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-display uppercase tracking-wider ${
                    p.status === "active" ? "bg-primary/10 text-primary" :
                    p.status === "passed" ? "bg-neon-green/10 text-neon-green" :
                    "bg-destructive/10 text-destructive"
                  }`}>
                    {p.status}
                  </span>
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-tier-gold" />
                    <span className="text-sm font-semibold text-foreground">{p.endorsements}</span>
                  </div>
                </div>
              </div>
              {p.status === "active" && (
                <div className="mt-3 flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-display uppercase tracking-wider border border-primary/20 hover:bg-primary/20 transition-colors"
                  >
                    Endorse
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="px-4 py-1.5 rounded-lg glass text-muted-foreground text-xs font-display uppercase tracking-wider hover:text-foreground transition-colors"
                  >
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
};

export default Governance;
