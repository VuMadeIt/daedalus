import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { isTakingBets, marketStatus, yesShare } from "@/lib/betting/market";
import { loadBettor } from "@/lib/betting/page-guard";
import { getMarket, getUserBets } from "@/lib/db/queries/betting";
import { cn } from "@/lib/utils";
import { Panel } from "@/components/bets/Leaderboard";
import { BetSlip } from "@/components/bets/PlaceBetDialog";
import { EmptyPage } from "@/components/EmptyPage";
import PageWrapper from "@/components/PageWrapper";

export const metadata: Metadata = { title: "Market" };

function Holders({
  rows,
}: {
  rows: { name: string | null; amount: number }[];
}) {
  if (rows.length === 0)
    return (
      <p className="text-textMuted px-5 py-5 text-sm">
        No bets on this side yet.
      </p>
    );
  return (
    <ol className="divide-border divide-y">
      {rows.map((r, i) => (
        <li key={i} className="flex justify-between px-5 py-2.5 text-sm">
          <span className="text-textPrimary truncate">
            {i + 1}. {r.name ?? "Hacker"}
          </span>
          <span className="text-textPrimary font-bold tabular-nums">
            {r.amount} pts
          </span>
        </li>
      ))}
    </ol>
  );
}

export default async function MarketPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId, points, allowed } = await loadBettor();
  if (!allowed) return <EmptyPage title="Bet Points" message="Betting is only open to event participants." />;
  const data = await getMarket(id);
  if (!data) notFound();
  const { market, yesHolders, noHolders } = data;
  const mine = (await getUserBets(userId)).filter((b) => b.marketId === id);
  const yes = yesShare(market);
  const status = marketStatus(market);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6">
        <Link
          href="/bets"
          className="text-textMuted hover:text-textPrimary inline-flex w-fit items-center gap-1.5 text-sm"
        >
          <ArrowLeft className="size-4" /> All markets
        </Link>
        <div className="space-y-2">
          <span
            className={cn(
              "rounded-full px-2 py-0.5 text-xs font-medium",
              status.tone,
            )}
          >
            {status.label}
          </span>
          <h1 className="text-textPrimary text-[28px] leading-tight font-bold tracking-tight md:text-[32px]">
            {market.question}
          </h1>
          {market.description && (
            <p className="text-textSecondary max-w-2xl text-[15px]">
              {market.description}
            </p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            [
              "Total pool",
              `${market.yesPool + market.noPool} pts`,
              "text-textPrimary",
            ],
            ["Bets", `${market.betCount}`, "text-textPrimary"],
            ["Yes", `${yes}%`, "text-primary"],
            ["No", `${100 - yes}%`, "text-textPrimary"],
          ].map(([label, value, tone]) => (
            <div
              key={label}
              className="border-border bg-surface shadow-card rounded-2xl border p-4"
            >
              <p className="text-textMuted text-xs">{label}</p>
              <p className={cn("mt-1 text-2xl font-bold tabular-nums", tone)}>
                {value}
              </p>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-4">
            <div className="border-border bg-surface shadow-card rounded-2xl border p-5">
              <div className="bg-backgroundMuted flex h-3 overflow-hidden rounded-full">
                <div className="bg-primary" style={{ width: `${yes}%` }} />
                <div
                  className="bg-ink dark:bg-textMuted"
                  style={{ width: `${100 - yes}%` }}
                />
              </div>
              <div className="text-textMuted mt-2 flex justify-between text-xs">
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
            {isTakingBets(market) ? (
              <div className="border-border bg-surface shadow-card rounded-2xl border p-5">
                <h2 className="text-textPrimary mb-4 text-base font-bold">
                  How would you like to bet?
                </h2>
                <BetSlip market={market} points={points} />
              </div>
            ) : (
              <p className="border-border bg-surface text-textMuted rounded-2xl border border-dashed p-5 text-sm">
                {market.status === "resolved"
                  ? "This market is settled."
                  : "Betting on this market is closed."}
              </p>
            )}
            {mine.length > 0 && (
              <Panel title="Your bets here">
                <ul className="divide-border divide-y">
                  {mine.map((b) => (
                    <li
                      key={b.id}
                      className="flex justify-between px-5 py-2.5 text-sm"
                    >
                      <span className="text-textPrimary">
                        {b.amount} pts on {b.side.toUpperCase()}
                      </span>
                      <span className="text-textMuted">
                        {b.payout == null
                          ? "Waiting"
                          : b.payout > 0
                            ? `+${b.payout} back`
                            : "Lost"}
                      </span>
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
