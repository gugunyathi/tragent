"use client";

import { motion } from "framer-motion";
import { MOCK_TOKENS } from "@/data/mockData";
import { SurvivalMeter } from "@/components/SurvivalMeter";
import { Shield, AlertTriangle, CheckCircle, Clock, FileSearch } from "lucide-react";

export default function Compliance() {
  const activeAgents = MOCK_TOKENS.filter((t) => t.status !== "retired");
  const retiredAgents = MOCK_TOKENS.filter((t) => t.status === "retired");

  return (
    <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-5xl mx-auto space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-2">
        <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
        <h1 className="font-display text-lg sm:text-xl font-bold text-foreground">Compliance & Transparency</h1>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {[
          { icon: CheckCircle, label: "MiCA Compliant", value: activeAgents.length, color: "text-neon-green" },
          { icon: AlertTriangle, label: "At Risk", value: MOCK_TOKENS.filter(t => t.status === "at-risk").length, color: "text-destructive" },
          { icon: Clock, label: "Retired", value: retiredAgents.length, color: "text-muted-foreground" },
          { icon: FileSearch, label: "Audit Entries", value: "1,842", color: "text-primary" },
        ].map(({ icon: Icon, label, value, color }, i) => (
          <motion.div key={label} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="glass rounded-xl p-3 sm:p-4 text-center">
            <Icon className={`w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto mb-1 ${color}`} />
            <p className="text-lg sm:text-xl font-bold text-foreground">{value}</p>
            <p className="text-[8px] sm:text-[10px] text-muted-foreground font-display uppercase tracking-wider">{label}</p>
          </motion.div>
        ))}
      </div>

      <section>
        <h2 className="font-display text-xs sm:text-sm uppercase tracking-wider text-foreground mb-3">Agent Survival Status</h2>
        <div className="space-y-2 sm:space-y-3">
          {MOCK_TOKENS.map((token, i) => (
            <motion.div key={token.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }} className="glass rounded-xl p-3 sm:p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 sm:gap-3">
                  <span className="text-xl sm:text-2xl">{token.agentAvatar}</span>
                  <div>
                    <p className="text-xs sm:text-sm font-medium text-foreground">{token.agentName}</p>
                    <p className="text-[10px] sm:text-xs text-muted-foreground">{token.symbol} • {token.type}</p>
                  </div>
                </div>
                <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-display uppercase tracking-wider ${
                  token.status === "thriving" ? "bg-neon-green/10 text-neon-green" :
                  token.status === "stable" ? "bg-primary/10 text-primary" :
                  token.status === "at-risk" ? "bg-destructive/10 text-destructive" :
                  "bg-muted text-muted-foreground"
                }`}>{token.status}</span>
              </div>
              <SurvivalMeter credits={token.survivalCredits} max={token.survivalMax} status={token.status} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="glass rounded-xl p-4 sm:p-5">
        <h2 className="font-display text-xs sm:text-sm uppercase tracking-wider text-foreground mb-2">Data & Privacy (GDPR)</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3">All data handling is GDPR-compliant. You can opt out of data collection at any time.</p>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg glass text-[10px] sm:text-xs font-display uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors">
          Manage Data Preferences
        </motion.button>
      </section>
    </div>
  );
}
