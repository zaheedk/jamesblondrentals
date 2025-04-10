
import { useState, useEffect } from 'react';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { useApiDiagnostics } from '@/hooks/use-api-diagnostics';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

interface ApiHealthStatusProps {
  onlyShowOnError?: boolean;
}

export const ApiHealthStatus = ({ onlyShowOnError = false }: ApiHealthStatusProps) => {
  const { rcmApi, initializeApi } = useRcmApi();
  const { runDiagnostics } = useApiDiagnostics();
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [lastChecked, setLastChecked] = useState<Date | null>(null);
  const [isChecking, setIsChecking] = useState(false);
  
  const checkApiHealth = async () => {
    setIsChecking(true);
    try {
      const result = await runDiagnostics();
      setApiStatus(result.apiAccessible ? 'connected' : 'error');
      setLastChecked(new Date());
      
      // If API is not accessible, switch to mock data
      if (!result.apiAccessible) {
        initializeApi({
          useMockData: true,
          apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
          apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
          apiUrl: "/api/rcm/booking/v3.2/"
        });
      }
    } catch (error) {
      console.error('Error checking API health:', error);
      setApiStatus('error');
    } finally {
      setIsChecking(false);
    }
  };
  
  useEffect(() => {
    checkApiHealth();
    
    // Re-check API health every 5 minutes
    const intervalId = setInterval(checkApiHealth, 5 * 60 * 1000);
    
    return () => clearInterval(intervalId);
  }, []);
  
  if (onlyShowOnError && apiStatus !== 'error') {
    return null;
  }
  
  return (
    <div className="mb-4">
      {apiStatus === 'checking' && (
        <Alert>
          <AlertTitle>Checking API Connection</AlertTitle>
          <AlertDescription>
            Verifying connection to the booking system...
          </AlertDescription>
        </Alert>
      )}
      
      {apiStatus === 'connected' && !onlyShowOnError && (
        <Alert>
          <AlertTitle className="text-green-600">API Connected</AlertTitle>
          <AlertDescription>
            Successfully connected to the booking system.
            {lastChecked && (
              <div className="text-xs text-gray-500 mt-1">
                Last checked: {lastChecked.toLocaleString()}
              </div>
            )}
          </AlertDescription>
        </Alert>
      )}
      
      {apiStatus === 'error' && (
        <Alert variant="destructive">
          <AlertTitle>API Connection Error</AlertTitle>
          <AlertDescription>
            <p>Unable to connect to the booking system. The application is running in demo mode with sample data.</p>
            <p className="text-sm mt-1">Real bookings cannot be processed until the connection is restored.</p>
            {lastChecked && (
              <div className="text-xs mt-1">
                Last checked: {lastChecked.toLocaleString()}
              </div>
            )}
            <div className="mt-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkApiHealth}
                disabled={isChecking}
              >
                {isChecking ? "Checking..." : "Check Again"}
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default ApiHealthStatus;
