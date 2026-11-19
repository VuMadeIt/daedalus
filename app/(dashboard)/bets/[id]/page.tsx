import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getMarket, getUserBets } from "@/lib/db/queries/betting";
import { loadBettor } from "@/lib/betting/page-guard";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/PageWrapper";
import { Panel } from "@/components/bets/Leaderboard";
import { marketStatus, yesShare } from "@/components/bets/MarketCard";
import { BetSlip } from "@/components/bets/PlaceBetDialog";

export const metadata: Metadata = { title: "Market" };

function Holders({ rows }: { rows: { name: string | null; amount: number }[] }) {
  if (rows.length === 0) return <p className="px-5 py-5 text-sm text-textMuted">No bets on this side yet.</p>;
  return (
    <ol className="divide-y divide-border">
      {rows.map((r, i) => (
        <li key={i} className="flex justify-between px-5 py-2.5 text-sm">
          <span className="truncate text-textPrimary">
            {i + 1}. {r.name ?? "Hacker"}
          </span>
          <span className="font-bold text-textPrimary tabular-nums">{r.amount} pts</span>
        </li>
      ))}
    </ol>
  );
}

export default async function MarketPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { userId, points, allowed } = await loadBettor();
  const data = await getMarket(id);
  if (!data) notFound();
  const { market, yesHolders, noHolders } = data;
  const mine = (await getUserBets(userId)).filter((b) => b.marketId === id);
  const yes = yesShare(market);
  const status = marketStatus(market);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <Link href="/bets" className="inline-flex w-fit items-center gap-1.5 text-sm text-textMuted hover:text-textPrimary">
          <ArrowLeft className="size-4" /> All markets
        </Link>
        <div className="space-y-2">
          <span className={cn("rounded-full px-2 py-0.5 text-xs font-medium", status.tone)}>{status.label}</span>
          <h1 className="text-[28px] leading-tight font-bold tracking-tight text-textPrimary md:text-[32px]">{market.question}</h1>
          {market.description && <p className="max-w-2xl text-[15px] text-textSecondary">{market.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Total pool", `${market.yesPool + market.noPool} pts`, "text-textPrimary"],
            ["Bets", `${market.betCount}`, "text-textPrimary"],
            ["Yes", `${yes}%`, "text-primary"],
            ["No", `${100 - yes}%`, "text-textPrimary"],
          ].map(([label, value, tone]) => (
            <div key={label} className="rounded-2xl border border-border bg-surface p-4 shadow-card">
              <p className="text-xs text-textMuted">{label}</p>
              <p className={cn("mt-1 text-2xl font-bold tabular-nums", tone)}>{value}</p>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
              <div className="flex h-3 overflow-hidden rounded-full bg-backgroundMuted">
                <div className="bg-primary" style={{ width: `${yes}%` }} />
                <div className="bg-ink dark:bg-textMuted" style={{ width: `${100 - yes}%` }} />
              </div>
              <div className="mt-2 flex justify-between text-xs text-textMuted">
                <span>YES {market.yesPool} pts</span>
                <span>NO {market.noPool} pts</span>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Panel title="Top YES holders">
                <Holders rows={yesHolders} />
              </Panel>
              <Panel title="Top NO holders">
                <Holders rows={noHolders} />
              </Panel>
            </div>
          </div>

          <div className="space-y-4">
            {market.status === "open" && allowed ? (
              <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
                <h2 className="mb-4 text-base font-bold text-textPrimary">How would you like to bet?</h2>
                <BetSlip market={market} points={points} />
              </div>
            ) : (
              <p className="rounded-2xl border border-dashed border-border bg-surface p-5 text-sm text-textMuted">
                {market.status === "resolved" ? "This market is settled." : "Betting on this market is closed."}
              </p>
            )}
            {mine.length > 0 && (
              <Panel title="Your bets here">
                <ul className="divide-y divide-border">
                  {mine.map((b) => (
                    <li key={b.id} className="flex justify-between px-5 py-2.5 text-sm">
                      <span className="text-textPrimary">
                        {b.amount} pts on {b.side.toUpperCase()}
                      </span>
                      <span className="text-textMuted">{b.payout == null ? "Waiting" : b.payout > 0 ? `+${b.payout} back` : "Lost"}</span>
                    </li>
                  ))}
                </ul>
              </Panel>
            )}
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
