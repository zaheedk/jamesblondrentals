
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
  apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
  apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
  apiUrl: "/api/rcm/booking/v3.2"
};

class RCMApiClient {
  config: RCMApiConfig;
  private initialized: boolean = false;
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
    
    this.initialized = true;
    
    console.log('RCM API initialized with config:', {
      apiUrl: this.config.apiUrl,
      apiKey: this.config.apiKey ? '******' : undefined
    });
  }

  private ensureInitialized(): void {
    if (!this.initialized) {
      console.log('RCM API not explicitly initialized, using default config');
      this.initialized = true;
    }
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
    
    // Check if this is a direct API URL or proxy URL
    if (baseUrl.includes('apis.rentalcarmanager.com')) {
      // Direct API URL format
      console.log('Using direct API URL format:', `${baseUrl}?apikey=${apiKey}`);
      return `${baseUrl}?apikey=${apiKey}`;
    }
    
    // Proxy URL format (append API key to path)
    console.log('Using proxy API URL format:', `${baseUrl}/${apiKey}?apikey=${apiKey}`);
    return `${baseUrl}/${apiKey}?apikey=${apiKey}`;
  }

  getLastRequestDetails() {
    return this.lastRequestDetails;
  }

  async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

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
      
      // Log complete request details including signature
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
      
      if (contentType.includes("text/html")) {
        console.error("Received HTML instead of JSON. This likely indicates a proxy configuration issue.");
        console.error("Content type:", contentType);
        
        const htmlContent = await response.text();
        console.error("HTML response preview:", htmlContent.substring(0, 200));
        
        // Save error details
        this.lastRequestDetails.error = `Received HTML instead of JSON. Status: ${status} ${statusText}`;
        this.lastRequestDetails.response = {
          status,
          statusText,
          contentType,
          htmlPreview: htmlContent.substring(0, 500)
        };
        
        let errorMessage = "Invalid API response format - received HTML instead of JSON";
        
        if (htmlContent.includes("404") || htmlContent.includes("not found")) {
          errorMessage += " - Endpoint not found (404)";
        } else if (htmlContent.includes("403") || htmlContent.includes("forbidden")) {
          errorMessage += " - Access forbidden (403)";
        } else if (htmlContent.includes("500") || htmlContent.includes("server error")) {
          errorMessage += " - Server error (500)";
        } else if (htmlContent.includes("maintenance") || htmlContent.includes("down for maintenance")) {
          errorMessage += " - Service may be under maintenance";
        }
        
        throw new Error(errorMessage);
      }

      if (!response.ok) {
        const errorText = await response.text();
        let errorData;
        
        try {
          errorData = JSON.parse(errorText);
        } catch (e) {
          errorData = { message: errorText || `API request failed: ${response.status}` };
        }
        
        console.error(`API error: ${response.status} ${response.statusText}`, errorData);
        
        // Save error details
        this.lastRequestDetails.error = `API request failed: ${response.status} ${response.statusText}`;
        this.lastRequestDetails.response = errorData;
        
        throw new Error(errorData.message || `Request failed with status: ${response.status}`);
      }

      // Success path
      const responseData = await response.json();
      console.log(`API success response (${method} - ${requestMethod}):`, responseData);
      
      // Save successful response
      this.lastRequestDetails.response = responseData;
      
      if (responseData.status === "ERR") {
        console.error('API returned error:', responseData.error);
        this.lastRequestDetails.error = responseData.error || 'Unknown API error';
        throw new Error(responseData.error || 'Unknown API error');
      }
      
      return responseData;
    } catch (error) {
      console.error('RCM API request failed:', error);
      
      if (!this.lastRequestDetails.error) {
        this.lastRequestDetails.error = error instanceof Error ? error.message : String(error);
      }
      
      throw error;
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
