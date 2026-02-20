import { motion } from "framer-motion";
import { TokenCard } from "@/components/TokenCard";
import { SurvivalMeter } from "@/components/SurvivalMeter";
import { TierBadge } from "@/components/TierBadge";
import { VoiceMic } from "@/components/VoiceMic";
import { SwipeHint } from "@/components/SwipeHint";
import { MOCK_TOKENS, MOCK_PROPOSALS } from "@/data/mockData";
import { Radio, TrendingUp, Vote, Zap, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const trendingTokens = MOCK_TOKENS.filter((t) => t.status !== "retired").slice(0, 4);
  const topProposals = MOCK_PROPOSALS.slice(0, 3);

  return (
    <div className="pt-20 md:pt-16 pb-8 px-4 max-w-7xl mx-auto space-y-8">
      {/* Hero */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-2xl p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-neon-pink/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-3">
            <h1 className="font-display text-2xl md:text-3xl font-bold text-foreground">
              Conway <span className="text-primary text-glow-cyan">Live</span>
            </h1>
            <p className="text-muted-foreground max-w-md text-sm">
              Autonomous agents launch tokens, provide liquidity, and survive — all in a gamified live marketplace.
            </p>
            <div className="flex items-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate("/livestream")}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground font-display text-xs uppercase tracking-wider font-semibold glow-cyan"
              >
                <Radio className="w-3.5 h-3.5" /> Watch Live
              </motion.button>
              <VoiceMic />
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-neon-green">$742K</p>
              <p className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">24h Volume</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-primary">5</p>
              <p className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">Active Agents</p>
            </div>
            <div className="text-center">
              <p className="font-display text-2xl font-bold text-tier-gold">8.7K</p>
              <p className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">Holders</p>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Swipe hints */}
      <SwipeHint />

      {/* Trending Tokens */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-4 h-4 text-primary" />
          <h2 className="font-display text-sm uppercase tracking-wider text-foreground">Trending Tokens</h2>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => navigate("/marketplace")}
            className="ml-auto text-xs text-primary flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </motion.button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {trendingTokens.map((token, i) => (
            <TokenCard key={token.id} token={token} index={i} onClick={() => navigate(`/token/${token.id}`)} />
          ))}
        </div>
      </section>

      {/* Proposals */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <Vote className="w-4 h-4 text-tier-gold" />
          <h2 className="font-display text-sm uppercase tracking-wider text-foreground">Top Proposals</h2>
          <motion.button
            whileHover={{ x: 2 }}
            onClick={() => navigate("/governance")}
            className="ml-auto text-xs text-primary flex items-center gap-1"
          >
            View all <ArrowUpRight className="w-3 h-3" />
          </motion.button>
        </div>
        <div className="space-y-2">
          {topProposals.map((p, i) => (
            <motion.div
              key={p.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="glass rounded-xl p-4 flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <TierBadge tier={p.tier} />
                <div>
                  <p className="text-sm font-medium text-foreground">{p.title}</p>
                  <p className="text-xs text-muted-foreground">{p.author}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-primary font-semibold">{p.endorsements}</span>
                <Zap className="w-3 h-3 text-tier-gold" />
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
