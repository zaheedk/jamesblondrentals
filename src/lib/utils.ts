
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: string | number): string {
  // Convert to number if string
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if it's a valid number
  if (isNaN(numValue)) {
    return '0.00';
  }
  
  // Format with 2 decimal places
  return numValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}
