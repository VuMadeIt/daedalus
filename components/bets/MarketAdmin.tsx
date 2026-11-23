"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import type { BetSide } from "@/config/betting";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

async function send(url: string, method: string, body: unknown) {
  const res = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || !data.success) throw new Error(data.message || "Something went wrong");
  return data.message as string;
}

type Outcome = BetSide | "refund";
const OUTCOME_LABEL: Record<Outcome, string> = { yes: "YES won", no: "NO won", refund: "Refund everyone" };

/** Organizer controls on a market: pause or reopen betting, then settle it. */
export function MarketAdmin({ marketId, status }: { marketId: string; status: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [pick, setPick] = useState<Outcome | null>(null);

  const run = async (fn: () => Promise<string>) => {
    setBusy(true);
    try {
      toast.success(await fn());
      setPick(null);
      router.refresh();
    } catch (e) {
      toast.error((e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  if (status === "resolved") return null;

  return (
    <section className="border-border bg-surface shadow-card space-y-4 rounded-2xl border p-5">
      <div>
        <h2 className="text-textPrimary text-base font-bold">Organizer controls</h2>
        <p className="text-textMuted mt-1 text-sm">
          Pause betting when the answer is close, then settle it to pay the winners.
        </p>
      </div>

      <Button
        variant="outline"
        className="w-full"
        disabled={busy}
        onClick={() =>
          run(() => send("/api/bets/markets", "PATCH", { marketId, status: status === "open" ? "closed" : "open" }))
        }
      >
        {status === "open" ? "Pause betting" : "Reopen betting"}
      </Button>

      <div className="space-y-2">
        <p className="text-textSecondary text-sm font-medium">Settle the market</p>
        <div className="grid grid-cols-3 gap-2" role="radiogroup" aria-label="Outcome">
          {(["yes", "no", "refund"] as const).map((o) => (
            <button
              key={o}
              type="button"
              role="radio"
              aria-checked={pick === o}
              onClick={() => setPick(o)}
              className={
                pick === o
                  ? "border-primary bg-primaryLight text-primary h-10 rounded-lg border text-sm font-bold"
                  : "border-border text-textPrimary hover:bg-backgroundMuted h-10 rounded-lg border text-sm font-medium"
              }
            >
              {o === "refund" ? "Refund" : o.toUpperCase()}
            </button>
          ))}
        </div>
        {pick && (
          <div className="bg-backgroundMuted space-y-3 rounded-xl p-4">
            <p className="text-textPrimary text-sm">
              <span className="font-bold">{OUTCOME_LABEL[pick]}.</span>{" "}
              {pick === "refund"
                ? "Every bet goes back to the hacker who placed it."
                : "Winners split the whole pool. This can't be undone."}
            </p>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                className="flex-1"
                loading={busy}
                disabled={busy}
                onClick={() => run(() => send("/api/bets/resolve", "POST", { marketId, outcome: pick }))}
              >
                Settle market
              </Button>
              <Button variant="outline" className="flex-1" disabled={busy} onClick={() => setPick(null)}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

/** Organizer form on the markets page to open a new yes/no question. */
export function OpenMarketForm() {
  const router = useRouter();
  const [question, setQuestion] = useState("");
  const [description, setDescription] = useState("");
  const [closesAt, setClosesAt] = useState("");
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      toast.success(
        await send("/api/bets/markets", "POST", {
          question,
          description: description || undefined,
          closesAt: closesAt ? new Date(closesAt).toISOString() : undefined,
        }),
      );
      setQuestion("");
      setDescription("");
      setClosesAt("");
      router.refresh();
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <form onSubmit={submit} className="border-border bg-surface shadow-card space-y-4 rounded-2xl border p-5">
      <div>
        <h2 className="text-textPrimary text-base font-bold">Open a market</h2>
        <p className="text-textMuted mt-1 text-sm">Ask a yes or no question hackers can bet on.</p>
      </div>
      <label className="block space-y-2">
        <span className="text-textSecondary text-sm font-medium">Question</span>
        <Input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Will the closing demo run over time?"
          minLength={8}
          maxLength={140}
          required
        />
      </label>
      <label className="block space-y-2">
        <span className="text-textSecondary text-sm font-medium">Details (optional)</span>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="How you'll decide the answer"
          maxLength={500}
          rows={3}
        />
      </label>
      <label className="block space-y-2">
        <span className="text-textSecondary text-sm font-medium">Betting closes (optional)</span>
        <Input type="datetime-local" value={closesAt} onChange={(e) => setClosesAt(e.target.value)} />
      </label>
      <Button type="submit" className="w-full" loading={busy} disabled={busy || question.trim().length < 8}>
        Open market
      </Button>
    </form>
  );
}
