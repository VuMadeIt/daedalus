"use client";

import { ScheduleType } from "@/types";

import type { Schedule } from "@/lib/db/schema";
import { cn } from "@/lib/utils";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

const eventTypeColors = {
  general:
    "bg-sky-100 hover:bg-sky-200 border-l-2 border-sky-400 shadow-sm dark:bg-sky-500/40 dark:hover:bg-sky-500/50 dark:shadow-none",
  meals:
    "bg-emerald-100 hover:bg-emerald-200 border-l-2 border-emerald-400 shadow-sm dark:bg-emerald-500/40 dark:hover:bg-emerald-500/50 dark:shadow-none",
  ceremonies:
    "bg-amber-100 hover:bg-amber-200 border-l-2 border-amber-400 shadow-sm dark:bg-amber-500/40 dark:hover:bg-amber-500/50 dark:shadow-none",
  workshops:
    "bg-violet-100 hover:bg-violet-200 border-l-2 border-violet-400 shadow-sm dark:bg-violet-500/40 dark:hover:bg-violet-500/50 dark:shadow-none",
  fun: "bg-rose-100 hover:bg-rose-200 border-l-2 border-rose-400 shadow-sm dark:bg-rose-500/40 dark:hover:bg-rose-500/50 dark:shadow-none",
};

interface ScheduleEventProps {
  event: Schedule;
  style: {
    top: string;
    height: string;
    position: "absolute";
    left: string;
    width: string;
    zIndex: number;
  };
}

export default function ScheduleEvent({ event, style }: ScheduleEventProps) {
  const startTime = new Date(event.startTime);
  const endTime = new Date(event.endTime);
  const formatTime = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const period = hours < 12 ? "AM" : "PM";
    const hour12 = hours % 12 || 12;
    return `${hour12}:${minutes} ${period}`;
  };

  const timeStr =
    event.customTime || `${formatTime(startTime)} - ${formatTime(endTime)}`;

  return (
    <HoverCard>
      <div style={style} className="group absolute p-1">
        <HoverCardTrigger
          className={cn(
            "mx-auto flex h-full w-full flex-col justify-start gap-1 overflow-hidden rounded-md px-2 py-3 transition-all duration-200 hover:shadow-md",
            eventTypeColors[event.type as ScheduleType],
          )}
        >
          <h3 className="text-textPrimary truncate text-sm font-medium">
            {event.eventName}
          </h3>
          {event.location && (
            <p className="text-textSecondary truncate text-xs">
              {event.location}
            </p>
          )}
          <p className="text-textSecondary mt-auto text-xs">{timeStr}</p>
        </HoverCardTrigger>

        {event.eventDescription && (
          <HoverCardContent
            className="border-border bg-backgroundMuted backdrop-blur-sm"
            side="bottom"
          >
            <p>{event.eventDescription}</p>
          </HoverCardContent>
        )}
      </div>
    </HoverCard>
  );
}
