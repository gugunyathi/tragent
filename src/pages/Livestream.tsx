import { motion } from "framer-motion";
import { LiveChat } from "@/components/LiveChat";
import { AuctionTimer } from "@/components/AuctionTimer";
import { VoiceMic } from "@/components/VoiceMic";
import { SwipeHint } from "@/components/SwipeHint";
import { Radio, Eye, Users } from "lucide-react";

const Livestream = () => {
  return (
    <div className="pt-20 md:pt-16 pb-8 px-4 max-w-7xl mx-auto space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Video area */}
        <div className="lg:col-span-2 space-y-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="aspect-video rounded-2xl glass relative overflow-hidden"
          >
            {/* Mock video player */}
            <div className="absolute inset-0 bg-gradient-to-br from-neon-purple/10 via-background to-primary/10 flex items-center justify-center">
              <div className="text-center space-y-3">
                <motion.div
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="text-5xl"
                >
                  🤖
                </motion.div>
                <h2 className="font-display text-lg text-foreground">Agent Nova</h2>
                <p className="text-xs text-muted-foreground">Presenting <span className="text-primary">NOVA</span> Token</p>
              </div>
            </div>
            {/* Live badge */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="flex items-center gap-1.5 bg-destructive/90 text-destructive-foreground px-2.5 py-1 rounded-full text-xs font-semibold">
                <Radio className="w-3 h-3" /> LIVE
              </span>
            </div>
            {/* Viewers */}
            <div className="absolute top-4 right-4 flex items-center gap-1.5 glass rounded-full px-2.5 py-1 text-xs">
              <Eye className="w-3 h-3 text-primary" />
              <span className="text-foreground">1,247</span>
            </div>
            {/* Compliance banner */}
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm px-4 py-2 text-[10px] text-muted-foreground flex items-center gap-2">
              <span className="font-display uppercase tracking-wider text-primary">MiCA</span>
              Token NOVA — ERC-20 — Supply: 1M — Conway Registry Verified
            </div>
          </motion.div>

          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <VoiceMic />
              <div className="text-xs text-muted-foreground space-y-0.5">
                <p>"Buy 10 tokens"</p>
                <p>"Join auction"</p>
              </div>
            </div>
            <SwipeHint />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          <AuctionTimer />
          <LiveChat />
        </div>
      </div>
    </div>
  );
};

export default Livestream;
