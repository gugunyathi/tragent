import { NavLink } from "react-router-dom";
import { Home, Radio, Store, Vote, Shield, Wallet } from "lucide-react";
import { motion } from "framer-motion";
import { TierBadge } from "./TierBadge";

const links = [
  { to: "/", icon: Home, label: "Home" },
  { to: "/livestream", icon: Radio, label: "Live" },
  { to: "/marketplace", icon: Store, label: "Market" },
  { to: "/governance", icon: Vote, label: "Govern" },
  { to: "/compliance", icon: Shield, label: "Audit" },
];

export function NavBar() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-strong">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <motion.span
            className="font-display text-lg font-bold text-primary text-glow-cyan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            CONWAY
          </motion.span>
          <span className="text-[10px] text-muted-foreground font-display tracking-widest">LIVE</span>
        </div>

        {/* Nav links - desktop */}
        <nav className="hidden md:flex items-center gap-1">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  isActive ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground"
                }`
              }
            >
              <Icon className="w-3.5 h-3.5" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <TierBadge tier="platinum" showLabel />
          <div className="flex items-center gap-1.5 text-xs glass rounded-full px-3 py-1.5">
            <Wallet className="w-3.5 h-3.5 text-primary" />
            <span className="text-foreground font-semibold">8,200</span>
            <span className="text-muted-foreground">SC</span>
          </div>
        </div>
      </div>

      {/* Mobile nav */}
      <nav className="md:hidden flex items-center justify-around border-t border-border py-1.5">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex flex-col items-center gap-0.5 text-[10px] transition-colors ${
                isActive ? "text-primary" : "text-muted-foreground"
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
