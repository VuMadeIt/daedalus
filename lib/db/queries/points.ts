import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { userBalance } from "@/lib/db/schema";

export async function getUserPoints(userId: string): Promise<number> {
  const [row] = await db
    .select({ points: userBalance.points })
    .from(userBalance)
    .where(eq(userBalance.userId, userId))
    .limit(1);
  return row?.points ?? 0;
}
