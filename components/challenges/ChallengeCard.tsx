import { Check, ChevronRight, Lock } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";

import { QR_LOGO_SRC } from "@/config/qr-code";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ChallengeStatus,
  ChallengeWithStatus,
} from "@/app/(dashboard)/challenges/page";

const palettes: Record<string, { band: string; ring: string }> = {
  social: { band: "bg-goldSoft", ring: "border-gold/40" },
  event: { band: "bg-brandSoft", ring: "border-primary/30" },
  physical: { band: "bg-mint", ring: "border-success/30" },
};
const fallback = { band: "bg-backgroundMuted", ring: "border-border" };

export const categoryLabel = (c: string) =>
  `${c.charAt(0).toUpperCase()}${c.slice(1)} Challenge`;

const steps = ["Start", "Submitted", "Pending approval", "Redeemed"];
const stepFor: Record<ChallengeStatus, number> = {
  not_started: -1,
  in_progress: 0,
  completed: 3,
  deadline_passed: -1,
  not_yet_available: -1,
};

function Steps({ status }: { status: ChallengeStatus }) {
  const at = stepFor[status];
  return (
    <ol className="grid grid-cols-4">
      {steps.map((label, i) => (
        <li key={label} className="relative flex flex-col items-center gap-1.5 text-center">
          {i > 0 && (
            <span
              className={cn(
                "absolute top-2 right-[calc(50%+12px)] h-px w-[calc(100%-24px)] -translate-y-1/2",
                i <= at ? "bg-ink" : "bg-border",
              )}
            />
          )}
          <span
            className={cn(
              "relative grid size-4 place-items-center rounded-full border",
              i <= at ? "border-ink bg-ink text-white" : "border-border bg-surface",
            )}
          >
            {i <= at && <Check className="size-2.5" strokeWidth={3} />}
          </span>
          <span className={cn("px-1 text-[11px] leading-tight", i <= at ? "text-textPrimary" : "text-textMuted")}>
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function ChallengeCard({
  challenge,
  user,
  onStartChallenge,
}: {
  challenge: ChallengeWithStatus;
  user: User;
  onStartChallenge: (challenge: ChallengeWithStatus) => void;
}) {
  const p = palettes[challenge.category.toLowerCase()] ?? fallback;
  const done = challenge.status === "completed";

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className={cn(
            "group flex w-full flex-col overflow-hidden rounded-2xl border text-left shadow-card transition-shadow hover:shadow-float focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
            p.ring,
            p.band,
          )}
        >
          <div className="flex items-center justify-between px-4 py-2">
            <span className="text-sm text-textSecondary">{categoryLabel(challenge.category)}</span>
            <span className="rounded-full bg-surface px-2 py-0.5 text-[11px] font-medium text-textPrimary">
              {done ? "Completed" : `${challenge.points} pts`}
            </span>
          </div>
          <div className="flex min-h-[72px] items-center justify-between gap-3 rounded-2xl bg-surface px-5 py-4">
            <span className="text-lg font-medium text-textPrimary">{challenge.name}</span>
            <span
              className={cn(
                "grid size-6 shrink-0 place-items-center rounded-full transition-transform group-hover:translate-x-0.5",
                done ? "bg-mint text-success" : "bg-ink text-white",
              )}
            >
              {done ? <Check className="size-3.5" strokeWidth={3} /> : <ChevronRight className="size-3.5" strokeWidth={3} />}
            </span>
          </div>
        </button>
      </DialogTrigger>

      <DialogContent className="gap-5 sm:max-w-[680px] [&>*]:min-w-0">
        <DialogHeader className="text-left">
          <span className={cn("w-fit rounded-full px-2.5 py-0.5 text-xs text-textSecondary", p.band)}>
            {categoryLabel(challenge.category)}, {challenge.points} pts, {challenge.difficulty}
          </span>
          <DialogTitle className="pt-1 text-2xl font-medium">{challenge.name}</DialogTitle>
          <DialogDescription>{challenge.instructions || challenge.shortDescription}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col items-center gap-3 rounded-xl border border-border bg-backgroundMuted p-4">
            <span className="self-start text-xs font-medium text-textPrimary">
              {challenge.qrCode ? "Show this QR code" : "How to submit"}
            </span>
            {challenge.qrCode && challenge.status !== "not_started" ? (
              <div className="rounded-lg bg-white p-3 shadow-card">
                <QRCodeSVG
                  value={JSON.stringify({ userId: user.id, challengeId: challenge.id })}
                  size={168}
                  level="H"
                  imageSettings={{ src: QR_LOGO_SRC, height: 40, width: 40, excavate: true }}
                />
              </div>
            ) : challenge.qrCode ? (
              <div className="grid size-[192px] place-items-center rounded-lg bg-backgroundMuted text-textMuted">
                <Lock className="size-6" />
              </div>
            ) : null}
            <p className="text-center text-xs text-textMuted">
              {challenge.qrCode
                ? challenge.status === "not_started"
                  ? "Start the challenge to unlock your code."
                  : "A volunteer scans this to give you points."
                : challenge.submissionInstructions}
            </p>
          </div>

          <div className="flex flex-col gap-3 rounded-xl border border-border p-4">
            <span className="text-xs font-medium text-textPrimary">Hints</span>
            {challenge.hints.length ? (
              <ul className="list-inside list-disc space-y-1 text-sm text-textSecondary">
                {challenge.hints.map((hint) => (
                  <li key={hint}>{hint}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-textMuted">No hints for this one. You&apos;ve got it.</p>
            )}
            {challenge.qrCode && (
              <p className="mt-auto text-xs text-textMuted">{challenge.submissionInstructions}</p>
            )}
          </div>
        </div>

        <Steps status={challenge.status} />

        {challenge.status === "not_started" && (
          <Button className="w-full" onClick={() => onStartChallenge(challenge)}>
            Start challenge
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
}
