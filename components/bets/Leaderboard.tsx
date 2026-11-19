import Link from "next/link";

import { cn } from "@/lib/utils";

export type LeaderRow = { rank: number; userId: string; name: string; net: number; plays: number };

export function LeaderList({ rows, me, compact }: { rows: LeaderRow[]; me?: string; compact?: boolean }) {
  if (rows.length === 0)
    return <p className="px-5 py-8 text-center text-sm text-textMuted">No one has won or lost yet. Be the first.</p>;
  return (
    <ol className="divide-y divide-border">
      {rows.map((r) => (
        <li
          key={r.userId}
          className={cn("flex items-center gap-3 px-5", compact ? "py-2.5" : "py-3.5", r.userId === me && "bg-brandSoft")}
        >
          <span
            className={cn(
              "grid size-7 shrink-0 place-items-center rounded-full text-xs font-bold tabular-nums",
              r.rank === 1 ? "bg-gold text-ink" : r.rank <= 3 ? "bg-goldSoft text-goldInk" : "bg-backgroundMuted text-textSecondary",
            )}
          >
            {r.rank}
          </span>
          <span className="min-w-0 flex-1 truncate text-sm font-medium text-textPrimary">
            {r.name}
            {r.userId === me && <span className="ml-1.5 text-xs text-primary">You</span>}
          </span>
          {!compact && <span className="text-xs text-textMuted">{r.plays} plays</span>}
          <span className={cn("w-16 text-right text-sm font-bold tabular-nums", r.net >= 0 ? "text-success" : "text-textSecondary")}>
            {r.net >= 0 ? "+" : ""}
            {r.net}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function Panel({ title, action, children }: { title: string; action?: { href: string; label: string }; children: React.ReactNode }) {
  return (
    <section className="overflow-hidden rounded-2xl border border-border bg-surface shadow-card">
      <header className="flex items-center justify-between border-b border-border px-5 py-3.5">
        <h2 className="text-sm font-bold text-textPrimary">{title}</h2>
        {action && (
          <Link href={action.href} className="text-xs font-medium text-primary hover:underline">
            {action.label}
          </Link>
        )}
      </header>
      {children}
    </section>
  );
}
