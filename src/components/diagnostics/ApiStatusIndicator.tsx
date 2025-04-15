
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
  const [activeTab, setActiveTab] = useState("status");
  
  const isLovableHosted = window.location.hostname.includes('lovable.dev') || 
                          window.location.hostname.includes('lovable-apps') ||
                          window.location.hostname.includes('lovable.app');
  
  useEffect(() => {
    // Run diagnostics on component mount
    handleRunDiagnostics();
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
            useCorsProxy: true
          });
        } else if (results.message?.includes('Direct API')) {
          rcmApi.initialize({
            useDirectApi: true,
            useCorsProxy: false
          });
        }
      } else {
        toast.error('API Connection Failed', {
          description: 'Using demo data instead. See Status tab for details.'
        });
        // Fall back to mock data after failed diagnostics
        rcmApi.initialize({
          useMockData: true
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

  const handleFallbackToMock = () => {
    rcmApi.initialize({
      useMockData: true
    });
    toast.success('Switched to demo data mode');
    setActiveTab("actions");
  };

  const handleTryDirectApi = () => {
    rcmApi.initialize({
      useDirectApi: true,
      useCorsProxy: false
    });
    toast.info('Switched to direct API mode');
    handleRunDiagnostics();
  };

  const handleTryCorsProxy = () => {
    rcmApi.initialize({
      useDirectApi: true,
      useCorsProxy: true
    });
    toast.info('Switched to CORS proxy mode');
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
            {isRunning ? "Checking..." : connectionStatus.isConnected ? "Connected" : process.env.NODE_ENV === 'production' ? "Using Demo Data" : "Disconnected"}
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
            <TabsTrigger value="actions">Actions</TabsTrigger>
            <TabsTrigger value="debug">Debug Info</TabsTrigger>
          </TabsList>
          
          <TabsContent value="status" className="space-y-4">
            {process.env.NODE_ENV === 'production' && (
              <Alert className="mt-2 bg-amber-50 border-amber-200">
                <AlertTriangle className="h-4 w-4 text-amber-500" />
                <AlertTitle className="text-amber-700">Using Demo Data</AlertTitle>
                <AlertDescription className="text-amber-600">
                  <p>Due to CORS restrictions, this application is running with demo data:</p>
                  <ul className="list-disc list-inside text-xs mt-1 space-y-1">
                    <li>The API server is preventing cross-origin requests</li>
                    <li>CORS proxies have been attempted but are not working</li>
                    <li>To use real API data, a backend proxy is required</li>
                  </ul>
                </AlertDescription>
              </Alert>
            )}
            
            {!connectionStatus.isConnected && process.env.NODE_ENV !== 'production' && (
              <Alert variant="destructive" className="mt-2">
                <Server className="h-4 w-4" />
                <AlertTitle>Connection Error</AlertTitle>
                <AlertDescription>
                  <p className="mb-1">API connection failed. Likely reasons:</p>
                  <ul className="list-disc list-inside text-xs space-y-1">
                    <li>Proxy configuration not working in production</li>
                    <li>CORS issues preventing direct API access</li>
                    <li>API server restricting access from this domain</li>
                  </ul>
                  {isLovableHosted && (
                    <div className="mt-2 bg-gray-800/20 p-2 rounded">
                      <p className="text-xs font-semibold flex items-center">
                        <Globe className="h-3 w-3 mr-1" />
                        Important for Lovable hosted apps:
                      </p>
                      <p className="text-xs mt-1">
                        Use the demo data mode until a backend proxy can be implemented.
                      </p>
                    </div>
                  )}
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
            <div className="grid grid-cols-1 gap-3">
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
                className={`justify-start ${process.env.NODE_ENV === 'production' ? "bg-blue-50" : ""}`}
              >
                <Server className="mr-2 h-4 w-4" />
                Use Demo Data (Recommended)
              </Button>
            </div>
            
            {process.env.NODE_ENV === 'production' && (
              <Alert className="mt-2">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Production Mode</AlertTitle>
                <AlertDescription>
                  <p className="text-sm">To use real API data in production, you would need to set up a backend API proxy.</p>
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
              
              {connectionStatus.failedEndpoints.length > 0 && (
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
