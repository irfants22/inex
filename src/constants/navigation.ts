import {
  Blocks,
  CalendarSync,
  ChartNoAxesCombined,
  Coins,
  HandCoins,
  House,
} from "lucide-react";

export const NAVIGATION_LIST = [
  { name: "Home", href: "/home", icon: House },
  { name: "Insight", href: "/insight", icon: ChartNoAxesCombined },
  { name: "Transactions", href: "/transactions", icon: HandCoins },
  { name: "Recurring", href: "/recurring-transactions", icon: CalendarSync },
  { name: "Categories", href: "/categories", icon: Blocks },
  { name: "Budget", href: "/budget", icon: Coins },
  // { name: "Profile", href: "/profile", icon: User },
];
