
import { useState, useEffect } from 'react';
import { rcmApi } from '@/lib/api/rcm-api';

interface ConnectionStatus {
  isConnected: boolean;
  lastAttempt: Date | null;
  successfulEndpoints: string[];
  failedEndpoints: string[];
  error: string | null;
}

interface EndpointCheck {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

interface DiagnosticResults {
  message: string;
  hasInternet: boolean;
  apiAccessible: boolean;
  details?: ConnectionStatus;
  errorDetails?: string;
}

/**
 * Hook to monitor API connection status and perform diagnostics
 */
export function useApiDiagnostics() {
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>({
    isConnected: false,
    lastAttempt: null,
    successfulEndpoints: [],
    failedEndpoints: [],
    error: null
  });

  /**
   * Check if the browser can connect to the internet
   */
  const checkInternetConnection = async (): Promise<boolean> => {
    try {
      // Use a CDN endpoint that's likely to be stable and support CORS
      const response = await fetch('https://cdn.jsdelivr.net/npm/react@18/package.json', { 
        mode: 'cors',
        cache: 'no-store',
        headers: {
          'Accept': 'application/json'
        },
        // Short timeout to avoid waiting too long
        signal: AbortSignal.timeout(5000)
      });
      return response.ok; // Check if response is OK
    } catch (error) {
      console.error('Internet connection check failed:', error);
      return navigator.onLine; // Fallback to browser's online status
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
        signal: AbortSignal.timeout(15000), // 15 second timeout
        cache: 'no-store'
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
        successfulEndpoints: [...prev.successfulEndpoints, check.url],
        error: null
      }));

      return true;
    } catch (error) {
      console.error(`Endpoint check failed for ${check.url}:`, error);
      
      // Update failed endpoints
      setConnectionStatus(prev => ({
        ...prev,
        lastAttempt: new Date(),
        failedEndpoints: [...prev.failedEndpoints, check.url],
        error: error instanceof Error ? error.message : 'Unknown error checking endpoint'
      }));
      
      return false;
    }
  };

  /**
   * Run diagnostics to check API connectivity and identify issues
   */
  const runDiagnostics = async (): Promise<DiagnosticResults> => {
    console.log('Running API diagnostics...', {
      environment: import.meta.env.MODE || 'unknown'
    });
    
    // Reset connection status
    setConnectionStatus({
      isConnected: false,
      lastAttempt: new Date(),
      successfulEndpoints: [],
      failedEndpoints: [],
      error: null
    });

    // First check internet connection
    const hasInternet = await checkInternetConnection();
    
    if (!hasInternet) {
      const message = 'No internet connection detected';
      console.error(message);
      setConnectionStatus(prev => ({...prev, error: message}));
      return {
        message,
        hasInternet: false,
        apiAccessible: false,
        errorDetails: 'No internet connection available. Please check your network.'
      };
    }

    // Try direct API test using the RCM API client
    try {
      // This will use the proper signature generation in production
      await rcmApi.getStep1();
      
      // If we get here, API is accessible
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: true,
        error: null
      }));
      
      return {
        message: 'API is accessible',
        hasInternet: true,
        apiAccessible: true,
        details: connectionStatus
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown API error';
      console.error('API test failed:', errorMessage);
      
      // Try to diagnose if it's a CORS or proxy issue
      const apiError = rcmApi.getLastError() || errorMessage;
      let diagnosticMessage = 'API connection failed';
      
      // Update connection status
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: false,
        error: apiError
      }));
      
      return {
        message: diagnosticMessage,
        hasInternet: true,
        apiAccessible: false,
        errorDetails: apiError,
        details: connectionStatus
      };
    }
  };

  // Check API connectivity on component mount
  useEffect(() => {
    // Run diagnostics once when the hook is first used
    const checkApiOnMount = async () => {
      try {
        await runDiagnostics();
      } catch (error) {
        console.error("Error running initial API diagnostics:", error);
      }
    };
    
    checkApiOnMount();
  }, []);

  return {
    connectionStatus,
    checkInternetConnection,
    checkEndpoint,
    runDiagnostics
  };
}
