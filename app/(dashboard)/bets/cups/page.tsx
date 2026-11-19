import type { Metadata } from "next";

import { CUPS_PLAYS_PER_DAY } from "@/config/betting";
import { getCupsPlaysToday } from "@/lib/db/queries/betting";
import { loadBettor } from "@/lib/betting/page-guard";
import { EmptyPage } from "@/components/EmptyPage";
import PageWrapper from "@/components/PageWrapper";
import { BetsHeader } from "@/components/bets/BetsTabs";
import { CupGame } from "@/components/bets/CupGame";

export const metadata: Metadata = { title: "Mini games" };

export default async function CupsPage() {
  const { userId, points, allowed } = await loadBettor();
  if (!allowed) return <EmptyPage title="Mini games" message="Mini games are only open to event participants." />;
  const played = await getCupsPlaysToday(userId);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <BetsHeader title="Mini games" lede="Pick a stake, watch the cups shuffle, and guess where the ball is." />
        <CupGame points={points} playsLeft={Math.max(CUPS_PLAYS_PER_DAY - played, 0)} />
      </div>
    </PageWrapper>
  );
}
