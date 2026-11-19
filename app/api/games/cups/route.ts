import { randomInt } from "crypto";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/auth";
import { and, eq, gte, sql } from "drizzle-orm";
import { z } from "zod";

import { CUPS_COUNT, CUPS_MAX_STAKE, CUPS_MIN_STAKE, CUPS_PLAYS_PER_DAY } from "@/config/betting";
import { db } from "@/lib/db";
import { miniGamePlays } from "@/lib/db/schema";
import { LedgerError, lockBalance, movePoints } from "@/lib/betting/ledger";
import { fail, handleError } from "@/lib/betting/respond";

const schema = z.object({
  stake: z.number().int().min(CUPS_MIN_STAKE).max(CUPS_MAX_STAKE),
  guess: z.number().int().min(0).max(CUPS_COUNT - 1),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id) return fail("Sign in to play", 401);
    if (user.role === "unassigned") return fail("Only event participants can play", 403);
    const userId = user.id;
    const { stake, guess } = schema.parse(await req.json());

    const result = await db.transaction(async (tx) => {
      // Locking the balance row also stops two plays from racing past the daily limit
      const balance = await lockBalance(tx, userId);
      const since = new Date();
      since.setHours(0, 0, 0, 0);
      const [{ n }] = await tx
        .select({ n: sql<number>`count(*)::int` })
        .from(miniGamePlays)
        .where(and(eq(miniGamePlays.userId, userId), eq(miniGamePlays.game, "cups"), gte(miniGamePlays.createdAt, since)));
      if (n >= CUPS_PLAYS_PER_DAY) throw new LedgerError("You're out of plays for today. Come back tomorrow.");
      if (balance < stake) throw new LedgerError(`You have ${balance} points, not enough for ${stake}`);

      const ball = randomInt(CUPS_COUNT);
      const won = ball === guess;
      const delta = won ? stake : -stake;
      const [play] = await tx
        .insert(miniGamePlays)
        .values({ userId, game: "cups", stake, won, delta })
        .returning();
      await movePoints(tx, userId, delta, play.id, { type: won ? "minigame_won" : "minigame_lost", game: "cups" });
      return { ball, won, delta, balance: balance + delta, playsLeft: CUPS_PLAYS_PER_DAY - n - 1 };
    });

    return NextResponse.json({ success: true, message: result.won ? "Found it" : "Wrong cup", data: result });
  } catch (error) {
    return handleError(error, "Cups game error:");
  }
}
