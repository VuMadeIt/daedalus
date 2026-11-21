import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon } from "@heroicons/react/20/solid";

import { MAX_TEAM_SIZE } from "@/config/apply";

const choices = [
  {
    href: "/apply/teams/new",
    title: "Start a team",
    body: "Name your team, say who you're looking for, and share one link.",
    points: ["You approve every request", "Apply together in one go"],
    cta: "Create team",
    image: { src: "/teams/start-team.png", width: 432, height: 360 },
  },
  {
    href: "/apply/teams/browse",
    title: "Join a team",
    body: "Browse public teams with open spots and send a quick request.",
    points: ["See skills each team needs", "Hear back from the owner"],
    cta: "Browse teams",
    image: { src: "/teams/join-team.png", width: 974, height: 559 },
  },
];

const steps = [
  ["Form or find a team", `Up to ${MAX_TEAM_SIZE} people. Teams are optional.`],
  ["Everyone applies", "Each person still submits their own answers."],
  ["Reviewed together", "Your team gets its decisions side by side."],
];

export function TeamChoices() {
  return (
    <div className="space-y-6">
      <div className="grid gap-5 md:grid-cols-2">
        {choices.map(({ href, title, body, points, cta, image }) => (
          <Link
            key={href}
            href={href}
            className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-surface p-6 shadow-card transition-all duration-200 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-float focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <h2 className="text-2xl font-bold tracking-tight text-textPrimary">{title}</h2>
                <p className="mt-1.5 max-w-xs text-[15px] leading-relaxed text-textSecondary">{body}</p>
              </div>
              <div className="flex h-20 w-28 shrink-0 items-start justify-end">
                <Image
                  src={image.src}
                  alt=""
                  width={image.width}
                  height={image.height}
                  className="h-20 w-auto max-w-28 object-contain transition-transform duration-300 group-hover:-rotate-3 group-hover:scale-105"
                />
              </div>
            </div>
            <ul className="mt-4 space-y-2">
              {points.map((p) => (
                <li key={p} className="flex items-center gap-2 text-sm text-textSecondary">
                  <CheckIcon className="size-4 text-success" aria-hidden />
                  {p}
                </li>
              ))}
            </ul>
            <span className="mt-5 inline-flex w-fit items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors group-hover:bg-primaryDark">
              {cta}
              <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
            </span>
          </Link>
        ))}
      </div>

      <section className="rounded-2xl border border-border bg-surface px-5 py-6 shadow-card md:px-8">
        <h2 className="text-sm font-bold text-textPrimary">How teams work</h2>
        <ol className="mt-5 grid grid-cols-3">
          {steps.map(([label, body], i) => (
            <li key={label} className="relative flex flex-col items-center gap-2 px-2 text-center">
              {i > 0 && <span className="absolute top-3 right-1/2 h-px w-full -translate-y-1/2 bg-border" aria-hidden />}
              <span className="relative grid size-6 place-items-center rounded-full border border-ink bg-ink text-[11px] font-bold text-white dark:border-primary dark:bg-primary">
                {i + 1}
              </span>
              <span className="text-sm font-bold leading-tight text-textPrimary">{label}</span>
              <span className="hidden max-w-[220px] text-xs leading-snug text-textMuted sm:block">{body}</span>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
