
import { format, parse, isAfter, isBefore, addDays, addHours, addMinutes } from "date-fns";
import { formatInTimeZone, toZonedTime } from 'date-fns-tz';
import { 
  RCMLocation, 
  RCMOfficeTime,
  RCMLocationDetail 
} from "@/lib/api/rcm-api-types";

// New Zealand timezone
const NZ_TIMEZONE = 'Pacific/Auckland';

// Get current date/time in NZ timezone
export const getNowInNZ = (): Date => {
  return toZonedTime(new Date(), NZ_TIMEZONE);
};

export const disablePastDates = (date: Date, locationId: string, locationDetails: RCMLocationDetail[]): boolean => {
  // Get the current date in NZ time
  const todayInNZ = getNowInNZ();
  // Set to beginning of day for comparison
  const todayStartInNZ = new Date(todayInNZ);
  todayStartInNZ.setHours(0, 0, 0, 0);
  
  // Convert the provided date to beginning of day for comparison
  const startOfDate = new Date(date);
  startOfDate.setHours(0, 0, 0, 0);
  
  // Disable past dates
  if (startOfDate < todayStartInNZ) {
    return true;
  }
  
  // Check for Wellington - CBD and disable Sundays
  const isWellingtonCBD = locationId && locationDetails.some(loc => 
    String(loc.id) === locationId && 
    loc.location?.toLowerCase().includes('wellington') && 
    loc.location?.toLowerCase().includes('cbd')
  );
  
  if (isWellingtonCBD && date.getDay() === 0) {
    console.log('Disabling Sunday for Wellington - CBD');
    return true;
  }
  
  if (locationId && locationDetails.length > 0) {
    const selectedLocationDetail = locationDetails.find(loc => String(loc.id) === locationId);
    
    if (selectedLocationDetail) {
      const requiredNoticeDays = selectedLocationDetail.noticerequired_numberofdays || 0;
      
      if (requiredNoticeDays > 0) {
        const minDate = addDays(new Date(), requiredNoticeDays);
        minDate.setHours(0, 0, 0, 0);
        
        return date < minDate;
      }
    }
  }
  
  // If today is selected, check if the current time prevents selecting any available pickup times
  if (startOfDate.getTime() === todayStartInNZ.getTime()) {
    // Find the location's operating hours for today
    const operatingHours = getOperatingHours(locationId, date, 'pickup', locationDetails);
    if (!operatingHours) {
      // If no operating hours, disable today
      return true;
    }
    
    const latestPossibleTime = operatingHours.endTime;
    if (!latestPossibleTime) {
      return true;
    }
    
    // Parse the latest possible time
    const [latestHour, latestMinute] = latestPossibleTime.split(':').map(Number);
    
    // Current time in NZ
    const currentNZHour = todayInNZ.getHours();
    const currentNZMinute = todayInNZ.getMinutes();
    
    // If current NZ time is past or too close to the closing time, disable today
    // Add a 30-minute buffer to ensure there's enough time for the pickup
    if (currentNZHour > latestHour || (currentNZHour === latestHour && currentNZMinute > latestMinute - 30)) {
      console.log('Current NZ time is past or too close to closing time, disabling today');
      return true;
    }
  }
  
  return false;
};

// Helper function to get operating hours
const getOperatingHours = (
  locationId: string, 
  date: Date, 
  type: 'pickup' | 'dropoff',
  locationDetails: RCMLocationDetail[]
): { startTime: string, endTime: string } | null => {
  if (!locationId || locationDetails.length === 0) {
    return { startTime: '09:00', endTime: '17:00' }; // Default values
  }
  
  const location = locationDetails.find(loc => String(loc.id) === locationId);
  if (!location) return { startTime: '09:00', endTime: '17:00' };
  
  // Get operation hours from the location
  return type === 'pickup' 
    ? { startTime: '09:00', endTime: '17:00' } // Replace with actual location hours 
    : { startTime: '09:00', endTime: '17:00' };
};

export const getLocationTimeOptions = (
  locationId: string,
  date: Date,
  type: 'pickup' | 'dropoff',
  officeHours: RCMOfficeTime[],
  locationDetails: RCMLocationDetail[]
): string[] => {
  console.log(`Finding hours for location ${locationId} on day ${date.getDay()} (JS day: ${date.getDay()})`);
  
  // Guard against empty locationId or invalid inputs
  if (!locationId || !date || !officeHours || !locationDetails) {
    console.log(`Missing required data for time options. LocationID: ${locationId}, Date: ${date}`);
    return [];
  }
  
  // Check for Wellington - CBD Sunday restriction
  const isWellingtonCBD = locationDetails.some(loc => 
    String(loc.id) === locationId && 
    loc.location?.toLowerCase().includes('wellington') && 
    loc.location?.toLowerCase().includes('cbd')
  );
  
  const dayOfWeek = date.getDay();
  
  // Wellington - CBD is closed on Sundays (day 0)
  if (isWellingtonCBD && dayOfWeek === 0) {
    console.log('Wellington - CBD is closed on Sundays');
    return [];
  }
  
  const location = locationDetails.find(loc => String(loc.id) === locationId);
  if (!location) {
    console.log(`Location ${locationId} not found in location details. Using default hours.`);
    // Return some default times rather than an empty array
    return ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
  }

  console.log(`Location ${locationId} requires ${location.noticerequired_numberofdays} days notice`);

  // First try to find hours for the specific day
  let hoursForLocation = officeHours.find(
    hour => String(hour.locationid) === locationId && hour.dayofweek === dayOfWeek
  );

  // If no hours found for this day, try to find default hours
  if (!hoursForLocation) {
    console.log(`No hours found for day ${dayOfWeek}, looking for default hours`);
    
    // Try to find hours for any day for this location
    const anyHoursForLocation = officeHours.find(
      hour => String(hour.locationid) === locationId
    );
    
    if (anyHoursForLocation) {
      console.log(`Found default hours from day ${anyHoursForLocation.dayofweek}`);
      hoursForLocation = anyHoursForLocation;
    } else {
      console.log(`No office hours found for location ${locationId} on any day. Using default hours.`);
      // Return default times
      return ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
    }
  }

  let startTime = "00:00";
  let endTime = "23:55";

  if (type === 'pickup') {
    startTime = hoursForLocation.startpickup || "09:00";
    endTime = hoursForLocation.endpickup || "17:00";
  } else {
    startTime = hoursForLocation.startdropoff || hoursForLocation.openingtime || "09:00";
    endTime = hoursForLocation.endpickup || hoursForLocation.closingtime || "17:00";
  }

  console.log(`Office hours for ${type} at location ${locationId} on day ${dayOfWeek}: ${startTime} - ${endTime}`);

  // Get current date/time in NZ timezone for filtering same-day options
  const nowInNZ = getNowInNZ();
  const isToday = nowInNZ.toDateString() === new Date(date).toDateString();

  const timeOptions = generateTimeOptions(startTime, endTime, date, isToday, nowInNZ);
  
  console.log(`Generated ${timeOptions.length} time options`);
  
  return timeOptions.length > 0 ? timeOptions : ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00"];
};

const generateTimeOptions = (
  startTime: string, 
  endTime: string, 
  date: Date, 
  isToday: boolean,
  currentTimeInNZ: Date
): string[] => {
  const options: string[] = [];
  
  console.log(`Generating time options between ${startTime}-${endTime} for date: ${date.toISOString()}, today in NZ? ${isToday}`);

  try {
    const startDate = parse(startTime, "HH:mm", date);
    const endDate = parse(endTime, "HH:mm", date);
    
    let currentTime = startDate;
    
    while (isBefore(currentTime, endDate)) {
      const timeString = format(currentTime, "HH:mm");
      
      if (!isToday || isAfter(currentTime, currentTimeInNZ)) {
        options.push(timeString);
      }
      
      currentTime = addMinutes(currentTime, 30);
    }
    
    const endTimeString = format(endDate, "HH:mm");
    if (!options.includes(endTimeString)) {
      if (!isToday || isAfter(endDate, currentTimeInNZ)) {
        options.push(endTimeString);
      }
    }
  } catch (error) {
    console.error('Error generating time options:', error);
  }

  return options;
};

export const combineDateTime = (date: Date, time: string): Date => {
  const [hours, minutes] = time.split(':').map(Number);
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(0);
  newDate.setMilliseconds(0);
  return newDate;
};

export const getDefaultPickupDate = (): Date => {
  // Get current time in NZ
  const nowInNZ = getNowInNZ();
  
  // Check if it's late in the day (past 5 PM NZ time)
  const hour = nowInNZ.getHours();
  const isLateDay = hour >= 17; // Past 5 PM
  
  // If late in the day, set default to tomorrow, otherwise today
  let defaultPickupDate = new Date(nowInNZ);
  
  // If it's late in the day, set to tomorrow
  if (isLateDay) {
    defaultPickupDate = addDays(defaultPickupDate, 1);
  }
  
  // Set to noon for consistency
  defaultPickupDate.setHours(12, 0, 0, 0);
  
  console.log(`Default pickup date set to: ${defaultPickupDate.toISOString()}`);
  return defaultPickupDate;
};

export const getDefaultDropoffDate = (pickupDate: Date): Date => {
  // Return pickup date + 1 day at the same time
  const dropoffDate = new Date(pickupDate);
  dropoffDate.setDate(dropoffDate.getDate() + 1);
  return dropoffDate;
};
