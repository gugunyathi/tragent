import { TIER_BADGES, TIER_COLORS } from "@/data/mockData";

interface TierBadgeProps {
  tier: "bronze" | "gold" | "platinum" | "diamond";
  showLabel?: boolean;
}

export function TierBadge({ tier, showLabel }: TierBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 ${TIER_COLORS[tier]}`}>
      <span>{TIER_BADGES[tier]}</span>
      {showLabel && <span className="font-display text-xs uppercase tracking-wider">{tier}</span>}
    </span>
  );
}
