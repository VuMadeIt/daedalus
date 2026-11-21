import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowLeftIcon,
  ArrowTopRightOnSquareIcon,
} from "@heroicons/react/20/solid";

import { loadBettor } from "@/lib/betting/page-guard";
import PageWrapper from "@/components/PageWrapper";

export const metadata: Metadata = { title: "Timber Tycoon" };

const GAME_URL =
  process.env.NEXT_PUBLIC_TIMBER_URL ??
  "https://vumadeit.github.io/hackcanada-minigame/";

export default async function TimberPage() {
  await loadBettor();
  return (
    <PageWrapper>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-3">
          <Link
            href="/bets/games"
            className="text-textMuted hover:text-textPrimary inline-flex items-center gap-1.5 text-sm"
          >
            <ArrowLeftIcon className="size-4" /> Mini games
          </Link>
          <a
            href={GAME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary inline-flex items-center gap-1.5 text-sm font-medium hover:underline"
          >
            Open full screen <ArrowTopRightOnSquareIcon className="size-4" />
          </a>
        </div>
        <h1 className="text-textPrimary text-[28px] leading-tight font-bold tracking-tight md:text-[32px]">
          Timber Tycoon
        </h1>
        <div className="border-border bg-ink shadow-card overflow-hidden rounded-2xl border">
          <iframe
            src={GAME_URL}
            title="Timber Tycoon"
            className="block h-[calc(100dvh-220px)] min-h-[520px] w-full"
            allow="autoplay"
          />
        </div>
      </div>
    </PageWrapper>
  );
}
