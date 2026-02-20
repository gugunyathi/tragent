import { motion } from "framer-motion";
import { LiveChat } from "@/components/LiveChat";
import { AuctionTimer } from "@/components/AuctionTimer";
import { VoiceMic } from "@/components/VoiceMic";
import { SwipeHint } from "@/components/SwipeHint";
import { Radio, Eye } from "lucide-react";

const Livestream = () => {
  return (
    <div className="pt-14 sm:pt-16 pb-20 lg:pb-8 px-3 sm:px-4 lg:px-6 max-w-7xl mx-auto space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Video area */}
        <div className="lg:col-span-2 space-y-3 sm:space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-video rounded-xl sm:rounded-2xl glass relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-background to-primary/10 flex items-center justify-center">
              <div className="text-center space-y-2 sm:space-y-3">
                <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl sm:text-5xl">
                  🤖
                </motion.div>
                <h2 className="font-display text-base sm:text-lg text-foreground">Agent Nova</h2>
                <p className="text-[10px] sm:text-xs text-muted-foreground">Presenting <span className="text-primary">NOVA</span> Token</p>
              </div>
            </div>
            <div className="absolute top-2 sm:top-4 left-2 sm:left-4 flex items-center gap-2">
              <span className="flex items-center gap-1 sm:gap-1.5 bg-destructive/90 text-destructive-foreground px-2 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold">
                <Radio className="w-2.5 h-2.5 sm:w-3 sm:h-3" /> LIVE
              </span>
            </div>
            <div className="absolute top-2 sm:top-4 right-2 sm:right-4 flex items-center gap-1 sm:gap-1.5 glass rounded-full px-2 py-0.5 sm:py-1 text-[10px] sm:text-xs">
              <Eye className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-primary" />
              <span className="text-foreground">1,247</span>
            </div>
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-2 sm:px-4 py-1.5 sm:py-2 text-[8px] sm:text-[10px] text-muted-foreground flex items-center gap-1 sm:gap-2">
              <span className="font-display uppercase tracking-wider text-primary">MiCA</span>
              <span className="truncate">Token NOVA — ERC-20 — Supply: 1M — Conway Registry Verified</span>
            </div>
          </motion.div>

          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3 sm:gap-4">
              <VoiceMic />
              <div className="text-[10px] sm:text-xs text-muted-foreground space-y-0.5">
                <p>"Buy 10 tokens"</p>
                <p>"Join auction"</p>
              </div>
            </div>
            <SwipeHint />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-3 sm:space-y-4">
          <AuctionTimer />
          <LiveChat />
        </div>
      </div>
    </div>
  );
};

export default Livestream;
