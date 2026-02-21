"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MOCK_PROPOSALS } from "@/data/mockData";
import { TierBadge } from "@/components/TierBadge";
import { VoiceMic } from "@/components/VoiceMic";
import { Vote, Zap, ThumbsUp, ScrollText, Users, Plus, X } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

interface LocalProposal {
  id: string;
  title: string;
  author: string;
  endorsements: number;
  status: "active" | "passed" | "rejected";
  tier: "bronze" | "gold" | "platinum" | "diamond";
  createdAt: string;
  isLocal?: boolean;
}

export default function Governance() {
  const { state, endorse } = useAppStore();
  const [proposals, setProposals] = useState<LocalProposal[]>(MOCK_PROPOSALS as LocalProposal[]);
  const [submitOpen, setSubmitOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Live endorsement counts: add 1 to proposals the user has endorsed
  const getEndorsements = (id: string, base: number) =>
    state.endorsements.includes(id) ? base + 1 : base;

  const handleEndorse = (proposalId: string) => {
    const wasEndorsed = state.endorsements.includes(proposalId);
    endorse(proposalId);
    toast({
      title: wasEndorsed ? "Endorsement removed" : "⚡ Endorsed!",
      description: wasEndorsed ? "You removed your endorsement" : "Your endorsement has been recorded on-chain",
    });
  };

  const handleCoSign = (title: string) => {
    toast({
      title: "📝 Co-Signed",
      description: `You co-signed: "${title}"`,
    });
  };

  const handleSubmit = async () => {
    if (!newTitle.trim()) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 600)); // Simulate tx
    const newProposal: LocalProposal = {
      id: `local-${Date.now()}`,
      title: newTitle.trim(),
      author: "You (0x...)",
      endorsements: 1,
      status: "active",
      tier: "bronze",
      createdAt: new Date().toISOString().split("T")[0],
      isLocal: true,
    };
    setProposals((prev) => [newProposal, ...prev]);
    setNewTitle("");
    setSubmitOpen(false);
    setSubmitting(false);
    toast({
      title: "🗳  Proposal submitted!",
      description: "Your proposal is now live for community endorsement",
    });
  };

  const totalVotes = proposals.reduce((sum, p) => sum + getEndorsements(p.id, p.endorsements), 0);
  const activeCount = proposals.filter((p) => p.status === "active").length;

  return (
    <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-5xl mx-auto space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Vote className="w-4 h-4 sm:w-5 sm:h-5 text-tier-gold" />
          <h1 className="font-display text-lg sm:text-xl font-bold text-foreground">Governance</h1>
        </div>
        <div className="flex items-center gap-2">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => setSubmitOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30 text-primary text-xs font-display uppercase tracking-wider hover:bg-primary/20 transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Propose
          </motion.button>
          <VoiceMic />
        </div>
      </motion.div>

      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          { label: "Active Proposals", value: activeCount, icon: ScrollText, color: "text-primary" },
          { label: "Council Members", value: 24, icon: Users, color: "text-tier-platinum" },
          { label: "Total Endorsements", value: totalVotes.toLocaleString(), icon: ThumbsUp, color: "text-tier-gold" },
        ].map(({ label, value, icon: Icon, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-3 sm:p-4 text-center">
            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto mb-1 ${color}`} />
            <p className="text-lg sm:text-xl font-bold text-foreground">{value}</p>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-display uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Your endorsements indicator */}
      {state.endorsements.length > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 text-xs text-tier-gold">
          <Zap className="w-3.5 h-3.5" />
          <span>You&apos;ve endorsed {state.endorsements.length} proposal{state.endorsements.length !== 1 ? "s" : ""}</span>
        </motion.div>
      )}

      <section>
        <h2 className="font-display text-xs sm:text-sm uppercase tracking-wider text-foreground mb-3">Proposal Leaderboard</h2>
        <div className="space-y-2 sm:space-y-3">
          <AnimatePresence>
            {[...proposals].sort((a, b) => getEndorsements(b.id, b.endorsements) - getEndorsements(a.id, a.endorsements)).map((p, i) => {
              const endorsed = state.endorsements.includes(p.id);
              const count = getEndorsements(p.id, p.endorsements);
              return (
                <motion.div
                  key={p.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className={`glass rounded-xl p-3 sm:p-4 ${p.isLocal ? "border border-primary/20" : ""}`}
                >
                  <div className="flex items-start justify-between gap-2 sm:gap-4">
                    <div className="flex items-start gap-2 sm:gap-3 min-w-0">
                      <span className="font-display text-base sm:text-lg text-muted-foreground w-5 sm:w-6 text-right flex-shrink-0">#{i + 1}</span>
                      <div className="min-w-0">
                        <p className="text-xs sm:text-sm font-medium text-foreground">{p.title}</p>
                        <div className="flex items-center gap-1.5 sm:gap-2 mt-1 flex-wrap">
                          <TierBadge tier={p.tier} showLabel />
                          <span className="text-[10px] sm:text-xs text-muted-foreground truncate">{p.author}</span>
                          {p.isLocal && <span className="text-[9px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full font-display uppercase tracking-wider">Your proposal</span>}
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
                        <Zap className={`w-3 h-3 ${endorsed ? "text-tier-gold fill-tier-gold" : "text-tier-gold"}`} />
                        <span className="text-xs sm:text-sm font-semibold text-foreground">{count}</span>
                      </div>
                    </div>
                  </div>
                  {p.status === "active" && (
                    <div className="mt-2 sm:mt-3 flex items-center gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleEndorse(p.id)}
                        className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg text-[10px] sm:text-xs font-display uppercase tracking-wider border transition-colors ${
                          endorsed
                            ? "bg-tier-gold/20 text-tier-gold border-tier-gold/40"
                            : "bg-primary/10 text-primary border-primary/20 hover:bg-primary/20"
                        }`}
                      >
                        {endorsed ? "✓ Endorsed" : "Endorse"}
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleCoSign(p.title)}
                        className="px-3 sm:px-4 py-1 sm:py-1.5 rounded-lg glass text-muted-foreground text-[10px] sm:text-xs font-display uppercase tracking-wider hover:text-foreground transition-colors"
                      >
                        Co-Sign
                      </motion.button>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </section>

      {/* Submit Proposal Modal */}
      <AnimatePresence>
        {submitOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setSubmitOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
            >
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Vote className="w-4 h-4 text-tier-gold" />
                    <span className="font-display text-sm font-semibold text-foreground">Submit Proposal</span>
                  </div>
                  <button onClick={() => setSubmitOpen(false)} className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-muted">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-muted-foreground font-display uppercase tracking-wider mb-1.5 block">Proposal Title</label>
                    <textarea
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Describe your governance proposal..."
                      rows={3}
                      maxLength={200}
                      className="w-full px-3 py-2 rounded-xl bg-muted/50 border border-border text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
                    />
                    <p className="text-[10px] text-muted-foreground text-right mt-1">{newTitle.length}/200</p>
                  </div>
                  <div className="glass rounded-lg p-3 text-xs text-muted-foreground space-y-1">
                    <p>• Requires <span className="text-tier-gold font-semibold">Bronze</span> tier or above</p>
                    <p>• Proposal stays active for 7 days</p>
                    <p>• Needs 50 endorsements to proceed to vote</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleSubmit}
                    disabled={!newTitle.trim() || submitting}
                    className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display text-sm uppercase tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? "Submitting..." : "Submit Proposal"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
