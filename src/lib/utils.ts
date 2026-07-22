
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
 * Check if pickup and dropoff dates are in the same week and both between Monday-Thursday
 * @param pickupDate - Date string in various formats
 * @param dropoffDate - Date string in various formats
 * @returns boolean - true if both dates are in same week and both are Monday-Thursday
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
    const pickupDay = pickup.getDay();
    const dropoffDay = dropoff.getDay();
    
    if (!(pickupDay >= 1 && pickupDay <= 4) || !(dropoffDay >= 1 && dropoffDay <= 4)) {
      return false;
    }
    
    // Check if both dates are in the same week
    // Get the start of the week (Monday) for both dates
    const getStartOfWeek = (date: Date): Date => {
      const result = new Date(date);
      const day = result.getDay();
      const diff = result.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is Sunday
      result.setDate(diff);
      result.setHours(0, 0, 0, 0);
      return result;
    };
    
    const pickupWeekStart = getStartOfWeek(pickup);
    const dropoffWeekStart = getStartOfWeek(dropoff);
    
    return pickupWeekStart.getTime() === dropoffWeekStart.getTime();
  } catch (error) {
    console.error('Error checking weekday rental:', error);
    return false;
  }
}

/**
 * Get campaign code with automatic midweek discount for Jumbo Vans and Trucks only
 * @param originalCampaignCode - Original campaign code (may be blank)
 * @param pickupDate - Pickup date string
 * @param dropoffDate - Dropoff date string
 * @param vehicleName - Vehicle name to check if it's a Jumbo Van or Truck
 * @param vehicleCategoryTypeId - Vehicle category type ID (optional)
 * @returns string - Campaign code to use
 */
export function getCampaignCode(
  originalCampaignCode: string, 
  pickupDate: string, 
  dropoffDate: string, 
  vehicleName?: string,
  vehicleCategoryTypeId?: string | number,
  pickupTime?: string,
  dropoffTime?: string
): string {
  console.log('getCampaignCode called with:', {
    originalCampaignCode,
    pickupDate,
    dropoffDate,
    vehicleName,
    vehicleCategoryTypeId,
    pickupTime,
    dropoffTime
  });

  // If there's already a campaign code (user manually entered), use it
  if (originalCampaignCode && originalCampaignCode.trim() !== "") {
    console.log('Using existing campaign code:', originalCampaignCode);
    return originalCampaignCode;
  }
  
  // Skip the 25% commercial midweek discount on short (≤2 hour) same-day hires.
  // These already use hourly rates and were never intended to receive the daily discount.
  if (pickupTime && dropoffTime && pickupDate && dropoffDate) {
    const sameDay = pickupDate === dropoffDate;
    if (sameDay) {
      const [ph, pm] = pickupTime.split(':').map(Number);
      const [dh, dm] = dropoffTime.split(':').map(Number);
      if ([ph, pm, dh, dm].every(n => !isNaN(n))) {
        const durationMinutes = (dh * 60 + dm) - (ph * 60 + pm);
        if (durationMinutes > 0 && durationMinutes <= 120) {
          console.log('❌ Skipping earlyweekcommercial25 — 2-hour (or shorter) same-day hire');
          return "";
        }
      }
    }
  }

  // Check if dates qualify for weekday discount (Monday-Thursday same week)
  const isWeekday = isWeekdayRental(pickupDate, dropoffDate);
  console.log('Weekday rental check:', {
    pickupDate,
    dropoffDate,
    isWeekday
  });
  
  // If weekday booking, pass earlyweekcommercial25 and let RCM apply it to qualifying categories
  if (isWeekday) {
    console.log('✅ Applying earlyweekcommercial25 campaign code for weekday booking');
    return "earlyweekcommercial25";
  }
  
  console.log('❌ No campaign code applied - not a weekday booking');
  // Default to empty string
  return "";
}

