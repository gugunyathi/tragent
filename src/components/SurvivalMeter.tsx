import { motion } from "framer-motion";
import { formatNumber } from "@/lib/utils";

interface SurvivalMeterProps {
  credits: number;
  max: number;
  status: "thriving" | "stable" | "at-risk" | "retired";
  compact?: boolean;
}

const statusStyles = {
  thriving: "from-neon-green to-neon-cyan",
  stable: "from-neon-cyan to-neon-purple",
  "at-risk": "from-tier-gold to-destructive",
  retired: "from-muted-foreground to-muted",
};

const statusGlow = {
  thriving: "shadow-[0_0_12px_hsl(150_100%_50%/0.4)]",
  stable: "shadow-[0_0_12px_hsl(185_100%_50%/0.3)]",
  "at-risk": "shadow-[0_0_12px_hsl(0_80%_55%/0.4)]",
  retired: "",
};

export function SurvivalMeter({ credits, max, status, compact }: SurvivalMeterProps) {
  const pct = Math.min((credits / max) * 100, 100);

  return (
    <div className={compact ? "w-full" : "w-full space-y-1"}>
      {!compact && (
        <div className="flex justify-between text-xs text-muted-foreground">
          <span className="font-display uppercase tracking-wider">Survival</span>
          <span>{formatNumber(credits)} / {formatNumber(max)}</span>
        </div>
      )}
      <div className="h-2 rounded-full bg-muted overflow-hidden">
        <motion.div
          className={`h-full rounded-full bg-gradient-to-r ${statusStyles[status]} ${statusGlow[status]}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}
