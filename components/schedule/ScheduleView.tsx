import type { Schedule } from "@/lib/db/schema";

import { ScheduleThemeProvider } from "./schedule-theme";
import ScheduleGrid from "./ScheduleGrid";
import ScheduleLegend from "./ScheduleLegend";

interface ScheduleViewProps {
  schedule: Schedule[];
}

export default function ScheduleView({ schedule }: ScheduleViewProps) {
  return (
    <ScheduleThemeProvider value>
      <div className="schedule-light flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <h1 className="text-[28px] leading-tight font-bold tracking-tight text-textPrimary md:text-[32px]">
            Event Schedule
          </h1>
          <p className="text-textSecondary">
            All times are in Eastern Time (ET). Events and times are subject to change.
          </p>
        </div>
        <ScheduleLegend />
        <ScheduleGrid schedule={schedule} />
      </div>
    </ScheduleThemeProvider>
  );
}
