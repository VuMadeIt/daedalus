import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";
import { eq, sql } from "drizzle-orm";
import { Gift } from "lucide-react";

import { db } from "@/lib/db";
import { shopItems, shopPurchases, userBalance } from "@/lib/db/schema";
import { BackButton } from "@/components/ui/back-button";
import { EmptyPage } from "@/components/EmptyPage";
import PageWrapper from "@/components/PageWrapper";
import { ShopItemCard } from "@/components/shop/ShopItemCard";

export default async function ShopsPage() {
  const currentUser = await getCurrentUser();

  if (!currentUser?.id) {
    redirect("/sign-in");
  }

  if (currentUser.role === "unassigned") {
    return (
      <EmptyPage
        title="Shop"
        message="Sorry, this feature is only available to participants."
      />
    );
  }

  const [items, balanceResult, purchaseCounts] = await Promise.all([
    db.select().from(shopItems).where(eq(shopItems.enabled, true)).orderBy(shopItems.purchasePrice),
    db
      .select()
      .from(userBalance)
      .where(eq(userBalance.userId, currentUser.id)),
    db
      .select({
        itemId: shopPurchases.itemId,
        count: sql<number>`count(*)::int`,
      })
      .from(shopPurchases)
      .where(eq(shopPurchases.userId, currentUser.id))
      .groupBy(shopPurchases.itemId),
  ]);

  const points = balanceResult.length > 0 ? balanceResult[0].points : 0;

  const purchaseCountMap = new Map(
    purchaseCounts.map((p) => [p.itemId, p.count]),
  );

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <div className="space-y-1">
          <h1 className="text-[28px] leading-tight font-medium text-textPrimary md:text-[32px]">
            General Shop
          </h1>
          <p className="text-sm text-textMuted md:text-[15px]">
            Browse everything on the shelf and redeem prizes with your points.
          </p>
        </div>

        {/* Items Grid */}
        {items.length === 0 ? (
          <div className="flex w-full flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-surface p-16 text-center">
            <div className="mb-4 rounded-full bg-brandSoft p-4">
              <Gift className="h-8 w-8 text-brand" />
            </div>
            <p className="text-lg font-semibold text-textPrimary">
              The shelf is empty for now
            </p>
            <p className="mt-1 text-sm text-textMuted">
              New prizes show up during the event, so check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {items.map((item) => (
              <ShopItemCard
                key={item.id}
                item={item}
                userId={currentUser.id!}
                points={points}
                purchaseCount={purchaseCountMap.get(item.id) ?? 0}
              />
            ))}
          </div>
        )}

        <BackButton />
      </div>
    </PageWrapper>
  );
}
