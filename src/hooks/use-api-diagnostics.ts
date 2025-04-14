
import { useState, useCallback } from 'react';

interface ApiConnectionStatus {
  isConnected: boolean;
  failedEndpoints: string[];
  message?: string;
  environment?: string;
}

interface DiagnosticsResult {
  apiAccessible: boolean;
  message: string;
  responseText?: string;
  failedEndpoints?: string[];
  environment?: string;
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

      console.log('Running API diagnostics on:', environment, 'environment');
      console.log('Current host:', hostUrl);
      
      // Test the RCM API endpoint
      const apiUrl = "/api/rcm/booking/v3.2/TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq?apikey=TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq";
      
      console.log('Testing API connection to:', apiUrl);
      
      const headers = new Headers();
      headers.append('Content-Type', 'application/json');
      headers.append('Accept', 'application/json');
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({ method: "step1" }),
      });

      const contentType = response.headers.get("content-type");
      let responseText = '';
      
      try {
        // We'll capture the response text for debugging purposes
        responseText = await response.text();
      } catch (e) {
        responseText = 'Could not read response text';
      }

      // Check if the response is JSON
      const isJsonResponse = contentType && contentType.includes('application/json');
      
      if (!isJsonResponse) {
        console.error("API returned non-JSON content type:", contentType);
        console.log("Response preview:", responseText.substring(0, 500));
        
        setConnectionStatus({
          isConnected: false,
          failedEndpoints: [apiUrl],
          message: `API returned ${contentType || 'unknown content type'} instead of JSON`,
          environment
        });
        
        return {
          apiAccessible: false,
          message: `API returned ${contentType || 'unknown content type'} instead of JSON`,
          responseText: responseText,
          failedEndpoints: [apiUrl],
          environment
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
          failedEndpoints: [apiUrl],
          message: 'Response is not valid JSON',
          environment
        });
        
        return {
          apiAccessible: false,
          message: 'Response is not valid JSON',
          responseText: responseText,
          failedEndpoints: [apiUrl],
          environment
        };
      }

      // If we made it here, the API is accessible and returned valid JSON
      setConnectionStatus({
        isConnected: true,
        failedEndpoints: [],
        environment
      });
      
      return {
        apiAccessible: true,
        message: 'API connection successful',
        responseText: responseText,
        environment
      };
    } catch (error) {
      console.error('API diagnostics error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const environment = process.env.NODE_ENV || 'unknown';
      
      setConnectionStatus({
        isConnected: false,
        failedEndpoints: ['API endpoint'],
        message: errorMessage,
        environment
      });
      
      return {
        apiAccessible: false,
        message: errorMessage,
        environment
      };
    }
  }, []);

  return { connectionStatus, runDiagnostics };
}
