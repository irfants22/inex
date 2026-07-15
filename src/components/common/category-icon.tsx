import { CATEGORY_ICONS } from "@/constants/icon";
import { HelpCircle } from "lucide-react";

interface CategoryIconProps {
  name: string;
  className?: string;
  size?: number;
}

export function CategoryIcon({
  name,
  className,
  size = 20,
}: CategoryIconProps) {
  const IconComponent = CATEGORY_ICONS[name] ?? HelpCircle;

  return <IconComponent size={size} className={className} />;
}
