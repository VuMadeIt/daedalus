import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { betMarkets, bets, miniGamePlays, users } from "@/lib/db/schema";

const pools = {
  yesPool: sql<number>`coalesce(sum(case when ${bets.side} = 'yes' then ${bets.amount} end), 0)::int`,
  noPool: sql<number>`coalesce(sum(case when ${bets.side} = 'no' then ${bets.amount} end), 0)::int`,
  betCount: sql<number>`count(${bets.id})::int`,
};

export type MarketSummary = Awaited<ReturnType<typeof listMarkets>>[number];

export async function listMarkets() {
  return db
    .select({
      id: betMarkets.id,
      question: betMarkets.question,
      description: betMarkets.description,
      status: betMarkets.status,
      outcome: betMarkets.outcome,
      closesAt: betMarkets.closesAt,
      createdAt: betMarkets.createdAt,
      ...pools,
    })
    .from(betMarkets)
    .leftJoin(bets, eq(bets.marketId, betMarkets.id))
    .groupBy(betMarkets.id)
    .orderBy(sql`case ${betMarkets.status} when 'open' then 0 when 'closed' then 1 else 2 end`, desc(betMarkets.createdAt));
}

export async function getMarket(id: string) {
  const [market] = (await listMarkets()).filter((m) => m.id === id);
  if (!market) return null;
  const holders = await db
    .select({
      side: bets.side,
      name: users.name,
      amount: sql<number>`sum(${bets.amount})::int`,
    })
    .from(bets)
    .innerJoin(users, eq(users.id, bets.userId))
    .where(eq(bets.marketId, id))
    .groupBy(bets.side, users.id, users.name)
    .orderBy(desc(sql`sum(${bets.amount})`));
  return {
    market,
    yesHolders: holders.filter((h) => h.side === "yes").slice(0, 5),
    noHolders: holders.filter((h) => h.side === "no").slice(0, 5),
  };
}

export async function getUserBets(userId: string) {
  return db
    .select({
      id: bets.id,
      marketId: bets.marketId,
      side: bets.side,
      amount: bets.amount,
      payout: bets.payout,
      createdAt: bets.createdAt,
      question: betMarkets.question,
      status: betMarkets.status,
      outcome: betMarkets.outcome,
    })
    .from(bets)
    .innerJoin(betMarkets, eq(betMarkets.id, bets.marketId))
    .where(eq(bets.userId, userId))
    .orderBy(desc(bets.createdAt));
}

/** Net points won from resolved bets and mini games, best first. */
export async function getBetLeaderboard(limit = 10) {
  const betNet = await db
    .select({
      userId: bets.userId,
      net: sql<number>`sum(${bets.payout} - ${bets.amount})::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(bets)
    .where(sql`${bets.payout} is not null`)
    .groupBy(bets.userId);
  const gameNet = await db
    .select({
      userId: miniGamePlays.userId,
      net: sql<number>`sum(${miniGamePlays.delta})::int`,
      count: sql<number>`count(*)::int`,
    })
    .from(miniGamePlays)
    .groupBy(miniGamePlays.userId);

  const totals = new Map<string, { net: number; plays: number }>();
  for (const r of [...betNet, ...gameNet]) {
    const t = totals.get(r.userId) ?? { net: 0, plays: 0 };
    t.net += r.net;
    t.plays += r.count;
    totals.set(r.userId, t);
  }
  const ranked = [...totals.entries()].sort((a, b) => b[1].net - a[1].net);
  const ids = ranked.map(([id]) => id);
  const names = ids.length
    ? await db
        .select({ id: users.id, name: users.name, image: users.image })
        .from(users)
        .where(inArray(users.id, ids))
    : [];
  const byId = new Map(names.map((u) => [u.id, u]));
  const out = ranked.map(([userId, t], i) => ({
    rank: i + 1,
    userId,
    name: byId.get(userId)?.name ?? "Hacker",
    image: byId.get(userId)?.image ?? null,
    net: t.net,
    plays: t.plays,
  }));
  return limit > 0 ? out.slice(0, limit) : out;
}

export async function getCupsPlaysToday(userId: string) {
  const since = new Date();
  since.setHours(0, 0, 0, 0);
  const [row] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(miniGamePlays)
    .where(and(eq(miniGamePlays.userId, userId), eq(miniGamePlays.game, "cups"), gte(miniGamePlays.createdAt, since)));
  return row?.n ?? 0;
}
