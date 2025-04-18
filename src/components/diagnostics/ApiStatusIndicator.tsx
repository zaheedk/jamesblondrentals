
import { useState, useEffect } from 'react';
import { useApiDiagnostics } from '@/hooks/use-api-diagnostics';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle, RefreshCw, Server } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRcmApi } from '@/hooks/use-rcm-api';

export function ApiStatusIndicator() {
  const { connectionStatus, runDiagnostics } = useApiDiagnostics();
  const { rcmApi } = useRcmApi();
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  
  useEffect(() => {
    // Run diagnostics on component mount
    handleRunDiagnostics();
    
    // Check if API is in mock mode
    // @ts-ignore - accessing private property for diagnostic purposes
    if (rcmApi && typeof rcmApi.shouldUseMockData === 'function') {
      // @ts-ignore - accessing private property for diagnostic purposes
      setIsMockMode(rcmApi.shouldUseMockData());
    } else {
      // Try to detect mock mode based on internal properties
      // @ts-ignore - accessing private property for diagnostic purposes
      setIsMockMode(rcmApi && (rcmApi.useMockData === true || rcmApi.apiConnectionFailed === true));
    }
  }, []);
  
  const handleRunDiagnostics = async () => {
    setIsRunning(true);
    try {
      const results = await runDiagnostics();
      console.log('API Diagnostics results:', results);
      
      if (results.apiAccessible) {
        toast.success('API connection successful');
      } else {
        toast.error('API connection failed', {
          description: results.message
        });
      }
      
      setLastRun(new Date());
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast.error('Diagnostics failed', {
        description: 'Could not complete API connectivity check'
      });
    } finally {
      setIsRunning(false);
    }
  };
  
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">API Connection Status</CardTitle>
            <CardDescription>RCM Booking System</CardDescription>
          </div>
          {isMockMode && (
            <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
              Demo Mode
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Server className="mr-2 h-4 w-4 text-gray-500" />
            <span>Connection Status:</span>
          </div>
          {isRunning ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-1" /> 
              Checking...
            </div>
          ) : connectionStatus.isConnected ? (
            <div className="flex items-center text-green-600">
              <Check className="h-4 w-4 mr-1" /> Connected
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <AlertTriangle className="h-4 w-4 mr-1" /> Disconnected
            </div>
          )}
        </div>
        
        <div className="text-sm text-gray-600">
          <p>Last check: {lastRun ? lastRun.toLocaleTimeString() : 'Not checked yet'}</p>
          
          {isMockMode && (
            <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded">
              <p className="font-medium">Running in demo mode with sample data.</p>
              <p>API connection failed or was configured to use mock data.</p>
            </div>
          )}
          
          {connectionStatus.failedEndpoints.length > 0 && (
            <div className="mt-2">
              <p className="text-red-600">Failed endpoints:</p>
              <ul className="list-disc list-inside text-xs">
                {connectionStatus.failedEndpoints.map((endpoint, i) => (
                  <li key={i}>{endpoint}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRunDiagnostics}
          disabled={isRunning}
          className="w-full"
        >
          {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Check Connection
        </Button>
      </CardFooter>
    </Card>
  );
}
