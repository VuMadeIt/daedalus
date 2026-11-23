"use client";

import Image from "next/image";
import { usePathname } from "next/navigation";
import signInBeachAccent from "@/public/scenes/sign-in-beach-accent.png";
import signInBeach from "@/public/scenes/sign-in-beach.png";
import { AnimatePresence, motion } from "framer-motion";

import { Cloud } from "@/components/apply/ApplyPicker";

type Scene = "sign-in" | "sign-up" | "forgot";

function sceneFor(pathname: string): Scene {
  if (pathname === "/sign-in") return "sign-in";
  if (pathname === "/forgot-password" || pathname.startsWith("/reset-password"))
    return "forgot";
  return "sign-up";
}

const COPY: Record<"forgot", { title: React.ReactNode; line: string }> = {
  forgot: {
    title: (
      <>
        Lost your
        <br />
        password?
      </>
    ),
    line: "Happens to the best of us. We'll send a bottle your way.",
  },
};

const fade = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.33, 1, 0.68, 1] as const },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.22, ease: "easeInOut" as const },
  },
};

// Sign in and sign up use beach artwork; password recovery keeps the sky scene.
export function AuthScene() {
  const scene = sceneFor(usePathname());

  if (scene === "sign-in" || scene === "sign-up") {
    // One full-bleed beach behind both forms. On desktop the art is right-aligned and at least
    // 1400 px wide, so its right third (just sand and a log) is always wider than the form and
    // the lettering and beaver stay clear of it. On phones it shows whole, above the form.
    return (
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 overflow-hidden lg:[container-type:size] lg:inset-y-0 lg:bg-[#d9ae73]"
      >
        <div className="relative aspect-[4096/2285.83203125] w-full lg:absolute lg:top-1/2 lg:right-0 lg:w-[max(100cqw,179.19cqh,1400px)] lg:-translate-y-1/2">
          <Image
            src={signInBeach}
            alt=""
            fill
            priority
            quality={95}
            sizes="(min-width: 1024px) 180vh, 100vw"
            className="object-cover"
          />
          <Image
            src={signInBeachAccent}
            alt=""
            quality={95}
            sizes="(min-width: 1024px) 46vh, 26vw"
            className="absolute top-[63.295%] left-[73.548%] h-auto w-[25.323%]"
          />
        </div>
        <div className="to-background lg:via-background/45 lg:to-background/85 absolute inset-x-0 top-0 -bottom-px bg-linear-to-b from-transparent from-60% lg:bg-linear-to-r lg:from-transparent lg:from-35% lg:via-60%" />
      </div>
    );
  }

  return (
    <aside
      aria-hidden
      className="relative hidden flex-1 overflow-hidden bg-linear-to-b from-[#c4defb] via-[#9cc5f4] to-[#5f9be2] lg:block"
    >
      <Cloud className="motion-safe:animate-drift text-textSecondary absolute top-[10%] right-[8%] w-36" />
      <Cloud className="motion-safe:animate-drift text-textMuted absolute top-[52%] left-[8%] w-24 [animation-delay:-8s]" />
      <Cloud className="motion-safe:animate-drift text-textMuted absolute top-[56%] right-[18%] w-28 [animation-delay:-15s]" />

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={scene}
          variants={fade}
          initial="initial"
          animate="animate"
          exit="exit"
          className="absolute inset-0"
        >
          <div className="absolute top-[18%] left-12 xl:left-16">
            <p className="font-display text-textPrimary text-7xl leading-[0.9] xl:text-8xl">
              {COPY[scene].title}
            </p>
            <p className="text-textSecondary mt-5 max-w-xs text-lg">
              {COPY[scene].line}
            </p>
          </div>

          {scene === "forgot" && (
            <div className="motion-safe:animate-bob absolute top-[40%] right-[14%]">
              <Image
                src="/scenes/bottle.png"
                alt=""
                width={346}
                height={277}
                className="h-32 w-auto -rotate-12 drop-shadow-[0_12px_18px_rgba(4,50,81,0.18)]"
              />
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      <motion.div
        className="absolute left-1/2 origin-bottom -translate-x-1/2"
        initial={false}
        animate={{ scale: 1, bottom: "8%", y: 0 }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      >
        <div className="motion-safe:animate-bob relative flex flex-col items-center [animation-delay:-2s]">
          <Image
            src="/glacier-small.svg"
            alt=""
            width={193}
            height={115}
            className="h-40 w-auto"
          />
          <span className="bg-ink/15 mt-2 h-2.5 w-3/4 rounded-full blur-sm" />
        </div>
      </motion.div>
    </aside>
  );
}
