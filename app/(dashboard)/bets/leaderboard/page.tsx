import type { Metadata } from "next";

import { getBetLeaderboard } from "@/lib/db/queries/betting";
import { loadBettor } from "@/lib/betting/page-guard";
import { cn } from "@/lib/utils";
import PageWrapper from "@/components/PageWrapper";
import { BetsHeader } from "@/components/bets/BetsTabs";
import { LeaderList, Panel } from "@/components/bets/Leaderboard";

export const metadata: Metadata = { title: "Betting leaderboard" };

export default async function BetLeaderboardPage() {
  const { userId } = await loadBettor();
  const rows = await getBetLeaderboard(0);
  const podium = rows.slice(0, 3);
  const mine = rows.find((r) => r.userId === userId);
  const order = [1, 0, 2];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <BetsHeader title="Leaderboard" lede="Net points won from settled bets and mini games." />

        {podium.length > 0 && (
          <div className="grid grid-cols-3 items-end gap-3 md:mx-auto md:w-full md:max-w-2xl">
            {order.map((i) => {
              const r = podium[i];
              if (!r) return <div key={i} />;
              return (
                <div
                  key={r.userId}
                  className={cn(
                    "flex flex-col items-center rounded-2xl border border-border bg-surface px-3 pt-5 text-center shadow-card",
                    i === 0 ? "pb-8 md:pb-10" : i === 1 ? "pb-5" : "pb-3",
                    i === 0 && "border-gold/50 bg-goldSoft",
                  )}
                >
                  <span className={cn("grid size-10 place-items-center rounded-full text-sm font-bold", i === 0 ? "bg-gold text-ink" : "bg-backgroundMuted text-textSecondary")}>
                    {r.rank}
                  </span>
                  <p className="mt-2 w-full truncate text-sm font-bold text-textPrimary">{r.name}</p>
                  <p className={cn("text-lg font-bold tabular-nums", r.net >= 0 ? "text-success" : "text-textSecondary")}>
                    {r.net >= 0 ? "+" : ""}
                    {r.net}
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {mine && (
          <p className="rounded-xl bg-brandSoft px-4 py-3 text-sm text-textPrimary">
            You&apos;re <span className="font-bold">#{mine.rank}</span> with{" "}
            <span className="font-bold">
              {mine.net >= 0 ? "+" : ""}
              {mine.net} pts
            </span>{" "}
            across {mine.plays} plays.
          </p>
        )}

        <Panel title={`Everyone (${rows.length})`}>
          <LeaderList rows={rows} me={userId} />
        </Panel>
      </div>
    </PageWrapper>
  );
}
