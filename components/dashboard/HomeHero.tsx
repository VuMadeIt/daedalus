"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CalendarDaysIcon, ShoppingBagIcon, StarIcon } from "@heroicons/react/24/outline";

import { useHackathonPhase } from "@/hooks/useHackathonPhase";

const links = [
  { href: "/schedule", label: "Schedule", icon: CalendarDaysIcon },
  { href: "/challenges", label: "Challenges", icon: StarIcon },
  { href: "/shops", label: "Store", icon: ShoppingBagIcon },
];

export function HomeHero() {
  const { isPhase } = useHackathonPhase();
  const live = isPhase("during-event");
  if (!live && !isPhase("pre-event")) return null;

  return (
    <section className="relative overflow-hidden rounded-3xl bg-ink px-6 py-7 text-white shadow-float md:px-9 md:py-9">
      <div className="absolute -top-24 right-24 size-72 rounded-full bg-primary/40 blur-3xl" aria-hidden />
      <div className="absolute -bottom-28 -left-10 size-64 rounded-full bg-gold/20 blur-3xl" aria-hidden />
      <Image
        src="/beaver-laptop.png"
        alt=""
        width={220}
        height={220}
        className="absolute right-6 bottom-0 hidden size-44 object-contain md:block lg:size-52"
        priority
      />
      <div className="relative max-w-xl">
        <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-medium">
          <span className={live ? "size-2 animate-pulse rounded-full bg-[#5fe09a]" : "size-2 rounded-full bg-gold"} />
          {live ? "Hacking is live" : "Event starts soon"}
        </span>
        <h2 className="mt-4 text-2xl font-bold tracking-tight md:text-[34px] md:leading-tight">
          {live ? "Build something great this weekend." : "Get ready for Hack Canada 2027."}
        </h2>
        <p className="mt-2 text-[15px] text-white/75">
          {live
            ? "Check what's on next, finish challenges for points, and trade them for prizes."
            : "Pack your charger, find a team, and look over the schedule before you arrive."}
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {links.map(({ href, label, icon: Icon }, i) => (
            <Link
              key={href}
              href={href}
              className={
                i === 0
                  ? "group inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white/90"
                  : "inline-flex items-center gap-2 rounded-lg bg-white/10 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-white/15"
              }
            >
              <Icon className="size-4" aria-hidden />
              {label}
              {i === 0 && <ArrowRightIcon className="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden />}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
