import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { betMarkets, bets } from "@/lib/db/schema";
import { isOrganizer } from "@/lib/utils";
import { LedgerError, lockBalance, movePoints } from "@/lib/betting/ledger";
import { fail, handleError } from "@/lib/betting/respond";

const schema = z.object({
  marketId: z.string().min(1),
  // "refund" gives everyone their points back, for markets that can't be settled
  outcome: z.enum(["yes", "no", "refund"]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id || !isOrganizer(user.role)) return fail("Only organizers can settle markets", 401);
    const { marketId, outcome } = schema.parse(await req.json());

    const paid = await db.transaction(async (tx) => {
      const [market] = await tx
        .select()
        .from(betMarkets)
        .where(eq(betMarkets.id, marketId))
        .for("update");
      if (!market) throw new LedgerError("That market doesn't exist", 404);
      if (market.status === "resolved") throw new LedgerError("This market is already settled");

      const all = await tx.select().from(bets).where(eq(bets.marketId, marketId));
      const total = all.reduce((n, b) => n + b.amount, 0);
      const winPool = all.filter((b) => b.side === outcome).reduce((n, b) => n + b.amount, 0);
      const refund = outcome === "refund" || winPool === 0;

      let paidOut = 0;
      for (const b of all) {
        const payout = refund ? b.amount : b.side === outcome ? Math.floor((b.amount * total) / winPool) : 0;
        await tx.update(bets).set({ payout }).where(eq(bets.id, b.id));
        if (payout > 0) {
          await lockBalance(tx, b.userId).catch(() => 0);
          await movePoints(tx, b.userId, payout, b.id, {
            type: refund ? "bet_refund" : "bet_won",
            marketId,
            question: market.question,
          });
          paidOut += payout;
        }
      }

      await tx
        .update(betMarkets)
        .set({ status: "resolved", outcome: refund ? "refund" : outcome, resolvedAt: new Date() })
        .where(eq(betMarkets.id, marketId));
      return paidOut;
    });

    return NextResponse.json({ success: true, message: `Settled. Paid out ${paid} points.`, data: { paid } });
  } catch (error) {
    return handleError(error, "Bet resolve error:");
  }
}
