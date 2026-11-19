"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import type { BetSide } from "@/config/betting";
import { marketStatus, yesShare } from "@/lib/betting/market";
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

export function MarketCard({
  market,
  points,
}: {
  market: MarketCardData;
  points: number;
}) {
  const [side, setSide] = useState<BetSide | null>(null);
  const open = market.status === "open";
  const yes = yesShare(market);
  const leader =
    yes === 50 ? "Even split" : yes > 50 ? "YES leads" : "NO leads";
  const status = marketStatus(market);

  return (
    <article className="group border-border bg-surface shadow-card hover:shadow-float flex flex-col gap-4 rounded-2xl border p-5 transition-shadow sm:flex-row sm:items-center">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className={cn("rounded-full px-2 py-0.5 font-medium", status.tone)}
          >
            {status.label}
          </span>
          <span className="text-textMuted">
            {market.betCount} {market.betCount === 1 ? "bet" : "bets"} ·{" "}
            {market.yesPool + market.noPool} pts in the pool
          </span>
        </div>
        <Link
          href={`/bets/${market.id}`}
          className="text-textPrimary hover:text-primary mt-2 flex items-center gap-1 text-base font-bold"
        >
          {market.question}
          <ChevronRight className="text-textMuted size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
        </Link>
        <div className="mt-3 flex items-center gap-3">
          <span className="text-primary w-10 text-sm font-bold tabular-nums">
            {yes}%
          </span>
          <div
            className="bg-backgroundMuted h-2 flex-1 overflow-hidden rounded-full"
            aria-hidden
          >
            <div
              className="bg-primary h-full rounded-full transition-[width] duration-500"
              style={{ width: `${yes}%` }}
            />
          </div>
          <span className="text-textMuted w-20 text-right text-xs">
            {leader}
          </span>
        </div>
      </div>
      {open && (
        <div className="flex gap-2 sm:w-28 sm:flex-col">
          <button
            type="button"
            onClick={() => setSide("yes")}
            className="bg-primary hover:bg-primaryDark flex-1 rounded-lg px-4 py-2 text-sm font-bold text-white transition-colors"
          >
            YES
          </button>
          <button
            type="button"
            onClick={() => setSide("no")}
            className="bg-backgroundMuted text-textPrimary hover:bg-border flex-1 rounded-lg px-4 py-2 text-sm font-bold transition-colors"
          >
            NO
          </button>
        </div>
      )}
      {side && (
        <PlaceBetDialog
          market={market}
          points={points}
          side={side}
          open
          onOpenChange={(v) => !v && setSide(null)}
        />
      )}
    </article>
  );
}
