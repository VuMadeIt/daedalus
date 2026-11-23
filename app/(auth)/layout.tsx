"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ApplyMark } from "@/components/apply/ApplyMark";
import { AuthScene } from "@/components/auth/AuthScene";
import { PageTransition } from "@/components/PageTransition";

import styles from "./AuthLayout.module.css";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const fitViewport = pathname === "/sign-in" || pathname === "/sign-up";

  const back = (
    <Link
      href="https://hackcanada.org"
      target="_blank"
      className="auth-back text-textMuted hover:text-textPrimary mt-8 block text-center text-sm transition-colors"
    >
      Back to hackcanada.org
    </Link>
  );

  if (fitViewport) {
    return (
      <div
        className={`bg-background relative flex min-h-svh w-full ${styles.viewport}`}
      >
        <ApplyMark />
        <AuthScene />
        <main className="relative z-10 flex w-full items-center justify-center px-4 sm:px-6 lg:justify-end lg:px-12">
          <div className="w-full max-w-md lg:w-sm">
            <div className="auth-panel bg-background/85 ring-border rounded-3xl p-8 shadow-[0_24px_64px_rgba(4,30,55,0.22)] ring-1 backdrop-blur-xl max-lg:bg-transparent max-lg:p-0 max-lg:shadow-none max-lg:ring-0 max-lg:backdrop-blur-none">
              <PageTransition>{children}</PageTransition>
              {back}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="bg-background flex min-h-svh w-full">
      <ApplyMark />
      <AuthScene />

      <main className="flex w-full items-center justify-center px-6 py-20 lg:max-w-xl lg:px-12">
        <div className="w-full max-w-md">
          <PageTransition>{children}</PageTransition>
          {back}
        </div>
      </main>
    </div>
  );
}
