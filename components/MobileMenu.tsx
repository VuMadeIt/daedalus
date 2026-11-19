"use client";

import { useEffect } from "react";

import { cn } from "@/lib/utils";

import SidebarNav from "./sidebar/SidebarNav";
import SidebarUser from "./sidebar/SidebarUser";

type MobileMenuProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

const MobileMenu = ({ isOpen, setIsOpen }: MobileMenuProps) => {
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isOpen);
    return () => document.body.classList.remove("overflow-hidden");
  }, [isOpen]);

  return (
    <div
      className={cn(
        "fixed inset-0 top-16 z-30 bg-black/20 backdrop-blur-[2px] transition-opacity lg:hidden",
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={() => setIsOpen(false)}
    >
      <div
        className={cn(
          "absolute inset-y-0 right-0 flex w-72 flex-col border-l border-border bg-background px-4 pt-6 pb-5 shadow-float transition-transform duration-300 max-sm:w-full",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex-1 overflow-y-auto">
          <SidebarNav setIsOpen={setIsOpen} />
        </div>
        <SidebarUser />
      </div>
    </div>
  );
};

export default MobileMenu;
