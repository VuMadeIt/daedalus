import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Search, Users } from "lucide-react";

import { MAX_TEAM_SIZE } from "@/config/apply";

const choices = [
  {
    href: "/apply/teams/new",
    title: "Start a team",
    body: "Name your team, say who you're looking for, and share one link.",
    points: ["You approve every request", "Apply together in one go"],
    cta: "Create team",
    image: "/beaver-idea.png",
    icon: Users,
    tone: "bg-brandSoft text-primary",
  },
  {
    href: "/apply/teams/browse",
    title: "Join a team",
    body: "Browse public teams with open spots and send a quick request.",
    points: ["See skills each team needs", "Hear back from the owner"],
    cta: "Browse teams",
    image: "/beaver-laptop.png",
    icon: Search,
    tone: "bg-goldSoft text-goldInk",
  },
];

const steps = [
  ["Form or find a team", `Up to ${MAX_TEAM_SIZE} people, all optional.`],
  ["Everyone applies", "Each person still submits their own answers."],
  ["Decisions together", "Teams are reviewed side by side."],
];

export function TeamChoices() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {choices.map(({ href, title, body, points, cta, image, icon: Icon, tone }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-float focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none md:p-7"
          >
            <div className="flex items-start justify-between gap-4">
              <span className={`grid size-11 place-items-center rounded-xl ${tone}`}>
                <Icon className="size-5" aria-hidden />
              </span>
              <Image
                src={image}
                alt=""
                width={112}
                height={112}
                className="-mt-2 -mr-2 size-24 object-contain transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105 md:size-28"
              />
            </div>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-textPrimary">{title}</h2>
            <p className="mt-1.5 max-w-sm text-[15px] leading-relaxed text-textSecondary">{body}</p>
            <ul className="mt-5 space-y-2">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-textSecondary">
                  <Check className="size-4 text-success" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-primaryDark">
              {cta}
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <ol className="grid gap-px overflow-hidden rounded-2xl border border-border bg-border sm:grid-cols-3">
        {steps.map(([title, body], i) => (
          <li key={title} className="flex gap-3 bg-surface p-5">
            <span className="grid size-7 shrink-0 place-items-center rounded-full bg-ink text-xs font-bold text-white dark:bg-primary">
              {i + 1}
            </span>
            <div>
              <p className="text-sm font-bold text-textPrimary">{title}</p>
              <p className="mt-0.5 text-sm text-textMuted">{body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
