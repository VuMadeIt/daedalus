import { eq, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import { pointsBannedUsers, pointsTransactions, userBalance } from "@/lib/db/schema";

type Tx = Parameters<Parameters<typeof db.transaction>[0]>[0];

export class LedgerError extends Error {
  constructor(
    message: string,
    public status = 400,
  ) {
    super(message);
  }
}

/** Locks the player's balance row and returns it, creating it at 0 if missing. */
export async function lockBalance(tx: Tx, userId: string) {
  const [banned] = await tx
    .select({ userId: pointsBannedUsers.userId })
    .from(pointsBannedUsers)
    .where(eq(pointsBannedUsers.userId, userId));
  if (banned) throw new LedgerError("Your points are paused. Talk to an organizer.", 403);

  await tx.insert(userBalance).values({ userId, points: 0 }).onConflictDoNothing();
  const [row] = await tx
    .select({ points: userBalance.points })
    .from(userBalance)
    .where(eq(userBalance.userId, userId))
    .for("update");
  return row?.points ?? 0;
}

export async function movePoints(
  tx: Tx,
  userId: string,
  delta: number,
  referenceId: string,
  metadata: Record<string, unknown>,
) {
  if (delta === 0) return;
  await tx
    .update(userBalance)
    .set({ points: sql`${userBalance.points} + ${delta}` })
    .where(eq(userBalance.userId, userId));
  await tx.insert(pointsTransactions).values({ userId, points: delta, referenceId, metadata });
}
