import { ArrowTopRightOnSquareIcon, BookOpenIcon } from "@heroicons/react/24/outline";

import { hackathonYear, hackerPackageUrl } from "@/config/site";

import { buttonVariants } from "../ui/button";
import { DashCard } from "./DashCard";

interface HackerPackageCardProps {
  isLocked: boolean;
}

const HackerPackageCard = ({ isLocked }: HackerPackageCardProps) => {
  const isDisabled = isLocked || hackerPackageUrl === "";

  return (
    <DashCard
      title="Welcome booklet"
      icon={<BookOpenIcon className="size-5" />}
      tone="cream"
      locked={isDisabled && (isLocked ? "Participants only" : "Coming soon")}
      description={`Maps, the Wi-Fi password, food times and everything else you need for Hack Canada ${hackathonYear}.`}
      action={
        <a
          href={isDisabled ? undefined : hackerPackageUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-disabled={isDisabled}
          className={buttonVariants({ variant: isDisabled ? "outline" : "default" })}
        >
          Open booklet
          <ArrowTopRightOnSquareIcon className="size-4" />
        </a>
      }
    />
  );
};

export default HackerPackageCard;
