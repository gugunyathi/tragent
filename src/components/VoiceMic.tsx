import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

interface VoiceMicProps {
  /** Called with the final transcript when speech ends */
  onTranscript?: (text: string) => void;
}

// Extend Window for webkit prefix
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function VoiceMic({ onTranscript }: VoiceMicProps) {
  const [active, setActive] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [supported, setSupported] = useState(true);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const SR = typeof window !== "undefined"
      ? window.SpeechRecognition ?? window.webkitSpeechRecognition
      : null;
    if (!SR) {
      setSupported(false);
      return;
    }

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = true;

    recognition.onresult = (event: any) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const t = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          final += t;
        } else {
          interim += t;
        }
      }
      setTranscript(final || interim);
      if (final) {
        onTranscript?.(final.trim().toLowerCase());
        parseVoiceCommand(final.trim().toLowerCase());
      }
    };

    recognition.onend = () => {
      setActive(false);
    };

    recognition.onerror = (e: any) => {
      if (e.error !== "no-speech") {
        toast({ title: "Voice error", description: e.error, variant: "destructive" });
      }
      setActive(false);
    };

    recognitionRef.current = recognition;
  }, [onTranscript]);

  const parseVoiceCommand = (text: string) => {
    if (text.includes("buy")) {
      toast({ title: "🎤 Voice: Buy detected", description: `"${text}" — opening trade dialog` });
    } else if (text.includes("sell")) {
      toast({ title: "🎤 Voice: Sell detected", description: `"${text}" — opening sell dialog` });
    } else if (text.includes("watchlist") || text.includes("watch")) {
      toast({ title: "🎤 Voice: Watchlist", description: `Added to watchlist` });
    } else if (text.includes("bid")) {
      toast({ title: "🎤 Voice: Bid detected", description: `Opening auction` });
    } else if (text) {
      toast({ title: `🎤 "${text}"`, description: "Command not recognized" });
    }
  };

  const toggle = () => {
    if (!recognitionRef.current) {
      toast({ title: "Voice not supported", description: "Use Chrome or Edge for voice commands", variant: "destructive" });
      return;
    }
    if (active) {
      recognitionRef.current.stop();
      setActive(false);
      setTranscript("");
    } else {
      setTranscript("");
      recognitionRef.current.start();
      setActive(true);
    }
  };

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
        onClick={toggle}
        title={supported ? (active ? "Stop listening" : "Start voice command") : "Voice not supported in this browser"}
        className={`relative z-10 w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
          active
            ? "bg-primary text-primary-foreground glow-cyan"
            : supported
            ? "glass text-muted-foreground hover:text-foreground"
            : "glass text-muted-foreground/40 cursor-not-allowed"
        }`}
      >
        {active ? <Mic className="w-5 h-5" /> : <MicOff className="w-5 h-5" />}
      </motion.button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            className="absolute -bottom-10 left-1/2 -translate-x-1/2 bg-background/90 border border-border rounded-lg px-3 py-1 text-[10px] text-primary whitespace-nowrap font-display tracking-wider max-w-48 truncate z-20"
          >
            {transcript || "Listening..."}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
