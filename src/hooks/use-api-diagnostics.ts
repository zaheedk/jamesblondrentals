
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

interface DiagnosticsResult {
  message: string;
  hasInternet: boolean;
  apiAccessible: boolean;
  details?: any;
  responseText?: string;
  statusCode?: number;
}

interface EndpointCheckResult {
  success: boolean;
  responseText?: string;
  statusCode?: number;
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
      console.log('Checking internet connection...');
      
      // Try to fetch a reliable resource with minimal payload
      const response = await fetch('https://www.cloudflare.com/cdn-cgi/trace', { 
        mode: 'no-cors',
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
      console.log('Internet connection check succeeded');
      return true; // If no error is thrown, assume connection is OK
    } catch (error) {
      console.error('Internet connection check failed:', error);
      return false;
    }
  };

  /**
   * Check if a specific API endpoint is accessible
   */
  const checkEndpoint = async (check: EndpointCheck): Promise<EndpointCheckResult> => {
    try {
      console.log(`Checking endpoint: ${check.method} ${check.url}`);
      
      const options: RequestInit = {
        method: check.method,
        headers: check.headers || {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        mode: 'cors',
        credentials: 'same-origin'
      };

      if (check.body && (check.method === 'POST' || check.method === 'PUT')) {
        options.body = JSON.stringify(check.body);
      }

      console.log('Request options:', {
        ...options,
        headers: options.headers,
        body: typeof options.body === 'string' ? options.body.substring(0, 100) : options.body
      });

      // Use AbortController to set a timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
      options.signal = controller.signal;

      const response = await fetch(check.url, options);
      clearTimeout(timeoutId);
      
      // Get full response details
      const statusCode = response.status;
      const statusText = response.statusText;
      const contentType = response.headers.get('content-type') || '';
      
      console.log(`Endpoint response: ${statusCode} ${statusText} (${contentType})`);
      
      // Clone response to read body multiple times
      const responseClone = response.clone();
      const responseText = await responseClone.text();
      
      console.log('Response preview:', responseText.substring(0, 200));
      
      // Check if response is valid
      const isJson = contentType && contentType.includes('application/json');

      if (!response.ok) {
        console.error(`Endpoint error: ${statusCode} ${statusText}`);
        
        // Update failed endpoints
        setConnectionStatus(prev => ({
          ...prev,
          lastAttempt: new Date(),
          failedEndpoints: [...prev.failedEndpoints, check.url]
        }));
        
        return {
          success: false, 
          responseText,
          statusCode
        };
      }
      
      if (!isJson) {
        console.warn(`Endpoint returned non-JSON response: ${contentType}`);
      }

      // Update successful endpoints
      setConnectionStatus(prev => ({
        ...prev,
        isConnected: true,
        lastAttempt: new Date(),
        successfulEndpoints: [...prev.successfulEndpoints, check.url]
      }));

      return {
        success: true,
        responseText,
        statusCode
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Endpoint check failed for ${check.url}:`, error);
      
      // Check if the error is a timeout
      const isTimeout = errorMessage.includes('aborted') || errorMessage.includes('timeout');
      
      // Update failed endpoints
      setConnectionStatus(prev => ({
        ...prev,
        lastAttempt: new Date(),
        failedEndpoints: [...prev.failedEndpoints, `${check.url} (${isTimeout ? 'timeout' : 'error'})`]
      }));
      
      return {
        success: false,
        responseText: errorMessage
      };
    }
  };

  /**
   * Run diagnostics to check API connectivity and identify issues
   */
  const runDiagnostics = async (): Promise<DiagnosticsResult> => {
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
    
    const timestamp = new Date().toISOString();
    const body = JSON.stringify({ method: 'step1' });
    
    // Create signature for the request
    const signature = await import('@/lib/api/rcm-signature')
      .then(module => module.generateSignature({
        method: 'POST',
        path: '', 
        timestamp,
        apiKey,
        apiSecret: 'tsdavpoP51o6AcLIdorqgtFJ0ullAimg',
        body
      }));
    
    const endpointChecks: EndpointCheck[] = [
      {
        url: `${apiUrlBase}/${apiKey}?apikey=${apiKey}`,
        method: 'POST',
        body: { method: 'step1' },
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'signature': signature
        }
      }
    ];

    const checkResults = await Promise.all(endpointChecks.map(check => checkEndpoint(check)));
    const allSuccessful = checkResults.every(result => result.success);
    
    // Extract response text and status code from the first check result
    const firstResult = checkResults[0] || {};
    const responseText = firstResult.responseText;
    const statusCode = firstResult.statusCode;

    // Set connection status based on results
    setConnectionStatus(prev => ({
      ...prev,
      isConnected: allSuccessful
    }));

    console.log('API diagnostics complete:', { 
      hasInternet, 
      apiAccessible: allSuccessful,
      connectionStatus
    });

    return {
      message: allSuccessful 
        ? 'API is accessible' 
        : `API is not accessible (Status: ${statusCode || 'unknown'}). Check network configuration and credentials.`,
      hasInternet,
      apiAccessible: allSuccessful,
      details: connectionStatus,
      responseText,
      statusCode
    };
  };

  return {
    connectionStatus,
    checkInternetConnection,
    checkEndpoint,
    runDiagnostics
  };
}
