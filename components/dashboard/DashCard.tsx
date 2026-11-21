import { cn } from "@/lib/utils";

import LockedState from "./LockedState";

const tones = {
  coral: "bg-brandSoft text-brand",
  cream: "bg-cream text-goldInk",
  mint: "bg-mint text-success",
  sky: "bg-sky text-primary",
  ink: "bg-ink text-white",
};

type Props = {
  title: string;
  description: React.ReactNode;
  icon: React.ReactNode;
  tone?: keyof typeof tones;
  action?: React.ReactNode;
  locked?: string | false;
  className?: string;
  children?: React.ReactNode;
};

export const DashCard = ({
  title,
  description,
  icon,
  tone = "coral",
  action,
  locked,
  className,
  children,
}: Props) => (
  <div
    className={cn(
      "relative flex h-full min-h-[220px] flex-col gap-3 rounded-2xl border border-border bg-surface p-6 shadow-card transition-shadow duration-200 hover:shadow-float",
      locked && "hover:shadow-card",
      className,
    )}
  >
    <div className="flex items-start justify-between gap-4">
      <h2 className="text-lg font-bold text-textPrimary">{title}</h2>
      <span
        className={cn(
          "grid size-9 shrink-0 place-items-center rounded-xl [&_svg]:size-[18px]",
          locked ? "bg-backgroundMuted text-textMuted" : tones[tone],
        )}
      >
        {icon}
      </span>
    </div>
    <p className="text-sm leading-relaxed text-textMuted">{description}</p>
    {children}
    {action && (
      <div className={cn("mt-auto flex items-center gap-2 pt-3", locked && "pointer-events-none opacity-50")}>
        {action}
      </div>
    )}
    {locked && <LockedState label={locked} />}
  </div>
);
