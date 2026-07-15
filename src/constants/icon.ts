import {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Home,
  Heart,
  GraduationCap,
  Plane,
  Gift,
  Briefcase,
  Wallet,
  TrendingUp,
  Coffee,
  Utensils,
  PartyPopper,
  Gamepad2,
  Zap,
  type LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  UtensilsCrossed,
  Car,
  ShoppingBag,
  Film,
  Home,
  Heart,
  GraduationCap,
  Plane,
  Gift,
  Briefcase,
  Wallet,
  TrendingUp,
  Coffee,
  Utensils,
  PartyPopper,
  Gamepad2,
  Zap,
};

export const CATEGORY_ICON_STYLES = {
  neutral: {
    bg: "bg-neutral-300/50",
    text: "text-neutral-500",
  },
  red: {
    bg: "bg-red-300/50",
    text: "text-red-500",
  },
  blue: {
    bg: "bg-blue-300/50",
    text: "text-blue-500",
  },
  green: {
    bg: "bg-green-300/50",
    text: "text-green-500",
  },
  yellow: {
    bg: "bg-yellow-300/50",
    text: "text-yellow-500",
  },
  orange: {
    bg: "bg-orange-300/50",
    text: "text-orange-500",
  },
  purple: {
    bg: "bg-purple-300/50",
    text: "text-purple-500",
  },
  pink: {
    bg: "bg-pink-300/50",
    text: "text-pink-500",
  },
} as const;

export const CATEGORY_ICON_NAMES = Object.keys(CATEGORY_ICONS) as Array<
  keyof typeof CATEGORY_ICONS
>;
export const CATEGORY_COLOR_NAMES = Object.keys(CATEGORY_ICON_STYLES) as Array<
  keyof typeof CATEGORY_ICON_STYLES
>;
