import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getCurrentUser } from "@/auth";
import { eq } from "drizzle-orm";
import { z } from "zod";

import { db } from "@/lib/db";
import { betMarkets } from "@/lib/db/schema";
import { isOrganizer } from "@/lib/utils";
import { fail, handleError } from "@/lib/betting/respond";

const createSchema = z.object({
  question: z.string().trim().min(8).max(140),
  description: z.string().trim().max(500).optional(),
  closesAt: z.string().datetime().optional(),
});

const updateSchema = z.object({
  marketId: z.string().min(1),
  status: z.enum(["open", "closed"]),
});

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id || !isOrganizer(user.role)) return fail("Only organizers can open markets", 401);
    const { question, description, closesAt } = createSchema.parse(await req.json());
    const [market] = await db
      .insert(betMarkets)
      .values({ question, description, closesAt: closesAt ? new Date(closesAt) : null, createdBy: user.id })
      .returning();
    return NextResponse.json({ success: true, message: "Market opened", data: market });
  } catch (error) {
    return handleError(error, "Market create error:");
  }
}

/** Pause or reopen betting on a market before it's settled. */
export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user?.id || !isOrganizer(user.role)) return fail("Only organizers can change markets", 401);
    const { marketId, status } = updateSchema.parse(await req.json());
    const [market] = await db
      .update(betMarkets)
      .set({ status })
      .where(eq(betMarkets.id, marketId))
      .returning();
    if (!market) return fail("That market doesn't exist", 404);
    if (market.outcome) return fail("This market is already settled");
    return NextResponse.json({ success: true, message: `Market ${status}`, data: market });
  } catch (error) {
    return handleError(error, "Market update error:");
  }
}
