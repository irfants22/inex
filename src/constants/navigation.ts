import {
  Blocks,
  ChartNoAxesCombined,
  Coins,
  HandCoins,
  House,
  User,
} from "lucide-react";

export const NAVIGATION_LIST = [
  { name: "Home", href: "/home", icon: House },
  { name: "Transaction", href: "/transactions", icon: HandCoins },
  { name: "Category", href: "/categories", icon: Blocks },
  { name: "Insight", href: "/insight", icon: ChartNoAxesCombined },
  { name: "Budget", href: "/budget", icon: Coins },
  { name: "Profile", href: "/profile", icon: User },
];
