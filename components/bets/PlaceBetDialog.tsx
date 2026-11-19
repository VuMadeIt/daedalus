"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  BET_MAX,
  BET_MIN,
  projectedReturn,
  type BetSide,
} from "@/config/betting";
import { cn } from "@/lib/utils";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

export type MarketPools = {
  id: string;
  question: string;
  yesPool: number;
  noPool: number;
};

export function BetSlip({
  market,
  points,
  initialSide = "yes",
  onDone,
}: {
  market: MarketPools;
  points: number;
  initialSide?: BetSide;
  onDone?: () => void;
}) {
  const router = useRouter();
  const max = Math.min(BET_MAX, points);
  const [side, setSide] = useState<BetSide>(initialSide);
  const [amount, setAmount] = useState(
    Math.min(Math.max(BET_MIN, 25), Math.max(max, BET_MIN)),
  );
  const [busy, setBusy] = useState(false);
  const canBet = max >= BET_MIN;
  const yesBack = projectedReturn(amount, "yes", market.yesPool, market.noPool);
  const noBack = projectedReturn(amount, "no", market.yesPool, market.noPool);
  const mood =
    amount >= 75
      ? "All in on this one"
      : amount >= 40
        ? "Looking spicy..."
        : "Playing it safe";

  async function place() {
    setBusy(true);
    try {
      const res = await fetch("/api/bets/place", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ marketId: market.id, side, amount }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.message);
      toast.success(`Bet placed: ${amount} pts on ${side.toUpperCase()}`);
      onDone?.();
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Couldn't place that bet");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-5">
      <div
        className="grid grid-cols-2 gap-2"
        role="radiogroup"
        aria-label="Pick a side"
      >
        {(["yes", "no"] as const).map((s) => (
          <button
            key={s}
            type="button"
            role="radio"
            aria-checked={side === s}
            onClick={() => setSide(s)}
            className={cn(
              "rounded-xl border px-4 py-3 text-left transition-colors",
              side === s
                ? s === "yes"
                  ? "border-primary bg-brandSoft"
                  : "border-ink bg-backgroundMuted dark:border-textSecondary"
                : "border-border bg-surface hover:border-textMuted/40",
            )}
          >
            <span className="text-textMuted block text-xs">
              If {s.toUpperCase()} wins
            </span>
            <span className="text-textPrimary mt-0.5 block text-lg font-bold tabular-nums">
              +{(s === "yes" ? yesBack : noBack) - amount} pts
            </span>
          </button>
        ))}
      </div>

      <div>
        <div className="flex items-baseline justify-between">
          <label
            htmlFor={`stake-${market.id}`}
            className="text-textPrimary text-sm font-medium"
          >
            Your stake
          </label>
          <span className="text-textPrimary text-2xl font-bold tabular-nums">
            {amount} pts
          </span>
        </div>
        <input
          id={`stake-${market.id}`}
          type="range"
          min={BET_MIN}
          max={Math.max(max, BET_MIN)}
          step={5}
          value={amount}
          disabled={!canBet}
          onChange={(e) => setAmount(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--hc-primary)]"
        />
        <div className="text-textMuted mt-1 flex justify-between text-xs">
          <span>{BET_MIN}</span>
          <span>{canBet ? mood : "Not enough points to bet"}</span>
          <span>{Math.max(max, BET_MIN)}</span>
        </div>
      </div>

      <button
        type="button"
        disabled={!canBet || busy}
        onClick={place}
        className="bg-primary hover:bg-primaryDark flex w-full items-center justify-center gap-2 rounded-xl px-4 py-3 text-[15px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      >
        {busy && <Loader2 className="size-4 animate-spin" />}
        Place bet on {side.toUpperCase()}
      </button>
      <p className="text-textMuted text-center text-xs">
        Payouts shift as others bet. Winners split the whole pool when an
        organizer settles it.
      </p>
    </div>
  );
}

export function PlaceBetDialog({
  market,
  points,
  side,
  open,
  onOpenChange,
}: {
  market: MarketPools;
  points: number;
  side: BetSide;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogTitle className="text-textPrimary text-xl font-bold">
          Place a bet
        </DialogTitle>
        <DialogDescription className="text-textSecondary text-sm">
          {market.question}
        </DialogDescription>
        <BetSlip
          key={side}
          market={market}
          points={points}
          initialSide={side}
          onDone={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
