import Image from "next/image";
import Link from "next/link";

import { hackathonYear } from "@/config/site";
import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  mobile?: boolean;
  dark?: boolean;
};

const SidebarLogo = ({ className }: Props) => {
  return (
    <Link
      href="/"
      className={cn("flex w-fit items-center gap-2.5 rounded-lg", className)}
    >
      <Image
        src="/hack-canada-logo.png"
        alt="Hack Canada"
        width={40}
        height={40}
        className="size-10 rounded-full ring-2 ring-[#f3c25a]"
      />
      <span className="flex flex-col leading-tight">
        <span className="text-[15px] font-medium text-textPrimary">
          Hacker Dashboard
        </span>
        <span className="text-[11px] font-medium text-coral">
          HC{String(hackathonYear).slice(-2)}
        </span>
      </span>
    </Link>
  );
};

export default SidebarLogo;
