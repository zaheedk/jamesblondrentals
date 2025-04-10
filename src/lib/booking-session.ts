
/**
 * Utility functions to manage booking data between pages using sessionStorage
 */

export interface BookingSessionData {
  vehicleId: string;
  vehicleName?: string;
  pickupLocationId: string;
  pickupLocationName?: string;
  dropoffLocationId: string;
  dropoffLocationName?: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  ageId: string;
  basePrice: number;
}

export const BOOKING_SESSION_KEY = 'rcm_booking_data';

/**
 * Save booking data to sessionStorage
 */
export const saveBookingData = (data: BookingSessionData): void => {
  try {
    sessionStorage.setItem(BOOKING_SESSION_KEY, JSON.stringify(data));
    console.log('Booking data saved to session:', data);
  } catch (error) {
    console.error('Error saving booking data to session:', error);
  }
};

/**
 * Get booking data from sessionStorage
 */
export const getBookingData = (): BookingSessionData | null => {
  try {
    const data = sessionStorage.getItem(BOOKING_SESSION_KEY);
    if (!data) return null;
    
    const bookingData = JSON.parse(data) as BookingSessionData;
    console.log('Booking data retrieved from session:', bookingData);
    return bookingData;
  } catch (error) {
    console.error('Error retrieving booking data from session:', error);
    return null;
  }
};

/**
 * Clear booking data from sessionStorage
 */
export const clearBookingData = (): void => {
  try {
    sessionStorage.removeItem(BOOKING_SESSION_KEY);
    console.log('Booking data cleared from session');
  } catch (error) {
    console.error('Error clearing booking data from session:', error);
  }
};
