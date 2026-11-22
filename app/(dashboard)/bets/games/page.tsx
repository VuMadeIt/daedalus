import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/20/solid";

import { CUPS_PLAYS_PER_DAY } from "@/config/betting";
import { loadBettor } from "@/lib/betting/page-guard";
import { getCupsPlaysToday } from "@/lib/db/queries/betting";
import { BetsHeader } from "@/components/bets/BetsTabs";
import { EmptyPage } from "@/components/EmptyPage";
import PageWrapper from "@/components/PageWrapper";

export const metadata: Metadata = { title: "Mini games" };

export default async function GamesPage() {
  const { userId, allowed } = await loadBettor();
  if (!allowed)
    return (
      <EmptyPage
        title="Mini games"
        message="Mini games are only open to event participants."
      />
    );
  const left = Math.max(
    CUPS_PLAYS_PER_DAY - (await getCupsPlaysToday(userId)),
    0,
  );

  const games = [
    {
      href: "/bets/timber",
      title: "Timber Tycoon",
      tag: "Idle game",
      body: "Chop trees, sell the wood and build a lumber empire between prompts.",
      meta: "Play as long as you like",
      cta: "Play Timber Tycoon",
      art: (
        <Image
          src="/games/timber-title.jpg"
          alt="Timber Tycoon title card"
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      ),
    },
    {
      href: "/bets/cups",
      title: "Cup Shuffle",
      tag: "Bet points",
      body: "Stake some points, watch the cups shuffle, and guess where the ball is.",
      meta: `${left} of ${CUPS_PLAYS_PER_DAY} plays left today`,
      cta: "Play Cup Shuffle",
      art: (
        <div className="from-brandSoft to-surface absolute inset-0 flex items-end justify-center gap-3 bg-gradient-to-b pb-6">
          {[0, 1, 2].map((i) => (
            <Image
              key={i}
              src="/games/cup.svg"
              alt=""
              width={140}
              height={180}
              className={`h-28 w-auto transition-transform duration-500 md:h-32 ${i === 1 ? "group-hover:-translate-y-6" : ""}`}
            />
          ))}
          <span className="bg-gold absolute bottom-7 size-6 rounded-full opacity-0 shadow-[inset_-3px_-3px_0_rgba(0,0,0,0.15)] transition-opacity duration-500 group-hover:opacity-100" />
        </div>
      ),
    },
  ];

  return (
    <PageWrapper>
      <div className="flex flex-col gap-6 md:gap-8">
        <BetsHeader
          title="Mini games"
          lede="Two quick games for the time between prompts. Pick one."
        />
        <div className="grid gap-5 md:grid-cols-2">
          {games.map((g) => (
            <Link
              key={g.href}
              href={g.href}
              className="group border-border bg-surface shadow-card hover:border-primary/40 hover:shadow-float focus-visible:ring-primary/40 flex flex-col overflow-hidden rounded-2xl border transition-all duration-200 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:outline-none"
            >
              <div className="border-border relative aspect-[3/2] overflow-hidden border-b">
                {g.art}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <span className="bg-goldSoft text-goldInk w-fit rounded-full px-2 py-0.5 text-xs font-medium">
                  {g.tag}
                </span>
                <h2 className="text-textPrimary mt-3 text-2xl font-bold tracking-tight">
                  {g.title}
                </h2>
                <p className="text-textSecondary mt-1.5 text-[15px] leading-relaxed">
                  {g.body}
                </p>
                <p className="text-textMuted mt-3 text-sm">{g.meta}</p>
                <span className="bg-primary group-hover:bg-primaryDark mt-5 inline-flex w-fit items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors">
                  {g.cta}
                  <ArrowRightIcon
                    className="size-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden
                  />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </PageWrapper>
  );
}
