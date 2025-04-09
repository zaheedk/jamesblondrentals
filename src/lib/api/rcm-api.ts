
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

/**
 * RCM API Client for handling all API requests
 */
class RCMApiClient {
  private config: RCMApiConfig;
  private initialized: boolean = false;
  private useMockData: boolean = false;

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
    this.useMockData = config.useMockData || false;
    
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

  // Mock data for testing when API is not available
  private getMockData(method: string): any {
    if (method === 'step1') {
      return {
        status: "OK",
        results: {
          locations: [
            { id: "1", location: "Downtown Office", address: "123 Main St", city: "San Francisco", state: "CA", country: "USA", postcode: "94105", latitude: 37.7749, longitude: -122.4194, ispickupavailable: true, isdropoffavailable: true, isdefault: true, minimumbookingday: 1, noticerequired_numberofdays: 0 },
            { id: "2", location: "Airport Terminal", address: "SF International Airport", city: "San Francisco", state: "CA", country: "USA", postcode: "94128", latitude: 37.6213, longitude: -122.3790, ispickupavailable: true, isdropoffavailable: true, isdefault: false, minimumbookingday: 1, noticerequired_numberofdays: 0 }
          ],
          officetimes: [
            { locationid: "1", dayofweek: 1, openingtime: "08:00", closingtime: "18:00", startpickup: "08:00", endpickup: "17:00", startdropoff: "08:00", enddropoff: "17:00" },
            { locationid: "1", dayofweek: 2, openingtime: "08:00", closingtime: "18:00", startpickup: "08:00", endpickup: "17:00", startdropoff: "08:00", enddropoff: "17:00" }
          ],
          driverages: [
            { id: "1", driverage: "21-24", isdefault: false },
            { id: "2", driverage: "25-70", isdefault: true },
            { id: "3", driverage: "71+", isdefault: false }
          ],
          categorytypes: [
            { id: "1", vehiclecategorytype: "Economy" },
            { id: "2", vehiclecategorytype: "Compact" },
            { id: "3", vehiclecategorytype: "SUV" },
            { id: "4", vehiclecategorytype: "Luxury" }
          ]
        }
      };
    } else if (method === 'step2') {
      return {
        status: "OK",
        results: {
          availablecars: [
            {
              vehiclecategoryid: "101",
              vehiclecategorytypeid: "1",
              vehiclecategory: "Toyota Corolla",
              vehicledescription1: "Fuel efficient compact car",
              vehicledescription2: "Great for city driving",
              vehicledescription3: "Automatic transmission",
              imageurl: "https://images.unsplash.com/photo-1590362891991-f776e747a588?q=80&w=809&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              totalrateafterdiscount: 199.99,
              totaldiscountamount: 20,
              avgrate: 66.66,
              numberofdays: "3",
              numberofadults: 4,
              numberofchildren: 1,
              numberoflargecases: 2,
              numberofsmallcases: 3,
              available: 1
            },
            {
              vehiclecategoryid: "102",
              vehiclecategorytypeid: "2",
              vehiclecategory: "Honda Civic",
              vehicledescription1: "Compact and reliable",
              vehicledescription2: "Excellent fuel economy",
              vehicledescription3: "Spacious interior",
              imageurl: "https://images.unsplash.com/photo-1619767886558-efdc259cde1a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              totalrateafterdiscount: 219.99,
              totaldiscountamount: 15,
              avgrate: 73.33,
              numberofdays: "3",
              numberofadults: 4,
              numberofchildren: 1,
              numberoflargecases: 2,
              numberofsmallcases: 3,
              available: 1
            },
            {
              vehiclecategoryid: "103",
              vehiclecategorytypeid: "3",
              vehiclecategory: "Toyota RAV4",
              vehicledescription1: "Compact SUV with great storage",
              vehicledescription2: "All-wheel drive available",
              vehicledescription3: "Perfect for adventures",
              imageurl: "https://images.unsplash.com/photo-1581540222194-0def2dda95b8?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              totalrateafterdiscount: 299.99,
              totaldiscountamount: 30,
              avgrate: 100,
              numberofdays: "3",
              numberofadults: 5,
              numberofchildren: 2,
              numberoflargecases: 3,
              numberofsmallcases: 4,
              available: 1
            },
            {
              vehiclecategoryid: "104",
              vehiclecategorytypeid: "4",
              vehiclecategory: "Mercedes C-Class",
              vehicledescription1: "Luxury sedan with premium features",
              vehicledescription2: "Leather seats and advanced technology",
              vehicledescription3: "Smooth and comfortable ride",
              imageurl: "https://images.unsplash.com/photo-1617469767053-d3b523a0b982?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              totalrateafterdiscount: 399.99,
              totaldiscountamount: 50,
              avgrate: 133.33,
              numberofdays: "3",
              numberofadults: 4,
              numberofchildren: 1,
              numberoflargecases: 2,
              numberofsmallcases: 2,
              available: 1
            },
            {
              vehiclecategoryid: "105",
              vehiclecategorytypeid: "1",
              vehiclecategory: "Nissan Versa",
              vehicledescription1: "Budget-friendly economy car",
              vehicledescription2: "Great fuel efficiency",
              vehicledescription3: "Easy to park and maneuver",
              imageurl: "https://images.unsplash.com/photo-1609752263419-84e2b5639f5a?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
              totalrateafterdiscount: 179.99,
              totaldiscountamount: 10,
              avgrate: 60,
              numberofdays: "3",
              numberofadults: 4,
              numberofchildren: 0,
              numberoflargecases: 1,
              numberofsmallcases: 2,
              available: 1
            }
          ],
          seasonalrates: [
            {
              vehiclecategoryid: "101",
              dailyratebeforediscount: 73.33,
              dailyrateafterdiscount: 66.66,
              discountrate: 10,
              discounttype: "Percentage",
              numberofdays: 3,
              numberofhours: 72,
              rateperiod: "Daily"
            },
            {
              vehiclecategoryid: "102",
              dailyratebeforediscount: 78.33,
              dailyrateafterdiscount: 73.33,
              discountrate: 7,
              discounttype: "Percentage",
              numberofdays: 3,
              numberofhours: 72,
              rateperiod: "Daily"
            },
            {
              vehiclecategoryid: "103",
              dailyratebeforediscount: 110,
              dailyrateafterdiscount: 100,
              discountrate: 10,
              discounttype: "Percentage",
              numberofdays: 3,
              numberofhours: 72,
              rateperiod: "Daily"
            },
            {
              vehiclecategoryid: "104",
              dailyratebeforediscount: 150,
              dailyrateafterdiscount: 133.33,
              discountrate: 12,
              discounttype: "Percentage",
              numberofdays: 3,
              numberofhours: 72,
              rateperiod: "Daily"
            },
            {
              vehiclecategoryid: "105",
              dailyratebeforediscount: 63.33,
              dailyrateafterdiscount: 60,
              discountrate: 5,
              discounttype: "Percentage",
              numberofdays: 3,
              numberofhours: 72,
              rateperiod: "Daily"
            }
          ],
          locationfees: [
            {
              vehiclecategorytypeid: "1",
              currencysymbol: "$",
              currencyname: "USD"
            },
            {
              vehiclecategorytypeid: "2",
              currencysymbol: "$",
              currencyname: "USD"
            },
            {
              vehiclecategorytypeid: "3",
              currencysymbol: "$",
              currencyname: "USD"
            },
            {
              vehiclecategorytypeid: "4",
              currencysymbol: "$",
              currencyname: "USD"
            }
          ],
          mandatoryfees: [
            {
              vehiclecategoryid: "101",
              vehiclecategorytypeid: "1",
              totalfeeamount: 15
            },
            {
              vehiclecategoryid: "102",
              vehiclecategorytypeid: "2",
              totalfeeamount: 18
            },
            {
              vehiclecategoryid: "103",
              vehiclecategorytypeid: "3",
              totalfeeamount: 25
            },
            {
              vehiclecategoryid: "104",
              vehiclecategorytypeid: "4",
              totalfeeamount: 35
            },
            {
              vehiclecategoryid: "105",
              vehiclecategorytypeid: "1",
              totalfeeamount: 15
            }
          ]
        }
      };
    } else if (method === 'step3') {
      // Add step3 mock data here
      return {
        status: "OK",
        results: {
          insuranceoptions: [
            {
              id: "1",
              name: "Basic Insurance",
              description: "Covers basic liability",
              totalinsuranceamount: 25,
              isdefault: true
            },
            {
              id: "2",
              name: "Premium Insurance",
              description: "Comprehensive coverage with no excess",
              totalinsuranceamount: 45,
              isdefault: false
            }
          ],
          kmcharges: [
            {
              id: "1",
              name: "Unlimited",
              mileagedesc: "Unlimited kilometers",
              dailyrate: 0,
              numberofkmsfree: 0,
              feeforeachadditionalkm: 0,
              isdefault: true
            },
            {
              id: "2",
              name: "Limited",
              mileagedesc: "200km per day",
              dailyrate: -5,
              numberofkmsfree: 200,
              feeforeachadditionalkm: 0.25,
              isdefault: false
            }
          ],
          extras: [
            {
              id: "1",
              name: "GPS",
              description: "Navigation system",
              maxquantity: 1,
              unitprice: 10,
              totalextraamount: 10,
              isdefault: false
            },
            {
              id: "2",
              name: "Child Seat",
              description: "Safety seat for children",
              maxquantity: 3,
              unitprice: 8,
              totalextraamount: 8,
              isdefault: false
            }
          ],
          locationfees: {
            vehiclecategoryid: "101",
            currencysymbol: "$",
            currencyname: "USD"
          }
        }
      };
    }
    // Add more mock responses for other methods as needed
    return { status: "OK", error: "No mock data available for this method" };
  }

  /**
   * Makes an API request with the correct format matching the Postman collection
   */
  private async request<T>(method: string, requestMethod: string, body?: any): Promise<T> {
    this.ensureInitialized();

    // Return mock data if mock mode is enabled
    if (this.useMockData) {
      console.log('Using mock data for', requestMethod);
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
        
        // Use mock data as fallback when API returns non-JSON
        if (this.useMockData === false) {
          console.log("API returned non-JSON response, switching to mock data temporarily");
          toast.error("API Connection Error", {
            description: "Using mock data temporarily. Check API configuration."
          });
          return this.getMockData(requestMethod) as T;
        }
        
        throw new Error(`API returned non-JSON response: ${response.status} ${response.statusText}`);
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
        
        // Use mock data as fallback when API returns error
        if (this.useMockData === false) {
          console.log("API returned error, switching to mock data temporarily");
          toast.error("API Connection Error", {
            description: "Using mock data temporarily. Check API configuration."
          });
          return this.getMockData(requestMethod) as T;
        }
        
        throw new Error(errorData.message || `API request failed: ${response.status}`);
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
      
      // Use mock data as fallback when API call fails
      if (this.useMockData === false) {
        console.log("API request failed, switching to mock data temporarily");
        toast.error("API Connection Error", {
          description: "Using mock data temporarily. Check API configuration."
        });
        return this.getMockData(requestMethod) as T;
      }
      
      throw error;
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
   * Create a booking
   */
  async createBooking(bookingData: RCMBookingRequest): Promise<RCMBookingResponse> {
    return this.request<RCMBookingResponse>('POST', 'booking', bookingData);
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
    
    // We'll no longer strip out the "0" value, since we want to explicitly pass it
    // to indicate "All Categories" rather than removing it entirely

    return this.request<RCMStep2Response>('POST', 'step2', params);
  }

  /**
   * Get Step3 data (insurance options, km charges, extras)
   * Using method name 'step3' as indicated in the API documentation
   */
  async getStep3(params: RCMStep3Request): Promise<RCMStep3Response> {
    console.log('Fetching Step3 data with params:', params);
    
    return this.request<RCMStep3Response>('POST', 'step3', params);
  }
}

// Export a singleton instance
export const rcmApi = new RCMApiClient(DEFAULT_CONFIG);

