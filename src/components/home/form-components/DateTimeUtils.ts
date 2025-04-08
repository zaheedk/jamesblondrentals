
import { addDays, addHours, getDay, isBefore, isSameDay, startOfDay, setHours, setMinutes, isAfter } from "date-fns";
import { RCMOfficeTime, RCMLocationDetail } from "@/lib/api/rcm-api-types";

// Map JavaScript day numbers (0-6, Sunday-Saturday) to API dayofweek (1-7, Monday-Sunday)
export const JS_TO_API_DAY_MAP: { [key: number]: number } = {
  0: 7, // Sunday -> 7
  1: 1, // Monday -> 1
  2: 2, // Tuesday -> 2
  3: 3, // Wednesday -> 3
  4: 4, // Thursday -> 4
  5: 5, // Friday -> 5
  6: 6, // Saturday -> 6
};

export const disablePastDates = (date: Date, locationId: string | undefined, locationDetails: RCMLocationDetail[]) => {
  // Always disable today and dates in the past - API requires future dates
  const tomorrow = startOfDay(addDays(new Date(), 1));
  if (isBefore(date, tomorrow)) {
    return true;
  }
  
  // If a pickup location is selected, respect its notice requirement
  if (locationId) {
    const selectedLocation = locationDetails.find(
      loc => String(loc.id) === locationId
    );
    
    if (selectedLocation) {
      const requiredNoticeDays = selectedLocation?.noticerequired_numberofdays || 0;
      
      if (requiredNoticeDays > 0) {
        // Calculate the minimum allowed date based on required notice days
        // Use startOfDay to ensure we're comparing full days, not hours
        const minAllowedDate = addDays(startOfDay(new Date()), requiredNoticeDays);
        console.log(`Location ${locationId} requires ${requiredNoticeDays} days notice. Min date: ${minAllowedDate.toISOString()}, Checking date: ${date.toISOString()}`);
        
        // Disable dates that don't provide enough notice
        if (isBefore(date, minAllowedDate)) {
          return true;
        }
      }
    }
  }
  
  return false;
};

// Helper function to get office hours for a specific location and day
export const getLocationTimeOptions = (
  locationId: string, 
  date: Date, 
  type: 'pickup' | 'dropoff', 
  officeHours: RCMOfficeTime[],
  locationDetails: RCMLocationDetail[]
): string[] => {
  if (!date || !locationId) return [];

  const jsDay = getDay(date);
  const apiDayOfWeek = JS_TO_API_DAY_MAP[jsDay];
  
  console.log(`Finding hours for location ${locationId} on day ${apiDayOfWeek} (JS day: ${jsDay})`);
  
  // Get the required notice period for this location
  const selectedLocationDetail = locationDetails.find(
    loc => String(loc.id) === String(locationId)
  );
  
  const requiredNoticeDays = selectedLocationDetail?.noticerequired_numberofdays || 0;
  console.log(`Location ${locationId} requires ${requiredNoticeDays} days notice`);
  
  // Find office hours for the selected location and day
  const locationOfficeHours = officeHours.filter(
    time => {
      const locIdMatches = String(time.locationid) === String(locationId);
      const dayMatches = time.dayofweek === apiDayOfWeek;
      return locIdMatches && dayMatches;
    }
  );
  
  if (locationOfficeHours.length === 0) {
    console.log(`No office hours found for location ${locationId} on day ${apiDayOfWeek}`);
    
    // Try to get default hours from location details as fallback
    const locationDetail = locationDetails.find(loc => String(loc.id) === String(locationId));
    if (locationDetail) {
      console.log(`Using default hours for ${locationId}: ${locationDetail.officeopeningtime} - ${locationDetail.officeclosingtime}`);
      return generateTimeOptions(locationDetail.officeopeningtime, locationDetail.officeclosingtime, date, requiredNoticeDays);
    }
    
    // Return default office hours if none found
    console.log(`Using hardcoded default hours for ${locationId}: 09:00 - 17:00`);
    return generateTimeOptions("09:00", "17:00", date, requiredNoticeDays);
  }
  
  // Get the first match
  const hours = locationOfficeHours[0];
  
  let startTime, endTime;
  
  if (type === 'pickup') {
    startTime = hours.startpickup || hours.openingtime;
    endTime = hours.endpickup || hours.closingtime;
  } else { // dropoff
    startTime = hours.startdropoff || hours.openingtime;
    endTime = hours.enddropoff || hours.closingtime;
  }
  
  console.log(`Office hours for ${type} at location ${locationId} on day ${apiDayOfWeek}:`, 
    `${startTime} - ${endTime}`);
  
  // Handle special case for 24-hour locations
  if (startTime === "00:00" && (endTime === "00:00" || endTime === "24:00")) {
    console.log(`Location ${locationId} has 24-hour operation, generating 24-hour time slots`);
    return generate24HourOptions(date, requiredNoticeDays);
  }
  
  return generateTimeOptions(startTime, endTime, date, requiredNoticeDays);
};

// Generate time options for 24-hour operations
export const generate24HourOptions = (date: Date, requiredNoticeDays: number): string[] => {
  const options: string[] = [];
  const now = new Date();
  const isToday = isSameDay(date, now);
  const isTomorrow = isSameDay(date, addDays(now, 1));
  
  console.log(`Generating 24-hour options for date: ${date.toISOString()}, today? ${isToday}, tomorrow? ${isTomorrow}, requiredNoticeDays: ${requiredNoticeDays}`);
  
  // Calculate the earliest allowed date considering notice period
  let earliestAllowedDate: Date | null = null;
  if (requiredNoticeDays > 0) {
    // Use startOfDay to ensure we're comparing full days
    earliestAllowedDate = addDays(startOfDay(now), requiredNoticeDays);
    console.log(`Required notice: ${requiredNoticeDays} days, earliest allowed time: ${earliestAllowedDate.toISOString()}`);
  }
  
  // Check if the selected date meets notice requirements
  const selectedDateStartOfDay = startOfDay(new Date(date));
  let earliestAllowedStartOfDay = null;
  
  if (earliestAllowedDate) {
    earliestAllowedStartOfDay = startOfDay(new Date(earliestAllowedDate));
    
    console.log(`Comparing: selected date ${selectedDateStartOfDay.toISOString()} with earliest allowed date ${earliestAllowedStartOfDay.toISOString()}`);
    
    // Compare days only (not exact timestamps)
    if (selectedDateStartOfDay.getTime() < earliestAllowedStartOfDay.getTime()) {
      console.log(`Selected date ${selectedDateStartOfDay.toISOString()} is before earliest allowed date ${earliestAllowedStartOfDay.toISOString()}, no times available`);
      return [];
    }
  }
  
  // For same day as the notice period, we might need to limit available times
  let minAllowedHour = 0;
  if (earliestAllowedDate && isSameDay(date, earliestAllowedDate)) {
    minAllowedHour = earliestAllowedDate.getHours();
  }
  
  // Generate times in 30-minute intervals for a full 24 hours
  for (let hour = 0; hour < 24; hour++) {
    // Skip hours before the minimum allowed hour when date is the same as earliest allowed date
    if (earliestAllowedDate && isSameDay(date, earliestAllowedDate) && hour < minAllowedHour) {
      continue;
    }
    
    for (let minute of [0, 30]) {
      // Create a test date for this time slot
      const testDate = new Date(date);
      testDate.setHours(hour, minute, 0, 0);
      
      // Skip times in the past if the date is today
      if (isToday && isBefore(testDate, now)) {
        continue;
      }
      
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      options.push(`${formattedHour}:${formattedMinute}`);
    }
  }
  
  console.log(`Generated ${options.length} time options for 24-hour location`);
  return options;
};

// Generate time options in 30-minute intervals between open and close times
export const generateTimeOptions = (openTime: string, closeTime: string, date: Date, requiredNoticeDays: number): string[] => {
  if (!openTime || !closeTime) return [];
  
  const options: string[] = [];
  const now = new Date();
  const isToday = isSameDay(date, now);
  const isTomorrow = isSameDay(date, addDays(now, 1));
  
  console.log(`Generating time options between ${openTime}-${closeTime} for date: ${date.toISOString()}, today? ${isToday}, tomorrow? ${isTomorrow}`);
  
  // Calculate the earliest allowed date considering notice period
  let earliestAllowedDate: Date | null = null;
  if (requiredNoticeDays > 0) {
    // Use startOfDay to ensure we're comparing full days
    earliestAllowedDate = addDays(startOfDay(now), requiredNoticeDays);
    console.log(`Required notice: ${requiredNoticeDays} days, earliest allowed time: ${earliestAllowedDate.toISOString()}`);
  }
  
  // Check if the selected date meets notice requirements using startOfDay to compare days only
  const selectedDateStartOfDay = startOfDay(new Date(date));
  let earliestAllowedStartOfDay = null;
  
  if (earliestAllowedDate) {
    earliestAllowedStartOfDay = startOfDay(new Date(earliestAllowedDate));
    
    console.log(`Comparing: selected date ${selectedDateStartOfDay.toISOString()} with earliest allowed date ${earliestAllowedStartOfDay.toISOString()}`);
    
    // Compare days only (not exact timestamps)
    if (selectedDateStartOfDay.getTime() < earliestAllowedStartOfDay.getTime()) {
      console.log(`Selected date ${selectedDateStartOfDay.toISOString()} is before earliest allowed date ${earliestAllowedStartOfDay.toISOString()}, no times available`);
      return [];
    }
  }
  
  // Parse times (expecting format like "09:00" or "17:30")
  const [openHour, openMinute] = openTime.split(':').map(Number);
  let closeHour = 0, closeMinute = 0;
  
  // Handle special case for midnight closing (00:00 or 24:00)
  if (closeTime === "00:00" || closeTime === "24:00") {
    closeHour = 24;
    closeMinute = 0;
  } else {
    [closeHour, closeMinute] = closeTime.split(':').map(Number);
  }
  
  // Convert to minutes for easier calculation
  const closingInMinutes = closeHour * 60 + closeMinute;
  let startInMinutes = openHour * 60 + openMinute;
  
  // Check if date is today and adjust startInMinutes to current time (rounded up to next 30 min)
  if (isToday) {
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    // Round up to next 30-min slot
    const roundedCurrentMinutes = Math.ceil((currentMinutes + 1) / 30) * 30;
    startInMinutes = Math.max(startInMinutes, roundedCurrentMinutes);
  }
  
  // For same day as the notice period, we might need to limit available times
  if (earliestAllowedDate && isSameDay(date, earliestAllowedDate)) {
    const earliestMinutes = earliestAllowedDate.getHours() * 60 + earliestAllowedDate.getMinutes();
    // Round up to next 30-min slot
    const roundedEarliestMinutes = Math.ceil(earliestMinutes / 30) * 30;
    startInMinutes = Math.max(startInMinutes, roundedEarliestMinutes);
  }
  
  // Generate times in 30-minute intervals
  for (let minutes = startInMinutes; minutes < closingInMinutes; minutes += 30) {
    const hour = Math.floor(minutes / 60) % 24;
    const minute = minutes % 60;
    
    const formattedHour = hour.toString().padStart(2, '0');
    const formattedMinute = minute.toString().padStart(2, '0');
    options.push(`${formattedHour}:${formattedMinute}`);
  }
  
  console.log(`Generated ${options.length} time options for regular hours location`);
  return options;
};

// Helper function to combine date and time into ISO string
export const combineDateTime = (date: Date | undefined, time: string): string => {
  if (!date || !time) {
    return new Date().toISOString();
  }
  
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours, minutes, 0, 0);
  
  return newDate.toISOString();
};
