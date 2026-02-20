import { motion } from "framer-motion";
import { ArrowRight, ArrowLeft, ArrowUp, ArrowDown } from "lucide-react";

const gestures = [
  { icon: ArrowRight, label: "Buy", color: "text-neon-green" },
  { icon: ArrowLeft, label: "Sell", color: "text-destructive" },
  { icon: ArrowUp, label: "Details", color: "text-primary" },
  { icon: ArrowDown, label: "Watchlist", color: "text-tier-gold" },
];

export function SwipeHint() {
  return (
    <div className="flex items-center gap-4 justify-center">
      {gestures.map(({ icon: Icon, label, color }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 + i * 0.1 }}
          className="flex flex-col items-center gap-1"
        >
          <div className={`w-8 h-8 rounded-full glass flex items-center justify-center ${color}`}>
            <Icon className="w-3.5 h-3.5" />
          </div>
          <span className="text-[10px] text-muted-foreground font-display uppercase tracking-wider">{label}</span>
        </motion.div>
      ))}
    </div>
  );
}
