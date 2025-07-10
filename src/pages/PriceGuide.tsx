
import React from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const PriceGuide = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Vehicle & Trailer Price Guide</h1>
        <p className="text-gray-600 mb-8">
          James Blond offers competitive rental rates for our wide range of commercial vehicles and trailers. 
          All prices are in NZD and include GST.
        </p>

        <Tabs defaultValue="trailers" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="trailers">Trailers</TabsTrigger>
            <TabsTrigger value="trucks">Trucks</TabsTrigger>
            <TabsTrigger value="vans">Vans & Utes</TabsTrigger>
          </TabsList>

          <TabsContent value="trailers" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Trailer Pricing</CardTitle>
                <CardDescription>
                  Our range of trailers available for hire in Auckland and Wellington
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Trailer rental prices (NZD, inc. GST)</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[150px]">Trailer</TableHead>
                        <TableHead className="min-w-[150px]">Luggage Space (LxWxH)</TableHead>
                        <TableHead>2 Hour</TableHead>
                        <TableHead>4 Hour</TableHead>
                        <TableHead>8 Hour</TableHead>
                        <TableHead>24 Hour</TableHead>
                        <TableHead>2-4 Days</TableHead>
                        <TableHead>5-9 Days</TableHead>
                        <TableHead>10+ Days</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Caged Standard</TableCell>
                        <TableCell>2.4 x 1.23 x 1.25m</TableCell>
                        <TableCell>$35.00</TableCell>
                        <TableCell>$35.00</TableCell>
                        <TableCell>$45.00</TableCell>
                        <TableCell>$65.00</TableCell>
                        <TableCell>$50.00</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>$35.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Standard Trailer</TableCell>
                        <TableCell>2.4 x 1.23 x 0.3m</TableCell>
                        <TableCell>$35.00</TableCell>
                        <TableCell>$35.00</TableCell>
                        <TableCell>$45.00</TableCell>
                        <TableCell>$65.00</TableCell>
                        <TableCell>$50.00</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>$35.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Car Transporter Trailer</TableCell>
                        <TableCell>5.0 x 1.9m (1940kg Max)</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>$120.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$90.00</TableCell>
                        <TableCell>$90.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Luggage Trailer</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>$45.00</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>$45.00</TableCell>
                        <TableCell>$45.00</TableCell>
                        <TableCell>$45.00</TableCell>
                        <TableCell>$45.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trucks" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Truck Pricing</CardTitle>
                <CardDescription>
                  Our range of commercial trucks for personal and business use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Truck rental prices (NZD, inc. GST)</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Truck (LxWxH)</TableHead>
                        <TableHead>$/km</TableHead>
                        <TableHead>2 Hour</TableHead>
                        <TableHead>4 Hour</TableHead>
                        <TableHead>8 Hour</TableHead>
                        <TableHead>1-3 days</TableHead>
                        <TableHead>4-6 Days</TableHead>
                        <TableHead>7-18 Days</TableHead>
                        <TableHead>3 Day Min (UnLtd kms)</TableHead>
                        <TableHead>4+ Days (UnLtd Kms)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">2T Box 9m3 - (12m3)<br/>3 x 1.6 x 1.8m</TableCell>
                        <TableCell>$0.42</TableCell>
                        <TableCell>$50.00</TableCell>
                        <TableCell>$70.00</TableCell>
                        <TableCell>$105.00</TableCell>
                        <TableCell>$125.00</TableCell>
                        <TableCell>$110.00</TableCell>
                        <TableCell>$110.00</TableCell>
                        <TableCell>$825.00</TableCell>
                        <TableCell>$250.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2T T/Lift (12m3)<br/>3.1 x 1.8 x 2m</TableCell>
                        <TableCell>$0.44</TableCell>
                        <TableCell>$60.00</TableCell>
                        <TableCell>$80.00</TableCell>
                        <TableCell>$115.00</TableCell>
                        <TableCell>$140.00</TableCell>
                        <TableCell>$125.00</TableCell>
                        <TableCell>$115.00</TableCell>
                        <TableCell>$975.00</TableCell>
                        <TableCell>$300.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2T (16m3)<br/>4 x 2 x 2m</TableCell>
                        <TableCell>$0.47</TableCell>
                        <TableCell>$50.00</TableCell>
                        <TableCell>$80.00</TableCell>
                        <TableCell>$115.00</TableCell>
                        <TableCell>$130.00</TableCell>
                        <TableCell>$120.00</TableCell>
                        <TableCell>$110.00</TableCell>
                        <TableCell>$900.00</TableCell>
                        <TableCell>$250.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">3T (18m3) T/Lift<br/>4.5 x 2 x 2m</TableCell>
                        <TableCell>$0.61</TableCell>
                        <TableCell>$75.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$140.00</TableCell>
                        <TableCell>$160.00</TableCell>
                        <TableCell>$145.00</TableCell>
                        <TableCell>$140.00</TableCell>
                        <TableCell>$1,200.00</TableCell>
                        <TableCell>$350.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">3T Tail Lift Class2 (19m3)<br/>4.5 x 2 x 2m</TableCell>
                        <TableCell>$0.62</TableCell>
                        <TableCell>$75.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$140.00</TableCell>
                        <TableCell>$160.00</TableCell>
                        <TableCell>$145.00</TableCell>
                        <TableCell>$140.00</TableCell>
                        <TableCell>$1,200.00</TableCell>
                        <TableCell>$350.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">2 Ton Tipper</TableCell>
                        <TableCell>$0.39</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>$70.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$115.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$95.00</TableCell>
                        <TableCell>$600.00</TableCell>
                        <TableCell>$200.00</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="vans" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Vans & Utes Pricing</CardTitle>
                <CardDescription>
                  Our range of vans and utility vehicles for commercial and personal use
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Van & Ute rental prices (NZD, inc. GST)</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="min-w-[180px]">Van or Ute</TableHead>
                        <TableHead>$/km</TableHead>
                        <TableHead>2 Hour</TableHead>
                        <TableHead>4 Hour</TableHead>
                        <TableHead>8 Hour</TableHead>
                        <TableHead>1-3 days</TableHead>
                        <TableHead>4-6 Days</TableHead>
                        <TableHead>7-18 Days</TableHead>
                        <TableHead>3 Days (UnLtd kms)</TableHead>
                        <TableHead>3 day+ (U/Ltd)</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Ute Dble Cab 4WD (Diesel)</TableCell>
                        <TableCell>$0.30</TableCell>
                        <TableCell>$50.00</TableCell>
                        <TableCell>$80.00</TableCell>
                        <TableCell>$120.00</TableCell>
                        <TableCell>$150.00</TableCell>
                        <TableCell>$130.00</TableCell>
                        <TableCell>$125.00</TableCell>
                        <TableCell>$630.00</TableCell>
                        <TableCell>$210.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Ute Sdgl Cab Diesel<br/>(100km/day)</TableCell>
                        <TableCell>$0.25</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>$70.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$130.00</TableCell>
                        <TableCell>$115.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$600.00</TableCell>
                        <TableCell>$200.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Ute Single Cab (Petrol)</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>$70.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$115.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$90.00</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Jumbo Van (9m3)<br/>3 x 1.6 x 1.9m</TableCell>
                        <TableCell>$0.39</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>$70.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$130.00</TableCell>
                        <TableCell>$115.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$600.00</TableCell>
                        <TableCell>$200.00</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Rear Seat Van (6m3)</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>$130.00</TableCell>
                        <TableCell>$120.00</TableCell>
                        <TableCell>$110.00</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Standard Van (6m3)<br/>2.8 x 1.5 x 1.35m</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>$35.00</TableCell>
                        <TableCell>$65.00</TableCell>
                        <TableCell>$90.00</TableCell>
                        <TableCell>$115.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$95.00</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Premium Van (6m3)<br/>2.8 x 1.5 x 1.35m</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>$40.00</TableCell>
                        <TableCell>$70.00</TableCell>
                        <TableCell>$100.00</TableCell>
                        <TableCell>$130.00</TableCell>
                        <TableCell>$120.00</TableCell>
                        <TableCell>$110.00</TableCell>
                        <TableCell>-</TableCell>
                        <TableCell>-</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="mt-10 bg-gray-50 p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold mb-4">Pricing Notes</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All prices are in New Zealand Dollars and include GST.</li>
            <li>Weekend rates apply from Friday morning to Sunday morning.</li>
            <li>A security deposit is required for all rentals.</li>
            <li>Kilometer charges apply as listed, where applicable.</li>
            <li>Unlimited kilometer options are available for some vehicles as shown.</li>
            <li>Additional charges may apply for late returns, damage, or cleaning.</li>
            <li>Prices are subject to change without notice.</li>
            <li>Special corporate rates are available for businesses - please contact us.</li>
          </ul>
          
          <div className="mt-6">
            <h3 className="font-bold mb-2">How to Book</h3>
            <p>For bookings and inquiries, please call 0800 525 663 or email info@jamesblond.co.nz, or use our online booking system.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceGuide;
