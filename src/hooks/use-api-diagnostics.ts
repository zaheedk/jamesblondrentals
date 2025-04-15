
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
      const isLovableHosted = hostname.includes('lovable.dev') || 
                             hostname.includes('lovable-apps') ||
                             hostname.includes('lovable.app');
      
      console.log('Running API diagnostics on:', environment, 'environment');
      console.log('Current host:', hostUrl);
      console.log('Is Lovable hosted:', isLovableHosted);
      
      // Arrays to track our test endpoints
      const endpoints = [];
      const successfulEndpoints = [];
      const failedEndpoints = [];
      
      // First try the proxy path
      let apiUrl = "/api/rcm/booking/v3.2/TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq?apikey=TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq";
      endpoints.push(apiUrl);
      
      // Direct API endpoint
      const directApiUrl = "https://apis.rentalcarmanager.com/booking/v3.2/TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq?apikey=TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq";
      endpoints.push(directApiUrl);
      
      // CORS proxied API endpoints
      const corsProxies = [
        "https://corsproxy.io/?",
        "https://cors-anywhere.herokuapp.com/",
        "https://api.allorigins.win/raw?url="
      ];
      
      const corsProxyEndpoints = corsProxies.map(proxy => 
        `${proxy}${encodeURIComponent(directApiUrl)}`
      );
      endpoints.push(...corsProxyEndpoints);
      
      console.log('Testing API endpoints:', endpoints);
      
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      
      // Generate a test signature (not actually used in this case but helpful for debugging)
      const testBody = JSON.stringify({ method: "step1" });
      
      let successfulResponse = null;
      let successfulEndpoint = null;
      let responseText = '';
      
      // Test each endpoint sequentially
      for (const endpoint of endpoints) {
        try {
          console.log(`Testing endpoint: ${endpoint}`);
          
          const fetchOptions: RequestInit = {
            method: 'POST',
            headers: headers,
            body: testBody,
          };
          
          // Use CORS mode for CORS proxy endpoints
          if (endpoint.includes('corsproxy.io') || 
              endpoint.includes('cors-anywhere') || 
              endpoint.includes('allorigins')) {
            fetchOptions.mode = 'cors';
          }
          
          const response = await fetch(endpoint, fetchOptions);
          const respText = await response.text();
          
          console.log(`Response from ${endpoint}:`, response.status, response.statusText);
          console.log('Content-Type:', response.headers.get('content-type'));
          console.log('Response preview:', respText.substring(0, 200));
          
          // Check if the response is valid JSON
          let isJsonResponse = false;
          try {
            JSON.parse(respText);
            isJsonResponse = true;
            console.log(`Endpoint ${endpoint} returned valid JSON`);
          } catch (e) {
            console.error(`Endpoint ${endpoint} returned invalid JSON:`, e);
            isJsonResponse = false;
          }
          
          if (isJsonResponse) {
            successfulEndpoints.push(endpoint);
            successfulResponse = response;
            successfulEndpoint = endpoint;
            responseText = respText;
            console.log(`Found working endpoint: ${endpoint}`);
            break; // Found a working endpoint, no need to continue
          } else {
            failedEndpoints.push(endpoint);
          }
        } catch (error) {
          console.error(`Error testing endpoint ${endpoint}:`, error);
          failedEndpoints.push(endpoint);
        }
      }
      
      // If we found a working endpoint
      if (successfulEndpoint) {
        const recommendationText = successfulEndpoint.includes('/api/rcm') 
          ? "Proxy configuration is working properly." 
          : successfulEndpoint.includes('corsproxy') 
            ? "Direct API with CORS proxy is working. Consider updating your application to use this approach."
            : "Direct API access is working. No proxy needed.";
        
        setConnectionStatus({
          isConnected: true,
          failedEndpoints,
          message: `Connection successful using ${successfulEndpoint}. ${recommendationText}`,
          environment,
          isLovableHosted
        });
        
        return {
          apiAccessible: true,
          message: `Connection successful using ${successfulEndpoint}. ${recommendationText}`,
          responseText,
          failedEndpoints,
          environment,
          isLovableHosted
        };
      }
      
      // If all endpoints failed
      const contentType = responseText ? 'unknown format' : 'empty response';
      const suggestionText = isLovableHosted
        ? "In the Lovable hosted environment, you need to use direct API access with CORS. Update your RCM API client configuration."
        : "Check API server configuration and CORS settings.";
      
      setConnectionStatus({
        isConnected: false,
        failedEndpoints,
        message: `All API endpoints failed. API returned ${contentType}. ${suggestionText}`,
        environment,
        isLovableHosted
      });
      
      return {
        apiAccessible: false,
        message: `All API endpoints failed. API returned ${contentType}. ${suggestionText}`,
        responseText,
        failedEndpoints,
        environment,
        isLovableHosted
      };
    } catch (error) {
      console.error('API diagnostics error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const environment = process.env.NODE_ENV || 'unknown';
      const isLovableHosted = window.location.hostname.includes('lovable.dev') || 
                             window.location.hostname.includes('lovable-apps') ||
                             window.location.hostname.includes('lovable.app');
      
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
