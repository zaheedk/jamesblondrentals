
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
  RCMPaymentResponse,
  RCMBookingInfoRequest,
  RCMBookingInfoResponse
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
    
    // Log signature for debugging purposes
    console.log('Generated signature for API request:', signature.substring(0, 10) + '...');
    
    // Store request headers for diagnostic purposes
    const headerObj: Record<string, string> = {};
    headers.forEach((value, key) => {
      headerObj[key] = key === 'signature' ? value.substring(0, 10) + '...' : value;
    });
    
    console.log('Request headers:', headerObj);
    
    return headers;
  }

  private buildApiUrl(): string {
    const baseUrl = this.config.apiUrl;
    const apiKey = this.config.apiKey;
    
    // Direct API URL format
    if (baseUrl.includes('apis.rentalcarmanager.com')) {
      // Direct API URL format
      return `${baseUrl}?apikey=${apiKey}`;
    }
    
    // Proxy URL format (append API key to path)
    return `${baseUrl}/${apiKey}?apikey=${apiKey}`;
  }

  getLastRequestDetails() {
    return this.lastRequestDetails;
  }

  async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

    // If mock mode is enabled, don't make actual API calls
    if (this.useMockData) {
      console.log(`[MOCK MODE] Skipping actual API request for ${method} - ${requestMethod}`);
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
              { id: "1", location: "Mock Location 1", address: "123 Mock St", city: "Mock City" },
              { id: "2", location: "Mock Location 2", address: "456 Test Ave", city: "Test Town" }
            ],
            driverages: [
              { id: 1, driverage: "18-24", isdefault: false },
              { id: 2, driverage: "25+", isdefault: true }
            ],
            categorytypes: [
              { id: 1, vehiclecategorytype: "Economy" },
              { id: 2, vehiclecategorytype: "Luxury" }
            ],
            officetimes: []
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
      const apiUrl = this.buildApiUrl();
      console.log(`Making ${method} request to ${apiUrl} for method ${requestMethod}`);
      console.log(`Request time: ${requestStartTime.toISOString()}`);
      console.log(`User agent: ${navigator.userAgent}`);
      
      const requestBody = { method: requestMethod, ...body };
      const headers = this.createHeaders(method, requestBody);
      
      // Store request details for diagnostics
      this.lastRequestDetails = {
        url: apiUrl,
        method,
        headers: Object.fromEntries(headers.entries()),
        body: requestBody,
        timestamp: requestStartTime.toISOString()
      };
      
      // Log complete request details for debugging
      console.log('Complete request details:', {
        url: apiUrl,
        method,
        headers: Object.fromEntries(headers.entries()),
        body: requestBody
      });
      
      const fetchStartTime = Date.now();
      const response = await fetch(apiUrl, {
        method,
        headers,
        body: JSON.stringify(requestBody),
        credentials: 'same-origin',
      });
      const fetchEndTime = Date.now();
      
      console.log(`Fetch completed in ${fetchEndTime - fetchStartTime}ms`);

      const contentType = response.headers.get("content-type") || "";
      const status = response.status;
      const statusText = response.statusText;
      
      console.log(`Response status: ${status} ${statusText}, Content-Type: ${contentType}`);
      
      // Log all response headers for debugging
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });
      console.log('Response headers:', responseHeaders);
      
      // Clone response to avoid consuming it
      const responseClone = response.clone();
      const textResponse = await responseClone.text();
      
      // Log the first part of the response for debugging
      console.log('Response preview:', textResponse.substring(0, 200) + 
                 (textResponse.length > 200 ? '...' : ''));
      
      if (contentType.includes("text/html")) {
        console.error("Received HTML instead of JSON. This likely indicates a proxy configuration issue or CORS problem.");
        console.error("Content type:", contentType);
        
        // Add more detailed logging for HTML responses
        console.error("HTML response preview:", textResponse.substring(0, 500));
        
        // Try to extract useful information from HTML
        const errorMessage = this.extractMessageFromHtml(textResponse);
        if (errorMessage) {
          console.error("Extracted message from HTML:", errorMessage);
        }
        
        // Save error details
        this.lastRequestDetails.error = `Received HTML instead of JSON. Status: ${status} ${statusText}`;
        this.lastRequestDetails.response = {
          status,
          statusText,
          contentType,
          htmlPreview: textResponse.substring(0, 500),
          extractedMessage: errorMessage
        };
        
        // Flag API connection as failed
        this.apiConnectionFailed = true;
        
        throw new Error(`Invalid API response format - received HTML instead of JSON. Status: ${status} ${statusText}`);
      }

      try {
        // Try to parse as JSON
        const jsonResponse = JSON.parse(textResponse);
        console.log(`API parsed JSON response (${method} - ${requestMethod}):`, jsonResponse);
        
        // Save successful response
        this.lastRequestDetails.response = jsonResponse;
        
        if (jsonResponse.status === "ERR") {
          console.error('API returned error:', jsonResponse.error);
          this.lastRequestDetails.error = jsonResponse.error || 'Unknown API error';
          throw new Error(jsonResponse.error || 'Unknown API error');
        }
        
        // API connection succeeded
        this.apiConnectionFailed = false;
        
        return jsonResponse;
      } catch (parseError) {
        console.error('Failed to parse response as JSON:', parseError);
        
        // Additional CORS troubleshooting for non-parseable responses
        console.error('This might be a CORS issue or malformed JSON response');
        
        this.lastRequestDetails.error = `Failed to parse response as JSON: ${parseError instanceof Error ? parseError.message : String(parseError)}`;
        this.lastRequestDetails.response = {
          raw: textResponse.substring(0, 1000)
        };
        
        // Flag API connection as failed
        this.apiConnectionFailed = true;
        
        throw new Error(`Failed to parse API response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
      }
    } catch (error) {
      console.error('RCM API request failed:', error);
      
      if (!this.lastRequestDetails.error) {
        this.lastRequestDetails.error = error instanceof Error ? error.message : String(error);
      }
      
      // Flag API connection as failed
      this.apiConnectionFailed = true;
      
      throw error;
    }
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

  async getBookingInfo(reservationNo: string): Promise<RCMBookingInfoResponse> {
    console.log('Fetching booking info for reservation:', reservationNo);
    return this.request<RCMBookingInfoResponse>('POST', 'bookinginfo', {
      reservationno: reservationNo
    });
  }
}

export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);
