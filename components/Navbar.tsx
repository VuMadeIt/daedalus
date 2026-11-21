"use client";

import { useState } from "react";

import MobileMenu from "./MobileMenu";
import { PointsPill } from "./PointsPill";
import SidebarLogo from "./sidebar/SidebarLogo";
import AnimatedMenuIcon from "./ui/AnimatedMenuIcon";
import { Button } from "./ui/button";

type Props = {
  points?: number | null;
};

const Navbar = ({ points }: Props) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 z-40 flex h-16 w-full items-center border-b border-border bg-background/90 px-4 backdrop-blur-md sm:px-6 lg:hidden">
        <div className="flex w-full items-center justify-between gap-3">
          <SidebarLogo />
          <div className="flex items-center gap-2">
            {points != null && <PointsPill points={points} compact />}
            <Button
              variant="ghost"
              size="icon"
              aria-label={isOpen ? "Close menu" : "Open menu"}
              onClick={() => setIsOpen(!isOpen)}
              className={isOpen ? "bg-black/[0.05] text-textPrimary" : "text-textPrimary"}
            >
              <AnimatedMenuIcon isOpen={isOpen} />
            </Button>
          </div>
        </div>
      </nav>

      <MobileMenu isOpen={isOpen} setIsOpen={setIsOpen} />
    </>
  );
};

export default Navbar;
