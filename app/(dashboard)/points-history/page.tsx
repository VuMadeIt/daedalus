import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";
import { desc, eq } from "drizzle-orm";
import {
  ArrowDownRight,
  ArrowUpRight,
  Clock,
  Coins,
  Dices,
  ShoppingBag,
  Trophy,
  Users,
} from "lucide-react";

import { db } from "@/lib/db";
import { pointsTransactions, userBalance } from "@/lib/db/schema";
import { cn, formatDate } from "@/lib/utils";
import { BackButton } from "@/components/ui/back-button";
import { EmptyPage } from "@/components/EmptyPage";
import PageWrapper from "@/components/PageWrapper";

interface TransactionMetadata {
  question?: string;
  game?: string;
  type?: string;
  challengeName?: string;
  itemName?: string;
  visitCount?: number;
}

export default async function PointsHistoryPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    redirect("/sign-in");
  }

  if (currentUser.role === "unassigned") {
    return (
      <EmptyPage
        title="Points History"
        message="Sorry, this feature is only available to participants."
      />
    );
  }

  const [transactions, balanceResult] = await Promise.all([
    db
      .select()
      .from(pointsTransactions)
      .where(eq(pointsTransactions.userId, currentUser.id))
      .orderBy(desc(pointsTransactions.createdAt)),
    db
      .select()
      .from(userBalance)
      .where(eq(userBalance.userId, currentUser.id)),
  ]);

  const points = balanceResult.length > 0 ? balanceResult[0].points : 0;

  const getTransactionIcon = (metadata: TransactionMetadata | null) => {
    if (metadata?.type === "challenge_completion") {
      return <Trophy className="h-4 w-4 text-success" />;
    }
    if (metadata?.type === "shop_redemption") {
      return <ShoppingBag className="h-4 w-4 text-textSecondary" />;
    }
    if (metadata?.type === "profile_visit_reward") {
      return <Users className="h-4 w-4 text-primary" />;
    }
    const kind = metadata?.type ?? "";
    if (kind.startsWith("bet_") || kind.startsWith("minigame_")) {
      return <Dices className="h-4 w-4 text-goldInk" />;
    }
    return <Coins className="h-4 w-4 text-primary" />;
  };

  const getTransactionLabel = (
    metadata: TransactionMetadata | null,
    points: number,
  ) => {
    if (metadata?.type === "challenge_completion") {
      return `Challenge: ${metadata.challengeName || "Unknown"}`;
    }
    if (metadata?.type === "shop_redemption") {
      return `Redeemed: ${metadata.itemName || "Unknown Item"}`;
    }
    if (metadata?.type === "profile_visit_reward") {
      return `Networking Reward (${metadata.visitCount || 0} profiles visited)`;
    }
    if (metadata?.type === "bet_placed") return `Bet: ${metadata.question || "Market"}`;
    if (metadata?.type === "bet_won") return `Bet won: ${metadata.question || "Market"}`;
    if (metadata?.type === "bet_refund") return `Bet refunded: ${metadata.question || "Market"}`;
    if (metadata?.type === "minigame_won") return "Cup shuffle: found the ball";
    if (metadata?.type === "minigame_lost") return "Cup shuffle: wrong cup";
    return points > 0 ? "Points Earned" : "Points Spent";
  };

  const earned = transactions
    .filter((t) => t.points > 0 && (t.metadata as TransactionMetadata | null)?.type !== "bet_refund")
    .reduce((n, t) => n + t.points, 0);
  const SPENDING = new Set(["shop_redemption", "bet_placed", "minigame_lost"]);
  const spent = transactions
    .filter((t) => t.points < 0 && SPENDING.has((t.metadata as TransactionMetadata | null)?.type ?? ""))
    .reduce((n, t) => n - t.points, 0);

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="space-y-1.5">
          <h1 className="text-[28px] leading-tight font-bold tracking-tight text-textPrimary md:text-[32px]">
            Points
          </h1>
          <p className="text-[15px] text-textSecondary">
            Everything you&apos;ve earned and spent during the event.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-[1.4fr_1fr_1fr]">
          <div className="relative overflow-hidden rounded-2xl bg-ink p-6 text-white shadow-float">
            <div className="absolute -top-10 -right-10 size-40 rounded-full bg-gold/20 blur-2xl" aria-hidden />
            <p className="text-sm text-white/70">Current balance</p>
            <p className="mt-1 text-4xl font-bold tracking-tight tabular-nums">
              {points.toLocaleString()} <span className="text-lg font-medium text-gold">pts</span>
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link href="/challenges" className="rounded-lg bg-gold px-3.5 py-2 text-sm font-medium text-ink transition-opacity hover:opacity-90">
                Earn more
              </Link>
              <Link href="/shops" className="rounded-lg bg-white/10 px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-white/15">
                Spend in the store
              </Link>
            </div>
          </div>
          {[
            ["Earned", earned, "text-success", ArrowUpRight],
            ["Spent", spent, "text-textPrimary", ArrowDownRight],
          ].map(([label, value, tone, Icon]) => {
            const I = Icon as typeof ArrowUpRight;
            return (
              <div key={label as string} className="rounded-2xl border border-border bg-surface p-6 shadow-card">
                <div className="flex items-center justify-between text-sm text-textMuted">
                  {label as string}
                  <I className={cn("size-4", tone as string)} aria-hidden />
                </div>
                <p className={cn("mt-2 text-3xl font-bold tabular-nums", tone as string)}>
                  {(value as number).toLocaleString()}
                </p>
                <p className="mt-1 text-xs text-textMuted">points so far</p>
              </div>
            );
          })}
        </div>

        <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
          <header className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-bold text-textPrimary">Activity</h2>
            <span className="text-sm text-textMuted">{transactions.length} entries</span>
          </header>
          {transactions.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <Image src="/beaver-money.png" alt="" width={120} height={120} className="size-28 object-contain" />
              <p className="mt-4 text-lg font-bold text-textPrimary">No points yet</p>
              <p className="mt-1 max-w-sm text-sm text-textSecondary">
                Finish a challenge around the venue and your first points will show up here.
              </p>
              <Link href="/challenges" className="mt-5 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primaryDark">
                See challenges
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {transactions.map((transaction) => {
                const metadata = transaction.metadata as TransactionMetadata | null;
                const isPositive = transaction.points > 0;
                return (
                  <li key={transaction.id} className="flex items-center gap-4 px-5 py-4">
                    <div
                      className={cn(
                        "grid size-10 shrink-0 place-items-center rounded-xl",
                        isPositive ? "bg-mint" : "bg-backgroundMuted",
                      )}
                    >
                      {getTransactionIcon(metadata)}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium text-textPrimary">
                        {getTransactionLabel(metadata, transaction.points)}
                      </p>
                      <p className="text-sm text-textMuted">{formatDate(transaction.createdAt)}</p>
                    </div>
                    <span
                      className={cn(
                        "text-base font-bold tabular-nums",
                        isPositive ? "text-success" : "text-textPrimary",
                      )}
                    >
                      {isPositive ? "+" : ""}
                      {transaction.points}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <BackButton />
      </div>
    </PageWrapper>
  );
}
