import Link from "next/link";
import { ArrowRight, User } from "lucide-react";

import { buttonVariants } from "../ui/button";
import { DashCard } from "./DashCard";

interface ProfileCardProps {
  isLocked: boolean;
  userId: string;
}

const ProfileCard = ({ isLocked, userId }: ProfileCardProps) => (
  <DashCard
    title="Your profile"
    icon={<User />}
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
        <ArrowRight className="size-4" />
      </Link>
    }
  />
);

export default ProfileCard;
