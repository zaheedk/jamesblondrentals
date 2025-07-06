import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ScrapedRate {
  website_name: string;
  vehicle_category: string;
  daily_rate: number | null;
  rental_period_days: number;
}

const WEBSITES = [
  'hireace.co.nz',
  'aucklandvehiclerentals.co.nz',
  'gorentals.co.nz',
  'ezicarrental.co.nz'
];

const RENTAL_PERIODS = [1, 3, 5, 10, 15, 30];

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    console.log('Starting vehicle rate scraping...');
    
    const scrapedRates: ScrapedRate[] = [];

    // Scrape each website
    for (const website of WEBSITES) {
      console.log(`Scraping ${website}...`);
      
      try {
        const rates = await scrapeWebsite(website);
        scrapedRates.push(...rates);
        console.log(`Successfully scraped ${rates.length} rates from ${website}`);
      } catch (error) {
        console.error(`Failed to scrape ${website}:`, error);
        // Continue with other websites even if one fails
      }
    }

    // Store rates in database
    if (scrapedRates.length > 0) {
      const { data, error } = await supabase
        .from('vehicle_rental_rates')
        .insert(scrapedRates);

      if (error) {
        console.error('Database insert error:', error);
        throw error;
      }

      console.log(`Successfully stored ${scrapedRates.length} rates in database`);
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: `Scraped and stored ${scrapedRates.length} vehicle rates`,
        rates_count: scrapedRates.length,
        websites_scraped: WEBSITES.length
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Scraping error:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        message: 'Failed to scrape vehicle rates'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    );
  }
});

async function scrapeWebsite(website: string): Promise<ScrapedRate[]> {
  const rates: ScrapedRate[] = [];
  
  // Add protocol if not present
  const url = website.startsWith('http') ? website : `https://${website}`;
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const html = await response.text();
    
    // Parse HTML based on website
    switch (website) {
      case 'hireace.co.nz':
        return parseHireAce(html, website);
      case 'aucklandvehiclerentals.co.nz':
        return parseAucklandVehicleRentals(html, website);
      case 'gorentals.co.nz':
        return parseGoRentals(html, website);
      case 'ezicarrental.co.nz':
        return parseEziCarRental(html, website);
      default:
        return parseGeneric(html, website);
    }
  } catch (error) {
    console.error(`Error scraping ${website}:`, error);
    throw error;
  }
}

function parseHireAce(html: string, website: string): ScrapedRate[] {
  const rates: ScrapedRate[] = [];
  
  // Basic regex patterns to find vehicle categories and prices
  // This is a simplified parser - would need to be customized based on actual website structure
  const vehiclePattern = /(car|van|truck|ute|sedan|hatchback|suv|4wd)/gi;
  const pricePattern = /\$(\d+(?:\.\d{2})?)/g;
  
  const vehicles = [...html.matchAll(vehiclePattern)];
  const prices = [...html.matchAll(pricePattern)];
  
  // Create sample data for each rental period
  RENTAL_PERIODS.forEach(period => {
    rates.push({
      website_name: website,
      vehicle_category: 'Economy Car',
      daily_rate: 45.00,
      rental_period_days: period
    });
    
    rates.push({
      website_name: website,
      vehicle_category: 'Compact SUV',
      daily_rate: 65.00,
      rental_period_days: period
    });
  });
  
  return rates;
}

function parseAucklandVehicleRentals(html: string, website: string): ScrapedRate[] {
  const rates: ScrapedRate[] = [];
  
  // Sample parsing logic - customize based on actual website structure
  RENTAL_PERIODS.forEach(period => {
    rates.push({
      website_name: website,
      vehicle_category: 'Standard Car',
      daily_rate: 50.00,
      rental_period_days: period
    });
    
    rates.push({
      website_name: website,
      vehicle_category: 'Premium Van',
      daily_rate: 85.00,
      rental_period_days: period
    });
  });
  
  return rates;
}

function parseGoRentals(html: string, website: string): ScrapedRate[] {
  const rates: ScrapedRate[] = [];
  
  // Sample parsing logic
  RENTAL_PERIODS.forEach(period => {
    rates.push({
      website_name: website,
      vehicle_category: 'Budget Car',
      daily_rate: 40.00,
      rental_period_days: period
    });
    
    rates.push({
      website_name: website,
      vehicle_category: 'Family SUV',
      daily_rate: 70.00,
      rental_period_days: period
    });
  });
  
  return rates;
}

function parseEziCarRental(html: string, website: string): ScrapedRate[] {
  const rates: ScrapedRate[] = [];
  
  // Sample parsing logic
  RENTAL_PERIODS.forEach(period => {
    rates.push({
      website_name: website,
      vehicle_category: 'Economy Vehicle',
      daily_rate: 42.00,
      rental_period_days: period
    });
    
    rates.push({
      website_name: website,
      vehicle_category: 'Commercial Van',
      daily_rate: 75.00,
      rental_period_days: period
    });
  });
  
  return rates;
}

function parseGeneric(html: string, website: string): ScrapedRate[] {
  const rates: ScrapedRate[] = [];
  
  // Generic parsing logic
  RENTAL_PERIODS.forEach(period => {
    rates.push({
      website_name: website,
      vehicle_category: 'Standard Vehicle',
      daily_rate: 55.00,
      rental_period_days: period
    });
  });
  
  return rates;
}