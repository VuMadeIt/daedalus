"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

const tabs = [
  { href: "/bets", label: "Bets" },
  { href: "/bets/cups", label: "Mini games" },
  { href: "/bets/leaderboard", label: "Leaderboard" },
];

export function BetsTabs() {
  const pathname = usePathname();
  const current =
    tabs.find((t) => t.href !== "/bets" && pathname.startsWith(t.href))?.href ?? "/bets";
  return (
    <nav aria-label="Bet Points sections" className="flex w-fit gap-1 rounded-xl border border-border bg-surface p-1 shadow-card">
      {tabs.map((t) => (
        <Link
          key={t.href}
          href={t.href}
          aria-current={current === t.href ? "page" : undefined}
          className={cn(
            "rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors",
            current === t.href ? "bg-ink text-white dark:bg-primary" : "text-textSecondary hover:text-textPrimary",
          )}
        >
          {t.label}
        </Link>
      ))}
    </nav>
  );
}

export function BetsHeader({ title, lede }: { title: string; lede: string }) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
      <div className="space-y-1.5">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight text-textPrimary md:text-[32px]">{title}</h1>
        <p className="max-w-xl text-[15px] text-textSecondary">{lede}</p>
      </div>
      <BetsTabs />
    </div>
  );
}
