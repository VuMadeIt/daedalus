import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/auth";

import { getApplications } from "@/config/applications";
import { hackathonYear } from "@/config/site";
import { getPhaseState } from "@/lib/phase";
import { BackButton } from "@/components/ui/back-button";
import { ApplicationCard } from "@/components/applications/ApplicationCard";
import PageWrapper from "@/components/PageWrapper";

export const metadata: Metadata = {
  title: "Applications - Apply to Hack Canada",
  description: `Apply to Hack Canada ${hackathonYear}! Submit your hacker application, mentor application, or judge application. Official HC applications portal for Canada's premier student hackathon.`,
  openGraph: {
    title: `Hack Canada ${hackathonYear} Applications | HC Apps Portal`,
    description:
      "Apply now to join 500+ hackers at Hack Canada! Submit your application for hacker, mentor, or judge positions through the official portal.",
  },
  keywords: [
    "Hack Canada applications",
    "HC applications",
    "Hack Canada apply",
    "hackathon application",
    "apply Hack Canada",
    "HC apply",
    "Hack Canada hacker application",
    "Hack Canada registration",
    "hackathon registration Canada",
    `Hack Canada ${hackathonYear} apply`,
  ],
};

const ApplicationPage = async () => {
  const user = await getCurrentUser();

  if (!user || !user.id) {
    redirect("/sign-in");
  }

  const alreadyApplied = user.status !== "not_applied";

  // Get phase-aware applications and current phase
  const phaseState = await getPhaseState();
  const applications = getApplications(
    phaseState.phase,
    new Date(phaseState.dates.registrationClose),
  );
  const currentPhase = phaseState.phase;

  return (
    <PageWrapper>
      {applications.some((application) => application.status === "open") ? (
        <ApplicationsOpenHeader />
      ) : (
        <ApplicationsClosedHeader phase={currentPhase} />
      )}
      <main
        className="flex w-full flex-col gap-6"
        role="main"
        aria-label="Hack Canada Applications"
      >
        {applications.map((application) => (
          <ApplicationCard
            key={application.title}
            application={application}
            phase={currentPhase}
            alreadyApplied={
              alreadyApplied && application.title === "Hacker Applications"
            }
          />
        ))}
      </main>
      <BackButton />
    </PageWrapper>
  );
};

const ApplicationsOpenHeader = () => {
  return (
    <header className="mb-8 space-y-2">
      <div className="text-textPrimary  w-fit">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight md:text-[32px]">
          Applications
        </h1>
      </div>
      <p className="text-textMuted max-md:text-sm">
        Hack Canada {hackathonYear} applications are live!
        <br /> Don&apos;t miss your chance to join 500+ hackers for an epic
        weekend of innovation and fun.
      </p>
    </header>
  );
};

const ApplicationsClosedHeader = ({ phase }: { phase: string }) => {
  // Dynamic title and message based on phase
  const getHeaderContent = () => {
    switch (phase) {
      case "pre-registration":
        return {
          title: "Applications open soon",
          message: `Hack Canada ${hackathonYear} applications open soon. Check back here when they do.`,
        };
      case "pre-event":
        return {
          title: "Applications are closed",
          message: `Decisions are out. If you were accepted, your home page has everything you need for the weekend.`,
        };
      case "during-event":
        return {
          title: "Applications are closed",
          message: `Hack Canada ${hackathonYear} is happening now. Applications for next year open in the fall.`,
        };
      case "post-event":
        return {
          title: "Thanks for coming",
          message: `Thanks for being part of Hack Canada ${hackathonYear}. We hope to see you at Hack Canada ${hackathonYear + 1}.`,
        };
      default:
        return {
          title: "Applications are closed",
          message: `Applications for Hack Canada ${hackathonYear} are closed for now.`,
        };
    }
  };

  const { title, message } = getHeaderContent();

  return (
    <header className="mb-8 space-y-2">
      <div className="text-textPrimary  w-fit">
        <h1 className="text-[28px] leading-tight font-bold tracking-tight md:text-[32px]">{title}</h1>
      </div>
      <p className="text-[15px] text-textSecondary">{message}</p>
    </header>
  );
};

export default ApplicationPage;
