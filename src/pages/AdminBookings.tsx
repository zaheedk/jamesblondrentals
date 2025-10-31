import { useState } from "react";
import { useBookings } from "@/hooks/use-bookings";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Search } from "lucide-react";
import { format } from "date-fns";

const AdminBookings = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: bookings, isLoading, error } = useBookings();

  const filteredBookings = bookings?.filter((booking) => {
    const searchLower = searchQuery.toLowerCase();
    return (
      booking.booking_reference?.toLowerCase().includes(searchLower) ||
      booking.customer_first_name?.toLowerCase().includes(searchLower) ||
      booking.customer_last_name?.toLowerCase().includes(searchLower) ||
      booking.customer_email?.toLowerCase().includes(searchLower) ||
      booking.vehicle_name?.toLowerCase().includes(searchLower) ||
      booking.pickup_location_name?.toLowerCase().includes(searchLower)
    );
  }) || [];

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

  const getTypeBadge = (bookingReference?: string) => {
    const isBooking = bookingReference?.startsWith('BK');
    
    if (isBooking) {
      return (
        <Badge variant="outline" className="bg-blue-500/10 text-blue-500 border-blue-500/20">
          Booking
        </Badge>
      );
    }
    
    return (
      <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
        Quote
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
            <Badge variant="secondary" className="text-sm">
              {filteredBookings.length} records
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Reference</TableHead>
                  <TableHead>Type</TableHead>
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
                {filteredBookings.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={11} className="text-center py-8 text-muted-foreground">
                      No records found
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredBookings.map((booking) => (
                    <TableRow key={booking.id}>
                      <TableCell className="font-mono text-sm">
                        {booking.booking_reference || "N/A"}
                      </TableCell>
                      <TableCell>
                        {getTypeBadge(booking.booking_reference)}
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
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBookings;
