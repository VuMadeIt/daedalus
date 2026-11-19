"use client";

import { ExternalLink, Trophy } from "lucide-react";

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
      icon={<Trophy />}
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
          <ExternalLink className="size-4" />
        </a>
      }
    />
  );
};

export default ProjectsCard;
