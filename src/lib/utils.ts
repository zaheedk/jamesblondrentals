
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Formats a number as currency
 * @param value - The value to format
 * @param maximumFractionDigits - Maximum number of fraction digits to display
 * @returns Formatted string with appropriate decimal places
 */
export function formatCurrency(value: number | string, maximumFractionDigits: number = 2): string {
  // Convert string to number if needed
  const numericValue = typeof value === 'string' ? parseFloat(value) : value;
  
  // Check if the value is a valid number
  if (isNaN(numericValue)) {
    return '0.00';
  }
  
  // Format the number with appropriate decimal places
  return numericValue.toFixed(maximumFractionDigits);
}
