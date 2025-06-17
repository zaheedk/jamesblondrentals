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

export interface RCMDriverAge {
  id: string;
  driverage: string;
  isdefault: boolean;
}

export interface RCMVehicleCategory {
  id: string;
  vehiclecategorytype: string;
  displayorder: number;
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

export interface RCMSeasonalRate {
  vehiclecategoryid: number | string;
  dailyratebeforediscount: number;
  dailyrateafterdiscount: number;
  discountrate: number;
  discounttype: string;
  numberofdays: number;
  numberofhours: number;
  rateperiod: string;
  ratesubtotal?: number;
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
  availablemessage?: string; // Added missing property
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
  vehiclecategoryid: string | number;
  vehiclecategorytypeid: string | number;
  pickuplocationid: string | number;
  pickupdate: string;
  pickuptime: string;
  dropofflocationid: string | number;
  dropoffdate: string;
  dropofftime: string;
  ageid: string | number;
  bookingtype: number; // 1=quote, 2=booking
  insuranceid?: string | number;
  extrakmsid?: string | number;
  optionalfees?: Array<{
    id: string | number;
    qty: number; // Changed from 'quantity' to 'qty' to match API requirements
  }>;
  customer?: {
    firstname: string;
    lastname: string;
    email: string;
    phone?: string;
    mobile?: string;
    dateofbirth?: string;
    licenseno?: string;
    licenseissued?: string;
    licenseexpires?: string;
    address?: string;
    city?: string;
    state?: string;
    postcode?: string;
    countryid?: string;
  };
  campaigncode?: string;
  referralid?: string;
  foundusid?: string;
  remark?: string;
  numbertravelling?: string | number;
  flightin?: string;
  flightout?: string;
  arrivalpoint?: string;
  departurepoint?: string;
  areaofuseid?: string;
  emailoption?: number;
  newsletter?: number;
  transmission?: number;
  refno?: string;
  packageid?: string | number;
  relocationspecialid?: string | number;
}

export interface RCMBookingResponseResults {
  reservationref?: string;
  bookingref?: string;
  confirmationno?: string;
  reservationno?: string | number;
  totalamount?: number;
  // Adding the missing properties used in PaymentSuccess.tsx
  bookinginfo?: Array<{
    vehiclecategory?: string;
    pickupdate?: string;
    pickuptime?: string;
    dropoffdate?: string;
    dropofftime?: string;
    totalcost?: string | number;
    payment?: string | number;
    insuranceoption?: string;
    insuranceamount?: string | number;
    pickuplocationname?: string;
    pickuplocation?: string;
    dropofflocationname?: string;
    dropofflocation?: string;
    totalrateafterdiscount?: string | number;
    numberofdays?: string | number;
    dailyrate?: string | number;
    balancedue?: string | number;
    vehicleimage?: string;
    urlpathfordocuments?: string;
    mandatoryfees?: Array<{
      name?: string;
      amount?: string | number;
      totalfeeamount?: string | number;
    }>;
  }>;
  paymentinfo?: Array<{
    paidamount: string | number;
    paymentdate?: string;
    paymentmethod?: string;
  }>;
  customerinfo?: Array<{
    firstname?: string;
    lastname?: string;
    email?: string;
    phone?: string;
    mobile?: string;
    dateofbirth?: string;
    licenseexpires?: string;
    address?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
  }>;
  extrafees?: Array<{
    name: string;
    fees: string | number;
    isoptionalfee: boolean;
  }>;
}

export interface RCMBookingResponse {
  status: string;
  bookingId?: string;
  confirmationNumber?: string;
  reservationRef?: string;
  bookingReference?: string;
  totalAmount?: number;
  error?: string;
  results?: RCMBookingResponseResults;
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

export interface RCMOptionalFee {
  id: string | number;
  vehiclecategorytypeid: string | number;
  vehiclecategoryid: string | number;
  locationid: string;
  displayorder: number;
  feegroupid: number;
  feegroupname: string;
  numberofdays: number;
  payagency: boolean;
  fees: number;
  totalfeeamount: number;
  name: string;
  type: string;
  maximumprice: number;
  stampduty: boolean;
  gst: boolean;
  ispercentageontotalcost: boolean;
  merchantfee: boolean;
  qtyapply: boolean;
  feedescription: string;
  feedescription1: string;
  feedescription2: string;
  feedescription3: string;
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
  optionalfees?: RCMOptionalFee[];
  locationfees: {
    vehiclecategoryid: string | number;
    currencysymbol: string;
    currencyname: string;
  };
  seasonalrates?: {
    vehiclecategoryid: number | string;
    dailyratebeforediscount: number;
    dailyrateafterdiscount: number;
    discountrate: number;
    discounttype: string;
    numberofdays: number;
    numberofhours: number;
    rateperiod: string;
  }[];
  mandatoryfees?: {
    vehiclecategoryid: number | string;
    vehiclecategorytypeid: number | string;
    totalfeeamount: number;
    name?: string;
  }[];
  availablecars?: RCMAvailableCar[];
}

export interface RCMStep3Response {
  status: string;
  results: RCMStep3Results;
  error?: string;
}

export interface RCMPaymentRequest {
  method: string;
  reservationref: string;
  amount: number;
  returnurl: string;
}

export interface RCMPaymentResponse {
  status: string;
  error?: string;
  results?: {
    ReturnUrl?: string;
    RedirectUrl?: string;
    TransactionType?: string;
    TransactionId?: string;
    Status?: string;
    ResponseText?: string;
    Amount?: string | number;
    RebillingToken?: string;
    ReservationRef?: string;  // Added this field to store reservation reference
  };
}

export interface RCMPaymentConfirmationRequest {
  method: string;
  reservationref: string;
  amount: string | number;
  success: boolean;
  paytype: string;
  paydate: string;
  supplierid: number;
  transactid: string;
  dpstxnref: string;
  paysource: string;
  transtype: string;
}

export interface RCMPaymentConfirmationResponse {
  status: string;
  error?: string;
  results?: any;
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

export interface BookingSessionData {
  vehicleId: string;
  vehicleName?: string;
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
}
