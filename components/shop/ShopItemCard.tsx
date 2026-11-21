"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import {
  BoltIcon,
  CakeIcon,
  CpuChipIcon,
  GiftIcon,
  LightBulbIcon,
  PuzzlePieceIcon,
  SparklesIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import { QRCodeSVG } from "qrcode.react";

import type { ShopItem } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ShopItemCardProps {
  item: ShopItem;
  userId: string;
  points: number;
  purchaseCount?: number;
}

const LOW_STOCK = 5;

type Art = { re: RegExp; Icon: typeof GiftIcon; tone: string; photo?: string };

const ART: Art[] = [
  { re: /charg|cable|power|battery/i, Icon: BoltIcon, tone: "bg-brandSoft text-primary", photo: "/shop/charger.jpg" },
  { re: /led|light|lamp/i, Icon: LightBulbIcon, tone: "bg-goldSoft text-goldInk", photo: "/shop/led-strips.jpg" },
  { re: /screw|tool|wrench/i, Icon: WrenchScrewdriverIcon, tone: "bg-backgroundMuted text-textSecondary", photo: "/shop/screwdrivers.jpg" },
  { re: /candy|sour|snack|chocolate|kids/i, Icon: CakeIcon, tone: "bg-mint text-success", photo: "/shop/sour-patch-kids.jpg" },
  { re: /micro|arduino|pi\b|pico|board|chip/i, Icon: CpuChipIcon, tone: "bg-brandSoft text-primary", photo: "/shop/microcontroller.jpg" },
  { re: /tamagotchi|game|toy/i, Icon: PuzzlePieceIcon, tone: "bg-goldSoft text-goldInk", photo: "/shop/tamagotchi.jpg" },
  { re: /shirt|hoodie|sock|hat|sticker/i, Icon: SparklesIcon, tone: "bg-mint text-success" },
];

function artFor(name: string) {
  return ART.find((a) => a.re.test(name)) ?? { Icon: GiftIcon, tone: "bg-backgroundMuted text-textMuted", photo: undefined };
}

function ItemImage({ item, className }: { item: ShopItem; className?: string }) {
  const { Icon, tone, photo } = artFor(item.itemName);
  const src = item.image || photo;
  const [failed, setFailed] = useState(false);
  const showPhoto = src && !failed;
  return (
    <div className={cn("relative grid place-items-center overflow-hidden", showPhoto ? "bg-white" : tone, className)}>
      {showPhoto ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={item.itemName}
          onError={() => setFailed(true)}
          className="h-full w-full object-contain p-4 transition-transform duration-300 group-hover:scale-[1.04]"
        />
      ) : (
        <Icon className="size-12 transition-transform duration-300 group-hover:scale-105 group-hover:-rotate-3" strokeWidth={1.5} aria-hidden />
      )}
    </div>
  );
}

export function ShopItemCard({ item, userId, points, purchaseCount = 0 }: ShopItemCardProps) {
  const soldOut = item.stock !== null && item.stock <= 0;
  const lowStock = !soldOut && item.stock !== null && item.stock <= LOW_STOCK;
  const after = points - item.purchasePrice;
  const short = after < 0;
  const qrPayload = JSON.stringify({
    type: "shop-redeem",
    userId,
    itemId: item.id,
    itemName: item.itemName,
    price: item.purchasePrice,
  });

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-card transition-shadow duration-200 hover:shadow-float">
      <div className="absolute top-3 right-3 left-3 z-10 flex justify-between gap-2">
        {purchaseCount > 0 ? (
          <span className="rounded-full bg-mint px-2.5 py-0.5 text-[11px] font-medium text-success">
            Redeemed {purchaseCount}x
          </span>
        ) : (
          <span />
        )}
        {lowStock && (
          <span className="rounded-full bg-cream px-2.5 py-0.5 text-[11px] font-medium text-goldInk">
            low stock
          </span>
        )}
      </div>

      <ItemImage item={item} className="h-44" />

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-[17px] font-medium text-textPrimary">{item.itemName}</h3>
            <p className="line-clamp-1 text-[13px] text-textMuted">{item.itemDescription}</p>
          </div>
          <span className="shrink-0 pt-0.5 text-[15px] font-bold text-textPrimary tabular-nums">
            {item.purchasePrice} pts
          </span>
        </div>

        {soldOut ? (
          <Button disabled className="mt-auto w-full bg-backgroundMuted text-textSecondary opacity-100 shadow-none">
            Sold out
          </Button>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
              <Button className="mt-auto w-full">Redeem</Button>
            </DialogTrigger>
            <DialogContent className="gap-0 p-0 sm:max-w-[640px]">
              <div className="grid sm:grid-cols-2">
                <div className="flex flex-col gap-4 border-border p-6 max-sm:border-b sm:border-r">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-xl font-medium">Checkout</DialogTitle>
                    <DialogDescription>
                      {short ? "You're a few points short for this one." : "Show this code to an organizer at the prize desk."}
                    </DialogDescription>
                  </DialogHeader>
                  {short ? (
                    <ItemImage item={item} className="aspect-square rounded-xl" />
                  ) : (
                    <div className="mx-auto rounded-xl border border-border bg-white p-3 shadow-card">
                      <QRCodeSVG value={qrPayload} size={196} level="H" />
                    </div>
                  )}
                  <p className="text-xs text-textMuted">
                    Points come off your balance once the organizer scans this code.
                  </p>
                </div>

                <div className="flex flex-col gap-4 p-6">
                  <h3 className="text-lg font-medium text-textPrimary">Order summary</h3>
                  <div className="flex justify-between text-sm">
                    <span className="text-textSecondary">{item.itemName}</span>
                    <span className="font-medium text-textPrimary">{item.purchasePrice} pts</span>
                  </div>
                  <div className="h-px bg-border" />
                  <div className="flex justify-between text-sm">
                    <span className="text-textMuted">Available balance</span>
                    <span className="text-textSecondary tabular-nums">{points} pts</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium text-textPrimary">Total</span>
                    <span className="text-lg font-bold text-textPrimary tabular-nums">{item.purchasePrice} pts</span>
                  </div>

                  {short ? (
                    <div className="flex gap-2 rounded-lg border border-brand/30 bg-brandSoft p-3 text-brand">
                      <AlertCircle className="mt-0.5 size-4 shrink-0" />
                      <div className="text-xs">
                        <p className="font-bold">Not enough points</p>
                        <p>You need {-after} more points for this item.</p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-1.5 rounded-lg border border-border p-3">
                      <div className="flex justify-between text-[11px] text-textMuted">
                        <span>Points after redeeming</span>
                        <span>Current balance</span>
                      </div>
                      <div className="flex justify-between text-sm font-bold text-textPrimary tabular-nums">
                        <span>{after} pts</span>
                        <span>{points} pts</span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-backgroundMuted">
                        <div
                          className="h-full rounded-full bg-ink"
                          style={{ width: `${points ? (after / points) * 100 : 0}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </div>
  );
}
