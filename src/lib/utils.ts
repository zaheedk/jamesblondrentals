
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { parse, isValid } from "date-fns"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format a number as a currency string with the specified locale and currency
 */
export function formatCurrency(amount: number, locale = 'en-US', currency = 'NZD'): string {
  console.log('Formatting currency:', { amount, locale, currency }); // Add logging
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * Check if pickup and dropoff dates are between Monday and Thursday
 * @param pickupDate - Date string in various formats
 * @param dropoffDate - Date string in various formats
 * @returns boolean - true if both dates are Monday-Thursday
 */
export function isWeekdayRental(pickupDate: string, dropoffDate: string): boolean {
  try {
    let pickup: Date | null = null;
    let dropoff: Date | null = null;
    
    // Parse pickup date
    if (pickupDate.includes('T') || pickupDate.includes('-')) {
      pickup = new Date(pickupDate);
    } else if (pickupDate.includes('/')) {
      pickup = parse(pickupDate, 'dd/MM/yyyy', new Date());
    }
    
    // Parse dropoff date
    if (dropoffDate.includes('T') || dropoffDate.includes('-')) {
      dropoff = new Date(dropoffDate);
    } else if (dropoffDate.includes('/')) {
      dropoff = parse(dropoffDate, 'dd/MM/yyyy', new Date());
    }
    
    if (!pickup || !dropoff || !isValid(pickup) || !isValid(dropoff)) {
      return false;
    }
    
    // Check if both dates are Monday (1) through Thursday (4)
    // getDay() returns 0=Sunday, 1=Monday, ..., 6=Saturday
    const pickupDay = pickup.getDay();
    const dropoffDay = dropoff.getDay();
    
    return (pickupDay >= 1 && pickupDay <= 4) && (dropoffDay >= 1 && dropoffDay <= 4);
  } catch (error) {
    console.error('Error checking weekday rental:', error);
    return false;
  }
}

/**
 * Get campaign code with automatic weekday detection
 * @param originalCampaignCode - Original campaign code (may be blank)
 * @param pickupDate - Pickup date string
 * @param dropoffDate - Dropoff date string
 * @returns string - Campaign code to use
 */
export function getCampaignCode(originalCampaignCode: string, pickupDate: string, dropoffDate: string): string {
  // If there's already a campaign code, use it
  if (originalCampaignCode && originalCampaignCode.trim() !== "") {
    return originalCampaignCode;
  }
  
  // If no campaign code and dates are weekdays, use midweek25
  if (isWeekdayRental(pickupDate, dropoffDate)) {
    return "midweek25";
  }
  
  // Default to empty string
  return "";
}

