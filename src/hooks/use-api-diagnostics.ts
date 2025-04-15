
import { useState, useCallback } from 'react';

interface ApiConnectionStatus {
  isConnected: boolean;
  failedEndpoints: string[];
  message?: string;
  environment?: string;
  isLovableHosted?: boolean;
}

interface DiagnosticsResult {
  apiAccessible: boolean;
  message: string;
  responseText?: string;
  failedEndpoints?: string[];
  environment?: string;
  isLovableHosted?: boolean;
}

export function useApiDiagnostics() {
  const [connectionStatus, setConnectionStatus] = useState<ApiConnectionStatus>({
    isConnected: false,
    failedEndpoints: []
  });

  const runDiagnostics = useCallback(async (): Promise<DiagnosticsResult> => {
    try {
      // Determine the environment
      const environment = process.env.NODE_ENV || 'unknown';
      const isProduction = environment === 'production';
      const hostUrl = window.location.origin;
      const hostname = window.location.hostname;
      const isLovableHosted = hostname.includes('lovable.dev') || hostname.includes('lovable-apps');
      
      console.log('Running API diagnostics on:', environment, 'environment');
      console.log('Current host:', hostUrl);
      console.log('Is Lovable hosted:', isLovableHosted);
      
      // Test the RCM API endpoint - first try the proxy path
      let apiUrl = "/api/rcm/booking/v3.2/TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq?apikey=TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq";
      
      // If we're in a Lovable hosted environment, also try the direct API endpoint if the proxy fails
      const directApiUrl = "https://apis.rentalcarmanager.com/booking/v3.2/TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq?apikey=TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq";
      
      console.log('Testing API connection to:', apiUrl);
      
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      
      // Generate a test signature (not actually used in this case but helpful for debugging)
      const testBody = JSON.stringify({ method: "step1" });
      
      let response;
      let useDirectApi = false;
      let responseText = '';
      
      try {
        // First try with the proxy URL
        console.log('Trying proxy URL first...');
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: headers,
          body: testBody,
        });
        
        // We'll capture the response text for debugging purposes
        responseText = await response.text();
        
        // Check if the response is valid JSON
        try {
          JSON.parse(responseText);
          console.log('Proxy URL returned valid JSON');
        } catch (e) {
          console.error('Proxy URL returned invalid JSON, will try direct URL');
          
          if (isLovableHosted || isProduction) {
            console.log('Trying direct API URL:', directApiUrl);
            useDirectApi = true;
            
            // Try with direct API URL
            const directResponse = await fetch(directApiUrl, {
              method: 'POST',
              headers: headers,
              body: testBody,
              mode: 'cors' // Explicitly request CORS
            });
            
            response = directResponse;
            responseText = await directResponse.text();
            
            // Check if this response is valid JSON
            try {
              JSON.parse(responseText);
              console.log('Direct URL returned valid JSON');
            } catch (e) {
              console.error('Both proxy and direct URLs failed to return valid JSON');
            }
          }
        }
      } catch (error) {
        console.error('Fetch error:', error);
        
        if (isLovableHosted || isProduction) {
          try {
            // Try with direct API URL as a fallback
            console.log('Primary request failed, trying direct API URL:', directApiUrl);
            useDirectApi = true;
            
            const directResponse = await fetch(directApiUrl, {
              method: 'POST',
              headers: headers,
              body: testBody,
              mode: 'cors' // Explicitly request CORS
            });
            
            response = directResponse;
            responseText = await directResponse.text();
          } catch (directError) {
            console.error('Both proxy and direct URL requests failed:', directError);
            
            setConnectionStatus({
              isConnected: false,
              failedEndpoints: [apiUrl, directApiUrl],
              message: `All API connection attempts failed: ${error}`,
              environment,
              isLovableHosted
            });
            
            return {
              apiAccessible: false,
              message: 'All API connection attempts failed',
              responseText: error instanceof Error ? error.message : String(error),
              failedEndpoints: [apiUrl, directApiUrl],
              environment,
              isLovableHosted
            };
          }
        } else {
          throw error; // Re-throw if we're not in production and not trying direct URL
        }
      }

      const contentType = response?.headers.get("content-type");
      
      // Check if the response is JSON
      const isJsonResponse = contentType && contentType.includes('application/json');
      
      if (!isJsonResponse) {
        console.error("API returned non-JSON content type:", contentType);
        console.log("Response preview:", responseText.substring(0, 500));
        
        // Suggest using direct API if we haven't tried it yet
        const suggestionText = (!useDirectApi && (isLovableHosted || isProduction)) 
          ? "Consider using the direct API URL in production environments."
          : "Check API server configuration and CORS settings.";
        
        setConnectionStatus({
          isConnected: false,
          failedEndpoints: [useDirectApi ? directApiUrl : apiUrl],
          message: `API returned ${contentType || 'unknown content type'} instead of JSON. ${suggestionText}`,
          environment,
          isLovableHosted
        });
        
        return {
          apiAccessible: false,
          message: `API returned ${contentType || 'unknown content type'} instead of JSON. ${suggestionText}`,
          responseText: responseText,
          failedEndpoints: [useDirectApi ? directApiUrl : apiUrl],
          environment,
          isLovableHosted
        };
      }
      
      let jsonData: any;
      try {
        // Attempt to parse the response as JSON
        jsonData = JSON.parse(responseText);
      } catch (e) {
        console.error("Failed to parse response as JSON:", e);
        
        setConnectionStatus({
          isConnected: false,
          failedEndpoints: [useDirectApi ? directApiUrl : apiUrl],
          message: 'Response is not valid JSON',
          environment,
          isLovableHosted
        });
        
        return {
          apiAccessible: false,
          message: 'Response is not valid JSON',
          responseText: responseText,
          failedEndpoints: [useDirectApi ? directApiUrl : apiUrl],
          environment,
          isLovableHosted
        };
      }

      // If we made it here, the API is accessible and returned valid JSON
      setConnectionStatus({
        isConnected: true,
        failedEndpoints: [],
        environment,
        isLovableHosted
      });
      
      return {
        apiAccessible: true,
        message: useDirectApi 
          ? 'API connection successful using direct URL (proxy failed)' 
          : 'API connection successful using proxy',
        responseText: responseText,
        environment,
        isLovableHosted
      };
    } catch (error) {
      console.error('API diagnostics error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const environment = process.env.NODE_ENV || 'unknown';
      const isLovableHosted = window.location.hostname.includes('lovable.dev') || 
                              window.location.hostname.includes('lovable-apps');
      
      setConnectionStatus({
        isConnected: false,
        failedEndpoints: ['API endpoint'],
        message: errorMessage,
        environment,
        isLovableHosted
      });
      
      return {
        apiAccessible: false,
        message: errorMessage,
        environment,
        isLovableHosted
      };
    }
  }, []);

  return { connectionStatus, runDiagnostics };
}
