import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toHtmlInputDate(date: Date) {
  return date.toISOString().split(":").slice(0, 2).join(":");
}
