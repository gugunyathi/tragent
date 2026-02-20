import { motion } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { MOCK_TOKENS } from "@/data/mockData";
import { SurvivalMeter } from "@/components/SurvivalMeter";
import { VoiceMic } from "@/components/VoiceMic";
import { ArrowLeft, Droplets, Users, BarChart3, Shield, Clock, ArrowUpRight, ArrowDownRight } from "lucide-react";

const TokenDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = MOCK_TOKENS.find((t) => t.id === id);

  if (!token) {
    return (
      <div className="pt-20 px-4 text-center text-muted-foreground">
        Token not found.
        <button onClick={() => navigate("/marketplace")} className="block mx-auto mt-4 text-primary text-sm">Back to marketplace</button>
      </div>
    );
  }

  const isPositive = token.change24h >= 0;

  const auditEntries = [
    { action: "Token Deployed", time: "2026-02-10 09:14", hash: "0xa1b2...c3d4" },
    { action: "Liquidity Added", time: "2026-02-10 09:30", hash: "0xe5f6...g7h8" },
    { action: "First Sale", time: "2026-02-11 14:22", hash: "0xi9j0...k1l2" },
    { action: "Survival Credits +500", time: "2026-02-15 11:08", hash: "0xm3n4...o5p6" },
  ];

  return (
    <div className="pt-20 md:pt-16 pb-8 px-4 max-w-4xl mx-auto space-y-6">
      {/* Back */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        onClick={() => navigate(-1)}
        className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="w-4 h-4" /> Back
      </motion.button>

      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-2xl p-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-neon-pink/5 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center gap-6">
          <div className="flex items-center gap-4">
            <motion.span animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 3, repeat: Infinity }} className="text-5xl">
              {token.agentAvatar}
            </motion.span>
            <div>
              <h1 className="font-display text-2xl font-bold text-foreground">{token.name}</h1>
              <p className="text-muted-foreground text-sm">{token.agentName} • {token.symbol} • {token.type}</p>
            </div>
          </div>
          <div className="flex items-center gap-6 md:ml-auto">
            <div>
              <p className="text-3xl font-bold text-foreground">${token.price.toFixed(2)}</p>
              <p className={`text-sm flex items-center gap-1 ${isPositive ? "text-neon-green" : "text-destructive"}`}>
                {isPositive ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                {Math.abs(token.change24h)}% (24h)
              </p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-display uppercase tracking-wider ${
              token.status === "thriving" ? "bg-neon-green/10 text-neon-green" :
              token.status === "stable" ? "bg-primary/10 text-primary" :
              token.status === "at-risk" ? "bg-destructive/10 text-destructive" :
              "bg-muted text-muted-foreground"
            }`}>
              {token.status}
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { icon: BarChart3, label: "24h Volume", value: `$${(token.volume24h / 1000).toFixed(0)}K`, color: "text-primary" },
          { icon: Droplets, label: "Liquidity", value: `${token.liquidityDepth}%`, color: "text-neon-cyan" },
          { icon: Users, label: "Holders", value: token.holders.toLocaleString(), color: "text-tier-gold" },
          { icon: Shield, label: "Supply", value: token.supply.toLocaleString(), color: "text-neon-purple" },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-xl p-4 text-center"
          >
            <Icon className={`w-4 h-4 mx-auto mb-1 ${color}`} />
            <p className="text-lg font-bold text-foreground">{value}</p>
            <p className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      {/* Survival */}
      <div className="glass rounded-xl p-5">
        <SurvivalMeter credits={token.survivalCredits} max={token.survivalMax} status={token.status} />
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 rounded-xl bg-neon-green/10 text-neon-green font-display text-sm uppercase tracking-wider font-semibold border border-neon-green/20 hover:bg-neon-green/20 transition-colors"
        >
          Buy {token.symbol}
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 py-3 rounded-xl bg-destructive/10 text-destructive font-display text-sm uppercase tracking-wider font-semibold border border-destructive/20 hover:bg-destructive/20 transition-colors"
        >
          Sell {token.symbol}
        </motion.button>
        <VoiceMic />
      </div>

      {/* Audit Log */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <h2 className="font-display text-sm uppercase tracking-wider text-foreground">Audit Log</h2>
        </div>
        <div className="space-y-2">
          {auditEntries.map((entry, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="glass rounded-lg p-3 flex items-center justify-between text-sm"
            >
              <div>
                <span className="text-foreground font-medium">{entry.action}</span>
                <span className="text-muted-foreground text-xs ml-2">{entry.time}</span>
              </div>
              <span className="text-xs text-primary font-mono">{entry.hash}</span>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default TokenDetail;
