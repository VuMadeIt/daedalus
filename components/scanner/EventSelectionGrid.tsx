"use client";

import Link from "next/link";
import {
  ChevronRight,
  Coins,
  Cookie,
  Plus,
  ScanQrCode,
  ShoppingBag,
  Trophy,
  Utensils,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";

type Tool = {
  href: string;
  title: string;
  body: string;
  icon: LucideIcon;
  organizersOnly?: boolean;
  points?: boolean;
};

const tools: Tool[] = [
  {
    href: "/scanner/hackathon-check-in",
    title: "Hackathon check-in",
    body: "Check hackers in at the door. Do this before any meal or snack scan.",
    icon: ScanQrCode,
  },
  {
    href: "/scanner/challenge",
    title: "Challenges",
    body: "Scan a hacker's challenge QR code to mark it done and give the points.",
    icon: Trophy,
  },
  {
    href: "/scanner/shop-redeem",
    title: "Store pickups",
    body: "Scan a redeem code from the Store and hand over the prize.",
    icon: ShoppingBag,
    organizersOnly: true,
  },
  {
    href: "/points-manager",
    title: "Points manager",
    body: "Find a hacker and give or take back points by hand.",
    icon: Coins,
    organizersOnly: true,
    points: true,
  },
];

const groups: { label: string; icon: LucideIcon; events: string[] }[] = [
  {
    label: "Meals",
    icon: Utensils,
    events: [
      "friday-dinner",
      "saturday-breakfast",
      "saturday-lunch",
      "saturday-dinner",
      "sunday-breakfast",
      "sunday-lunch",
    ],
  },
  {
    label: "Snacks",
    icon: Cookie,
    events: ["snack-1", "snack-2", "snack-3", "snack-4", "snack-5"],
  },
  { label: "Other events", icon: Plus, events: ["extra-1", "extra-2"] },
];

const formatEventName = (event: string) => {
  const words = event.split("-");
  return [words[0][0].toUpperCase() + words[0].slice(1), ...words.slice(1)].join(" ");
};

export function EventSelectionGrid() {
  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <h2 className="text-textPrimary text-base font-bold">Scanners</h2>
        <div className="grid gap-4 md:grid-cols-2">
          {tools.map(({ href, title, body, icon: Icon, organizersOnly, points }) => (
            <Link
              key={href}
              href={href}
              className="group border-border bg-surface shadow-card hover:shadow-float focus-visible:ring-primary/40 flex items-start gap-4 rounded-2xl border p-5 transition-shadow focus-visible:ring-2 focus-visible:outline-hidden"
            >
              <span
                className={cn(
                  "flex size-10 shrink-0 items-center justify-center rounded-xl",
                  points ? "bg-goldSoft text-goldInk" : "bg-primaryLight text-primary",
                )}
              >
                <Icon className="size-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="text-textPrimary group-hover:text-primary text-base font-bold transition-colors">
                    {title}
                  </span>
                  {organizersOnly && (
                    <span className="bg-backgroundMuted text-textSecondary rounded-full px-2 py-0.5 text-xs font-medium">
                      Organizers
                    </span>
                  )}
                </span>
                <span className="text-textMuted mt-1 block text-sm">{body}</span>
              </span>
              <ChevronRight className="text-textMuted mt-2 size-4 shrink-0 transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      </section>

      {groups.map(({ label, icon: Icon, events }) => (
        <section key={label} className="space-y-3">
          <h2 className="text-textPrimary text-base font-bold">{label}</h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {events.map((event) => (
              <Link
                key={event}
                href={`/scanner/${event}`}
                className="group border-border bg-surface hover:border-primary/40 focus-visible:ring-primary/40 flex h-14 items-center gap-3 rounded-2xl border px-4 transition-colors focus-visible:ring-2 focus-visible:outline-hidden"
              >
                <span className="bg-backgroundMuted text-textSecondary group-hover:bg-primaryLight group-hover:text-primary flex size-8 shrink-0 items-center justify-center rounded-lg transition-colors">
                  <Icon className="size-4" />
                </span>
                <span className="text-textPrimary truncate text-sm font-medium">{formatEventName(event)}</span>
              </Link>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
