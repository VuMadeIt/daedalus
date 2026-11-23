"use client";

import { Coins, Mail, ShoppingBag, User, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { ShopRedeemData } from "@/hooks/useQRScanner";
import type { UserVerifyData } from "@/app/api/check-ins/verify/route";

interface ShopRedeemConfirmDialogProps {
  shopData: ShopRedeemData;
  userData: UserVerifyData;
  isOpen: boolean;
  isLoading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ShopRedeemConfirmDialog({
  shopData,
  userData,
  isOpen,
  isLoading,
  onConfirm,
  onCancel,
}: ShopRedeemConfirmDialogProps) {
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
            <ShoppingBag className="size-6 text-primary" />
          </div>
          <h2 className="text-lg font-bold text-textPrimary">
            Hand over this prize?
          </h2>
          <p className="mt-1 text-sm text-textMuted">
            The points come off their balance when you confirm.
          </p>
        </div>

        {/* Item Details */}
        <div className="mb-4 rounded-xl bg-backgroundMuted p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-textMuted">Item</p>
              <p className="text-lg font-semibold text-textPrimary">
                {shopData.itemName}
              </p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-goldSoft px-3 py-1.5">
              <Coins className="size-4 text-goldInk" />
              <span className="font-bold text-goldInk">
                {shopData.price} pts
              </span>
            </div>
          </div>
        </div>

        {/* User Details */}
        <div className="space-y-3 rounded-xl bg-backgroundMuted p-4">
          {/* Full name */}
          <div className="flex items-start gap-3">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-surface">
              <User className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-medium text-textMuted">
                Hacker
              </p>
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
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Button onClick={onConfirm} disabled={isLoading} loading={isLoading} className="flex-1">
            {isLoading ? "Handing over…" : "Hand over prize"}
          </Button>
          <Button onClick={onCancel} disabled={isLoading} variant="outline" className="flex-1">
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}
