import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Merge Tailwind classes safely with clsx (RULE-003) */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}
