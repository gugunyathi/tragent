import { motion } from "framer-motion";
import { Timer, Gavel } from "lucide-react";
import { useState, useEffect } from "react";

export function AuctionTimer() {
  const [seconds, setSeconds] = useState(347);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;

  return (
    <motion.div
      className="glass rounded-xl p-4"
      animate={{ boxShadow: seconds < 60 ? [
        "0 0 0px hsl(0 80% 55% / 0)",
        "0 0 20px hsl(0 80% 55% / 0.3)",
        "0 0 0px hsl(0 80% 55% / 0)",
      ] : undefined }}
      transition={{ duration: 1.5, repeat: Infinity }}
    >
      <div className="flex items-center gap-2 mb-2">
        <Gavel className="w-4 h-4 text-tier-gold" />
        <span className="font-display text-xs uppercase tracking-wider text-tier-gold">Live Auction</span>
      </div>
      <div className="flex items-center gap-3">
        <Timer className="w-5 h-5 text-primary" />
        <span className="font-display text-2xl text-foreground tabular-nums">
          {String(mins).padStart(2, "0")}:{String(secs).padStart(2, "0")}
        </span>
      </div>
      <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
        <span>Current bid: <span className="text-primary font-semibold">$42.50</span></span>
        <span>12 bidders</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="mt-3 w-full py-2 rounded-lg bg-gradient-to-r from-tier-gold to-accent text-accent-foreground font-display text-xs uppercase tracking-wider font-semibold"
      >
        Place Bid
      </motion.button>
    </motion.div>
  );
}
