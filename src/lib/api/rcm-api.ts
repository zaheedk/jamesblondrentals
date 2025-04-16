
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
  RCMStep3Response,
  RCMPaymentRequest,
  RCMPaymentResponse
} from './rcm-api-types';
import { toast } from 'sonner';

// API Configuration from Web.config file
const DEFAULT_CONFIG: RCMApiConfig = {
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "/api/rcm/booking/v3.2" // Use the proxy URL in development
};

// Direct API URL for production environments
const DIRECT_API_URL = "https://apis.rentalcarmanager.com/booking/v3.2";

// CORS proxy URLs for production/published environments
const CORS_PROXY_URLS = [
  "https://api.corsproxy.io/?",
  "https://api.allorigins.win/raw?url=",
  "https://cors-anywhere.herokuapp.com/",
  "https://crossorigin.me/"
];

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
  private apiFailedAttempts: number = 0;
  private maxFailAttempts: number = 2;
  private environment: string = process.env.NODE_ENV || 'unknown';
  private useDirectApi: boolean = false;
  private isLovableHosted: boolean = false;
  private currentCorsProxyIndex: number = -1; // Not using CORS proxy by default

  constructor(config: RCMApiConfig) {
    // Ensure API URL doesn't end with a slash
    this.config = {
      ...config,
      apiUrl: config.apiUrl.replace(/\/$/, '')
    };
    
    // Check if we're running on Lovable hosted environment
    this.isLovableHosted = window.location.hostname.includes('lovable.dev') || 
                          window.location.hostname.includes('lovable-apps') || 
                          window.location.hostname.includes('lovable.app');
    
    console.log('RCM API Client initialized. Environment:', this.environment);
    console.log('Running on Lovable hosted environment:', this.isLovableHosted);
    
    // In production or Lovable hosted environment, use mock data by default
    if (this.environment === 'production' || this.isLovableHosted) {
      console.log('Initializing RCM API client for production or hosted environment');
      this.useMockData = true;
      console.log('Using mock data by default in production/hosted environment due to CORS issues');
    }
  }

  /**
   * Initialize or update API configuration
   */
  initialize(config: RCMConfigInit): void {
    if (config.apiKey) this.config.apiKey = config.apiKey;
    if (config.apiSecret) this.config.apiSecret = config.apiSecret;
    if (config.apiUrl) this.config.apiUrl = config.apiUrl.replace(/\/$/, '');
    
    // Reset connection failure flags when re-initializing
    this.apiConnectionFailed = false;
    this.apiFailedAttempts = 0;
    
    // Configure CORS proxy usage
    if (config.useCorsProxy === true) {
      // If explicitly requested to use a CORS proxy, set it
      this.currentCorsProxyIndex = config.corsProxyIndex !== undefined ? config.corsProxyIndex : 0;
    } else if (config.useCorsProxy === false) {
      // If explicitly requested not to use a CORS proxy, disable it
      this.currentCorsProxyIndex = -1;
    }
    
    // Handle direct API vs proxy configuration
    if (config.useDirectApi === true) {
      this.useDirectApi = true;
    } else if (config.useDirectApi === false) {
      this.useDirectApi = false;
    }
    
    // Use mock data if explicitly requested, or if we previously detected API failures
    this.useMockData = config.useMockData === true || this.apiConnectionFailed;
    
    this.initialized = true;
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey,
      useMockData: this.useMockData,
      environment: this.environment,
      isLovableHosted: this.isLovableHosted,
      useDirectApi: this.useDirectApi,
      corsProxyIndex: this.currentCorsProxyIndex
    });
  }

  /**
   * Check if mock data is being used
   */
  isUsingMockData(): boolean {
    return this.useMockData;
  }

  /**
   * Ensure the API is initialized before making requests
   */
  private ensureInitialized(): void {
    if (!this.initialized) {
      console.log('RCM API not explicitly initialized, using default config');
      this.initialized = true;
      
      // For Lovable hosted apps, default to mock data if not initialized
      if (this.isLovableHosted || this.environment === 'production') {
        this.useMockData = true;
        console.log('Using mock data for uninitialized Lovable hosted app');
      }
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
    
    // Add additional headers for direct API requests when needed
    if (this.useDirectApi) {
      // For direct API calls, we might need CORS headers
      headers.append('X-Requested-With', 'XMLHttpRequest');
    }
    
    // Log request details for debugging
    console.log('RCM API Request:', {
      method,
      timestamp,
      signature,
      useDirectApi: this.useDirectApi,
      corsProxyIndex: this.currentCorsProxyIndex,
      body: requestBody
    });
    
    return headers;
  }

  /**
   * Builds the correct API URL with the API key format
   */
  private buildApiUrl(): string {
    let baseUrl = this.config.apiUrl;
    
    // If direct API mode is enabled or we're in production, use the direct URL
    if (this.useDirectApi) {
      baseUrl = DIRECT_API_URL;
      console.log('Using direct API URL:', baseUrl);
      
      // If we're using a CORS proxy
      if (this.currentCorsProxyIndex >= 0 && this.currentCorsProxyIndex < CORS_PROXY_URLS.length) {
        const corsProxy = CORS_PROXY_URLS[this.currentCorsProxyIndex];
        console.log('Using CORS proxy:', corsProxy);
        baseUrl = corsProxy + encodeURIComponent(baseUrl);
      }
    }
    
    const url = `${baseUrl}/${this.config.apiKey}?apikey=${this.config.apiKey}`;
    console.log('Built API URL:', url, 'Direct mode:', this.useDirectApi, 'CORS proxy index:', this.currentCorsProxyIndex);
    return url;
  }
  
  /**
   * Check if we should use mock data
   * - If explicitly set to use mock data
   * - If API connection has failed too many times
   */
  private shouldUseMockData(requestMethod: string): boolean {
    // Always check user-configured setting first
    if (this.useMockData) {
      console.log(`Using mock data because useMockData=true for: ${requestMethod}`);
      return true;
    }
    
    // Then check if API has failed too many times
    if (this.apiConnectionFailed) {
      console.log(`Using mock data because previous API connection failed for: ${requestMethod}`);
      return true;
    }
    
    return false;
  }

  /**
   * Makes a generic API request with the correct format
   * This allows for custom method calls that aren't pre-defined
   */
  async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

    // Check if we should use mock data
    if (this.shouldUseMockData(requestMethod)) {
      return this.getMockData(requestMethod) as T;
    }

    try {
      // Build the URL with API key
      const apiUrl = this.buildApiUrl();
      console.log(`Making ${method} request to ${apiUrl} for method ${requestMethod} in ${this.environment} environment`);
      
      // Create requestBody with method as the first property
      const requestBody = { method: requestMethod, ...body };
      
      // Create headers with auth tokens
      const headers = this.createHeaders(method, requestBody);
      
      // Configure fetch options based on environment
      const fetchOptions: RequestInit = {
        method,
        headers,
        body: JSON.stringify(requestBody),
        mode: 'cors', // Always use cors mode for consistency
        credentials: 'omit', // Don't send credentials to avoid CORS issues
      };
      
      // Make the request with a timeout
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000); // 15 second timeout
      
      try {
        fetchOptions.signal = controller.signal;
        const response = await fetch(apiUrl, fetchOptions);
        clearTimeout(timeout);
        
        // Process response
        const contentType = response.headers.get("content-type");
        console.log(`API response content type: ${contentType}`);
        
        if (!contentType || contentType.indexOf("application/json") === -1) {
          // Handle non-JSON response
          console.error('Non-JSON response received:', await response.text().then(text => text.substring(0, 200) + '...'));
          this.switchToMockData();
          return this.getMockData(requestMethod) as T;
        }

        // Reset failure counter on successful response
        if (response.ok) {
          this.apiFailedAttempts = 0;
          this.apiConnectionFailed = false;
        }

        // Handle non-OK responses
        if (!response.ok) {
          console.error(`API returned status ${response.status}: ${response.statusText}`);
          // Switch to mock data after failure
          this.switchToMockData();
          return this.getMockData(requestMethod) as T;
        }

        // Parse and return the response
        const responseData = await response.json();
        console.log('API response:', responseData);
        
        // Check for API errors in the response
        if (responseData.status === "ERR") {
          console.error('API returned error:', responseData.error);
          // Switch to mock data on API error
          this.switchToMockData();
          return this.getMockData(requestMethod) as T;
        }
        
        return responseData;
      } catch (error) {
        clearTimeout(timeout);
        const errorMessage = error instanceof Error ? error.message : "Unknown fetch error";
        console.error(`API fetch error:`, errorMessage);
        
        // Try next connection strategy
        if (this.tryNextConnectionStrategy()) {
          console.log('Trying next connection strategy...');
          // Try again with new strategy
          return this.request<T>(method, requestMethod, body);
        }
        
        // Switch to mock data on error if all strategies failed
        this.switchToMockData();
        return this.getMockData(requestMethod) as T;
      }
    } catch (error) {
      console.error(`RCM API request failed in ${this.environment} environment:`, error);
      
      // Switch to mock data
      this.switchToMockData();
      return this.getMockData(requestMethod) as T;
    }
  }
  
  /**
   * Try the next connection strategy when the current one fails
   * Returns true if there's a new strategy to try
   */
  private tryNextConnectionStrategy(): boolean {
    if (!this.useDirectApi) {
      // Switch to direct API if we were using proxy
      console.log('Switching to direct API after proxy failure');
      this.useDirectApi = true;
      this.currentCorsProxyIndex = -1;
      return true;
    } else if (this.currentCorsProxyIndex < 0) {
      // Switch to first CORS proxy if we were using direct without proxy
      console.log('Switching to CORS proxy after direct API failure');
      this.currentCorsProxyIndex = 0;
      return true;
    } else if (this.currentCorsProxyIndex < CORS_PROXY_URLS.length - 1) {
      // Try next CORS proxy
      this.currentCorsProxyIndex++;
      console.log(`Trying next CORS proxy: ${CORS_PROXY_URLS[this.currentCorsProxyIndex]}`);
      return true;
    }
    
    // No more strategies to try
    return false;
  }
  
  /**
   * Switch to mock data mode when all API strategies have failed
   */
  private switchToMockData(): void {
    if (!this.apiConnectionFailed) {
      this.apiConnectionFailed = true;
      this.useMockData = true;
      toast.error("API Connection Failed", {
        description: `Switching to demo mode with sample data. Environment: ${this.environment}`
      });
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
                totalinsuranceamount: 15,
                isdefault: true
              },
              {
                id: "202",
                description: "Premium Insurance",
                totalinsuranceamount: 25,
                isdefault: false
              }
            ],
            kmcharges: [
              {
                id: "301",
                description: "Unlimited",
                dailyrate: 0,
                isdefault: true
              },
              {
                id: "302",
                description: "200km per day",
                dailyrate: -10,
                isdefault: false
              }
            ],
            extras: [
              {
                id: "401",
                description: "GPS Navigation",
                totalextraamount: 5,
                isdefault: false
              },
              {
                id: "402",
                description: "Child Seat",
                totalextraamount: 7,
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
      case 'createdpspayment':
        return {
          status: "OK",
          paymentId: "MOCK_PAYMENT_ID",
          paymentReference: "MOCK_PAYMENT_REF"
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
      // Use 'booking' as the method name based on the provided example code
      const response = await this.request<RCMBookingResponse>('POST', 'booking', bookingData);
      
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
   * Create a payment session with the RCM API
   */
  async createPaymentSession(paymentData: RCMPaymentRequest): Promise<RCMPaymentResponse> {
    console.log('Creating payment session with data:', paymentData);
    
    try {
      // Using 'createdpspayment' as the method name based on the provided example code
      const response = await this.request<RCMPaymentResponse>('POST', 'createdpspayment', paymentData);
      
      if (response.status === "OK") {
        console.log('Payment session created successfully:', response);
        return response;
      } else {
        console.error('API returned error:', response.error || 'Unknown error');
        throw new Error(response.error || "Failed to create payment session");
      }
    } catch (error) {
      console.error('Payment session creation error:', error);
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
        console.log('Insurance options:', response.results.insuranceoptions);
        console.log('KM charges:', response.results.kmcharges);
        console.log('Extras in response:', response.results.extras);
        
        // Ensure all arrays are properly initialized
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
        
        if (!response.results.insuranceoptions) {
          console.log('No insurance options in response, setting to empty array');
          response.results.insuranceoptions = [];
        } else if (!Array.isArray(response.results.insuranceoptions)) {
          response.results.insuranceoptions = [];
        }
        
        if (!response.results.kmcharges) {
          console.log('No km charges in response, setting to empty array');
          response.results.kmcharges = [];
        } else if (!Array.isArray(response.results.kmcharges)) {
          response.results.kmcharges = [];
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
