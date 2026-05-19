import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// Kết hợp class Tailwind (clsx + tailwind-merge)
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
