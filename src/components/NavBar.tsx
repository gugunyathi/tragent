"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Radio, Store, Vote, Shield, Wallet, Bot } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import { motion } from "framer-motion";
import { TierBadge } from "./TierBadge";

const links = [
  { href: "/", icon: Radio, label: "Live" },
  { href: "/marketplace", icon: Store, label: "Market" },
  { href: "/agents", icon: Bot, label: "Agents" },
  { href: "/governance", icon: Vote, label: "Govern" },
  { href: "/compliance", icon: Shield, label: "Audit" },
  { href: "/dashboard", icon: Home, label: "Dashboard" },
];

export function NavBar() {
  const pathname = usePathname();
  const { state } = useAppStore();

  return (
    <>
      {/* Top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
        <div className="max-w-7xl mx-auto px-3 sm:px-4 h-12 sm:h-14 flex items-center justify-between">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <motion.span
              className="font-display text-base sm:text-lg font-bold text-primary text-glow-cyan"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              CONWAY
            </motion.span>
            <span className="text-[8px] sm:text-[10px] text-muted-foreground font-display tracking-widest">LIVE</span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {links.map(({ href, icon: Icon, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Right side */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="hidden sm:inline-flex"><TierBadge tier="platinum" showLabel /></span>
            <span className="sm:hidden"><TierBadge tier="platinum" /></span>
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="flex items-center gap-1 sm:gap-1.5 text-[10px] sm:text-xs glass rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                <Wallet className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-primary" />
                <span className="text-foreground font-semibold">${state.walletBalance.toFixed(0)}</span>
                <span className="text-muted-foreground hidden sm:inline">USDC</span>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-[10px] text-xs glass rounded-full px-2 sm:px-3 py-1 sm:py-1.5">
                <span className="text-tier-gold font-semibold">{state.scCredits.toLocaleString("en-US")}</span>
                <span className="text-muted-foreground">SC</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Bottom mobile/tablet nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 glass-strong border-t border-border flex items-center justify-around py-1.5 sm:py-2 safe-area-bottom">
        {links.map(({ href, icon: Icon, label }) => {
          const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center gap-0.5 text-[10px] sm:text-xs transition-colors px-2 py-1 ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`}
            >
              <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
