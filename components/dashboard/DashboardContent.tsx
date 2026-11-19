"use client";

import { cn } from "@/lib/utils";
import { useHackathonPhase } from "@/hooks/useHackathonPhase";

import PageWrapper from "../PageWrapper";
import { PhaseGuard } from "../phase/PhaseGuard";
import { BackButton } from "../ui/back-button";
import { ApplicationStatus } from "./ApplicationStatus";
import { ContactSection } from "./ContactSection";
import { CountdownSection } from "./CountdownSection";
import { DashboardHeader } from "./DashboardHeader";
import DashboardQRCode from "./DashboardQRCode";
import DevpostCard from "./DevpostCard";
import { HackathonConclusion } from "./HackathonConclusion";
import { HomeHero } from "./HomeHero";
import HackathonsCanadaDiscord from "./HackathonsCanadaDiscord";
import HackerPackageCard from "./HackerPackageCard";
import ProfileCard from "./ProfileCard";
import ProjectsCard from "./ProjectsCard";
import { ThankYouCard } from "./ThankYouCard";

interface DashboardContentProps {
  user: User;
}

export const DashboardContent = ({ user }: DashboardContentProps) => {
  // Lock everything for unassigned users
  const isLocked = user.role === "unassigned";
  const { isPhase } = useHackathonPhase();

  return (
    <PageWrapper>
      <DashboardHeader userName={user.name || "Hacker"} />
      {!isLocked && <HomeHero />}
      <div
        className={cn("flex flex-col gap-5", {
          "flex-col-reverse": user.role === "hacker",
        })}
      >
        {/* Application Status - shown during pre-registration, registration and pre-event phases */}
        <PhaseGuard
          phases={["pre-registration", "registration-open", "pre-event"]}
        >
          <ApplicationStatus
            status={isPhase("pre-registration") ? "coming_soon" : user.status}
            role={user.role}
          />
        </PhaseGuard>

        {/* Post-Event Content */}
        <PhaseGuard phases={["post-event"]}>
          <div className="space-y-5">
            <HackathonConclusion role={user.role} />
            <ThankYouCard role={user.role} />
          </div>
        </PhaseGuard>

        <div className="grid w-full grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          <DashboardQRCode isLocked={isLocked} userId={user.id!} />
          <PhaseGuard phases={["pre-event", "during-event"]}>
            <HackerPackageCard isLocked={isLocked} />
            <DevpostCard />
          </PhaseGuard>
          <ProfileCard isLocked={isLocked} userId={user.id!} />
          <ProjectsCard />
          <HackathonsCanadaDiscord />
        </div>
      </div>

      <div className="grid w-full grid-cols-1 gap-5 lg:grid-cols-3">
        <CountdownSection />
        <ContactSection />
      </div>
      <BackButton label="Back to landing page" href="https://hackcanada.org" />
    </PageWrapper>
  );
};
