
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import Hero from "@/components/home/Hero";
import FeaturedVehicles from "@/components/home/FeaturedVehicles";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useEffect, useState } from "react";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { ApiStatusIndicator } from "@/components/diagnostics/ApiStatusIndicator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const { initializeApi, rcmApi } = useRcmApi();
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [apiError, setApiError] = useState<string | null>(null);
  const [rawResponse, setRawResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [requestDetails, setRequestDetails] = useState<{
    url?: string;
    method?: string;
    headers?: Record<string, string>;
    body?: string;
  }>({});
  
  useEffect(() => {
    try {
      const apiConfig = {
        apiKey: "TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq",
        apiSecret: "tsdavpoP51o6AcLIdorqgtFJ0ullAimg",
        apiUrl: "/api/rcm/booking/v3.2"
      };
      
      console.log('Initializing API with config:', {
        ...apiConfig,
        apiSecret: '******' // Mask secret for logs
      });
      
      initializeApi(apiConfig);
      console.log('API initialized successfully');
    } catch (error) {
      console.error('Failed to initialize API:', error);
      setApiError(`Initialization Error: ${error instanceof Error ? error.message : String(error)}`);
    }
  }, [initializeApi]);

  const testApiConnection = async () => {
    setIsLoading(true);
    setApiError(null);
    setApiResponse(null);
    setRawResponse(null);
    
    try {
      console.log('Testing API connection...');
      
      // Enhanced API testing with raw response capture
      const url = `${rcmApi.config?.apiUrl}/${rcmApi.config?.apiKey}?apikey=${rcmApi.config?.apiKey}`;
      const timestamp = new Date().toISOString();
      const requestBody = JSON.stringify({ method: "step1" });
      
      // Store request details for debug display
      setRequestDetails({
        url,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody
      });
      
      // Make the API request with raw response handling
      const fetchResponse = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: requestBody,
        credentials: 'same-origin'
      });
      
      // Capture response content type for debugging
      const contentType = fetchResponse.headers.get('content-type') || '';
      console.log('Response content type:', contentType);
      
      // Clone response to read text and also parse as JSON if possible
      const responseClone = fetchResponse.clone();
      
      // Get raw text response first
      const textResponse = await responseClone.text();
      setRawResponse(textResponse);
      
      // Check for HTML response
      if (contentType.includes('text/html')) {
        console.error('Received HTML instead of JSON');
        setApiError(`Invalid API response format - received HTML instead of JSON. Content-Type: ${contentType}`);
        
        // Try to parse HTML to extract any error messages
        const htmlMessage = extractMessageFromHtml(textResponse);
        if (htmlMessage) {
          setApiError(`${apiError}\n\nExtracted message: ${htmlMessage}`);
        }
      } else {
        // Try parsing as JSON
        try {
          const jsonResponse = JSON.parse(textResponse);
          setApiResponse(jsonResponse);
          
          if (jsonResponse.status === "ERR") {
            setApiError(`API Error: ${jsonResponse.error || 'Unknown error'}`);
          }
        } catch (parseError) {
          console.error('Failed to parse response as JSON:', parseError);
          setApiError(`Failed to parse response: ${parseError instanceof Error ? parseError.message : String(parseError)}`);
        }
      }
      
      // Original API call through the client for comparison
      const clientResponse = await rcmApi.getStep1();
      console.log('Client API response:', clientResponse);
      
    } catch (error) {
      console.error('API test failed:', error);
      setApiError(`API Error: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Helper function to extract messages from HTML responses
  const extractMessageFromHtml = (html: string): string | null => {
    try {
      // Try to extract common error patterns from HTML
      const titleMatch = html.match(/<title>(.*?)<\/title>/i);
      const bodyTextMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      
      if (titleMatch && titleMatch[1] && titleMatch[1].toLowerCase() !== 'document') {
        return `Page title: ${titleMatch[1]}`;
      }
      
      if (bodyTextMatch) {
        // Remove HTML tags to get plain text
        const div = document.createElement('div');
        div.innerHTML = bodyTextMatch[1];
        const textContent = div.textContent || div.innerText || '';
        
        // Return a condensed version (first 200 chars)
        return textContent.trim().substring(0, 200) + (textContent.length > 200 ? '...' : '');
      }
      
      return null;
    } catch (e) {
      console.error('Error extracting message from HTML:', e);
      return null;
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Hero />
        
        {/* API Status and Debug Section */}
        <div className="container mx-auto px-4 py-4 mb-8">
          <h2 className="text-2xl font-bold mb-4">API Diagnostics</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* API Status Card */}
            <div>
              <ApiStatusIndicator />
              
              {/* API Configuration */}
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-lg">API Configuration</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 text-sm">
                  <div>
                    <strong>API URL:</strong> {rcmApi.config?.apiUrl || '/api/rcm/booking/v3.2'}
                  </div>
                  <div>
                    <strong>API Key:</strong> {rcmApi.config?.apiKey || 'TnpLdXphUmVudGFsczQ5M3xKYW1lc0Jsb25kfE56TU1NYzVq'}
                  </div>
                  <div>
                    <strong>Environment:</strong> {process.env.NODE_ENV}
                  </div>
                  <div>
                    <strong>Base URL:</strong> {window.location.origin}
                  </div>
                  <div className="pt-2">
                    <Button 
                      onClick={testApiConnection}
                      disabled={isLoading}
                      size="sm"
                      className="w-full"
                    >
                      {isLoading ? "Testing API..." : "Test API Connection"}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            {/* API Response Display */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">API Response</CardTitle>
              </CardHeader>
              <CardContent>
                {apiError && (
                  <Alert variant="destructive" className="mb-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription className="whitespace-pre-wrap">{apiError}</AlertDescription>
                  </Alert>
                )}
                
                {isLoading && (
                  <div className="flex justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                  </div>
                )}
                
                {!isLoading && (
                  <Tabs defaultValue="parsed" className="w-full">
                    <TabsList className="mb-2 w-full">
                      <TabsTrigger value="parsed">Parsed Response</TabsTrigger>
                      <TabsTrigger value="raw">Raw Response</TabsTrigger>
                      <TabsTrigger value="request">Request Details</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="parsed">
                      {apiResponse ? (
                        <ScrollArea className="h-[300px] w-full rounded border p-4 bg-gray-50">
                          <pre className="text-xs whitespace-pre-wrap break-words">
                            {JSON.stringify(apiResponse, null, 2)}
                          </pre>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          {apiError ? "Failed to parse response as JSON" : "No response data available"}
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="raw">
                      {rawResponse ? (
                        <ScrollArea className="h-[300px] w-full rounded border p-4 bg-gray-50">
                          <pre className="text-xs whitespace-pre-wrap break-words">
                            {rawResponse}
                          </pre>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No raw response data available
                        </div>
                      )}
                    </TabsContent>
                    
                    <TabsContent value="request">
                      {Object.keys(requestDetails).length > 0 ? (
                        <ScrollArea className="h-[300px] w-full rounded border p-4 bg-gray-50">
                          <pre className="text-xs whitespace-pre-wrap break-words">
                            {JSON.stringify(requestDetails, null, 2)}
                          </pre>
                        </ScrollArea>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          No request details available
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                )}
                
                {!apiResponse && !apiError && !isLoading && !rawResponse && (
                  <div className="text-center py-8 text-gray-500">
                    Click "Test API Connection" to see the response
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
        
        <FeaturedVehicles />
        
        {/* Why Choose Us Section */}
        <section className="bg-gray-50 py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Why Choose Roadster Rentals</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Quality Vehicles</h3>
                <p className="text-gray-600">All our vehicles are thoroughly inspected and maintained to ensure your safety and comfort.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="m12 8-9.04 9.06a2.82 2.82 0 1 0 3.98 3.98L16 12"/><circle cx="17" cy="7" r="5"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Affordable Rates</h3>
                <p className="text-gray-600">Competitive pricing with no hidden fees, plus special discounts for extended rentals.</p>
              </div>
              
              <div className="text-center p-6">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                </div>
                <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
                <p className="text-gray-600">Our customer service team is available around the clock to assist you with any needs.</p>
              </div>
            </div>
          </div>
        </section>
        
        {/* Call to Action */}
        <section className="bg-primary py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Book Your Perfect Ride?</h2>
            <p className="text-white/90 mb-8 max-w-2xl mx-auto">
              Choose from our extensive fleet of vehicles and enjoy a smooth rental experience from start to finish.
            </p>
            <Button asChild className="bg-white text-primary hover:bg-gray-100">
              <Link to="/vehicles">Browse All Vehicles</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
