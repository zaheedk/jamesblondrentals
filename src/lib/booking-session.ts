/**
 * Utility functions to manage booking data between pages using sessionStorage
 */

export interface BookingSessionData {
  vehicleId: string;
  vehicleName?: string;
  vehicleCategoryId?: string | number;  // Added field for vehicle category ID
  vehicleCategoryTypeId: string;
  pickupLocationId: string;
  pickupLocationName?: string;
  dropoffLocationId: string;
  dropoffLocationName?: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  ageId: string;
  driverageId?: string | number;  // Added field for driver age ID
  basePrice: number;
  vehicleImage?: string;
  // Payment related fields
  paymentAmount?: number;
  paymentType?: "deposit" | "full";
  paymentStatus?: "Approved" | "Failed" | "Pending" | "Unknown";
  transactionId?: string;
  windcaveReservationRef?: string; // Adding this property to fix the type error
  // Insurance and optional fees
  insuranceId?: string;
  insuranceName?: string;
  insurancePrice?: number;
  extraKmsId?: string;
  extraKmsName?: string;
  extraKmsPrice?: number;
  selectedExtras?: Array<{
    id: string;
    name: string;
    quantity: number;
    price: number;
  }>;
  // Booking reference fields
  reservationRef?: string;
  bookingReference?: string;
  confirmationNumber?: string;
  reservationNo?: string;
  // Customer details fields
  customerFirstName?: string;
  customerLastName?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerDob?: string;
  customerLicenseExpiry?: string;
  customerAddress?: string;
  totalRateAfterDiscount?: number; // Add this new optional field
  totalDiscountAmount?: number;     // Also add total discount amount
  // Add the new mandatory fees field
  mandatoryFees?: Array<{
    name: string;
    amount: number;
  }>;
  // Add these new fields from the API response
  numberofdays?: number;
  dailyrate?: number;
  totalcost?: number;
  payment?: number;
  balancedue?: number;
  transmission?: number; // Added for API compatibility
}

export const BOOKING_SESSION_KEY = 'rcm_booking_data';

/**
 * Save booking data to sessionStorage
 */
export const saveBookingData = (data: BookingSessionData): void => {
  try {
    // Include a way to save the total rate after discount
    sessionStorage.setItem(BOOKING_SESSION_KEY, JSON.stringify(data));
    console.log('Booking data saved to session, including total rate:', data.totalRateAfterDiscount);
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

/**
 * Update existing booking data with new data
 */
export const updateBookingData = (newData: Partial<BookingSessionData>): BookingSessionData | null => {
  try {
    const currentData = getBookingData();
    if (!currentData) return null;
    
    const updatedData = { ...currentData, ...newData };
    saveBookingData(updatedData);
    return updatedData;
  } catch (error) {
    console.error('Error updating booking data:', error);
    return null;
  }
};
