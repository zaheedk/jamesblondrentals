
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

// API Configuration
const DEFAULT_CONFIG: RCMApiConfig = {
  apiKey: import.meta.env.VITE_RCM_API_KEY || "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: import.meta.env.VITE_RCM_API_SECRET || "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "/api/rcm/booking/v3.2"
};

class RCMApiClient {
  config: RCMApiConfig;
  private initialized: boolean = false;
  private useMockData: boolean = false;
  private apiConnectionFailed: boolean = false;
  private lastRequestDetails: {
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: any;
    timestamp?: string;
    response?: any;
    error?: string;
  } = {};

  constructor(config: RCMApiConfig) {
    this.config = {
      ...config,
      apiUrl: config.apiUrl.replace(/\/$/, '')
    };
  }

  initialize(config: RCMConfigInit): void {
    if (config.apiKey) this.config.apiKey = config.apiKey;
    if (config.apiSecret) this.config.apiSecret = config.apiSecret;
    if (config.apiUrl) this.config.apiUrl = config.apiUrl.replace(/\/$/, '');
    if (config.useMockData !== undefined) this.useMockData = config.useMockData;
    
    this.initialized = true;
    this.apiConnectionFailed = false; // Reset connection status on initialization
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey ? '******' : undefined,
      useMockData: this.useMockData
    });
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      console.log('RCM API not explicitly initialized, using default config');
      this.initialized = true;
    }
  }

  shouldUseMockData(): boolean {
    return this.useMockData || this.apiConnectionFailed;
  }

  private createHeaders(method: string, body?: any): Headers {
    this.ensureInitialized();

    const timestamp = new Date().toISOString();
    const requestBody = body ? JSON.stringify(body) : '{}';
    
    const signature = generateSignature({
      method,
      path: '', 
      timestamp,
      apiKey: this.config.apiKey,
      apiSecret: this.config.apiSecret,
      body: requestBody
    });

    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Accept', 'application/json');
    headers.append('signature', signature); 
    
    console.log('Generated signature for API request:', signature.substring(0, 10) + '...');
    
    return headers;
  }

  private buildApiUrl(): string {
    const baseUrl = this.config.apiUrl;
    const apiKey = this.config.apiKey;
    
    // For direct API (not proxy), use this format
    if (baseUrl.includes('apis.rentalcarmanager.com')) {
      return `${baseUrl}?apikey=${apiKey}`;
    }
    
    // For proxied API, use this format
    return `${baseUrl}/${apiKey}?apikey=${apiKey}`;
  }

  getLastRequestDetails() {
    return this.lastRequestDetails;
  }

  async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

    // If mock mode is enabled, don't make actual API calls
    if (this.shouldUseMockData()) {
      console.log(`[MOCK MODE] Using mock data for ${method} - ${requestMethod}`);
      this.lastRequestDetails = {
        url: "mock://api.example.com",
        method,
        timestamp: new Date().toISOString(),
        error: "Using mock data mode"
      };
      
      // Return mock response based on the request method
      if (requestMethod === "step1") {
        return {
          status: "OK",
          results: {
            locations: [
              { id: "1", location: "Mock Location 1", address: "123 Mock St", city: "Mock City", state: "CA", country: "USA", postcode: "12345", latitude: -36.8485, longitude: 174.7633, ispickupavailable: true, isdropoffavailable: true, isdefault: true, minimumbookingday: 1, noticerequired_numberofdays: 0 },
              { id: "2", location: "Mock Location 2", address: "456 Test Ave", city: "Test Town", state: "NY", country: "USA", postcode: "54321", latitude: -36.8485, longitude: 174.7633, ispickupavailable: true, isdropoffavailable: true, isdefault: false, minimumbookingday: 1, noticerequired_numberofdays: 0 }
            ],
            driverages: [
              { id: "1", driverage: "18-24", isdefault: false },
              { id: "2", driverage: "25+", isdefault: true },
              { id: "3", driverage: "26+", isdefault: false }
            ],
            categorytypes: [
              { id: "1", vehiclecategorytype: "Economy", displayorder: 1 },
              { id: "2", vehiclecategorytype: "Luxury", displayorder: 2 }
            ],
            officetimes: [
              { 
                locationid: "1", 
                dayofweek: 1, 
                openingtime: "08:00", 
                closingtime: "17:00",
                startpickup: "08:00",
                endpickup: "16:30",
                startdropoff: "08:00",
                enddropoff: "17:00"
              },
              { 
                locationid: "2", 
                dayofweek: 1, 
                openingtime: "08:00", 
                closingtime: "17:00",
                startpickup: "08:00",
                endpickup: "16:30",
                startdropoff: "08:00",
                enddropoff: "17:00"
              }
            ]
          }
        } as unknown as T;
      }
      
      if (requestMethod === "step2") {
        return {
          status: "OK",
          results: {
            availablecars: [
              {
                vehiclecategoryid: "101",
                vehiclecategorytypeid: "1",
                vehiclecategory: "Economy Car",
                vehicledescription1: "Toyota Corolla or similar",
                vehicledescription2: "Great for city driving",
                vehicledescription3: "Fuel efficient",
                imageurl: "https://example.com/car1.jpg",
                totalrateafterdiscount: 299.99,
                totaldiscountamount: 50.00,
                avgrate: 99.99,
                numberofdays: "3",
                numberofadults: 5,
                numberofchildren: 0,
                numberoflargecases: 2,
                numberofsmallcases: 3,
                available: 5
              }
            ],
            seasonalrates: [],
            locationfees: [],
            mandatoryfees: []
          }
        } as unknown as T;
      }
      
      return {} as T;
    }

    const requestStartTime = new Date();
    const requestDetails = {
      timestamp: requestStartTime.toISOString(),
      method,
      requestMethod
    };
    
    try {
      // Try direct API first if we're currently set to use direct API
      if (this.config.apiUrl.includes('apis.rentalcarmanager.com')) {
        try {
          const result = await this.makeDirectApiRequest<T>(method, requestMethod, body);
          this.apiConnectionFailed = false;
          return result;
        } catch (directError) {
          console.error('Direct API request failed:', directError);
          this.lastRequestDetails.error = directError instanceof Error ? directError.message : String(directError);
          throw directError;
        }
      } else {
        // Try proxied request first, then fallback to direct if it fails
        try {
          const result = await this.makeProxiedRequest<T>(method, requestMethod, body);
          this.apiConnectionFailed = false;
          return result;
        } catch (proxyError) {
          console.error('Proxied API request failed, trying direct API:', proxyError);
          
          // Fallback to direct API
          try {
            // Temporarily switch to direct API
            const originalUrl = this.config.apiUrl;
            this.config.apiUrl = 'https://apis.rentalcarmanager.com/booking/v3.2';
            
            const result = await this.makeDirectApiRequest<T>(method, requestMethod, body);
            
            // If successful, notify the user we switched to direct API
            console.log('Successfully switched to direct API connection');
            
            // Reset the flag since we've successfully connected
            this.apiConnectionFailed = false;
            
            return result;
          } catch (directError) {
            console.error('Both proxy and direct API requests failed');
            this.lastRequestDetails.error = `Proxy error: ${proxyError instanceof Error ? proxyError.message : String(proxyError)}. Direct error: ${directError instanceof Error ? directError.message : String(directError)}`;
            this.apiConnectionFailed = true;
            throw directError;
          }
        }
      }
    } catch (error) {
      console.error('RCM API request failed after all attempts:', error);
      
      if (!this.lastRequestDetails.error) {
        this.lastRequestDetails.error = error instanceof Error ? error.message : String(error);
      }
      
      // Flag API connection as failed
      this.apiConnectionFailed = true;
      
      throw error;
    }
  }
  
  private async makeProxiedRequest<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    const apiUrl = this.buildApiUrl();
    console.log(`Making proxied ${method} request to ${apiUrl} for method ${requestMethod}`);
    
    const headers = this.createHeaders(method, body);
    const requestBody = { method: requestMethod, ...body };
    
    // Store request details for diagnostics
    this.lastRequestDetails = {
      url: apiUrl,
      method,
      headers: Object.fromEntries(headers.entries()),
      body: requestBody,
      timestamp: new Date().toISOString()
    };
    
    const fetchStartTime = Date.now();
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: JSON.stringify(requestBody),
      credentials: 'same-origin',
    });
    const fetchEndTime = Date.now();
    
    console.log(`Proxied fetch completed in ${fetchEndTime - fetchStartTime}ms`);
    
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error(`Invalid response content type: ${contentType} (expected application/json)`);
    }

    const jsonResponse = await response.json();
    
    if (jsonResponse.status === "ERR") {
      throw new Error(jsonResponse.error || 'Unknown API error');
    }
    
    this.lastRequestDetails.response = jsonResponse;
    return jsonResponse;
  }
  
  private async makeDirectApiRequest<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    const apiUrl = 'https://apis.rentalcarmanager.com/booking/v3.2?apikey=' + this.config.apiKey;
    console.log(`Making direct ${method} request to ${apiUrl} for method ${requestMethod}`);
    
    const headers = this.createHeaders(method, body);
    const requestBody = { method: requestMethod, ...body };
    
    // Store request details for diagnostics
    this.lastRequestDetails = {
      url: apiUrl,
      method,
      headers: Object.fromEntries(headers.entries()),
      body: requestBody,
      timestamp: new Date().toISOString()
    };
    
    const fetchStartTime = Date.now();
    const response = await fetch(apiUrl, {
      method,
      headers,
      body: JSON.stringify(requestBody),
      mode: 'cors',
    });
    const fetchEndTime = Date.now();
    
    console.log(`Direct fetch completed in ${fetchEndTime - fetchStartTime}ms`);
    
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      throw new Error(`Invalid response content type: ${contentType} (expected application/json)`);
    }

    const jsonResponse = await response.json();
    
    if (jsonResponse.status === "ERR") {
      throw new Error(jsonResponse.error || 'Unknown API error');
    }
    
    this.lastRequestDetails.response = jsonResponse;
    return jsonResponse;
  }
  
  // Helper function to extract meaningful message from HTML response
  private extractMessageFromHtml(html: string): string | null {
    try {
      // Look for title tag
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      if (titleMatch && titleMatch[1] && !titleMatch[1].toLowerCase().includes('document')) {
        return `Page title: ${titleMatch[1]}`;
      }
      
      // Look for common error messages in the body
      const errorMatches = [
        { pattern: /access denied|forbidden|403/i, message: 'Access denied or forbidden' },
        { pattern: /not found|404/i, message: 'Resource not found' },
        { pattern: /server error|500/i, message: 'Server error' },
        { pattern: /maintenance|down for maintenance/i, message: 'Service under maintenance' },
        { pattern: /invalid signature|authentication failed/i, message: 'Authentication failed' }
      ];
      
      for (const matcher of errorMatches) {
        if (matcher.pattern.test(html)) {
          return matcher.message;
        }
      }
      
      return null;
    } catch (e) {
      console.error('Error extracting message from HTML:', e);
      return null;
    }
  }

  async getStep1(): Promise<RCMStep1Response> {
    return this.request<RCMStep1Response>('POST', 'step1');
  }

  async getLocations(): Promise<RCMLocation[]> {
    const step1Data = await this.getStep1();
    if (step1Data.status === "OK" && step1Data.results?.locations) {
      return step1Data.results.locations.map(loc => ({
        id: String(loc.id),
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

  async getAvailableVehicles(params: RCMAvailabilityRequest): Promise<RCMVehicle[]> {
    return this.request<RCMVehicle[]>('POST', 'vehicles/available', params);
  }

  async getVehicleById(vehicleId: string): Promise<RCMVehicle> {
    return this.request<RCMVehicle>('POST', 'vehicles/details', { id: vehicleId });
  }

  async createBooking(bookingData: RCMBookingRequest): Promise<RCMBookingResponse> {
    console.log('Creating booking with data:', bookingData);
    return this.request<RCMBookingResponse>('POST', 'booking', bookingData);
  }

  async createPaymentSession(paymentData: RCMPaymentRequest): Promise<RCMPaymentResponse> {
    console.log('Creating payment session with data:', paymentData);
    return this.request<RCMPaymentResponse>('POST', 'createdpspayment', paymentData);
  }

  async getStep2(params: RCMStep2Request): Promise<RCMStep2Response> {
    console.log('Fetching Step2 data with params:', params);
    return this.request<RCMStep2Response>('POST', 'step2', params);
  }

  async getStep3(params: RCMStep3Request): Promise<RCMStep3Response> {
    console.log('Fetching Step3 data with params:', params);
    return this.request<RCMStep3Response>('POST', 'step3', params);
  }
}

export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);
