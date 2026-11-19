import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";

import { getUserPoints } from "@/lib/db/queries/points";
import { getPhaseState } from "@/lib/phase";
import Navbar from "@/components/Navbar";
import { PageTransition } from "@/components/PageTransition";
import { PointsPill } from "@/components/PointsPill";
import Sidebar from "@/components/sidebar/Sidebar";

type Props = {
  children: React.ReactNode;
};

const EARLY_PHASES = new Set(["pre-registration", "registration-open"]);
const UNDECIDED = new Set(["not_applied", "pending"]);
const STAFF = new Set(["admin", "organizer", "mentor", "volunteer"]);

const DashboardLayout = async ({ children }: Props) => {
  const [{ phase }, user] = await Promise.all([
    getPhaseState(),
    getCurrentUser(),
  ]);
  // Applicants stay on /apply until their decision is released (status leaves pending).
  const early =
    EARLY_PHASES.has(phase) ||
    (phase === "pre-event" &&
      !!user &&
      UNDECIDED.has(user.status) &&
      !STAFF.has(user.role));

  if (early) {
    const path = (await headers()).get("x-pathname") ?? "";
    if (path && !path.startsWith("/apply")) redirect("/apply");

    return (
      <div className="relative min-h-dvh bg-[#0a0a0f]">
        <PageTransition>{children}</PageTransition>
      </div>
    );
  }

  const points = user?.id ? await getUserPoints(user.id) : null;

  return (
    <div className="relative min-h-screen flex-1 bg-background">
      <Sidebar />
      <main className="relative z-10 h-full max-lg:pt-16 lg:ml-60">
        <Navbar points={points} />
        <div className="mx-auto hidden h-20 max-w-[1180px] items-center justify-end px-10 lg:flex">
          {points != null && <PointsPill points={points} />}
        </div>
        <PageTransition>{children}</PageTransition>
      </main>
    </div>
  );
};

export default DashboardLayout;
