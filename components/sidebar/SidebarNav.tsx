"use client";

import { useSession } from "next-auth/react";

import { navSections, type NavItem } from "@/config/navigation";
import { isOrganizer, isVolunteer } from "@/lib/utils";

import SidebarNavLink from "./SidebarNavLink";

type SidebarNavProps = {
  setIsOpen?: (open: boolean) => void;
  dark?: boolean;
};

const SidebarNav = ({ setIsOpen }: SidebarNavProps) => {
  const { data } = useSession();
  const role = data?.user?.role;

  const allowed = (item: NavItem) => {
    if (item.requiresOrganizer) return !!role && isOrganizer(role);
    if (item.requiresVolunteer) return !!role && isVolunteer(role);
    return true;
  };

  return (
    <nav className="flex flex-col gap-5">
      {navSections.map((section, i) => {
        const items = section.items.filter(allowed);
        if (!items.length) return null;
        return (
          <div key={section.label ?? i} className="flex flex-col gap-0.5">
            {section.label && (
              <span className="mb-1 px-3 text-[11px] font-bold tracking-[0.06em] text-textPrimary uppercase">
                {section.label}
              </span>
            )}
            {items.map((item) => (
              <SidebarNavLink
                key={item.href}
                {...item}
                href={
                  item.href === "/profile" && data?.user?.id
                    ? `/profile/${data.user.id}`
                    : item.href
                }
                setIsOpen={setIsOpen}
              />
            ))}
          </div>
        );
      })}
    </nav>
  );
};

export default SidebarNav;
