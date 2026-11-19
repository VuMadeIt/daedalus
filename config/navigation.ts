import {
  Dices,
  CalendarDays,
  Coins,
  Home,
  ListChecks,
  NotebookPen,
  QrCode,
  ScanQrCode,
  ShoppingBag,
  Star,
  User,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

export type NavItem = {
  name: string;
  href: string;
  icon: LucideIcon;
  requiresVolunteer?: boolean;
  requiresOrganizer?: boolean;
  external?: boolean;
};

export type NavSection = {
  label?: string;
  items: NavItem[];
};

export const navSections: NavSection[] = [
  {
    items: [
      { name: "Home", href: "/", icon: Home },
      { name: "Profile", href: "/profile", icon: User },
      { name: "Applications", href: "/applications", icon: NotebookPen },
      { name: "Schedule", href: "/schedule", icon: CalendarDays },
      { name: "QR Code", href: "/qr-code", icon: QrCode },
    ],
  },
  {
    label: "Beaver Games",
    items: [
      { name: "Challenges", href: "/challenges", icon: Star },
      { name: "Bet Points", href: "/bets", icon: Dices },
      { name: "Points", href: "/points-history", icon: Coins },
      { name: "Store", href: "/shops", icon: ShoppingBag },
    ],
  },
  {
    label: "Crew",
    items: [
      { name: "Scanner", href: "/scanner", icon: ScanQrCode, requiresVolunteer: true },
      { name: "Points Manager", href: "/points-manager", icon: ListChecks, requiresOrganizer: true },
    ],
  },
];

export const navigation: NavItem[] = navSections.flatMap((s) => s.items);
