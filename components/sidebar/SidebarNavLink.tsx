import Link from "next/link";
import { usePathname } from "next/navigation";
import { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface SidebarNavLinkProps {
  name: string;
  href: string;
  icon: LucideIcon;
  setIsOpen?: (open: boolean) => void;
  dark?: boolean;
}

const SidebarNavLink = ({
  name,
  href,
  icon: Icon,
  setIsOpen,
}: SidebarNavLinkProps) => {
  const pathname = usePathname();
  const external = href.startsWith("http");
  const isActive =
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  return (
    <Link
      href={href}
      target={external ? "_blank" : undefined}
      aria-current={isActive ? "page" : undefined}
      className={cn(
        "group flex items-center gap-3 rounded-lg px-3 py-2 text-[15px] transition-colors duration-150",
        isActive
          ? "bg-brand text-white shadow-card"
          : "text-textSecondary hover:bg-black/[0.04] hover:text-textPrimary",
      )}
      onClick={() => setIsOpen?.(false)}
    >
      <Icon
        strokeWidth={1.75}
        className={cn(
          "size-[18px] shrink-0",
          isActive ? "text-white" : "text-textPrimary/80",
        )}
      />
      <span className="truncate">{name}</span>
    </Link>
  );
};

export default SidebarNavLink;
