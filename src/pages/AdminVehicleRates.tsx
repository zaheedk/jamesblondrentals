import React from 'react';
import VehicleRateScraper from '@/components/admin/VehicleRateScraper';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useVehicleRates } from '@/hooks/use-vehicle-rates';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { RefreshCw, TrendingUp, BarChart3, PieChart } from 'lucide-react';

const AdminVehicleRates: React.FC = () => {
  const { useRates } = useVehicleRates();
  const { data: rates = [], isLoading, refetch } = useRates(100);

  // Calculate statistics
  const stats = React.useMemo(() => {
    const websites = [...new Set(rates.map(r => r.website_name))];
    const categories = [...new Set(rates.map(r => r.vehicle_category))];
    const validRates = rates.filter(r => r.daily_rate !== null);
    const avgRate = validRates.length > 0 ? validRates.reduce((sum, r) => sum + r.daily_rate, 0) / validRates.length : 0;
    const latestScrape = rates.length > 0 ? new Date(Math.max(...rates.map(r => new Date(r.scraped_at).getTime()))) : null;

    return {
      totalRates: rates.length,
      websites: websites.length,
      categories: categories.length,
      avgRate: avgRate.toFixed(2),
      latestScrape
    };
  }, [rates]);

  // Group rates by website and category for analysis
  const ratesByWebsite = React.useMemo(() => {
    const grouped: Record<string, typeof rates> = {};
    rates.forEach(rate => {
      if (!grouped[rate.website_name]) {
        grouped[rate.website_name] = [];
      }
      grouped[rate.website_name].push(rate);
    });
    return grouped;
  }, [rates]);

  const ratesByCategory = React.useMemo(() => {
    const grouped: Record<string, { rates: typeof rates; avgRate: number; minRate: number; maxRate: number }> = {};
    rates.forEach(rate => {
      if (!grouped[rate.vehicle_category]) {
        grouped[rate.vehicle_category] = { rates: [], avgRate: 0, minRate: Infinity, maxRate: 0 };
      }
      grouped[rate.vehicle_category].rates.push(rate);
    });

    // Calculate stats for each category
    Object.keys(grouped).forEach(category => {
      const validRates = grouped[category].rates.filter(r => r.daily_rate !== null);
      if (validRates.length > 0) {
        const categoryRates = validRates.map(r => r.daily_rate);
        grouped[category].avgRate = categoryRates.reduce((sum, rate) => sum + rate, 0) / categoryRates.length;
        grouped[category].minRate = Math.min(...categoryRates);
        grouped[category].maxRate = Math.max(...categoryRates);
      } else {
        grouped[category].avgRate = 0;
        grouped[category].minRate = 0;
        grouped[category].maxRate = 0;
      }
    });

    return grouped;
  }, [rates]);

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Vehicle Rate Analytics</h1>
          <p className="text-muted-foreground">
            Monitor and analyze competitor vehicle rental rates
          </p>
        </div>
        <Button onClick={() => refetch()} disabled={isLoading} variant="outline">
          <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh Data
        </Button>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Total Rates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRates}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Websites</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.websites}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Categories</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.categories}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Avg Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${stats.avgRate}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Last Update</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm">
              {stats.latestScrape ? stats.latestScrape.toLocaleDateString() : 'Never'}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="scraper" className="space-y-4">
        <TabsList>
          <TabsTrigger value="scraper">Rate Scraper</TabsTrigger>
          <TabsTrigger value="analysis">Rate Analysis</TabsTrigger>
          <TabsTrigger value="comparison">Website Comparison</TabsTrigger>
          <TabsTrigger value="raw-data">Raw Data</TabsTrigger>
        </TabsList>

        <TabsContent value="scraper">
          <VehicleRateScraper />
        </TabsContent>

        <TabsContent value="analysis">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="h-5 w-5" />
                Rate Analysis by Category
              </CardTitle>
              <CardDescription>
                Average, minimum, and maximum rates by vehicle category
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Category</TableHead>
                      <TableHead>Count</TableHead>
                      <TableHead>Avg Rate</TableHead>
                      <TableHead>Min Rate</TableHead>
                      <TableHead>Max Rate</TableHead>
                      <TableHead>Price Range</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.entries(ratesByCategory).map(([category, data]) => (
                      <TableRow key={category}>
                        <TableCell className="font-medium">{category}</TableCell>
                        <TableCell>{data.rates.length}</TableCell>
                        <TableCell>${data.avgRate > 0 ? data.avgRate.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>${data.minRate > 0 ? data.minRate.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>${data.maxRate > 0 ? data.maxRate.toFixed(2) : 'N/A'}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="h-2 bg-gradient-to-r from-green-500 to-red-500 rounded flex-1 min-w-[60px]"></div>
                            <span className="text-xs text-muted-foreground">
                              {data.maxRate > 0 ? `$${(data.maxRate - data.minRate).toFixed(2)}` : 'N/A'}
                            </span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Website Comparison
              </CardTitle>
              <CardDescription>
                Compare rates across different rental websites
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {Object.entries(ratesByWebsite).map(([website, websiteRates]) => {
                  const validRates = websiteRates.filter(r => r.daily_rate !== null);
                  const avgRate = validRates.length > 0 ? validRates.reduce((sum, r) => sum + r.daily_rate, 0) / validRates.length : 0;
                  const categories = [...new Set(websiteRates.map(r => r.vehicle_category))];
                  
                  return (
                    <Card key={website}>
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{website}</CardTitle>
                          <Badge variant="outline">{websiteRates.length} rates</Badge>
                        </div>
                        <CardDescription>
                          Average rate: {avgRate > 0 ? `$${avgRate.toFixed(2)}` : 'Rates Unavailable'} | {categories.length} categories
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {categories.slice(0, 8).map(category => (
                            <Badge key={category} variant="secondary" className="text-xs">
                              {category}
                            </Badge>
                          ))}
                          {categories.length > 8 && (
                            <Badge variant="outline" className="text-xs">
                              +{categories.length - 8} more
                            </Badge>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="raw-data">
          <Card>
            <CardHeader>
              <CardTitle>Raw Rate Data</CardTitle>
              <CardDescription>
                Complete dataset of scraped vehicle rental rates
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="text-center py-8">Loading rates...</div>
              ) : rates.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No rates found. Run the scraper to collect data.
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
                      {rates.slice(0, 50).map((rate) => (
                        <TableRow key={rate.id}>
                          <TableCell>
                            <Badge variant="outline">{rate.website_name}</Badge>
                          </TableCell>
                          <TableCell className="max-w-[200px] truncate">{rate.vehicle_category}</TableCell>
                          <TableCell className="font-mono">
                            {rate.daily_rate ? `$${rate.daily_rate.toFixed(2)}` : 'Rate Unavailable'}
                          </TableCell>
                          <TableCell>{rate.rental_period_days}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {new Date(rate.scraped_at).toLocaleString()}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {rates.length > 50 && (
                    <div className="text-center py-4 text-sm text-muted-foreground">
                      Showing first 50 of {rates.length} total rates
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminVehicleRates;