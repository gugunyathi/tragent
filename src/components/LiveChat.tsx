import { motion } from "framer-motion";
import { MOCK_CHAT } from "@/data/mockData";
import { TierBadge } from "./TierBadge";
import { MessageSquare } from "lucide-react";

export function LiveChat() {
  return (
    <div className="glass rounded-xl p-4 flex flex-col h-full max-h-80">
      <div className="flex items-center gap-2 mb-3">
        <MessageSquare className="w-4 h-4 text-primary" />
        <span className="font-display text-xs uppercase tracking-wider text-primary">Live Chat</span>
        <span className="ml-auto w-2 h-2 rounded-full bg-neon-green animate-pulse-glow" />
      </div>
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">
        {MOCK_CHAT.map((msg, i) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="text-sm"
          >
            <span className="inline-flex items-center gap-1">
              <TierBadge tier={msg.tier} />
              <span className="font-semibold text-foreground">{msg.user}</span>
            </span>
            <span className="text-muted-foreground ml-1">{msg.message}</span>
            <span className="text-xs text-muted-foreground/50 ml-2">{msg.timestamp}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
