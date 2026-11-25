"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

export function Tabs() {
  const pathname = usePathname();
  const isSignIn = pathname?.includes("sign-in");
  const isSignUp = pathname?.includes("sign-up");

  return (
    <div className="relative grid w-full grid-cols-2 rounded-full bg-surface p-1 ring-1 ring-border">
      {/* Animated background indicator */}
      <motion.div
        className="absolute top-1 bottom-1 left-1 w-[calc(50%-4px)] rounded-full bg-primary"
        initial={false}
        animate={{ x: isSignUp ? "100%" : "0%" }}
        transition={{ duration: 0.6, ease: [0.65, 0, 0.35, 1] }}
      />

      <Link
        href="/sign-in"
        className={cn(
          "relative z-10 cursor-pointer px-5 py-2 text-center text-sm font-medium transition-colors duration-500 md:px-6 md:text-base",
          isSignIn ? "text-white" : "text-textMuted hover:text-textSecondary",
        )}
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className={cn(
          "relative z-10 cursor-pointer px-5 py-2 text-center text-sm font-medium transition-colors duration-500 md:px-6 md:text-base",
          isSignUp ? "text-white" : "text-textMuted hover:text-textSecondary",
        )}
      >
        Sign up
      </Link>
    </div>
  );
}
