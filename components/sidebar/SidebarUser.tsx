"use client";

import Image from "next/image";
import { LogOut } from "lucide-react";
import { useSession } from "next-auth/react";

import { LogoutButton } from "../auth/LoginButton";

type SidebarUserProps = {
  dark?: boolean;
};

const roleLabel: Record<string, string> = {
  hacker: "Hacker",
  organizer: "Organizer",
  admin: "Admin",
  volunteer: "Volunteer",
  mentor: "Mentor",
  judge: "Judge",
};

const SidebarUser = ({}: SidebarUserProps) => {
  const { data } = useSession();

  if (!data) {
    return null;
  }

  return (
    <div className="border-t border-textPrimary/40 pt-4">
      <div className="flex items-center gap-2.5">
        <Image
          src={data.user.image || "/default-avatar.webp"}
          alt=""
          width={36}
          height={36}
          className="size-9 shrink-0 rounded-full object-cover ring-2 ring-[#f3c25a]"
        />
        <div className="min-w-0 flex-1 leading-tight">
          <div className="truncate text-sm font-medium text-textPrimary">
            {data.user.name}
          </div>
          <div className="text-[11px] font-medium text-coral">
            {roleLabel[data.user.role] ?? "Guest"}
          </div>
        </div>
        <LogoutButton
          title="Log out"
          label=""
          icon={<LogOut className="size-4" />}
          className="grid size-8 shrink-0 place-items-center rounded-md p-0 text-textMuted transition-colors hover:bg-black/[0.05] hover:text-textPrimary [&>span]:mr-0"
        />
      </div>
    </div>
  );
};

export default SidebarUser;
