
import { format, parse, isAfter, isBefore, addDays, addHours, addMinutes } from "date-fns";
import { 
  RCMLocation, 
  RCMOfficeTime,
  RCMLocationDetail 
} from "@/lib/api/rcm-api-types";

export const disablePastDates = (date: Date, locationId: string, locationDetails: RCMLocationDetail[]): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (date < today) {
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
  
  return false;
};

export const getLocationTimeOptions = (
  locationId: string,
  date: Date,
  type: 'pickup' | 'dropoff',
  officeHours: RCMOfficeTime[],
  locationDetails: RCMLocationDetail[]
): string[] => {
  console.log(`Finding hours for location ${locationId} on day ${date.getDay()} (JS day: ${date.getDay()})`);
  
  const location = locationDetails.find(loc => String(loc.id) === locationId);
  if (!location) {
    console.error(`Location ${locationId} not found in location details`);
    return [];
  }

  console.log(`Location ${locationId} requires ${location.noticerequired_numberofdays} days notice`);

  const dayOfWeek = date.getDay();
  
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
      console.error(`No office hours found for location ${locationId} on any day`);
      return [];
    }
  }

  let startTime = "00:00";
  let endTime = "23:55";

  if (type === 'pickup') {
    startTime = hoursForLocation.startpickup || "00:00";
    endTime = hoursForLocation.endpickup || "23:55";
  } else {
    startTime = hoursForLocation.startdropoff || hoursForLocation.openingtime || "00:00";
    endTime = hoursForLocation.endpickup || hoursForLocation.closingtime || "23:55";
  }

  console.log(`Office hours for ${type} at location ${locationId} on day ${dayOfWeek}: ${startTime} - ${endTime}`);

  const timeOptions = generateTimeOptions(startTime, endTime, date);
  
  console.log(`Generated ${timeOptions.length} time options`);
  
  return timeOptions;
};

const generateTimeOptions = (startTime: string, endTime: string, date: Date): string[] => {
  const options: string[] = [];
  const isToday = new Date().toDateString() === date.toDateString();
  
  console.log(`Generating time options between ${startTime}-${endTime} for date: ${date.toISOString()}, today? ${isToday}`);

  try {
    const currentDate = new Date();
    const startDate = parse(startTime, "HH:mm", date);
    const endDate = parse(endTime, "HH:mm", date);
    
    let currentTime = startDate;
    
    while (isBefore(currentTime, endDate)) {
      const timeString = format(currentTime, "HH:mm");
      
      if (!isToday || isAfter(currentTime, currentDate)) {
        options.push(timeString);
      }
      
      currentTime = addMinutes(currentTime, 30);
    }
    
    const endTimeString = format(endDate, "HH:mm");
    if (!options.includes(endTimeString)) {
      if (!isToday || isAfter(endDate, currentDate)) {
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
  // Get tomorrow at noon (12:00)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(12, 0, 0, 0);
  return tomorrow;
};

export const getDefaultDropoffDate = (pickupDate: Date): Date => {
  // Return pickup date + 1 day at the same time
  const dropoffDate = new Date(pickupDate);
  dropoffDate.setDate(dropoffDate.getDate() + 1);
  return dropoffDate;
};
