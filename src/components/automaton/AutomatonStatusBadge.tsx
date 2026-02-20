"use client";

import { motion } from "framer-motion";
import { Activity, Wifi, WifiOff, AlertTriangle, Clock } from "lucide-react";
import type { ConwayAutomatonAPI } from "@/lib/automaton/types";
import type { AgentStatus } from "@/lib/automaton/types";

const STATUS_CONFIG: Record<AgentStatus, { label: string; color: string; dot: string }> = {
  running:      { label: "Running",      color: "text-neon-green",  dot: "bg-neon-green" },
  waking:       { label: "Waking",       color: "text-tier-gold",   dot: "bg-tier-gold" },
  sleeping:     { label: "Sleeping",     color: "text-primary",     dot: "bg-primary" },
  low_compute:  { label: "Low Compute",  color: "text-tier-gold",   dot: "bg-tier-gold" },
  critical:     { label: "Critical",     color: "text-destructive", dot: "bg-destructive" },
  dead:         { label: "Dead",         color: "text-muted-foreground", dot: "bg-muted-foreground" },
  setup:        { label: "Setting Up",   color: "text-neon-purple", dot: "bg-neon-purple" },
};

interface AutomatonStatusBadgeProps {
  runtime?: ConwayAutomatonAPI;
  status: AgentStatus;
  compact?: boolean;
}

export function AutomatonStatusBadge({ runtime, status, compact }: AutomatonStatusBadgeProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.setup;

  if (compact) {
    return (
      <span className="flex items-center gap-1.5">
        <motion.span
          className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`}
          animate={status === "running" ? { opacity: [1, 0.3, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <span className={`text-[10px] font-display uppercase tracking-wider ${cfg.color}`}>
          {cfg.label}
        </span>
      </span>
    );
  }

  return (
    <div className="glass rounded-xl p-3 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground font-display uppercase tracking-wider">
          Conway Runtime
        </span>
        {runtime ? (
          <Wifi className="w-3 h-3 text-neon-green" />
        ) : (
          <WifiOff className="w-3 h-3 text-muted-foreground" />
        )}
      </div>

      <div className="flex items-center gap-2">
        <motion.span
          className={`w-2 h-2 rounded-full ${cfg.dot}`}
          animate={status === "running" ? { opacity: [1, 0.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        />
        <span className={`text-sm font-semibold ${cfg.color}`}>{cfg.label}</span>
      </div>

      {runtime && (
        <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Activity className="w-3 h-3" />
            <span>${(runtime.credits / 100).toFixed(2)} credits</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>{runtime.turnCount} turns</span>
          </div>
        </div>
      )}

      {status === "critical" && (
        <div className="flex items-center gap-1 text-xs text-destructive">
          <AlertTriangle className="w-3 h-3" />
          <span>Agent needs funding to survive</span>
        </div>
      )}
      {status === "dead" && (
        <div className="flex items-center gap-1 text-xs text-muted-foreground">
          <AlertTriangle className="w-3 h-3" />
          <span>Agent has terminated — out of credits</span>
        </div>
      )}
    </div>
  );
}
