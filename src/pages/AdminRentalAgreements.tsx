import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Search, FileText, ExternalLink } from "lucide-react";
import { rcmApi } from "@/lib/api/rcm-api";
import type { RCMBookingInfoResponse } from "@/lib/api/rcm-api-types";

const AdminRentalAgreements = () => {
  const navigate = useNavigate();
  const [reservationRef, setReservationRef] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<RCMBookingInfoResponse["results"] | null>(null);

  const handleFetch = async () => {
    if (!reservationRef.trim()) {
      toast.error("Please enter a reservation reference");
      return;
    }
    setLoading(true);
    try {
      const response = await rcmApi.getBookingInfoByReservationNo(reservationRef.trim(), lastName.trim() || undefined);
      if (response.status === "OK" && response.results) {
        const booking = response.results.bookinginfo?.[0];
        const ref = booking?.reservationref || reservationRef.trim();
        navigate(`/admin/rental-agreement?ref=${ref}`);
      } else {
        toast.error(response.error || "No booking found with that reference");
      }
    } catch (error) {
      console.error("Error fetching booking info:", error);
      toast.error("No booking found. Please check the reservation number and last name.");
    } finally {
      setLoading(false);
    }
  };

  const booking = bookingData?.bookinginfo?.[0];
  const customer = bookingData?.customerinfo?.[0];

  return (
    <>
      <Helmet>
        <title>Rental Agreements | Admin | James Blond</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Rental Agreements</h1>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Fetch Booking Details</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Reservation number..."
                  value={reservationRef}
                  onChange={(e) => setReservationRef(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                />
                <Input
                  placeholder="Last name..."
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleFetch()}
                />
                <Button onClick={handleFetch} disabled={loading}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Search className="h-4 w-4 mr-2" />}
                  Fetch
                </Button>
              </div>
            </CardContent>
          </Card>

          {bookingData && booking && customer && (
            <Card>
              <CardContent className="pt-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground text-xs">Reference</p>
                    <p className="font-semibold">{booking.reservationdocumentno || booking.reservationno || reservationRef}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Customer</p>
                    <p className="font-semibold">{customer.firstname} {customer.lastname}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Vehicle</p>
                    <p className="font-semibold">{booking.vehiclecategory}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Registration</p>
                    <p className="font-semibold">{booking.vehicle_registrationnumber || booking.vehiclerego || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Pickup</p>
                    <p className="font-semibold">{booking.pickupdate} {booking.pickuptime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Return</p>
                    <p className="font-semibold">{booking.dropoffdate} {booking.dropofftime}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Days</p>
                    <p className="font-semibold">{booking.numberofdays}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground text-xs">Total Cost</p>
                    <p className="font-semibold">${Number(booking.totalcost || 0).toFixed(2)}</p>
                  </div>
                </div>

                <div className="flex gap-3 pt-2">
                  <Button
                    onClick={() => navigate(`/admin/rental-agreement?ref=${booking.reservationref || reservationRef.trim()}`)}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Open Rental Agreement
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => window.open(`/admin/rental-agreement?ref=${booking.reservationref || reservationRef.trim()}`, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Open in New Tab
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminRentalAgreements;
