import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { addDays, addWeeks, addMonths, addYears, format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function calculateNextRun(
  currentNextRun: Date,
  frequency: string,
): Date {
  switch (frequency) {
    case "daily":
      return addDays(currentNextRun, 1);
    case "weekly":
      return addWeeks(currentNextRun, 1);
    case "monthly":
      return addMonths(currentNextRun, 1);
    case "yearly":
      return addYears(currentNextRun, 1);
    default:
      throw new Error(`Unknown frequency: ${frequency}`);
  }
}

export function parseToDateFormat(date: Date): string {
  return format(date, "yyyy-MM-dd");
}
