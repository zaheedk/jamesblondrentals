import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Globe, Search, CheckCircle, AlertCircle } from 'lucide-react';

interface ScrapingStatus {
  website: string;
  status: 'pending' | 'scraping' | 'completed' | 'failed';
  rates: Array<{
    vehicle_category: string;
    daily_rate: number | null;
    rental_period_days: number;
  }>;
  error?: string;
}

const ClientSideScraper: React.FC = () => {
  const [isScrapingActive, setIsScrapingActive] = useState(false);
  const [scrapingProgress, setScrapingProgress] = useState(0);
  const [scrapingStatuses, setScrapingStatuses] = useState<ScrapingStatus[]>([]);
  const { toast } = useToast();

  const RENTAL_WEBSITES = [
    {
      name: 'hireace.co.nz',
      url: 'https://hireace.co.nz',
      bookingUrl: 'https://web.rentalcarmanager.com/app/1295/hireace'
    },
    {
      name: 'aucklandvehiclerentals.co.nz', 
      url: 'https://aucklandvehiclerentals.co.nz',
      bookingUrl: 'https://aucklandvehiclerentals.co.nz/online-booking'
    },
    {
      name: 'gorentals.co.nz',
      url: 'https://gorentals.co.nz',
      bookingUrl: 'https://gorentals.co.nz/book-now'
    },
    {
      name: 'ezicarrental.co.nz',
      url: 'https://ezicarrental.co.nz',
      bookingUrl: 'https://ezicarrental.co.nz/booking'
    }
  ];

  const startClientSideScraping = async () => {
    setIsScrapingActive(true);
    setScrapingProgress(0);
    
    // Initialize statuses
    const initialStatuses: ScrapingStatus[] = RENTAL_WEBSITES.map(site => ({
      website: site.name,
      status: 'pending',
      rates: []
    }));
    setScrapingStatuses(initialStatuses);

    let completedCount = 0;
    const rentalPeriods = [1, 3, 5, 10, 15, 30]; // Days for rental periods

    for (let i = 0; i < RENTAL_WEBSITES.length; i++) {
      const website = RENTAL_WEBSITES[i];
      
      // Update status to scraping
      setScrapingStatuses(prev => prev.map(status => 
        status.website === website.name 
          ? { ...status, status: 'scraping' }
          : status
      ));

      try {
        const rates = await scrapeWebsiteClientSide(website, rentalPeriods);
        
        // Save rates to database
        if (rates.length > 0) {
          const ratesToSave = rates.map(rate => ({
            website_name: website.name,
            vehicle_category: rate.vehicle_category,
            daily_rate: rate.daily_rate,
            rental_period_days: rate.rental_period_days
          }));

          const { error } = await supabase
            .from('vehicle_rental_rates')
            .insert(ratesToSave);

          if (error) {
            console.error('Error saving rates:', error);
          }
        }

        // Update status to completed
        setScrapingStatuses(prev => prev.map(status => 
          status.website === website.name 
            ? { ...status, status: 'completed', rates }
            : status
        ));

        toast({
          title: `${website.name} Complete`,
          description: `Found ${rates.length} rates`,
        });

      } catch (error) {
        console.error(`Error scraping ${website.name}:`, error);
        
        // Update status to failed
        setScrapingStatuses(prev => prev.map(status => 
          status.website === website.name 
            ? { ...status, status: 'failed', error: error.message }
            : status
        ));
      }

      completedCount++;
      setScrapingProgress((completedCount / RENTAL_WEBSITES.length) * 100);
    }

    setIsScrapingActive(false);
    toast({
      title: 'Scraping Complete',
      description: 'All websites have been processed',
    });
  };

  const scrapeWebsiteClientSide = async (website: { name: string; url: string; bookingUrl: string }, rentalPeriods: number[]) => {
    const rates: Array<{
      vehicle_category: string;
      daily_rate: number | null;
      rental_period_days: number;
    }> = [];

    // Calculate dates - pickup tomorrow, dropoff based on rental periods
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const pickupDate = tomorrow.toISOString().split('T')[0]; // YYYY-MM-DD format

    for (const periodDays of rentalPeriods) {
      const dropoffDate = new Date(tomorrow);
      dropoffDate.setDate(dropoffDate.getDate() + periodDays);
      const dropoffDateStr = dropoffDate.toISOString().split('T')[0];

      // Build booking URL with dates for HireAce
      let searchUrl = website.bookingUrl;
      if (website.name === 'hireace.co.nz') {
        // HireAce uses specific date format and parameters
        const urlParams = new URLSearchParams({
          'pickup-date': pickupDate,
          'return-date': dropoffDateStr,
          'pickup-location': 'Henderson', 
          'return-location': 'Henderson'
        });
        searchUrl = `${website.bookingUrl}?${urlParams.toString()}`;
      }

      try {
        // Use direct fetch with proxy instead of iframe
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(searchUrl)}`;
        console.log(`Fetching ${website.name} for ${periodDays} days from:`, searchUrl);
        
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        if (data.contents) {
          // Parse rates from content based on website and period
          const parsedRates = parseRatesFromContent(data.contents, website.name, periodDays);
          rates.push(...parsedRates);
          console.log(`Found ${parsedRates.length} rates for ${website.name} (${periodDays} days)`);
        } else {
          console.warn(`No content returned for ${website.name} (${periodDays} days)`);
        }

      } catch (error) {
        console.error(`Error processing ${website.name} for ${periodDays} days:`, error);
      }
    }

    return rates;
  };

  const parseRatesFromContent = (content: string, websiteName: string, rentalPeriodDays: number) => {
    const rates: Array<{
      vehicle_category: string;
      daily_rate: number | null;
      rental_period_days: number;
    }> = [];

    if (websiteName === 'hireace.co.nz') {
      // Look for UTE rates specifically
      const utePatterns = [
        /ute.*?\$?(\d+\.?\d*)/gi,
        /single.*?cab.*?\$?(\d+\.?\d*)/gi,
        /\$(\d+\.?\d*).{0,20}ute/gi,
        /(\d+\.?\d*).*?per.*?day.*?ute/gi
      ];

      for (const pattern of utePatterns) {
        const matches = content.match(pattern);
        if (matches) {
          matches.forEach(match => {
            const priceMatch = match.match(/(\d+\.?\d*)/);
            if (priceMatch) {
              const price = parseFloat(priceMatch[1]);
              if (price > 50 && price < 500) { // Reasonable rate range
                rates.push({
                  vehicle_category: `UTE (Henderson) - ${rentalPeriodDays} days`,
                  daily_rate: price,
                  rental_period_days: rentalPeriodDays
                });
              }
            }
          });
        }
      }

      // If no UTE rates found, try generic vehicle patterns
      if (rates.length === 0) {
        const genericPatterns = [
          /\$(\d+\.?\d*)\s*(?:per\s+day|\/day|daily)/gi,
          /daily.*?\$(\d+\.?\d*)/gi,
          /(\d+\.?\d*)\s*per\s*day/gi
        ];

        for (const pattern of genericPatterns) {
          const matches = [...content.matchAll(pattern)];
          matches.forEach(match => {
            const price = parseFloat(match[1]);
            if (price > 30 && price < 300) {
              rates.push({
                vehicle_category: `Vehicle Rate Found - ${rentalPeriodDays} days`,
                daily_rate: price,
                rental_period_days: rentalPeriodDays
              });
            }
          });
          if (rates.length > 0) break;
        }
      }
    } else {
      // Generic parsing for other websites
      const pricePattern = /\$(\d+\.?\d*)\s*(?:per\s+day|\/day|daily)/gi;
      const matches = [...content.matchAll(pricePattern)];
      
      matches.forEach(match => {
        const price = parseFloat(match[1]);
        if (price > 20 && price < 400) {
          rates.push({
            vehicle_category: `Standard Vehicle - ${rentalPeriodDays} days`,
            daily_rate: price,
            rental_period_days: rentalPeriodDays
          });
        }
      });
    }

    return rates;
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Client-Side Rate Scraper
          </CardTitle>
          <CardDescription>
            Performs real booking searches on rental websites to get actual pricing data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button
            onClick={startClientSideScraping}
            disabled={isScrapingActive}
            className="flex items-center gap-2"
          >
            <Globe className="h-4 w-4" />
            {isScrapingActive ? 'Scraping...' : 'Start Client-Side Scraping'}
          </Button>

          {isScrapingActive && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Overall Progress</span>
                <span>{scrapingProgress.toFixed(0)}%</span>
              </div>
              <Progress value={scrapingProgress} />
            </div>
          )}

          {scrapingStatuses.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-medium">Scraping Status</h4>
              {scrapingStatuses.map((status) => (
                <div key={status.website} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2">
                    {status.status === 'completed' ? (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    ) : status.status === 'failed' ? (
                      <AlertCircle className="h-4 w-4 text-red-500" />
                    ) : status.status === 'scraping' ? (
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    ) : (
                      <div className="h-4 w-4 rounded-full border-2 border-gray-300" />
                    )}
                    <span className="font-medium">{status.website}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={
                      status.status === 'completed' ? 'default' :
                      status.status === 'failed' ? 'destructive' :
                      status.status === 'scraping' ? 'secondary' : 'outline'
                    }>
                      {status.status}
                    </Badge>
                    {status.rates.length > 0 && (
                      <span className="text-sm text-muted-foreground">
                        {status.rates.length} rates
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {scrapingStatuses.some(s => s.error) && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Some websites failed to scrape. Check individual status above for details.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientSideScraper;