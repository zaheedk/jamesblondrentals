import { generateSignature } from './rcm-signature';
import type { 
  RCMApiConfig,
  RCMVehicle,
  RCMLocation,
  RCMBookingRequest,
  RCMBookingResponse,
  RCMAvailabilityRequest,
  RCMStep1Response,
  RCMConfigInit,
  RCMStep2Request,
  RCMStep2Response,
  RCMStep3Request,
  RCMStep3Response
} from './rcm-api-types';
import { toast } from 'sonner';

// API Configuration from Web.config file
const DEFAULT_CONFIG: RCMApiConfig = {
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "/api/rcm/booking/v3.2" // Use the proxy URL
};

// Mock data definitions remain but won't be used unless explicitly requested
const MOCK_STEP1_DATA: RCMStep1Response = {
  status: "OK",
  results: {
    locations: [
      {
        id: "625",
        location: "Auckland Airport",
        address: "123 Airport Rd",
        city: "Auckland",
        state: "Auckland",
        country: "New Zealand",
        postcode: "2022",
        latitude: -36.999,
        longitude: 174.785,
        noticerequired_numberofdays: 0,
        ispickupavailable: true,
        isdropoffavailable: true,
        isdefault: true,
        minimumbookingday: 1,
        officeopeningtime: "08:00",
        officeclosingtime: "18:00"
      },
      {
        id: "626",
        location: "Wellington Airport",
        address: "45 Airport Dr",
        city: "Wellington",
        state: "Wellington",
        country: "New Zealand",
        postcode: "6022",
        latitude: -41.327,
        longitude: 174.805,
        noticerequired_numberofdays: 0,
        ispickupavailable: true,
        isdropoffavailable: true,
        isdefault: false,
        minimumbookingday: 1,
        officeopeningtime: "08:00",
        officeclosingtime: "18:00"
      }
    ],
    driverages: [
      { id: "1", driverage: "21-24 years", isdefault: false },
      { id: "2", driverage: "25+ years", isdefault: true }
    ],
    categorytypes: [
      { id: "1", vehiclecategorytype: "Economy" },
      { id: "2", vehiclecategorytype: "Compact" },
      { id: "3", vehiclecategorytype: "SUV" },
      { id: "4", vehiclecategorytype: "Luxury" }
    ],
    officetimes: [
      { locationid: "625", dayofweek: 1, openingtime: "08:00", closingtime: "18:00" },
      { locationid: "625", dayofweek: 2, openingtime: "08:00", closingtime: "18:00" },
      { locationid: "625", dayofweek: 3, openingtime: "08:00", closingtime: "18:00" },
      { locationid: "625", dayofweek: 4, openingtime: "08:00", closingtime: "18:00" },
      { locationid: "625", dayofweek: 5, openingtime: "08:00", closingtime: "18:00" },
      { locationid: "625", dayofweek: 6, openingtime: "09:00", closingtime: "16:00" },
      { locationid: "625", dayofweek: 7, openingtime: "09:00", closingtime: "16:00" }
    ]
  }
};

/**
 * RCM API Client for handling all API requests
 */
class RCMApiClient {
  private config: RCMApiConfig;
  private initialized: boolean = false;
  private useMockData: boolean = false;
  private apiConnectionFailed: boolean = false;

  constructor(config: RCMApiConfig) {
    // Ensure API URL doesn't end with a slash
    this.config = {
      ...config,
      apiUrl: config.apiUrl.replace(/\/$/, '')
    };
  }

  /**
   * Initialize or update API configuration
   */
  initialize(config: RCMConfigInit): void {
    if (config.apiKey) this.config.apiKey = config.apiKey;
    if (config.apiSecret) this.config.apiSecret = config.apiSecret;
    if (config.apiUrl) this.config.apiUrl = config.apiUrl.replace(/\/$/, '');
    
    // Only use mock data if explicitly requested, default to false
    this.useMockData = config.useMockData === true;
    
    // Always reset the connection status on initialization
    this.apiConnectionFailed = false;
    
    this.initialized = true;
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey,
      useMockData: this.useMockData
    });
  }

  /**
   * Ensure the API is initialized before making requests
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      console.log('RCM API not explicitly initialized, using default config');
      this.initialized = true;
    }
  }

  /**
   * Creates headers with authentication for API requests based on the Postman collection
   */
  private createHeaders(method: string, body?: any): Headers {
    this.ensureInitialized();

    const timestamp = new Date().toISOString();
    const requestBody = body ? JSON.stringify(body) : '{}';
    
    // Generate HMAC SHA256 signature
    const signature = generateSignature({
      method,
      path: '', // Not used in actual signature generation
      timestamp,
      apiKey: this.config.apiKey,
      apiSecret: this.config.apiSecret,
      body: requestBody
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('signature', signature); 
    
    // Log request details for debugging
    console.log('RCM API Request:', {
      method,
      timestamp,
      signature,
      body: requestBody
    });
    
    return headers;
  }

  /**
   * Builds the correct API URL with the API key format
   * Format: /api/rcm/booking/v3.2/[API_KEY]?apikey=[API_KEY]
   */
  private buildApiUrl(): string {
    const url = `${this.config.apiUrl}/${this.config.apiKey}?apikey=${this.config.apiKey}`;
    console.log('Built API URL:', url);
    return url;
  }

  /**
   * Makes an API request with the correct format matching the Postman collection
   */
  private async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

    // Only use mock data if explicitly enabled, NOT when API calls fail
    if (this.useMockData) {
      console.log('Using mock data because useMockData=true for:', requestMethod);
      return this.getMockData(requestMethod) as T;
    }

    try {
      // Build the URL with API key
      const apiUrl = this.buildApiUrl();
      console.log(`Making ${method} request to ${apiUrl}`);
      
      // Create requestBody with method as the first property
      const requestBody = { method: requestMethod, ...body };
      
      // Create headers with auth tokens
      const headers = this.createHeaders(method, requestBody);
      
      // Make the request
      const response = await fetch(apiUrl, {
        method,
        headers,
        body: JSON.stringify(requestBody),
        credentials: 'same-origin', // Important for cookies if needed
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      if (contentType && contentType.indexOf("application/json") === -1) {
        console.error("Non-JSON response received:", contentType);
        const text = await response.text();
        console.error("Response text:", text);
        
        // Don't set flag to use mock data anymore
        // Instead, throw an error to be handled by the caller
        throw new Error("API returned non-JSON response");
      }

      // Handle non-OK responses
      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || `API request failed: ${response.status}` };
        }
        
        console.error(`API error: ${response.status} ${response.statusText}`, errorData);
        
        // Don't set flag to use mock data anymore
        // Instead, throw an error to be handled by the caller
        throw new Error(errorData.message || `Request failed with status: ${response.status}`);
      }

      // Parse and return the response
      const responseData = await response.json();
      console.log('API response:', responseData);
      
      // Check for API errors in the response
      if (responseData.status === "ERR") {
        console.error('API returned error:', responseData.error);
        throw new Error(responseData.error || 'Unknown API error');
      }
      
      return responseData;
    } catch (error) {
      console.error('RCM API request failed:', error);
      
      // Don't set flag to use mock data anymore
      // Don't fall back to mock data, instead throw the error to be handled by the caller
      throw error;
    }
  }

  /**
   * Get mock data for testing when API is not available
   */
  private getMockData(method: string): any {
    console.log('Providing mock data for method:', method);
    
    switch (method) {
      case 'step1':
        return MOCK_STEP1_DATA;
      case 'step2':
        return {
          status: "OK",
          results: {
            availablecars: [
              {
                vehiclecategoryid: "101",
                vehiclecategorytypeid: "1",
                vehiclecategory: "Toyota Corolla",
                vehicledescription1: "Economy car with great fuel efficiency",
                vehicledescription2: "Automatic transmission",
                vehicledescription3: "Bluetooth and USB",
                imageurl: "https://via.placeholder.com/300x200?text=Toyota+Corolla",
                numberofadults: 4,
                numberofchildren: 1,
                numberoflargecases: 2,
                numberofsmallcases: 2,
                totalrateafterdiscount: 199,
                totaldiscountamount: 20,
                available: 1
              },
              {
                vehiclecategoryid: "102",
                vehiclecategorytypeid: "3",
                vehiclecategory: "Toyota RAV4",
                vehicledescription1: "SUV with ample space",
                vehicledescription2: "Automatic transmission",
                vehicledescription3: "Bluetooth and Navigation",
                imageurl: "https://via.placeholder.com/300x200?text=Toyota+RAV4",
                numberofadults: 5,
                numberofchildren: 2,
                numberoflargecases: 3,
                numberofsmallcases: 2,
                totalrateafterdiscount: 299,
                totaldiscountamount: 30,
                available: 1
              }
            ],
            seasonalrates: [
              {
                vehiclecategoryid: "101",
                numberofdays: 3,
                dailyrateafterdiscount: 66.33
              },
              {
                vehiclecategoryid: "102",
                numberofdays: 3,
                dailyrateafterdiscount: 99.66
              }
            ],
            mandatoryfees: [
              {
                vehiclecategoryid: "101",
                vehiclecategorytypeid: "1",
                totalfeeamount: 20
              },
              {
                vehiclecategoryid: "102",
                vehiclecategorytypeid: "3",
                totalfeeamount: 25
              }
            ]
          }
        };
      case 'step3':
        return {
          status: "OK",
          results: {
            insuranceoptions: [
              {
                id: "201",
                description: "Basic Insurance",
                amount: 15,
                isdefault: true
              },
              {
                id: "202",
                description: "Premium Insurance",
                amount: 25,
                isdefault: false
              }
            ],
            kmcharges: [
              {
                id: "301",
                description: "Unlimited",
                amount: 0,
                isdefault: true
              },
              {
                id: "302",
                description: "200km per day",
                amount: -10,
                isdefault: false
              }
            ],
            extras: [
              {
                id: "401",
                description: "GPS Navigation",
                amount: 5,
                isdefault: false
              },
              {
                id: "402",
                description: "Child Seat",
                amount: 7,
                isdefault: false
              }
            ],
            locationfees: {
              vehiclecategoryid: 0,
              currencysymbol: "$",
              currencyname: "USD"
            }
          }
        };
      case 'vehicles/available':
        return [
          {
            id: "101",
            name: "Toyota Corolla",
            type: "economy",
            price: 199,
            features: ["Automatic", "4 Doors", "5 Seats"],
            available: true
          },
          {
            id: "102",
            name: "Toyota RAV4",
            type: "suv",
            price: 299,
            features: ["Automatic", "5 Doors", "5 Seats"],
            available: true
          }
        ];
      case 'vehicles/details':
        return {
          id: "101",
          name: "Toyota Corolla",
          description: "Comfortable economy car with excellent fuel efficiency",
          type: "economy",
          price: 199,
          features: ["Automatic", "4 Doors", "5 Seats", "Bluetooth", "USB"],
          images: ["https://via.placeholder.com/800x400?text=Toyota+Corolla"]
        };
      case 'booking':
        return {
          status: "OK",
          confirmationNumber: "MOCK" + Math.floor(Math.random() * 100000),
          bookingReference: "REF" + Math.floor(Math.random() * 100000)
        };
      default:
        return { status: "OK", message: "Mock data not available for this method", results: {} };
    }
  }

  /**
   * Get Step1 data (locations, driver ages, categories, etc.)
   * Using method name 'step1' as indicated in the Postman collection
   */
  async getStep1(): Promise<RCMStep1Response> {
    return this.request<RCMStep1Response>('POST', 'step1');
  }

  /**
   * Get all available locations
   */
  async getLocations(): Promise<RCMLocation[]> {
    const step1Data = await this.getStep1();
    if (step1Data.status === "OK" && step1Data.results?.locations) {
      return step1Data.results.locations.map(loc => ({
        id: String(loc.id), // Convert id to string to match RCMLocation type
        name: loc.location,
        address: loc.address || "",
        city: loc.city || "",
        state: loc.state || "",
        country: loc.country || "",
        postcode: loc.postcode || "",
        latitude: loc.latitude || 0,
        longitude: loc.longitude || 0
      }));
    }
    throw new Error("Failed to retrieve locations");
  }

  /**
   * Get available vehicles based on location and dates
   */
  async getAvailableVehicles(params: RCMAvailabilityRequest): Promise<RCMVehicle[]> {
    return this.request<RCMVehicle[]>('POST', 'vehicles/available', params);
  }

  /**
   * Get vehicle details by ID
   */
  async getVehicleById(vehicleId: string): Promise<RCMVehicle> {
    return this.request<RCMVehicle>('POST', 'vehicles/details', { id: vehicleId });
  }

  /**
   * Create a booking with the RCM API
   */
  async createBooking(bookingData: RCMBookingRequest): Promise<RCMBookingResponse> {
    console.log('Creating booking with data:', bookingData);
    
    try {
      const response = await this.request<RCMBookingResponse>('POST', 'step4', bookingData);
      
      if (response.status === "OK") {
        console.log('Booking created successfully:', response);
        return response;
      } else {
        console.error('API returned error:', response.error || 'Unknown error');
        throw new Error(response.error || "Failed to create booking");
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      throw error;
    }
  }

  /**
   * Get Step2 data (available vehicles)
   * Using method name 'step2' as indicated in the provided code
   */
  async getStep2(params: RCMStep2Request): Promise<RCMStep2Response> {
    console.log('Fetching Step2 data with params:', params);
    
    // Log specifically the category ID for debugging
    if ('vehiclecategorytypeid' in params) {
      console.log('Vehicle category type ID:', params.vehiclecategorytypeid, 'Type:', typeof params.vehiclecategorytypeid);
    } else {
      console.log('No vehicle category type ID in request - using all categories');
    }

    return this.request<RCMStep2Response>('POST', 'step2', params);
  }

  /**
   * Get Step3 data (insurance options, km charges, extras)
   * Using method name 'step3' as indicated in the API documentation
   */
  async getStep3(params: RCMStep3Request): Promise<RCMStep3Response> {
    console.log('Fetching Step3 data with params:', params);
    
    try {
      const response = await this.request<RCMStep3Response>('POST', 'step3', params);
      
      // Additional logging to debug extras
      if (response.status === "OK" && response.results) {
        console.log('Step3 response received with status OK');
        console.log('Extras in response:', response.results.extras);
        console.log('Extras type:', typeof response.results.extras);
        
        // Ensure extras is always an array
        if (!response.results.extras) {
          console.log('No extras in response, setting to empty array');
          response.results.extras = [];
        } else if (!Array.isArray(response.results.extras)) {
          console.log('Extras is not an array, converting:', response.results.extras);
          try {
            // If the API returns an object or string, try to convert it to an array
            response.results.extras = [];
          } catch (e) {
            console.error('Failed to parse extras:', e);
            response.results.extras = [];
          }
        }
      }
      
      return response;
    } catch (error) {
      console.error('Error in getStep3:', error);
      // Return a valid but empty response on error
      return {
        status: "ERR",
        error: error instanceof Error ? error.message : "Unknown error in getStep3",
        results: {
          insuranceoptions: [],
          kmcharges: [],
          extras: [],
          locationfees: {
            vehiclecategoryid: 0,
            currencysymbol: "$",
            currencyname: "USD"
          }
        }
      };
    }
  }
}

// Export a singleton instance
export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);
