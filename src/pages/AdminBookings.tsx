import { useState, useEffect, useMemo } from "react";
import { useBookings } from "@/hooks/use-bookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search, Send, FileSignature, Eye, ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  const [signedAgreements, setSignedAgreements] = useState<Set<string>>(new Set());
  const [bookingsPage, setBookingsPage] = useState(1);
  const [quotesPage, setQuotesPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { data: bookings, isLoading, error } = useBookings();

  // Fetch which reservation refs have signed agreements
  useEffect(() => {
    const fetchSignedAgreements = async () => {
      const { data } = await supabase
        .from("rental_agreements" as any)
        .select("reservation_ref")
        .not("hirer_signature", "is", null);
      if (data) {
        setSignedAgreements(new Set((data as any[]).map((d: any) => d.reservation_ref)));
      }
    };
    fetchSignedAgreements();
  }, []);

  const siteUrl = window.location.origin;

  const handleSendRentalAgreementLink = async (booking: typeof bookings extends (infer T)[] | undefined ? T : never) => {
    const email = booking.customer_email;
    const resRef = booking.reservation_reference;
    
    if (!email) {
      toast.error("No customer email address found for this booking");
      return;
    }
    if (!resRef) {
      toast.error("No RCM reservation reference found for this booking");
      return;
    }

    setSendingEmail(booking.id);
    
    const agreementUrl = `${siteUrl}/admin/rental-agreement?ref=${resRef}`;
    const customerName = booking.customer_first_name 
      ? `${booking.customer_first_name} ${booking.customer_last_name || ''}`.trim()
      : 'Customer';

    const idempotencyKey = `agreement-link-${resRef}-${Date.now()}`;

    try {
      const { data, error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'rental-agreement-link',
          recipientEmail: email,
          idempotencyKey,
          templateData: {
            customerName,
            reservationRef: resRef,
            agreementUrl,
          },
        },
      });

      if (error) throw error;
      if (data?.success === false) throw new Error(data.error);

      toast.success(`Rental agreement link sent to ${email}`);
    } catch (err: any) {
      console.error('Error sending rental agreement email:', err);
      toast.error(`Failed to send email: ${err.message || 'Unknown error'}`);
    } finally {
      setSendingEmail(null);
    }
  };

  const filteredBookings = bookings?.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      booking.booking_reference?.toLowerCase().includes(searchLower) ||
      booking.customer_first_name?.toLowerCase().includes(searchLower) ||
      booking.customer_last_name?.toLowerCase().includes(searchLower) ||
      booking.customer_email?.toLowerCase().includes(searchLower) ||
      booking.vehicle_name?.toLowerCase().includes(searchLower) ||
      booking.pickup_location_name?.toLowerCase().includes(searchLower);
    
    return matchesSearch;
  }) || [];

  const quotes = filteredBookings.filter(
    (booking) => booking.booking_status === 'pending' && booking.payment_status === 'pending'
  );

  const confirmedBookings = filteredBookings.filter(
    (booking) => !(booking.booking_status === 'pending' && booking.payment_status === 'pending')
  );

  // Reset pages when search or page size changes
  useEffect(() => {
    setBookingsPage(1);
    setQuotesPage(1);
  }, [searchQuery, pageSize]);

  const bookingsTotalPages = Math.max(1, Math.ceil(confirmedBookings.length / pageSize));
  const quotesTotalPages = Math.max(1, Math.ceil(quotes.length / pageSize));

  const paginatedBookings = confirmedBookings.slice((bookingsPage - 1) * pageSize, bookingsPage * pageSize);
  const paginatedQuotes = quotes.slice((quotesPage - 1) * pageSize, quotesPage * pageSize);

  const getStatusBadge = (status?: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      confirmed: "bg-green-500/10 text-green-500 border-green-500/20",
      cancelled: "bg-red-500/10 text-red-500 border-red-500/20",
      completed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    };

    return (
      <Badge variant="outline" className={statusColors[status || "pending"]}>
        {status || "pending"}
      </Badge>
    );
  };

  const getPaymentBadge = (status?: string) => {
    const statusColors: Record<string, string> = {
      pending: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
      paid: "bg-green-500/10 text-green-500 border-green-500/20",
      failed: "bg-red-500/10 text-red-500 border-red-500/20",
    };

    return (
      <Badge variant="outline" className={statusColors[status || "pending"]}>
        {status || "pending"}
      </Badge>
    );
  };

  const getTypeBadge = (bookingStatus?: string, paymentStatus?: string) => {
    // A quote is when both statuses are pending (no payment made yet)
    const isQuote = bookingStatus === 'pending' && paymentStatus === 'pending';
    
    if (isQuote) {
      return (
        <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
          Quote
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
        Booking
      </Badge>
    );
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return "$0.00";
    return `$${amount.toFixed(2)}`;
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-8 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error Loading Quotes</CardTitle>
            <CardDescription>{error.message}</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Quotes & Bookings</h1>
        <p className="text-muted-foreground">Manage and view all customer quotes and bookings</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by reference, customer, vehicle, or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="bookings" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4">
              <TabsTrigger value="bookings">
                Bookings ({confirmedBookings.length})
              </TabsTrigger>
              <TabsTrigger value="quotes">
                Quotes ({quotes.length})
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="bookings">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>RCM Ref</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Dropoff</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {paginatedBookings.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                          No bookings found
                        </TableCell>
                      </TableRow>
                    ) : (
                      paginatedBookings.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-sm">
                            {booking.booking_reference || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {booking.reservation_reference || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {booking.customer_first_name} {booking.customer_last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {booking.customer_email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <div className="font-medium truncate">{booking.vehicle_name}</div>
                              <div className="text-xs text-muted-foreground">{booking.vehicle_category}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {booking.pickup_date ? format(new Date(booking.pickup_date), "MMM dd, yyyy") : "N/A"}
                              <div className="text-xs text-muted-foreground">
                                {booking.pickup_time?.toString().slice(0, 5)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {booking.dropoff_date ? format(new Date(booking.dropoff_date), "MMM dd, yyyy") : "N/A"}
                              <div className="text-xs text-muted-foreground">
                                {booking.dropoff_time?.toString().slice(0, 5)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[150px]">
                            <div className="truncate text-sm">{booking.pickup_location_name}</div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(booking.total_amount)}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.booking_status)}</TableCell>
                          <TableCell>{getPaymentBadge(booking.payment_status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {booking.created_at ? format(new Date(booking.created_at), "MMM dd, yyyy") : "N/A"}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              {booking.reservation_reference && (
                                <>
                                  <Link to={`/admin/rental-agreement?ref=${booking.reservation_reference}`}>
                                    {signedAgreements.has(booking.reservation_reference) ? (
                                      <Button variant="ghost" size="sm" title="View Signed Agreement" className="text-green-600 hover:text-green-700">
                                        <Eye className="h-4 w-4 mr-1" />
                                        <span className="text-xs">View Signed</span>
                                      </Button>
                                    ) : (
                                      <Button variant="ghost" size="sm" title="Create Rental Agreement">
                                        <FileSignature className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </Link>
                                  {booking.customer_email && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      title="Send Rental Agreement Link"
                                      disabled={sendingEmail === booking.id}
                                      onClick={() => handleSendRentalAgreementLink(booking)}
                                    >
                                      <Send className="h-4 w-4" />
                                    </Button>
                                  )}
                                </>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
              {/* Bookings Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Rows per page:</span>
                  <Select value={String(pageSize)} onValueChange={(v) => setPageSize(Number(v))}>
                    <SelectTrigger className="w-[70px] h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {confirmedBookings.length === 0 ? 0 : (bookingsPage - 1) * pageSize + 1}–{Math.min(bookingsPage * pageSize, confirmedBookings.length)} of {confirmedBookings.length}
                  </span>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={bookingsPage <= 1} onClick={() => setBookingsPage(p => p - 1)}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" className="h-8 w-8" disabled={bookingsPage >= bookingsTotalPages} onClick={() => setBookingsPage(p => p + 1)}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

            <TabsContent value="quotes">
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Reference</TableHead>
                      <TableHead>RCM Ref</TableHead>
                      <TableHead>Customer</TableHead>
                      <TableHead>Vehicle</TableHead>
                      <TableHead>Pickup</TableHead>
                      <TableHead>Dropoff</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Total</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Payment</TableHead>
                      <TableHead>Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {quotes.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                          No quotes found
                        </TableCell>
                      </TableRow>
                    ) : (
                      quotes.map((booking) => (
                        <TableRow key={booking.id}>
                          <TableCell className="font-mono text-sm">
                            {booking.booking_reference || "N/A"}
                          </TableCell>
                          <TableCell className="font-mono text-xs">
                            {booking.reservation_reference || "N/A"}
                          </TableCell>
                          <TableCell>
                            <div>
                              <div className="font-medium">
                                {booking.customer_first_name} {booking.customer_last_name}
                              </div>
                              <div className="text-xs text-muted-foreground">
                                {booking.customer_email}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="max-w-[200px]">
                              <div className="font-medium truncate">{booking.vehicle_name}</div>
                              <div className="text-xs text-muted-foreground">{booking.vehicle_category}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {booking.pickup_date ? format(new Date(booking.pickup_date), "MMM dd, yyyy") : "N/A"}
                              <div className="text-xs text-muted-foreground">
                                {booking.pickup_time?.toString().slice(0, 5)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              {booking.dropoff_date ? format(new Date(booking.dropoff_date), "MMM dd, yyyy") : "N/A"}
                              <div className="text-xs text-muted-foreground">
                                {booking.dropoff_time?.toString().slice(0, 5)}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="max-w-[150px]">
                            <div className="truncate text-sm">{booking.pickup_location_name}</div>
                          </TableCell>
                          <TableCell className="font-medium">
                            {formatCurrency(booking.total_amount)}
                          </TableCell>
                          <TableCell>{getStatusBadge(booking.booking_status)}</TableCell>
                          <TableCell>{getPaymentBadge(booking.payment_status)}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {booking.created_at ? format(new Date(booking.created_at), "MMM dd, yyyy") : "N/A"}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
