import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { RefreshCw, Database, Globe, TrendingUp } from 'lucide-react';

interface VehicleRate {
  id: string;
  website_name: string;
  vehicle_category: string;
  daily_rate: number;
  rental_period_days: number;
  scraped_at: string;
}

interface ScrapingResult {
  success: boolean;
  message: string;
  rates_count?: number;
  websites_scraped?: number;
  error?: string;
}

const VehicleRateScraper: React.FC = () => {
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapingResult, setScrapingResult] = useState<ScrapingResult | null>(null);
  const [rates, setRates] = useState<VehicleRate[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadRecentRates();
  }, []);

  const loadRecentRates = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('vehicle_rental_rates')
        .select('*')
        .order('scraped_at', { ascending: false })
        .limit(50);

      if (error) throw error;
      setRates(data || []);
    } catch (error) {
      console.error('Error loading rates:', error);
      toast({
        title: 'Error',
        description: 'Failed to load recent rates',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartScraping = async () => {
    setIsScrapingActive(true);
    setScrapingResult(null);

    try {
      const { data, error } = await supabase.functions.invoke('scrape-vehicle-rates');

      if (error) throw error;

      setScrapingResult(data);
      
      if (data.success) {
        toast({
          title: 'Scraping Complete',
          description: `Successfully scraped ${data.rates_count} rates from ${data.websites_scraped} websites`,
        });
        // Reload the rates to show new data
        await loadRecentRates();
      } else {
        toast({
          title: 'Scraping Failed',
          description: data.error || 'Unknown error occurred',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Scraping error:', error);
      toast({
        title: 'Error',
        description: 'Failed to start scraping process',
        variant: 'destructive',
      });
    } finally {
      setIsScrapingActive(false);
    }
  };

  const getUniqueWebsites = () => {
    return [...new Set(rates.map(rate => rate.website_name))];
  };

  const getUniqueCategories = () => {
    return [...new Set(rates.map(rate => rate.vehicle_category))];
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Vehicle Rate Scraper
          </CardTitle>
          <CardDescription>
            Scrape vehicle rental rates from competitor websites and store them in the database
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Button
              onClick={handleStartScraping}
              disabled={isScrapingActive}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`h-4 w-4 ${isScrapingActive ? 'animate-spin' : ''}`} />
              {isScrapingActive ? 'Scraping...' : 'Start Scraping'}
            </Button>
            
            <Button
              variant="outline"
              onClick={loadRecentRates}
              disabled={isLoading}
              className="flex items-center gap-2"
            >
              <Database className="h-4 w-4" />
              Refresh Data
            </Button>
          </div>

          {scrapingResult && (
            <Alert variant={scrapingResult.success ? "default" : "destructive"}>
              <AlertDescription>
                {scrapingResult.message}
                {scrapingResult.success && scrapingResult.rates_count && (
                  <span className="block mt-1">
                    Found {scrapingResult.rates_count} rates from {scrapingResult.websites_scraped} websites
                  </span>
                )}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Total Rates</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rates.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Websites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueWebsites().length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{getUniqueCategories().length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Recent Scraped Rates
          </CardTitle>
          <CardDescription>
            Latest vehicle rental rates from competitor websites
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-4">Loading rates...</div>
          ) : rates.length === 0 ? (
            <div className="text-center py-4 text-muted-foreground">
              No rates found. Try running the scraper first.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Website</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Daily Rate</TableHead>
                    <TableHead>Period (Days)</TableHead>
                    <TableHead>Scraped At</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rates.map((rate) => (
                    <TableRow key={rate.id}>
                      <TableCell>
                        <Badge variant="outline">{rate.website_name}</Badge>
                      </TableCell>
                      <TableCell>{rate.vehicle_category}</TableCell>
                      <TableCell>
                        {rate.daily_rate ? `$${rate.daily_rate.toFixed(2)}` : 'Rate Unavailable'}
                      </TableCell>
                      <TableCell>{rate.rental_period_days}</TableCell>
                      <TableCell>
                        {new Date(rate.scraped_at).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default VehicleRateScraper;