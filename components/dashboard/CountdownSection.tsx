"use client";

import Image from "next/image";

import { useHackathonPhase } from "@/hooks/useHackathonPhase";

import { CountdownTimer } from "../ui/CountdownTimer";

export const CountdownSection = () => {
  const { isFeatureEnabled, eventDate } = useHackathonPhase();

  if (!isFeatureEnabled("showCountdown")) {
    return null;
  }

  return (
    <div className="relative flex flex-col justify-between gap-8 overflow-hidden rounded-2xl border border-border bg-white p-6 shadow-card md:p-8 lg:col-span-2">
      <CountdownTimer targetDate={eventDate} />
      <div className="flex items-center gap-4">
        <Image
          src="/hack-canada-logo.png"
          alt="Hack Canada"
          width={48}
          height={48}
          className="size-12 rounded-full"
        />
        <div>
          <p className="font-bold text-textPrimary">Doors open soon</p>
          <p className="text-sm text-textMuted">Pack a charger. We&apos;ll handle the snacks.</p>
        </div>
      </div>
    </div>
  );
};
