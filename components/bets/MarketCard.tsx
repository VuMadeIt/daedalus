"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { BetSide } from "@/config/betting";
import { cn } from "@/lib/utils";

import { PlaceBetDialog } from "./PlaceBetDialog";

export type MarketCardData = {
  id: string;
  question: string;
  status: string;
  outcome: string | null;
  yesPool: number;
  noPool: number;
  betCount: number;
};

export function marketStatus(m: Pick<MarketCardData, "status" | "outcome">) {
  if (m.status === "resolved")
    return { label: m.outcome === "refund" ? "Refunded" : `Settled ${m.outcome?.toUpperCase()}`, tone: "bg-backgroundMuted text-textSecondary" };
  if (m.status === "closed") return { label: "Closed", tone: "bg-goldSoft text-goldInk" };
  return { label: "Live", tone: "bg-mint text-success" };
}

export function yesShare(m: Pick<MarketCardData, "yesPool" | "noPool">) {
  const total = m.yesPool + m.noPool;
  return total === 0 ? 50 : Math.round((m.yesPool / total) * 100);
}

export function MarketCard({ market, points }: { market: MarketCardData; points: number }) {
  const [side, setSide] = useState<BetSide | null>(null);
  const open = market.status === "open";
  const yes = yesShare(market);
  const leader = yes === 50 ? "Even split" : yes > 50 ? "YES leads" : "NO leads";
  const status = marketStatus(market);

  return (
    <article className="group flex flex-col gap-4 rounded-2xl border border-border bg-surface p-5 shadow-card transition-shadow hover:shadow-float sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className={cn("rounded-full px-2 py-0.5 font-medium", status.tone)}>{status.label}</span>
          <span className="text-textMuted">
            {market.betCount} {market.betCount === 1 ? "bet" : "bets"} · {market.yesPool + market.noPool} pts in the pool
          </span>
        </div>
        <Link
          href={`/bets/${market.id}`}
          className="mt-2 flex items-center gap-1 text-base font-bold text-textPrimary hover:text-primary"
        >
          {market.question}
          <ChevronRight className="size-4 shrink-0 text-textMuted transition-transform group-hover:translate-x-0.5" />
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="w-10 text-sm font-bold text-primary tabular-nums">{yes}%</span>
          <div className="h-2 flex-1 overflow-hidden rounded-full bg-backgroundMuted" aria-hidden>
            <div className="h-full rounded-full bg-primary transition-[width] duration-500" style={{ width: `${yes}%` }} />
          </div>
          <span className="w-20 text-right text-xs text-textMuted">{leader}</span>
        </div>
      </div>
      {open && (
        <div className="flex gap-2 sm:w-28 sm:flex-col">
          <button
            type="button"
            onClick={() => setSide("yes")}
            className="flex-1 rounded-lg bg-primary px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-primaryDark"
          >
            YES
          </button>
          <button
            type="button"
            onClick={() => setSide("no")}
            className="flex-1 rounded-lg bg-backgroundMuted px-4 py-2 text-sm font-bold text-textPrimary transition-colors hover:bg-border"
          >
            NO
          </button>
        </div>
      )}
      {side && (
        <PlaceBetDialog market={market} points={points} side={side} open onOpenChange={(v) => !v && setSide(null)} />
      )}
    </article>
  );
}
