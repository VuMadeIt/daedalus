"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { CUPS_COUNT, CUPS_MAX_STAKE, CUPS_MIN_STAKE } from "@/config/betting";
import { cn } from "@/lib/utils";

type Phase = "stake" | "shuffling" | "pick" | "reveal";
type Result = {
  ball: number;
  won: boolean;
  delta: number;
  balance: number;
  playsLeft: number;
};

const SHUFFLE_MS = 1800;

function Cup({
  lifted,
  ball,
  selected,
  onClick,
  disabled,
  shuffling,
  index,
}: {
  lifted: boolean;
  ball: boolean;
  selected: boolean;
  onClick?: () => void;
  disabled: boolean;
  shuffling: boolean;
  index: number;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={`Cup ${index + 1}`}
      className={cn(
        "relative flex h-40 w-24 items-end justify-center rounded-2xl transition-colors sm:h-48 sm:w-32",
        selected && "bg-brandSoft ring-primary ring-2",
        !disabled && "hover:bg-backgroundMuted",
      )}
    >
      <span
        className={cn(
          "bg-gold absolute bottom-4 size-7 rounded-full shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.15)] transition-opacity",
          lifted && ball ? "opacity-100" : "opacity-0",
        )}
      />
      <Image
        src="/games/cup.svg"
        alt=""
        width={140}
        height={180}
        draggable={false}
        style={shuffling ? { animationDelay: `${index * 90}ms` } : undefined}
        className={cn(
          "relative mb-1 h-32 w-auto select-none transition-transform duration-500 sm:h-40",
          lifted && "-translate-y-14",
          shuffling && "animate-[cup-shuffle_0.45s_ease-in-out_infinite]",
        )}
      />
    </button>
  );
}

export function CupGame({
  points,
  playsLeft: initialPlays,
}: {
  points: number;
  playsLeft: number;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>("stake");
  const [stake, setStake] = useState(
    Math.min(25, Math.max(points, CUPS_MIN_STAKE)),
  );
  const [pick, setPick] = useState<number | null>(null);
  const [result, setResult] = useState<Result | null>(null);
  const [playsLeft, setPlaysLeft] = useState(initialPlays);
  const [busy, setBusy] = useState(false);
  const max = Math.min(CUPS_MAX_STAKE, points);
  const canPlay = playsLeft > 0 && max >= CUPS_MIN_STAKE;
  const bet = Math.min(Math.max(stake, CUPS_MIN_STAKE), Math.max(max, CUPS_MIN_STAKE));

  function start() {
    setResult(null);
    setPick(null);
    setPhase("shuffling");
    setTimeout(() => setPhase("pick"), SHUFFLE_MS);
  }

  async function choose(i: number) {
    setPick(i);
    setBusy(true);
    try {
      const res = await fetch("/api/games/cups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stake: bet, guess: i }),
      });
      const body = await res.json();
      if (!res.ok || !body.success) throw new Error(body.message);
      setResult(body.data);
      setPlaysLeft(body.data.playsLeft);
      setPhase("reveal");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Something went wrong");
      setPhase("stake");
    } finally {
      setBusy(false);
    }
  }

  const heading =
    phase === "reveal" && result
      ? result.won
        ? "You found the ball!"
        : "Oops, wrong cup"
      : phase === "pick"
        ? "Where is the ball hiding?"
        : phase === "shuffling"
          ? "Watch closely..."
          : "Cup shuffle";

  return (
    <div className="border-border bg-surface shadow-card mx-auto flex w-full max-w-2xl flex-col items-center gap-6 rounded-3xl border px-5 py-8 md:px-10 md:py-10">
      <div className="text-center">
        <h2 className="text-textPrimary text-2xl font-bold tracking-tight md:text-3xl">
          {heading}
        </h2>
        <p className="text-textMuted mt-1 text-sm">
          {phase === "reveal" && result
            ? `${result.delta > 0 ? "+" : ""}${result.delta} pts · ${playsLeft} ${playsLeft === 1 ? "play" : "plays"} left today`
            : `Find the ball to double your stake. ${playsLeft} ${playsLeft === 1 ? "play" : "plays"} left today.`}
        </p>
      </div>

      <div className="flex items-end justify-center gap-2 sm:gap-6">
        {Array.from({ length: CUPS_COUNT }, (_, i) => (
          <Cup
            key={i}
            index={i}
            lifted={phase === "reveal" && (result?.ball === i || pick === i)}
            ball={result?.ball === i}
            selected={pick === i}
            shuffling={phase === "shuffling"}
            disabled={phase !== "pick" || busy}
            onClick={() => choose(i)}
          />
        ))}
      </div>

      {phase === "stake" && (
        <div className="border-border bg-background w-full max-w-md rounded-2xl border p-5">
          <div className="flex items-baseline justify-between">
            <label
              htmlFor="cup-stake"
              className="text-textPrimary text-sm font-medium"
            >
              Your stake
            </label>
            <span className="text-textPrimary shrink-0 text-xl font-bold tabular-nums">
              {stake} pts
            </span>
          </div>
          <input
            id="cup-stake"
            type="range"
            min={CUPS_MIN_STAKE}
            max={Math.max(max, CUPS_MIN_STAKE)}
            step={5}
            value={bet}
            disabled={!canPlay}
            onChange={(e) => setStake(Number(e.target.value))}
            className="mt-3 w-full accent-[var(--hc-primary)]"
          />
          <button
            type="button"
            onClick={start}
            disabled={!canPlay}
            className="bg-primary hover:bg-primaryDark mt-4 w-full rounded-xl px-4 py-3 text-[15px] font-bold text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {playsLeft <= 0
              ? "Out of plays for today"
              : canPlay
                ? "Start shuffle"
                : `You need ${CUPS_MIN_STAKE} pts to play`}
          </button>
        </div>
      )}

      {phase === "pick" && (
        <p className="text-primary flex items-center gap-2 text-sm font-medium">
          {busy && <Loader2 className="size-4 animate-spin" />} Tap a cup
        </p>
      )}

      {phase === "reveal" && (
        <div className="flex w-full max-w-md gap-2">
          <a
            href="/bets"
            className="bg-backgroundMuted text-textPrimary hover:bg-border flex-1 rounded-xl px-4 py-3 text-center text-sm font-bold"
          >
            Back to bets
          </a>
          <button
            type="button"
            onClick={() => setPhase("stake")}
            disabled={playsLeft <= 0}
            className="bg-primary hover:bg-primaryDark flex-1 rounded-xl px-4 py-3 text-sm font-bold text-white disabled:opacity-50"
          >
            {playsLeft > 0 ? "Play again" : "Out of plays"}
          </button>
        </div>
      )}
    </div>
  );
}
