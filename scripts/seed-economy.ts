// Sets store prices, stock and challenge points to the balanced Hack Canada economy.
// Run with: bun ./scripts/seed-economy.ts
//
// An active hacker finishes about 8 challenges (easy 25, medium 40, hard 60),
// so they earn around 300 points. That buys one big prize or a few small ones.
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd());

async function main() {
  const { eq } = await import("drizzle-orm");
  const { db } = await import("../lib/db");
  const { challenges, shopItems } = await import("../lib/db/schema");

  const CHALLENGE_POINTS: Record<string, number> = {
    easy: 25,
    medium: 40,
    hard: 60,
  };

  const SHOP = [
    {
      itemName: "Sour Patch Kids",
      itemDescription: "370 g bag",
      purchasePrice: 20,
      stock: 50,
    },
    {
      itemName: "LED Strips",
      itemDescription: "10 ft",
      purchasePrice: 60,
      stock: 30,
    },
    {
      itemName: "Screwdrivers",
      itemDescription: "11 piece set",
      purchasePrice: 90,
      stock: 30,
    },
    {
      itemName: "Tamagotchi",
      itemDescription: "Original",
      purchasePrice: 120,
      stock: 30,
    },
    {
      itemName: "Microcontroller",
      itemDescription: "Raspberry Pi Pico",
      purchasePrice: 150,
      stock: 30,
    },
    {
      itemName: "Charger",
      itemDescription: "Anker MagGo",
      purchasePrice: 250,
      stock: 30,
    },
  ];

  for (const item of SHOP) {
    const [existing] = await db
      .select({ id: shopItems.id })
      .from(shopItems)
      .where(eq(shopItems.itemName, item.itemName))
      .limit(1);
    if (existing) {
      await db
        .update(shopItems)
        .set({ ...item, updatedAt: new Date() })
        .where(eq(shopItems.id, existing.id));
    } else {
      await db.insert(shopItems).values({ ...item, name: item.itemName });
    }
    console.log(
      `${item.itemName}: ${item.purchasePrice} pts, ${item.stock} in stock`,
    );
  }

  for (const [difficulty, points] of Object.entries(CHALLENGE_POINTS)) {
    const rows = await db
      .update(challenges)
      .set({ points })
      .where(eq(challenges.difficulty, difficulty))
      .returning({ id: challenges.id });
    console.log(`${rows.length} ${difficulty} challenges: ${points} pts`);
  }
}

main().then(() => process.exit(0));
