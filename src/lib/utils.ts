import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function severityOrder(s: string): number {
  return s === "high" ? 3 : s === "opportunity" ? 2.5 : s === "medium" ? 2 : 1;
}
