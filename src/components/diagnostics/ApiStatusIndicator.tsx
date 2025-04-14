
import { useState, useEffect } from 'react';
import { useApiDiagnostics } from '@/hooks/use-api-diagnostics';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle, RefreshCw, Server } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

export function ApiStatusIndicator() {
  const { connectionStatus, runDiagnostics } = useApiDiagnostics();
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  
  useEffect(() => {
    // Run diagnostics on component mount
    handleRunDiagnostics();
  }, []);
  
  const handleRunDiagnostics = async () => {
    setIsRunning(true);
    try {
      const results = await runDiagnostics();
      console.log('API Diagnostics results:', results);
      
      setResponseData(results.responseText?.substring(0, 200) || null);
      
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
    <div className="bg-gray-50 rounded-lg p-4 border">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-lg font-medium">API Connection Status</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={handleRunDiagnostics}
          disabled={isRunning}
        >
          {isRunning ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
          Check Connection
        </Button>
      </div>
      
      <div className="space-y-3">
        <div className="flex items-center">
          <span className="mr-2">Connection Status:</span>
          {isRunning ? (
            <Loader2 className="h-4 w-4 animate-spin text-blue-500" />
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
          
          {!connectionStatus.isConnected && (
            <Alert variant="destructive" className="mt-2">
              <Server className="h-4 w-4" />
              <AlertTitle>Connection Error</AlertTitle>
              <AlertDescription>
                <p className="mb-1">The API is returning HTML instead of JSON. This usually means:</p>
                <ul className="list-disc list-inside text-xs space-y-1">
                  <li>The API endpoint URL is incorrect</li>
                  <li>The API server might be down or misconfigured</li>
                  <li>Your proxy configuration might need adjustment</li>
                  <li>CORS issues are preventing proper communication</li>
                </ul>
              </AlertDescription>
            </Alert>
          )}
          
          {responseData && !connectionStatus.isConnected && (
            <div className="mt-3">
              <p className="font-medium text-xs mb-1">Response Preview:</p>
              <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
                {responseData}... (truncated)
              </pre>
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
      </div>
    </div>
  );
}
