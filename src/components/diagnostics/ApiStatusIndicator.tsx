
import { useState, useEffect } from 'react';
import { useApiDiagnostics } from '@/hooks/use-api-diagnostics';
import { Button } from '@/components/ui/button';
import { Loader2, Check, AlertTriangle, RefreshCw, Server, Globe, ExternalLink, Network } from 'lucide-react';
import { toast } from 'sonner';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { rcmApi } from '@/lib/api/rcm-api';

export function ApiStatusIndicator() {
  const { connectionStatus, runDiagnostics } = useApiDiagnostics();
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);
  const [responseData, setResponseData] = useState<string | null>(null);
  const [attemptCount, setAttemptCount] = useState(0);
  const [activeTab, setActiveTab] = useState("actions"); // Start with actions tab for better UX
  
  const isLovableHosted = window.location.hostname.includes('lovable.dev') || 
                          window.location.hostname.includes('lovable-apps') ||
                          window.location.hostname.includes('lovable.app');
  
  useEffect(() => {
    // Just set last run time without actually running diagnostics
    setLastRun(new Date());
    console.log('API status indicator mounted - ready for manual connection check');
  }, []);
  
  const handleRunDiagnostics = async () => {
    setIsRunning(true);
    setAttemptCount(count => count + 1);
    try {
      const results = await runDiagnostics();
      console.log('API Diagnostics results:', results);
      
      setResponseData(results.responseText?.substring(0, 500) || null);
      
      if (results.apiAccessible) {
        toast.success('API connection successful');
        // If we get a successful connection, also initialize the RCM API client to use this approach
        if (results.message?.includes('CORS proxy')) {
          rcmApi.initialize({
            useDirectApi: true,
            useCorsProxy: true,
            useMockData: false
          });
          toast.success('Connected to live API using CORS proxy');
        } else if (results.message?.includes('Direct API')) {
          rcmApi.initialize({
            useDirectApi: true,
            useCorsProxy: false,
            useMockData: false
          });
          toast.success('Connected to live API directly');
        } else if (results.message?.includes('proxy')) {
          rcmApi.initialize({
            useDirectApi: false,
            useCorsProxy: false,
            useMockData: false,
            apiUrl: "/api/rcm/booking/v3.2"
          });
          toast.success('Connected to live API via local proxy');
        }
        // Switch to status tab to show successful connection
        setActiveTab("status");
      } else {
        toast.error('API Connection Failed', {
          description: 'Using demo data instead. See debug tab for details.'
        });
        // Fall back to mock data after failed diagnostics
        rcmApi.initialize({
          useMockData: true
        });
        // Show debug info on failure
        setActiveTab("debug");
      }
      
      setLastRun(new Date());
    } catch (error) {
      console.error('Error running diagnostics:', error);
      toast.error('Diagnostics failed', {
        description: 'Could not complete API connectivity check'
      });
      
      // Ensure we're using mock data if diagnostics fail
      rcmApi.initialize({
        useMockData: true
      });
      
      // Show debug tab on error
      setActiveTab("debug");
    } finally {
      setIsRunning(false);
    }
  };

  const handleFallbackToMock = () => {
    rcmApi.initialize({
      useMockData: true
    });
    toast.success('Switched to demo data mode');
    setActiveTab("status");
  };

  const handleTryDirectApi = () => {
    rcmApi.initialize({
      useDirectApi: true,
      useCorsProxy: false,
      useMockData: false
    });
    toast.info('Trying direct API connection...');
    handleRunDiagnostics();
  };

  const handleTryCorsProxy = () => {
    rcmApi.initialize({
      useDirectApi: true,
      useCorsProxy: true,
      useMockData: false
    });
    toast.info('Trying CORS proxy connection...');
    handleRunDiagnostics();
  };
  
  const handleTryLocalProxy = () => {
    rcmApi.initialize({
      useDirectApi: false,
      useCorsProxy: false,
      useMockData: false,
      apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
      apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
      apiUrl: "/api/rcm/booking/v3.2"
    });
    toast.info('Trying local proxy connection...');
    handleRunDiagnostics();
  };
  
  return (
    <Card className="border shadow-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Network className="h-5 w-5 text-blue-500" />
            <CardTitle className="text-lg">API Connection Status</CardTitle>
          </div>
          <Badge 
            variant={connectionStatus.isConnected ? "default" : "destructive"}
            className={connectionStatus.isConnected ? "bg-green-500" : ""}
          >
            {isRunning ? "Checking..." : connectionStatus.isConnected ? "Connected" : "Using Demo Data"}
          </Badge>
        </div>
        <CardDescription>
          {isLovableHosted ? "Lovable hosted environment" : "Local development environment"} 
          • Last check: {lastRun ? lastRun.toLocaleTimeString() : 'Not checked yet'}
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="mb-2 grid w-full grid-cols-3">
            <TabsTrigger value="status">Status</TabsTrigger>
            <TabsTrigger value="actions">Connect</TabsTrigger>
            <TabsTrigger value="debug">Debug Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            {!connectionStatus.isConnected && (
              <Alert className="mt-2 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Using Demo Data</AlertTitle>
                <AlertDescription className="text-amber-600">
                  <p>This application is running with demo data. Possible reasons:</p>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                    <li>The API server is preventing cross-origin requests</li>
                    <li>The development proxy is not configured correctly</li>
                    <li>Click "Check Connection" to try connecting to the API</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {connectionStatus.isConnected && (
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-500" />
                <AlertTitle className="text-green-700">API Connected</AlertTitle>
                <AlertDescription className="text-green-600">
                  <p>{connectionStatus.message || "Connection successful"}</p>
                </AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-end">
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
          </TabsContent>
          
          <TabsContent value="actions" className="space-y-4">
            <Alert className="mb-4 bg-blue-50 border-blue-200">
              <Server className="h-4 w-4 text-blue-500" />
              <AlertTitle className="text-blue-700">Connect to API</AlertTitle>
              <AlertDescription className="text-blue-600">
                <p>Choose a connection method below. Try all options to find which works best in your environment.</p>
              </AlertDescription>
            </Alert>
            
            <div className="grid grid-cols-1 gap-3">
              {process.env.NODE_ENV !== 'production' && (
                <Button
                  variant="outline"
                  onClick={handleTryLocalProxy}
                  disabled={isRunning}
                  className="justify-start bg-blue-50"
                >
                  <Server className="mr-2 h-4 w-4" />
                  Try Local Development Proxy (Recommended)
                </Button>
              )}
              
              <Button
                variant="outline"
                onClick={handleTryDirectApi}
                disabled={isRunning}
                className="justify-start"
              >
                <Globe className="mr-2 h-4 w-4" />
                Try Direct API Access
              </Button>
              
              <Button
                variant="outline"
                onClick={handleTryCorsProxy}
                disabled={isRunning}
                className="justify-start"
              >
                <Network className="mr-2 h-4 w-4" />
                Try with CORS Proxy
              </Button>
              
              <Button
                variant="outline"
                onClick={handleFallbackToMock}
                disabled={isRunning}
                className="justify-start"
              >
                <Server className="mr-2 h-4 w-4" />
                Use Demo Data
              </Button>
            </div>
            
            {process.env.NODE_ENV !== 'production' && (
              <Alert className="mt-2">
                <Server className="h-4 w-4" />
                <AlertTitle>Development Mode</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">For development, the local proxy configured in vite.config.ts should work best.</p>
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>
          
          <TabsContent value="debug" className="space-y-4">
            <div className="space-y-2 text-sm text-gray-600">
              <p>Environment: {connectionStatus.environment || process.env.NODE_ENV || 'Unknown'}</p>
              <p>Host: {window.location.origin}</p>
              <p>Lovable hosted: {isLovableHosted ? 'Yes' : 'No'}</p>
              <p>Test run count: {attemptCount}</p>
              <p>Demo mode active: {rcmApi.isUsingMockData() ? 'Yes' : 'No'}</p>
              
              {connectionStatus.failedEndpoints && connectionStatus.failedEndpoints.length > 0 && (
                <div className="mt-2">
                  <p className="text-red-600 font-medium">Failed endpoints:</p>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    {connectionStatus.failedEndpoints.map((endpoint, i) => (
                      <li key={i} className="break-all">{endpoint}</li>
                    ))}
                  </ul>
                </div>
              )}
              
              {responseData && (
                <div className="mt-3">
                  <p className="font-medium text-xs mb-1">Response Preview:</p>
                  <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto max-h-40">
                    {responseData}... (truncated)
                  </pre>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
