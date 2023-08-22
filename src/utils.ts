import { type ClassValue, clsx } from "clsx";
import { format } from "date-fns";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toHtmlInputDate(date: Date) {
  return date.toISOString().split(":").slice(0, 2).join(":");
}

export function formatDate(date: Date) {
  return format(date, "MMM d, HH:MM");
}

export function pluralize(count: number, singular: string, plural: string) {
  return count === 1 ? singular : plural;
}

export function calculateTrust(trustScores: { amountPercent: number }[]) {
  return Math.round(trustScores.reduce((acc, curr) => acc + curr.amountPercent, 0) / trustScores.length);
}
