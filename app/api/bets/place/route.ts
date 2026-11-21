import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { BET_MAX, BET_MIN } from "@/config/betting";
import { db } from "@/lib/db";
import { betMarkets, bets } from "@/lib/db/schema";
import { LedgerError, lockBalance, movePoints } from "@/lib/betting/ledger";
import { fail, handleError } from "@/lib/betting/respond";

const schema = z.object({
  marketId: z.string().min(1),
  side: z.enum(["yes", "no"]),
  amount: z.number().int().min(BET_MIN).max(BET_MAX),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) return fail("Sign in to place a bet", 401);
    if (user.role === "unassigned") return fail("Only event participants can bet", 403);
    const userId = user.id;

    const { marketId, side, amount } = schema.parse(await req.json());

    const bet = await db.transaction(async (tx) => {
      const [market] = await tx
        .select()
        .from(betMarkets)
        .where(eq(betMarkets.id, marketId))
        .for("update");
      if (!market) throw new LedgerError("That market doesn't exist", 404);
      const closed =
        market.status !== "open" || (market.closesAt && market.closesAt.getTime() <= Date.now());
      if (closed) throw new LedgerError("This market isn't taking bets anymore");

      const balance = await lockBalance(tx, userId);
      if (balance < amount) throw new LedgerError(`You have ${balance} points, not enough for ${amount}`);

      const [row] = await tx.insert(bets).values({ marketId, userId, side, amount }).returning();
      await movePoints(tx, userId, -amount, row.id, {
        type: "bet_placed",
        marketId,
        side,
        question: market.question,
      });
      return row;
    });

    return NextResponse.json({ success: true, message: `Bet ${amount} pts on ${side.toUpperCase()}`, data: bet });
  } catch (error) {
    return handleError(error, "Bet place error:");
  }
}
