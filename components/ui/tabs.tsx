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
    <div className="relative grid w-full grid-cols-2 border-b border-border">
      {/* Underline that slides to the active tab */}
      <motion.div
        className="absolute -bottom-px left-0 h-0.5 w-1/2 rounded-full bg-primary"
        initial={false}
        animate={{ x: isSignUp ? "100%" : "0%" }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      />

      <Link
        href="/sign-in"
        className={cn(
          "relative z-10 cursor-pointer rounded-md pt-2 pb-3 text-center text-base font-medium transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-hidden",
          isSignIn ? "text-textPrimary" : "text-textMuted hover:text-textSecondary",
        )}
      >
        Sign in
      </Link>
      <Link
        href="/sign-up"
        className={cn(
          "relative z-10 cursor-pointer rounded-md pt-2 pb-3 text-center text-base font-medium transition-colors duration-300 ease-out focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-hidden",
          isSignUp ? "text-textPrimary" : "text-textMuted hover:text-textSecondary",
        )}
      >
        Sign up
      </Link>
    </div>
  );
}
