
import { format, parse, isAfter, isBefore, addMinutes } from "date-fns";
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

function addDays(date: Date, days: number): Date {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

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
  const hoursForLocation = officeHours.find(
    hour => String(hour.locationid) === locationId && hour.dayofweek === dayOfWeek
  );

  if (!hoursForLocation) {
    console.error(`No office hours found for location ${locationId} on day ${dayOfWeek}`);
    return [];
  }

  let startTime = "00:00";
  let endTime = "23:55";

  if (type === 'pickup') {
    startTime = hoursForLocation.startpickup || "00:00";
    endTime = hoursForLocation.endpickup || "23:55";
  } else {
    // For dropoff, use specific dropoff times if available
    startTime = hoursForLocation.startdropoff || hoursForLocation.openingtime || "00:00";
    endTime = hoursForLocation.enddropoff || hoursForLocation.endpickup || hoursForLocation.closingtime || "23:55";
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
