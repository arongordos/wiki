import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { format, formatDistanceToNow } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function mockDelay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const formatDate = (date: Date) => {
  return format(date, "MMMM dd, yyyy");
};

export function formatRelativeTime(date: Date) {
  return formatDistanceToNow(date, { addSuffix: true, includeSeconds: true });
}
