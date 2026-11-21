"use client";

import { useRef, useState } from "react";
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

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
const slotX = (slot: number) => `translateX(${slot * 100}%)`;

function randomSwaps() {
  const count = 9 + Math.floor(Math.random() * 6);
  return Array.from({ length: count }, (_, k) => {
    const a = Math.floor(Math.random() * CUPS_COUNT);
    const b =
      (a + 1 + Math.floor(Math.random() * (CUPS_COUNT - 1))) % CUPS_COUNT;
    return { a, b, ms: Math.max(190, 460 - k * 26) };
  });
}

function Cup({
  slot,
  lifted,
  ball,
  selected,
  onClick,
  disabled,
  wrapRef,
}: {
  slot: number;
  lifted: boolean;
  ball: boolean;
  selected: boolean;
  onClick?: () => void;
  disabled: boolean;
  wrapRef: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={wrapRef}
      style={{ transform: slotX(slot) }}
      className="absolute inset-y-0 left-0 flex w-1/3 items-end justify-center"
    >
      <button
        type="button"
        onClick={onClick}
        disabled={disabled}
        aria-label={`Cup ${slot + 1}`}
        className={cn(
          "relative flex h-full w-full max-w-32 items-end justify-center rounded-2xl transition-colors",
          selected && "bg-brandSoft ring-primary ring-2",
          !disabled && "hover:bg-backgroundMuted",
        )}
      >
        <span
          className={cn(
            "bg-gold absolute bottom-3 size-7 rounded-full shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.15)] transition-opacity",
            lifted && ball ? "opacity-100" : "opacity-0",
          )}
        />
        <Image
          src="/games/cup.svg"
          alt=""
          width={140}
          height={180}
          draggable={false}
          className={cn(
            "relative mb-1 h-28 w-auto transition-transform duration-500 select-none sm:h-40",
            lifted && "-translate-y-16 sm:-translate-y-20",
          )}
        />
      </button>
    </div>
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
  const [slots, setSlots] = useState(() =>
    Array.from({ length: CUPS_COUNT }, (_, i) => i),
  );
  const slotsRef = useRef(slots);
  const cupEls = useRef<(HTMLDivElement | null)[]>([]);
  const max = Math.min(CUPS_MAX_STAKE, points);
  const canPlay = playsLeft > 0 && max >= CUPS_MIN_STAKE;
  const bet = Math.min(
    Math.max(stake, CUPS_MIN_STAKE),
    Math.max(max, CUPS_MIN_STAKE),
  );

  async function start() {
    setResult(null);
    setPick(null);
    setPhase("shuffling");
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const order = [...slotsRef.current];
    await sleep(350);
    for (const { a, b, ms } of randomSwaps()) {
      const ca = order.indexOf(a);
      const cb = order.indexOf(b);
      const ea = cupEls.current[ca];
      const eb = cupEls.current[cb];
      if (ea && eb && !reduce) {
        ea.style.zIndex = "2";
        eb.style.zIndex = "1";
        const mid = (a + b) / 2;
        const opts = { duration: ms, easing: "cubic-bezier(.45,0,.55,1)" };
        await Promise.all([
          ea.animate(
            [
              { transform: slotX(a) },
              { transform: `${slotX(mid)} translateY(14px) scale(1.06)` },
              { transform: slotX(b) },
            ],
            opts,
          ).finished,
          eb.animate(
            [
              { transform: slotX(b) },
              { transform: `${slotX(mid)} translateY(-16px) scale(0.92)` },
              { transform: slotX(a) },
            ],
            opts,
          ).finished,
        ]);
        ea.style.transform = slotX(b);
        eb.style.transform = slotX(a);
      }
      order[ca] = b;
      order[cb] = a;
    }
    slotsRef.current = order;
    setSlots(order);
    setPhase("pick");
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

      <div className="relative h-44 w-full max-w-md sm:h-56">
        {slots.map((slot, cup) => (
          <Cup
            key={cup}
            slot={slot}
            wrapRef={(el) => {
              cupEls.current[cup] = el;
            }}
            lifted={
              phase === "reveal" && (result?.ball === slot || pick === slot)
            }
            ball={result?.ball === slot}
            selected={pick === slot}
            disabled={phase !== "pick" || busy}
            onClick={() => choose(slot)}
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
