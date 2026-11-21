import Link from "next/link";
import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

type Props = {
  points: number;
  compact?: boolean;
  className?: string;
};

export const PointsPill = ({ points, compact, className }: Props) => (
  <Link
    href="/points-history"
    className={cn(
      "flex items-center gap-2 rounded-xl border border-border bg-surface py-1.5 pr-4 pl-1.5 shadow-card transition-colors hover:border-black/15",
      compact && "py-1 pr-3 pl-1",
      className,
    )}
  >
    <span className="grid size-7 place-items-center rounded-full bg-brandSoft text-brand">
      <Star className="size-3.5" strokeWidth={2.25} />
    </span>
    <span className="flex flex-col leading-none">
      {!compact && (
        <span className="text-[10px] text-textMuted">Your points</span>
      )}
      <span className="text-sm font-bold text-textPrimary tabular-nums">
        {points.toLocaleString()} pts
      </span>
    </span>
  </Link>
);
