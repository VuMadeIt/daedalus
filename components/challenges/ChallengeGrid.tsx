"use client";

import { useMemo, useState } from "react";
import { ArrowUpDown, Trophy } from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { ChallengeWithStatus } from "@/app/(dashboard)/challenges/page";

import { categoryLabel, ChallengeCard } from "./ChallengeCard";

type Tab = "available" | "completed";

export function ChallengeGrid({
  challenges,
  currentUser,
}: {
  challenges: ChallengeWithStatus[];
  currentUser: User;
}) {
  const [items, setItems] = useState(challenges);
  const [tab, setTab] = useState<Tab>("available");
  const [category, setCategory] = useState("all");
  const [desc, setDesc] = useState(true);

  const categories = useMemo(
    () => [...new Set(challenges.map((c) => c.category.toLowerCase()))],
    [challenges],
  );

  const shown = useMemo(
    () =>
      items
        .filter((c) => c.status !== "not_yet_available" && c.status !== "deadline_passed")
        .filter((c) => (tab === "completed" ? c.status === "completed" : c.status !== "completed"))
        .filter((c) => category === "all" || c.category.toLowerCase() === category)
        .sort(
          (a, b) =>
            Number(b.status === "in_progress") - Number(a.status === "in_progress") ||
            (desc ? b.points - a.points : a.points - b.points),
        ),
    [items, tab, category, desc],
  );

  const onStartChallenge = async (challenge: ChallengeWithStatus) => {
    const response = await fetch("/api/challenges/start", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: currentUser.id, challengeId: challenge.id }),
    });

    if (!response.ok) {
      toast.error("Couldn't start that challenge. Try again in a moment.");
      return;
    }

    setItems((prev) =>
      prev.map((c) => (c.id === challenge.id ? { ...c, status: "in_progress" } : c)),
    );
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
        <div className="flex rounded-lg border border-border bg-[#ececea] p-0.5">
          {(["available", "completed"] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={cn(
                "rounded-md px-3.5 py-1.5 text-sm capitalize transition-colors",
                tab === t ? "bg-ink text-white shadow-card" : "text-textSecondary hover:text-textPrimary",
              )}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex overflow-x-auto rounded-lg border border-border bg-white">
            {["all", ...categories].map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "border-r border-border px-3.5 py-1.5 text-sm whitespace-nowrap last:border-r-0",
                  category === c ? "font-medium text-textPrimary" : "text-textMuted hover:text-textSecondary",
                )}
              >
                {c === "all" ? "All Challenges" : categoryLabel(c).replace(" Challenge", "")}
              </button>
            ))}
          </div>
          <button
            onClick={() => setDesc(!desc)}
            className="flex items-center gap-2 rounded-lg bg-ink px-3.5 py-1.5 text-sm text-white"
            aria-label={desc ? "Sort by points, lowest first" : "Sort by points, highest first"}
          >
            Points
            <ArrowUpDown className="size-3.5" />
          </button>
        </div>
      </div>

      {shown.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white px-6 py-14 text-center">
          <div className="mb-4 rounded-full bg-coralSoft p-3">
            <Trophy className="size-6 text-coral" />
          </div>
          <h3 className="text-lg font-bold text-textPrimary">
            {tab === "completed" ? "Nothing finished yet" : "No challenges right now"}
          </h3>
          <p className="mt-1 max-w-sm text-sm text-textMuted">
            {tab === "completed"
              ? "Challenges you finish show up here with the points you earned."
              : "New challenges drop throughout the weekend. Check back soon."}
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {shown.map((challenge) => (
            <ChallengeCard
              key={challenge.id}
              challenge={challenge}
              user={currentUser}
              onStartChallenge={onStartChallenge}
            />
          ))}
        </div>
      )}
    </div>
  );
}
