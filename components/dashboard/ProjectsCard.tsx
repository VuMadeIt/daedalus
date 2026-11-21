"use client";

import { ArrowTopRightOnSquareIcon, TrophyIcon } from "@heroicons/react/24/outline";

import { hackathonYear, viewProjectsUrl } from "@/config/site";
import { useHackathonPhase } from "@/hooks/useHackathonPhase";

import { buttonVariants } from "../ui/button";
import { DashCard } from "./DashCard";

const ProjectsCard = () => {
  const { isFeatureEnabled } = useHackathonPhase();

  if (!isFeatureEnabled("showProjectsCard")) {
    return null;
  }

  return (
    <DashCard
      title="Project gallery"
      icon={<TrophyIcon className="size-5" />}
      tone="cream"
      description={`Everything built at Hack Canada ${hackathonYear}, all in one place. Go see what people made in 36 hours.`}
      action={
        <a
          href={viewProjectsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className={buttonVariants()}
        >
          See projects
          <ArrowTopRightOnSquareIcon className="size-4" />
        </a>
      }
    />
  );
};

export default ProjectsCard;
