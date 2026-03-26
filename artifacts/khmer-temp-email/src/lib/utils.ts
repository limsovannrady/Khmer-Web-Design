import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatKhmerDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('km-KH', { 
      dateStyle: 'long', 
      timeStyle: 'short' 
    }).format(date);
  } catch {
    return dateString;
  }
}
