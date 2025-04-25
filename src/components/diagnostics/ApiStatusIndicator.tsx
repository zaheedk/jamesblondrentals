
import { useState, useEffect } from 'react';
import { useApiDiagnostics } from '@/hooks/use-api-diagnostics';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle, RefreshCw, Server, Globe, WifiOff, Settings } from 'lucide-react';
import { toast } from 'sonner';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRcmApi } from '@/hooks/use-rcm-api';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function ApiStatusIndicator() {
  const { connectionStatus, runDiagnostics, checkInternetConnection } = useApiDiagnostics();
  const { rcmApi, initializeApi } = useRcmApi();
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const [hasInternetConnection, setHasInternetConnection] = useState<boolean | null>(null);
  const [requestDetails, setRequestDetails] = useState<{url?: string; error?: string}>({});
  const [apiEndpoint, setApiEndpoint] = useState("/api/rcm/booking/v3.2");
  const [isConfigOpen, setIsConfigOpen] = useState(false);
  const [directApiToggle, setDirectApiToggle] = useState(false);
  
  useEffect(() => {
    // Run diagnostics on component mount
    handleRunDiagnostics();
    
    // Check internet connection
    checkAndSetInternetConnection();
    
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
    
    // Get last request details if available
    if (rcmApi && rcmApi.getLastRequestDetails) {
      const details = rcmApi.getLastRequestDetails();
      if (details && details.url) {
        setRequestDetails({
          url: details.url,
          error: details.error
        });
      }
    }

    // Check if we're using direct API or proxy
    if (rcmApi && rcmApi.config && rcmApi.config.apiUrl) {
      setApiEndpoint(rcmApi.config.apiUrl);
      setDirectApiToggle(rcmApi.config.apiUrl.includes('apis.rentalcarmanager.com'));
    }
  }, []);
  
  const checkAndSetInternetConnection = async () => {
    const hasInternet = await checkInternetConnection();
    setHasInternetConnection(hasInternet);
    return hasInternet;
  };
  
  const handleRunDiagnostics = async () => {
    setIsRunning(true);
    try {
      // First check internet connection
      const hasInternet = await checkAndSetInternetConnection();
      
      if (!hasInternet) {
        toast.error('Internet Connection Issue', {
          description: 'Please check your internet connection and try again.'
        });
        return;
      }
      
      const results = await runDiagnostics();
      console.log('API Diagnostics results:', results);
      
      // Update request details from the API client
      if (rcmApi && rcmApi.getLastRequestDetails) {
        const details = rcmApi.getLastRequestDetails();
        if (details && details.url) {
          setRequestDetails({
            url: details.url,
            error: details.error
          });
        }
      }
      
      if (results.apiAccessible) {
        toast.success('API connection successful');
      } else {
        toast.error('API connection failed', {
          description: results.message
        });
      }
      
      setLastRun(new Date());
      
      // Check if API is in mock mode
      // @ts-ignore - accessing private property for diagnostic purposes
      if (rcmApi && typeof rcmApi.shouldUseMockData === 'function') {
        // @ts-ignore - accessing private property for diagnostic purposes
        setIsMockMode(rcmApi.shouldUseMockData());
      }
      
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast.error('Diagnostics failed', {
        description: 'Could not complete API connectivity check'
      });
    } finally {
      setIsRunning(false);
    }
  };

  const handleUpdateApiConfig = () => {
    if (rcmApi && rcmApi.initialize) {
      const newUrl = directApiToggle 
        ? 'https://apis.rentalcarmanager.com/booking/v3.2'
        : '/api/rcm/booking/v3.2';
      
      initializeApi({
        apiUrl: newUrl,
        apiKey: import.meta.env.VITE_RCM_API_KEY || rcmApi.config.apiKey,
        apiSecret: import.meta.env.VITE_RCM_API_SECRET || rcmApi.config.apiSecret,
        useMockData: false // Explicitly disable mock mode when updating config
      });
      
      toast.success('API configuration updated', {
        description: `API endpoint set to: ${newUrl}`
      });
      
      // Rerun diagnostics after config change
      setTimeout(() => {
        handleRunDiagnostics();
      }, 500);
      
      setApiEndpoint(newUrl);
      setIsConfigOpen(false);
    }
  };
  
  const toggleMockMode = () => {
    if (rcmApi && rcmApi.initialize) {
      const newMockMode = !isMockMode;
      
      initializeApi({
        apiUrl: rcmApi.config.apiUrl,
        apiKey: rcmApi.config.apiKey,
        apiSecret: rcmApi.config.apiSecret,
        useMockData: newMockMode
      });
      
      setIsMockMode(newMockMode);
      
      toast.success(`${newMockMode ? 'Enabled' : 'Disabled'} demo mode`, {
        description: newMockMode 
          ? 'Now using sample data instead of real API' 
          : 'Now using real API data'
      });
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
          <div className="flex items-center gap-2">
            {isMockMode && (
              <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
                Demo Mode
              </Badge>
            )}
            <Dialog open={isConfigOpen} onOpenChange={setIsConfigOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>API Configuration</DialogTitle>
                  <DialogDescription>
                    Configure API connection settings
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 pt-2">
                  <div className="space-y-2">
                    <Label htmlFor="apiEndpoint">API Endpoint</Label>
                    <Input
                      id="apiEndpoint"
                      value={apiEndpoint}
                      onChange={(e) => setApiEndpoint(e.target.value)}
                      disabled
                    />
                  </div>
                  
                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="direct-api" className="text-sm cursor-pointer">
                      Use direct API endpoint (bypasses proxy)
                    </Label>
                    <Switch
                      id="direct-api"
                      checked={directApiToggle}
                      onCheckedChange={setDirectApiToggle}
                    />
                  </div>

                  <div className="flex items-center justify-between space-x-2">
                    <Label htmlFor="mock-mode" className="text-sm cursor-pointer">
                      Enable demo mode (mock data)
                    </Label>
                    <Switch
                      id="mock-mode"
                      checked={isMockMode}
                      onCheckedChange={toggleMockMode}
                    />
                  </div>
                  
                  <div className="text-xs text-gray-500 mt-2">
                    <p>Note: Direct API endpoint may be required if the proxy server is misconfigured.</p>
                  </div>
                  
                  <Button onClick={handleUpdateApiConfig} className="w-full">
                    Update Configuration
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Globe className="mr-2 h-4 w-4 text-gray-500" />
            <span>Internet:</span>
          </div>
          {hasInternetConnection === null ? (
            <div className="flex items-center">
              <Loader2 className="h-4 w-4 animate-spin text-blue-500 mr-1" /> 
              Checking...
            </div>
          ) : hasInternetConnection ? (
            <div className="flex items-center text-green-600">
              <Check className="h-4 w-4 mr-1" /> Connected
            </div>
          ) : (
            <div className="flex items-center text-red-600">
              <WifiOff className="h-4 w-4 mr-1" /> Disconnected
            </div>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Server className="mr-2 h-4 w-4 text-gray-500" />
            <span>API Connection:</span>
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
          <p className="text-xs text-muted-foreground mt-1">API Mode: {directApiToggle ? 'Direct API' : 'Proxy'} {isMockMode ? '(Demo)' : ''}</p>
          
          {isMockMode && (
            <div className="mt-2 p-2 bg-yellow-50 text-yellow-800 text-xs rounded">
              <p className="font-medium">Running in demo mode with sample data.</p>
              <p>API connection failed or was configured to use mock data.</p>
            </div>
          )}
          
          {requestDetails.url && (
            <div className="mt-2">
              <p className="text-xs text-gray-500">Last request URL:</p>
              <p className="text-xs break-all bg-gray-50 p-1 rounded">{requestDetails.url}</p>
            </div>
          )}
          
          {requestDetails.error && (
            <div className="mt-2 p-2 bg-red-50 text-red-800 text-xs rounded">
              <p className="font-medium">Error details:</p>
              <p className="break-words">{requestDetails.error}</p>
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
