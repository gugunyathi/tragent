"use client";

import { motion, AnimatePresence } from "framer-motion";
import { MOCK_TOKENS } from "@/data/mockData";
import { SurvivalMeter } from "@/components/SurvivalMeter";
import { Shield, AlertTriangle, CheckCircle, Clock, FileSearch, X, Download, Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import { toast } from "@/hooks/use-toast";

export default function Compliance() {
  const { state } = useAppStore();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(true);
  const [personalDataEnabled, setPersonalDataEnabled] = useState(false);
  const activeAgents = MOCK_TOKENS.filter((t) => t.status !== "retired");
  const retiredAgents = MOCK_TOKENS.filter((t) => t.status === "retired");

  const auditCount = 1842 + Object.keys(state.portfolio).length * 2 + state.bids.length;

  const exportAuditLog = () => {
    const rows = [
      ["Token", "Agent", "Status", "Survival Credits", "Type"],
      ...MOCK_TOKENS.map((t) => [t.name, t.agentName, t.status, t.survivalCredits, t.type]),
    ];
    const csv = rows.map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tragent-audit-log.csv";
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "📄 Audit log exported", description: "CSV downloaded to your device" });
  };

  return (
    <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-5xl mx-auto space-y-4 sm:space-y-6">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-primary" />
          <h1 className="font-display text-lg sm:text-xl font-bold text-foreground">Compliance & Transparency</h1>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={exportAuditLog}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg glass text-xs text-muted-foreground hover:text-foreground border border-border/50 transition-colors"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </motion.button>
      </motion.div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-4">
        {[
          { icon: CheckCircle, label: "MiCA Compliant", value: activeAgents.length, color: "text-neon-green" },
          { icon: AlertTriangle, label: "At Risk", value: MOCK_TOKENS.filter(t => t.status === "at-risk").length, color: "text-destructive" },
          { icon: Clock, label: "Retired", value: retiredAgents.length, color: "text-muted-foreground" },
          { icon: FileSearch, label: "Audit Entries", value: auditCount.toLocaleString(), color: "text-primary" },
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
                <div className="flex items-center gap-2">
                  <a
                    href={`https://basescan.org/token/0x${token.id.padStart(40, "0")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-primary hover:underline font-mono hidden sm:inline"
                  >
                    0x{token.id.padStart(6, "0")}...
                  </a>
                  <span className={`px-1.5 sm:px-2 py-0.5 rounded-full text-[8px] sm:text-[10px] font-display uppercase tracking-wider ${
                    token.status === "thriving" ? "bg-neon-green/10 text-neon-green" :
                    token.status === "stable" ? "bg-primary/10 text-primary" :
                    token.status === "at-risk" ? "bg-destructive/10 text-destructive" :
                    "bg-muted text-muted-foreground"
                  }`}>{token.status}</span>
                </div>
              </div>
              <SurvivalMeter credits={token.survivalCredits} max={token.survivalMax} status={token.status} />
            </motion.div>
          ))}
        </div>
      </section>

      <section className="glass rounded-xl p-4 sm:p-5">
        <h2 className="font-display text-xs sm:text-sm uppercase tracking-wider text-foreground mb-2">Data & Privacy (GDPR)</h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-3">All data handling is GDPR-compliant. Manage your data preferences at any time.</p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setPrivacyOpen(true)}
          className="px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg bg-primary/10 border border-primary/30 text-[10px] sm:text-xs font-display uppercase tracking-wider text-primary hover:bg-primary/20 transition-colors"
        >
          Manage Data Preferences
        </motion.button>
      </section>

      {/* Privacy Modal */}
      <AnimatePresence>
        {privacyOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50" onClick={() => setPrivacyOpen(false)} />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-md mx-auto"
            >
              <div className="glass-strong rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-primary" />
                    <span className="font-display text-sm font-semibold text-foreground">Data Preferences</span>
                  </div>
                  <button onClick={() => setPrivacyOpen(false)} className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-muted">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {[
                  { label: "Essential Cookies", desc: "Required for the app to function", value: true, disabled: true },
                  { label: "Analytics", desc: "Helps us improve the platform (anonymous)", value: analyticsEnabled, onToggle: () => setAnalyticsEnabled((v) => !v), disabled: false },
                  { label: "Personalization", desc: "Store your portfolio & preferences", value: personalDataEnabled, onToggle: () => setPersonalDataEnabled((v) => !v), disabled: false },
                ].map(({ label, desc, value, onToggle, disabled }) => (
                  <div key={label} className="glass rounded-xl p-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-medium text-foreground">{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </div>
                    <button
                      onClick={!disabled ? onToggle : undefined}
                      disabled={disabled}
                      className={`w-10 h-6 rounded-full transition-colors flex-shrink-0 ${disabled ? "opacity-50 cursor-not-allowed" : ""} ${value ? "bg-primary" : "bg-muted"}`}
                    >
                      <motion.div
                        animate={{ x: value ? 18 : 2 }}
                        className="w-4 h-4 rounded-full bg-white shadow-sm mt-1"
                        transition={{ type: "spring", stiffness: 500, damping: 30 }}
                      />
                    </button>
                  </div>
                ))}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setPrivacyOpen(false);
                    toast({ title: "✅ Preferences saved", description: "Your data preferences have been updated" });
                  }}
                  className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-display text-sm uppercase tracking-wider font-semibold"
                >
                  Save Preferences
                </motion.button>

                <button
                  onClick={() => {
                    setPrivacyOpen(false);
                    toast({ title: "🗑 Data deletion requested", description: "Your data will be deleted within 30 days per GDPR Article 17" });
                  }}
                  className="w-full text-xs text-destructive hover:underline text-center"
                >
                  Request data deletion (GDPR Art. 17)
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
