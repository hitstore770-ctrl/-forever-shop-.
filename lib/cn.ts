import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Conditional classes (clsx) plus last-wins conflict resolution (tailwind-merge),
// so a component can ship a default like `border-2` and a caller can override it
// with `border-4` without the two both landing in the class list and the
// stylesheet order deciding the winner.
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
