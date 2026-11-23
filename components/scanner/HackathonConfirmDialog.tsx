"use client";

import { AlertTriangle, CheckCircle2, Mail, User, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { UserVerifyData } from "@/app/api/check-ins/verify/route";

interface HackathonConfirmDialogProps {
  userData: UserVerifyData;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function HackathonConfirmDialog({
  userData,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: HackathonConfirmDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onCancel}
      />

      {/* Dialog */}
      <div className="relative z-10 mx-4 w-full max-w-md rounded-2xl border border-border bg-surface p-6 shadow-float">
        {/* Close button */}
        <button
          onClick={onCancel}
          aria-label="Close"
          className="absolute top-4 right-4 rounded-md p-1 text-textMuted transition-colors hover:text-textPrimary"
        >
          <X className="size-5" aria-hidden />
        </button>

        {/* Header */}
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex size-12 items-center justify-center rounded-2xl bg-primaryLight">
            <CheckCircle2 className="size-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-textPrimary">
            Check in this hacker?
          </h2>
          <p className="mt-1 text-sm text-textMuted">
            Match the name to their government ID first.
          </p>
        </div>

        {/* User Details */}
        <div className="space-y-4 rounded-xl bg-backgroundMuted p-4">
          {/* Full name */}
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-textMuted">Full name</p>
              <p className="text-lg font-semibold text-textPrimary">
                {userData.fullName}
              </p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface">
              <Mail className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-textMuted">Email</p>
              <p className="text-base text-textPrimary">{userData.email}</p>
            </div>
          </div>

          {/* Age with Under-18 Warning */}
          <div className="flex items-start gap-3">
            <div
              className={cn(
                "flex h-9 w-9 shrink-0 items-center justify-center rounded-full",
                userData.isUnder18 ? "bg-goldSoft" : "bg-primary/20",
              )}
            >
              {userData.isUnder18 ? (
                <AlertTriangle className="h-4 w-4 text-goldInk" />
              ) : (
                <User className="h-4 w-4 text-primary" />
              )}
            </div>
            <div>
              <p className="text-xs font-medium text-textMuted">Age</p>
              <div className="flex items-center gap-2">
                <p
                  className={cn(
                    "text-lg font-semibold",
                    userData.isUnder18 ? "text-goldInk" : "text-textPrimary",
                  )}
                >
                  {userData.age !== null ? userData.age : "Unknown"}
                </p>
                {userData.isUnder18 && (
                  <span className="rounded-full bg-goldSoft px-2 py-0.5 text-xs font-medium text-goldInk">
                    Minor
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Under-18 Warning */}
        {userData.isUnder18 && (
          <div className="mt-4 rounded-xl bg-goldSoft p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-goldInk" />
              <div>
                <p className="font-semibold text-goldInk">
                  Needs a signed parental consent form
                </p>
                <p className="mt-1 text-sm text-textSecondary">
                  This participant is under 18 years old. Please verify that
                  they have a signed parental consent form before proceeding
                  with check-in.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onConfirm} disabled={isLoading} loading={isLoading} className="flex-1">
            {isLoading ? "Checking in…" : "Check in"}
          </Button>
          <Button onClick={onCancel} disabled={isLoading} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
