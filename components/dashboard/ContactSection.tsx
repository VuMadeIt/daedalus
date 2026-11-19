"use client";

import Link from "next/link";
import { HelpCircle, Mail } from "lucide-react";

import { useHackathonPhase } from "@/hooks/useHackathonPhase";

import { buttonVariants } from "../ui/button";

const messages = {
  "pre-event": "Questions about the event, travel or your application? We usually reply within a day.",
  "during-event": "Find any organizer in a Hack Canada shirt, or send us a message and we'll come to you.",
  "post-event": "Thanks for spending the weekend with us. Send us your feedback, we read all of it.",
};

export const ContactSection = () => {
  const { features } = useHackathonPhase();

  return (
    <div className="flex h-full flex-col gap-3 rounded-2xl border border-border bg-brandSoft p-6">
      <span className="grid size-9 place-items-center rounded-xl bg-surface text-brand">
        <HelpCircle className="size-[18px]" />
      </span>
      <h2 className="text-lg font-bold text-textPrimary">Need a hand?</h2>
      <p className="text-sm leading-relaxed text-textSecondary">
        {messages[features.contactMessage]}
      </p>
      <div className="mt-auto flex flex-wrap gap-2 pt-3">
        <Link
          href="https://hackcanada.org/#faq"
          target="_blank"
          className={buttonVariants({ variant: "outline" })}
        >
          Read the FAQ
        </Link>
        <Link href="mailto:hi@hackcanada.org" className={buttonVariants({ variant: "secondary" })}>
          <Mail className="size-4" />
          Email us
        </Link>
      </div>
    </div>
  );
};
