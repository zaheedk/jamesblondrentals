
// RCM API type definitions

export interface RCMVehicle {
  id: string | number;
  name: string;
  description: string;
  make: string;
  model: string;
  year: number;
  type: string;
  category: string;
  transmission: string;
  fuelType: string;
  fuelConsumption?: string;
  passengers?: number;
  seats: number;
  luggage: number;
  price: number | string;
  images: Array<string | { url: string }>;
  features: string[] | string;
  available: boolean;
}

export interface RCMLocation {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postcode: string;
  latitude: number;
  longitude: number;
}

// New interfaces for Step1 response
export interface RCMDriverAge {
  id: string;
  driverage: string;
  isdefault: boolean;
}

export interface RCMVehicleCategory {
  id: string;
  vehiclecategorytype: string;
}

export interface RCMOfficeTime {
  locationid: string | number;
  day?: string;
  dayofweek?: number;
  openingtime: string;
  closingtime: string;
  startpickup?: string;
  endpickup?: string;
  startdropoff?: string;
  enddropoff?: string;
  startdate?: string;
  enddate?: string;
}

export interface RCMLocationDetail {
  id: string | number;
  location: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postcode?: string;
  latitude?: number;
  longitude?: number;
  ispickupavailable: boolean;
  isdropoffavailable: boolean;
  isdefault: boolean;
  minimumbookingday: number;
  noticerequired_numberofdays: number; // This is the number of days notice required
  officeopeningtime: string;
  officeclosingtime: string;
}

export interface RCMStep1Results {
  locations: RCMLocationDetail[];
  officetimes: RCMOfficeTime[];
  driverages: RCMDriverAge[];
  categorytypes: RCMVehicleCategory[];
}

export interface RCMStep1Response {
  status: string;
  results: RCMStep1Results;
}

export interface RCMBookingRequest {
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDate: string; // ISO date string
  dropoffDate: string; // ISO date string
  vehicleId: string;
  customerDetails: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  extras?: {
    id: string;
    quantity: number;
  }[];
}

export interface RCMBookingResponse {
  bookingId: string;
  confirmationNumber: string;
  totalAmount: number;
  status: string;
}

export interface RCMAvailabilityRequest {
  pickupLocationId: string;
  dropoffLocationId: string;
  pickupDate: string; // ISO date string
  dropoffDate: string; // ISO date string
  pickupTime: string;
  dropoffTime: string;
}

export interface RCMApiConfig {
  apiKey: string;
  apiSecret: string;
  apiUrl: string;
}

export interface RCMConfigInit {
  apiUrl?: string;
  apiKey?: string;
  apiSecret?: string;
  useMockData?: boolean;
}
