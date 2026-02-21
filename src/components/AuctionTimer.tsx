import { motion, AnimatePresence } from "framer-motion";
import { Timer, Gavel, X, DollarSign, TrendingUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import { toast } from "@/hooks/use-toast";

const AUCTION_ID = "nova-launch-auction-1";
const INITIAL_PRICE = 42.50;
const INITIAL_BIDDERS = 12;

export function AuctionTimer() {
  const { state, bid } = useAppStore();
  const [seconds, setSeconds] = useState(347);
  const [bidOpen, setBidOpen] = useState(false);
  const [bidInput, setBidInput] = useState("");
  const [bidderCount, setBidderCount] = useState(INITIAL_BIDDERS);

  // Find the user's current bid for this auction
  const userBid = state.bids.find((b) => b.auctionId === AUCTION_ID);
  // Simulated current bid: user's bid or initial price
  const currentBid = userBid ? Math.max(userBid.amount, INITIAL_PRICE) : INITIAL_PRICE;
  const minNextBid = +(currentBid + 0.5).toFixed(2);

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  const isUrgent = seconds < 60;

  const handleBid = () => {
    const amount = parseFloat(bidInput);
    if (isNaN(amount) || amount < minNextBid) {
      toast({
        title: "Invalid bid",
        description: `Minimum bid is $${minNextBid}`,
        variant: "destructive",
      });
      return;
    }
    if (amount > state.walletBalance) {
      toast({
        title: "Insufficient funds",
        description: `Your balance is $${state.walletBalance.toFixed(2)}`,
        variant: "destructive",
      });
      return;
    }
    bid(AUCTION_ID, amount);
    setBidderCount((n) => (userBid ? n : n + 1)); // only increment if new bidder
    setBidOpen(false);
    setBidInput("");
    toast({
      title: "🔨 Bid placed!",
      description: `You bid $${amount.toFixed(2)} on NOVA token auction`,
    });
  };

  return (
    <>
      <motion.div
        className="glass rounded-xl p-4"
        animate={{
          boxShadow: isUrgent
            ? [
                "0 0 0px hsl(0 80% 55% / 0)",
                "0 0 20px hsl(0 80% 55% / 0.3)",
                "0 0 0px hsl(0 80% 55% / 0)",
              ]
            : undefined,
        }}
        transition={{ duration: 1.5, repeat: Infinity }}
      >
        <div className="flex items-center gap-2 mb-2">
          <Gavel className="w-4 h-4 text-tier-gold" />
          <span className="font-display text-xs uppercase tracking-wider text-tier-gold">Live Auction</span>
          {isUrgent && (
            <span className="ml-auto text-[9px] font-display text-destructive uppercase tracking-wider animate-pulse">
              Ending soon
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 mb-2">
          <Timer className={`w-5 h-5 ${isUrgent ? "text-destructive" : "text-primary"}`} />
          <span className={`font-display text-2xl tabular-nums ${isUrgent ? "text-destructive" : "text-foreground"}`}>
            {seconds === 0 ? "ENDED" : `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
          <span>
            Current bid:{" "}
            <span className="text-primary font-semibold">${currentBid.toFixed(2)}</span>
          </span>
          <span>{bidderCount} bidders</span>
        </div>

        {userBid && (
          <div className="flex items-center gap-1 text-[10px] text-neon-green mb-2">
            <TrendingUp className="w-3 h-3" />
            <span>Your bid: ${userBid.amount.toFixed(2)}</span>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          disabled={seconds === 0}
          onClick={() => {
            setBidInput(String(minNextBid));
            setBidOpen(true);
          }}
          className="mt-1 w-full py-2 rounded-lg bg-gradient-to-r from-tier-gold to-accent text-accent-foreground font-display text-xs uppercase tracking-wider font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {userBid ? "Raise Bid" : "Place Bid"}
        </motion.button>
      </motion.div>

      {/* Bid modal */}
      <AnimatePresence>
        {bidOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
              onClick={() => setBidOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-x-4 top-1/2 -translate-y-1/2 z-50 max-w-sm mx-auto"
            >
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Gavel className="w-4 h-4 text-tier-gold" />
                    <span className="font-display text-sm font-semibold text-foreground">Place Bid</span>
                  </div>
                  <button
                    onClick={() => setBidOpen(false)}
                    className="w-7 h-7 rounded-lg glass flex items-center justify-center hover:bg-muted"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="glass rounded-lg p-3 text-sm">
                    <div className="flex justify-between text-xs text-muted-foreground mb-1">
                      <span>Current highest bid</span>
                      <span>Min next bid</span>
                    </div>
                    <div className="flex justify-between font-semibold text-foreground">
                      <span>${currentBid.toFixed(2)}</span>
                      <span className="text-primary">${minNextBid.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <input
                      type="number"
                      value={bidInput}
                      onChange={(e) => setBidInput(e.target.value)}
                      step="0.01"
                      min={minNextBid}
                      placeholder={`Min $${minNextBid}`}
                      className="w-full pl-9 pr-3 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-tier-gold/50"
                      autoFocus
                      onKeyDown={(e) => e.key === "Enter" && handleBid()}
                    />
                  </div>

                  <p className="text-[10px] text-muted-foreground">
                    Balance: <span className="text-foreground">${state.walletBalance.toFixed(2)}</span>
                  </p>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBid}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-tier-gold to-accent text-accent-foreground font-display text-sm uppercase tracking-wider font-semibold"
                  >
                    Confirm Bid
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
