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
  id: string | number;
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

// New Step2 response interfaces
export interface RCMSeasonalRate {
  vehiclecategoryid: number | string;
  dailyratebeforediscount: number;
  dailyrateafterdiscount: number;
  discountrate: number;
  discounttype: string;
  numberofdays: number;
  numberofhours: number;
  rateperiod: string;
}

export interface RCMLocationFee {
  vehiclecategorytypeid: number | string;
  currencysymbol: string;
  currencyname: string;
}

export interface RCMMandatoryFee {
  vehiclecategoryid: number | string;
  vehiclecategorytypeid: number | string;
  totalfeeamount: number;
}

export interface RCMAvailableCar {
  vehiclecategoryid: number | string;
  vehiclecategorytypeid: number | string;
  vehiclecategory: string;
  vehicledescription1: string;
  vehicledescription2: string;
  vehicledescription3: string;
  imageurl: string;
  totalrateafterdiscount: number;
  totaldiscountamount: number;
  avgrate: number;
  numberofdays: string;
  numberofadults: number;
  numberofchildren: number;
  numberoflargecases: number;
  numberofsmallcases: number;
  available: number;
}

export interface RCMStep2Results {
  availablecars: RCMAvailableCar[];
  seasonalrates: RCMSeasonalRate[];
  locationfees: RCMLocationFee[];
  mandatoryfees: RCMMandatoryFee[];
}

export interface RCMStep2Response {
  status: string;
  results: RCMStep2Results;
  error?: string; // Adding optional error property
}

export interface RCMStep2Request {
  vehiclecategorytypeid?: number | string;
  pickuplocationid: string | number;
  pickupdate: string;
  pickuptime: string;
  dropofflocationid: string | number;
  dropoffdate: string;
  dropofftime: string;
  ageid?: string | number;
  campaigncode?: string;
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

export interface RCMInsuranceOption {
  id: string | number;
  name: string;
  description: string;
  totalinsuranceamount: number;
  isdefault: boolean;
}

export interface RCMKmCharge {
  id: string | number;
  name: string;
  mileagedesc: string;
  dailyrate: number;
  numberofkmsfree: number;
  feeforeachadditionalkm: number;
  isdefault: boolean;
}

export interface RCMExtra {
  id: string | number;
  name: string;
  description?: string;
  maxquantity: number;  // Maximum quantity allowed
  unitprice: number;    // Price per unit
  totalextraamount: number;  // Total amount for default quantity
  isdefault: boolean;   // Whether selected by default
  // Additional fields from the API response
  vehiclecategorytypeid?: string | number;
  vehiclecategoryid?: string | number;
  locationid?: string | number;
  displayorder?: number;
  feegroupid?: number;
  feegroupname?: string;
  numberofdays?: number;
  payagency?: boolean;
  fees?: number;
  type?: string;
  maximumprice?: number;
  stampduty?: boolean;
  gst?: boolean;
  ispercentageontotalcost?: boolean;
  merchantfee?: boolean;
  qtyapply?: boolean;
  feedescription?: string;
  feedescription1?: string;
  feedescription2?: string;
  feedescription3?: string;
}

export interface RCMStep3Request {
  vehiclecategoryid: string | number;
  vehiclecategorytypeid: string | number; 
  pickuplocationid: string | number;
  pickupdate: string;  // Should be in dd/MM/yyyy format
  pickuptime: string;
  dropofflocationid: string | number;
  dropoffdate: string;  // Should be in dd/MM/yyyy format
  dropofftime: string;
  ageid: string | number;
  campaigncode?: string;
}

export interface RCMStep3Results {
  insuranceoptions: RCMInsuranceOption[];
  kmcharges: RCMKmCharge[];
  extras: RCMExtra[];
  locationfees: {
    vehiclecategoryid: string | number;
    currencysymbol: string;
    currencyname: string;
  };
}

export interface RCMStep3Response {
  status: string;
  results: RCMStep3Results;
  error?: string;
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
