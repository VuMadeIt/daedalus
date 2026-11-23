"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Coins, Loader2, Minus, Plus, Search, User, X } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { UserSearchResult } from "@/app/api/users/search/route";

interface AdjustmentResult {
  userName: string;
  points: number;
  message: string;
}

export function PointsManager() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<UserSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserSearchResult | null>(null);
  const [points, setPoints] = useState("");
  const [reason, setReason] = useState("Added via front desk");
  const [submitting, setSubmitting] = useState(false);
  const [lastResult, setLastResult] = useState<AdjustmentResult | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const searchUsers = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setSearching(true);
    try {
      const res = await fetch(`/api/users/search?q=${encodeURIComponent(q)}`);
      const data = await res.json();
      if (data.success) {
        setResults(data.data ?? []);
        setShowDropdown(true);
      }
    } catch {
      toast.error("Failed to search users");
    } finally {
      setSearching(false);
    }
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => searchUsers(query), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query, searchUsers]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleSelectUser = (user: UserSearchResult) => {
    setSelectedUser(user);
    setQuery("");
    setResults([]);
    setShowDropdown(false);
    setLastResult(null);
  };

  const handleClearUser = () => {
    setSelectedUser(null);
    setPoints("");
    setReason("Added via front desk");
    setLastResult(null);
  };

  const handleSubmit = async (mode: "give" | "take") => {
    if (!selectedUser || !points) return;

    const numPoints = parseInt(points, 10);
    if (isNaN(numPoints) || numPoints <= 0 || numPoints > 500) {
      toast.error("Enter a valid number between 1 and 500");
      return;
    }

    const adjustedPoints = mode === "give" ? numPoints : -numPoints;

    setSubmitting(true);
    try {
      const res = await fetch("/api/points/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          points: adjustedPoints,
          reason,
        }),
      });

      const data = await res.json();

      if (data.success) {
        toast.success(data.message);
        setSelectedUser((prev) =>
          prev ? { ...prev, points: prev.points + adjustedPoints } : null,
        );
        setLastResult({
          userName: data.userName || selectedUser.name,
          points: adjustedPoints,
          message: data.message,
        });
        setPoints("");
      } else {
        toast.error(data.message || "Failed to adjust points");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Section */}
      {!selectedUser && (
        <div className="relative" ref={dropdownRef}>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-textMuted" />
            <Input
              placeholder="Search hackers by name or email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-10 pr-10"
              autoFocus
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
            )}
          </div>

          {showDropdown && results.length > 0 && (
            <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-surface shadow-float">
              {results.map((user) => (
                <button
                  key={user.id}
                  onClick={() => handleSelectUser(user)}
                  className="flex w-full items-center gap-3 px-4 py-3 text-left transition-colors hover:bg-backgroundMuted"
                >
                  <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primaryLight">
                    <User className="h-4 w-4 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-medium text-textPrimary">{user.name}</p>
                    <p className="truncate text-sm text-textMuted">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-1 text-sm font-bold text-goldInk tabular-nums">
                    <Coins className="size-3.5" />
                    {user.points.toLocaleString("en-CA")}
                  </div>
                </button>
              ))}
            </div>
          )}

          {showDropdown && query.length >= 2 && results.length === 0 && !searching && (
            <div className="absolute z-50 mt-2 w-full rounded-2xl border border-border bg-surface p-4 text-center text-sm text-textMuted shadow-float">
              No hackers found
            </div>
          )}
        </div>
      )}

      {/* Selected User Card */}
      {selectedUser && (
        <div className="rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex size-11 items-center justify-center rounded-full bg-primaryLight">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-base font-bold text-textPrimary">{selectedUser.name}</p>
                <p className="text-sm text-textMuted">{selectedUser.email}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 rounded-full bg-goldSoft px-3 py-1">
                <Coins className="size-4 text-goldInk" />
                <span className="text-base font-bold text-goldInk tabular-nums">
                  {selectedUser.points.toLocaleString("en-CA")} pts
                </span>
              </div>
              <button
                onClick={handleClearUser}
                className="rounded-full p-1.5 text-textMuted transition-colors hover:bg-backgroundMuted hover:text-textPrimary"
                aria-label="Pick a different hacker"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Points Adjustment Form */}
      {selectedUser && (
        <div className="space-y-4 rounded-2xl border border-border bg-surface p-5 shadow-card">
          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">Points</label>
            <Input
              type="number"
              placeholder="1 to 500"
              value={points}
              onChange={(e) => {
                const val = e.target.value;
                if (val === "" || (parseInt(val) >= 0 && parseInt(val) <= 500)) {
                  setPoints(val);
                }
              }}
              min={1}
              max={500}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-textSecondary">Reason</label>
            <Input
              placeholder="For example, won the trivia round"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row">
            <Button
              onClick={() => handleSubmit("give")}
              disabled={submitting || !points}
              loading={submitting}
              className="flex-1"
            >
              <Plus className="h-4 w-4" />
              Give points
            </Button>
            <Button
              onClick={() => handleSubmit("take")}
              disabled={submitting || !points}
              loading={submitting}
              variant="outline"
              className="flex-1 hover:text-error"
            >
              <Minus className="h-4 w-4" />
              Take back points
            </Button>
          </div>
        </div>
      )}

      {/* Last Adjustment Result */}
      {lastResult && (
        <div
          className={cn(
            "rounded-2xl p-4 text-center",
            lastResult.points > 0
              ? "bg-mint"
              : "bg-error/10",
          )}
        >
          <p className="font-medium text-textPrimary">
            {lastResult.points > 0 ? "+" : ""}
            {lastResult.points} points{" "}
            {lastResult.points > 0 ? "given to" : "taken from"}{" "}
            <span className="font-bold">{lastResult.userName}</span>
          </p>
        </div>
      )}
    </div>
  );
}
