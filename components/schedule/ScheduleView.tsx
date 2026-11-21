"use client";

import type { Schedule } from "@/lib/db/schema";

import ScheduleGrid from "./ScheduleGrid";
import ScheduleLegend from "./ScheduleLegend";

interface ScheduleViewProps {
  schedule: Schedule[];
}

export default function ScheduleView({ schedule }: ScheduleViewProps) {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-textPrimary text-[28px] leading-tight font-bold tracking-tight md:text-[32px]">
          Event Schedule
        </h1>
        <p className="text-textSecondary">
          All times are in Eastern Time (ET). Events and times are subject to
          change.
        </p>
      </div>
      <ScheduleLegend />
      <ScheduleGrid schedule={schedule} />
    </div>
  );
}
