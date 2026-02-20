import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useState } from "react";

export function VoiceMic() {
  const [active, setActive] = useState(false);

  return (
    <div className="relative">
      <AnimatePresence>
        {active && (
          <>
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="absolute inset-0 rounded-full border border-primary/30"
                initial={{ scale: 1, opacity: 0.6 }}
                animate={{ scale: 1.5 + i * 0.4, opacity: 0 }}
                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
              />
            ))}
          </>
        )}
      </AnimatePresence>
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setActive(!active)}
        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          active ? "bg-primary text-primary-foreground glow-cyan" : "glass text-muted-foreground hover:text-foreground"
        }`}
      >
        {active ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </motion.button>
      {active && (
        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] text-primary whitespace-nowrap font-display tracking-wider"
        >
          Listening...
        </motion.p>
      )}
    </div>
  );
}
