
import { useState, useEffect } from 'react';

interface ConnectionStatus {
  isConnected: boolean;
  lastAttempt: Date | null;
  successfulEndpoints: string[];
  failedEndpoints: string[];
}

interface EndpointCheck {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Hook to monitor API connection status and perform diagnostics
 */
export function useApiDiagnostics() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    lastAttempt: null,
    successfulEndpoints: [],
    failedEndpoints: []
  });

  /**
   * Check if the browser can connect to the internet
   */
  const checkInternetConnection = async (): Promise<boolean> => {
    try {
      // Try to fetch a small resource that should always be available
      const response = await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-store'
      });
      return true; // If no error is thrown, assume connection is OK
    } catch (error) {
      console.error('Internet connection check failed:', error);
      return false;
    }
  };

  /**
   * Check if a specific API endpoint is accessible
   */
  const checkEndpoint = async (check: EndpointCheck): Promise<boolean> => {
    try {
      const options: RequestInit = {
        method: check.method,
        headers: check.headers || {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors'
      };

      if (check.body && (check.method === 'POST' || check.method === 'PUT')) {
        options.body = JSON.stringify(check.body);
      }

      const response = await fetch(check.url, options);
      
      // Check if response is valid
      const contentType = response.headers.get('content-type');
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok || !isJson) {
        throw new Error(`Endpoint returned ${response.status}: ${response.statusText}`);
      }

      // Update successful endpoints
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: true,
        lastAttempt: new Date(),
        successfulEndpoints: [...prev.successfulEndpoints, check.url]
      }));

      return true;
    } catch (error) {
      console.error(`Endpoint check failed for ${check.url}:`, error);
      
      // Update failed endpoints
      setConnectionStatus(prev => ({
        ...prev,
        lastAttempt: new Date(),
        failedEndpoints: [...prev.failedEndpoints, check.url]
      }));
      
      return false;
    }
  };

  /**
   * Run diagnostics to check API connectivity and identify issues
   */
  const runDiagnostics = async () => {
    console.log('Running API diagnostics...');
    
    // Reset connection status
    setConnectionStatus({
      isConnected: false,
      lastAttempt: new Date(),
      successfulEndpoints: [],
      failedEndpoints: []
    });

    // First check internet connection
    const hasInternet = await checkInternetConnection();
    
    if (!hasInternet) {
      console.error('No internet connection detected');
      return {
        message: 'No internet connection detected',
        hasInternet: false,
        apiAccessible: false
      };
    }

    // Check API endpoints
    const apiUrlBase = '/api/rcm/booking/v3.2';
    const apiKey = 'TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq';
    
    const endpointChecks: EndpointCheck[] = [
      {
        url: `${apiUrlBase}/${apiKey}?apikey=${apiKey}`,
        method: 'POST',
        body: { method: 'step1' }
      }
    ];

    const results = await Promise.all(endpointChecks.map(check => checkEndpoint(check)));
    const allSuccessful = results.every(result => result);

    console.log('API diagnostics complete:', { 
      hasInternet, 
      apiAccessible: allSuccessful,
      connectionStatus
    });

    return {
      message: allSuccessful 
        ? 'API is accessible' 
        : 'API is not accessible. Check network configuration and credentials.',
      hasInternet,
      apiAccessible: allSuccessful,
      details: connectionStatus
    };
  };

  return {
    connectionStatus,
    checkInternetConnection,
    checkEndpoint,
    runDiagnostics
  };
}
