
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
      
      // First try the proxy path - only in development
      if (!isProduction && !isLovableHosted) {
        const apiUrl = "/api/rcm/booking/v3.2/TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq?apikey=TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq";
        endpoints.push(apiUrl);
      }
      
      // Direct API endpoint
      const directApiUrl = "https://apis.rentalcarmanager.com/booking/v3.2/TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq?apikey=TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq";
      endpoints.push(directApiUrl);
      
      // CORS proxied API endpoints - try these first in production/Lovable hosted
      const corsProxies = [
        "https://corsproxy.io/?",
        "https://api.allorigins.win/raw?url=",
        "https://cors-anywhere.herokuapp.com/"
      ];
      
      // In production, prioritize CORS proxies
      if (isProduction || isLovableHosted) {
        const corsProxyEndpoints = corsProxies.map(proxy => 
          `${proxy}${encodeURIComponent(directApiUrl)}`
        );
        // Put CORS proxies at the beginning in production
        endpoints.unshift(...corsProxyEndpoints);
      } else {
        // In dev, add them after the proxy and direct attempts
        const corsProxyEndpoints = corsProxies.map(proxy => 
          `${proxy}${encodeURIComponent(directApiUrl)}`
        );
        endpoints.push(...corsProxyEndpoints);
      }
      
      console.log('Testing API endpoints:', endpoints);
      
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      
      // Generate a test request body
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
          
          // Add a timeout to the fetch request
          const controller = new AbortController();
          fetchOptions.signal = controller.signal;
          
          // Set a timeout of 5 seconds per endpoint
          const timeoutId = setTimeout(() => controller.abort(), 5000);
          
          try {
            const response = await fetch(endpoint, fetchOptions);
            clearTimeout(timeoutId);
            
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
            clearTimeout(timeoutId);
            console.error(`Error testing endpoint ${endpoint}:`, error);
            
            // Add specific error details for this endpoint
            failedEndpoints.push(`${endpoint} (${error instanceof Error ? error.message : 'Unknown error'})`);
          }
        } catch (error) {
          console.error(`Error testing endpoint ${endpoint}:`, error);
          failedEndpoints.push(endpoint);
        }
      }
      
      // If we found a working endpoint
      if (successfulEndpoint) {
        const isProxy = successfulEndpoint.includes('/api/rcm');
        const isCorsProxy = successfulEndpoint.includes('corsproxy.io') || 
                         successfulEndpoint.includes('cors-anywhere') || 
                         successfulEndpoint.includes('allorigins');
        
        const recommendationText = isProxy 
          ? "Proxy configuration is working properly." 
          : isCorsProxy 
            ? "Direct API with CORS proxy is working. Use this approach for deployed apps."
            : "Direct API access is working. No proxy needed.";
        
        const connectionMode = isProxy ? "proxy" : isCorsProxy ? "CORS proxy" : "direct";
        
        setConnectionStatus({
          isConnected: true,
          failedEndpoints,
          message: `Connection successful using ${connectionMode}. ${recommendationText}`,
          environment,
          isLovableHosted
        });
        
        return {
          apiAccessible: true,
          message: `Connection successful using ${connectionMode}. ${recommendationText}`,
          responseText,
          failedEndpoints,
          environment,
          isLovableHosted
        };
      }
      
      // If all endpoints failed
      const suggestionText = isLovableHosted
        ? "In the Lovable hosted environment, you need to use direct API access with a CORS proxy. Try the different connection methods in the Actions tab."
        : isProduction
        ? "Check API server CORS settings or try one of the connection methods in the Actions tab."
        : "Check your development server configuration and network connection.";
      
      setConnectionStatus({
        isConnected: false,
        failedEndpoints,
        message: `API connection failed. ${suggestionText}`,
        environment,
        isLovableHosted
      });
      
      return {
        apiAccessible: false,
        message: `API connection failed. ${suggestionText}`,
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
