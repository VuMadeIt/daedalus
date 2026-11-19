import { ExternalLink, Rocket } from "lucide-react";

import { devpostUrl } from "@/config/site";

import { buttonVariants } from "../ui/button";
import { DashCard } from "./DashCard";

const DevpostCard = () => (
  <DashCard
    title="Submit on Devpost"
    icon={<Rocket />}
    tone="sky"
    description="Projects are submitted on Devpost. Make sure everyone on your team has joined before the deadline."
    action={
      <a
        href={devpostUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={buttonVariants()}
      >
        Open Devpost
        <ExternalLink className="size-4" />
      </a>
    }
  />
);

export default DevpostCard;
