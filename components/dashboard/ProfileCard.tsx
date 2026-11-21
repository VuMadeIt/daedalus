import Link from "next/link";
import { ArrowRightIcon, UserCircleIcon } from "@heroicons/react/24/outline";

import { buttonVariants } from "../ui/button";
import { DashCard } from "./DashCard";

interface ProfileCardProps {
  isLocked: boolean;
  userId: string;
}

const ProfileCard = ({ isLocked, userId }: ProfileCardProps) => (
  <DashCard
    title="Your profile"
    icon={<UserCircleIcon className="size-5" />}
    tone="mint"
    locked={isLocked && "Participants only"}
    description="Add your skills, links and what you're into so other hackers know who they're talking to."
    action={
      <Link
        href={isLocked ? "#" : `/profile/${userId}`}
        aria-disabled={isLocked}
        className={buttonVariants({ variant: "outline" })}
      >
        View profile
        <ArrowRightIcon className="size-4" />
      </Link>
    }
  />
);

export default ProfileCard;
