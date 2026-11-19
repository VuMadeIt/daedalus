import type { Metadata } from "next";

import { getBetLeaderboard, getUserBets, listMarkets } from "@/lib/db/queries/betting";
import { loadBettor } from "@/lib/betting/page-guard";
import { cn } from "@/lib/utils";
import { EmptyPage } from "@/components/EmptyPage";
import PageWrapper from "@/components/PageWrapper";
import { BetsHeader } from "@/components/bets/BetsTabs";
import { LeaderList, Panel } from "@/components/bets/Leaderboard";
import { MarketCard } from "@/components/bets/MarketCard";

export const metadata: Metadata = { title: "Bet Points" };

export default async function BetsPage() {
  const { userId, points, allowed } = await loadBettor();
  if (!allowed) return <EmptyPage title="Bet Points" message="Betting is only open to event participants." />;

  const [markets, mine, leaders] = await Promise.all([listMarkets(), getUserBets(userId), getBetLeaderboard(5)]);
  const spent = mine.reduce((n, b) => n + b.amount, 0);
  const returned = mine.reduce((n, b) => n + (b.payout ?? 0), 0);
  const pending = mine.filter((b) => b.payout == null).length;
  const live = markets.filter((m) => m.status !== "resolved");
  const settled = markets.filter((m) => m.status === "resolved");

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <BetsHeader
          title="Open markets"
          lede="Bet your points on what happens this weekend. Payouts shift as others bet, and winners split the pool."
        />

        <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
          {[
            ["Your balance", `${points}`, "pts"],
            ["Bets placed", `${mine.length}`, `${pending} waiting`],
            ["Points staked", `${spent}`, "pts"],
            ["Points returned", `${returned}`, "pts"],
          ].map(([label, value, unit], i) => (
            <div key={label} className={cn("rounded-2xl border border-border bg-surface p-4 shadow-card", i === 0 && "border-transparent bg-ink text-white")}>
              <p className={cn("text-xs", i === 0 ? "text-white/70" : "text-textMuted")}>{label}</p>
              <p className="mt-1 text-2xl font-bold tabular-nums">
                {value} <span className={cn("text-sm font-medium", i === 0 ? "text-gold" : "text-textMuted")}>{unit}</span>
              </p>
            </div>
          ))}
        </div>

        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="space-y-3">
            <h2 className="text-base font-bold text-textPrimary">Available bets</h2>
            {live.length === 0 ? (
              <p className="rounded-2xl border border-dashed border-border bg-surface py-12 text-center text-sm text-textMuted">
                No markets are open right now. Organizers add new ones during the event.
              </p>
            ) : (
              live.map((m) => <MarketCard key={m.id} market={m} points={points} />)
            )}
            {settled.length > 0 && (
              <>
                <h2 className="pt-4 text-base font-bold text-textPrimary">Settled</h2>
                {settled.map((m) => (
                  <MarketCard key={m.id} market={m} points={points} />
                ))}
              </>
            )}
          </div>

          <div className="space-y-4">
            <Panel title="Your bets">
              {mine.length === 0 ? (
                <p className="px-5 py-6 text-sm text-textMuted">You haven&apos;t placed a bet yet.</p>
              ) : (
                <ul className="divide-y divide-border">
                  {mine.slice(0, 5).map((b) => (
                    <li key={b.id} className="px-5 py-3">
                      <p className="truncate text-sm font-medium text-textPrimary">{b.question}</p>
                      <p className="mt-0.5 flex justify-between text-xs text-textMuted">
                        <span>
                          {b.amount} pts on {b.side.toUpperCase()}
                        </span>
                        <span className={cn(b.payout ? "font-bold text-success" : "")}>
                          {b.payout == null ? "Waiting" : b.payout > 0 ? `+${b.payout} back` : "Lost"}
                        </span>
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>
            <Panel title="Top bettors" action={{ href: "/bets/leaderboard", label: "See all" }}>
              <LeaderList rows={leaders} me={userId} compact />
            </Panel>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
