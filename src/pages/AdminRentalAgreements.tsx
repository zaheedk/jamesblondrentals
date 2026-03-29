import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, Search } from "lucide-react";
import { rcmApi } from "@/lib/api/rcm-api";

const AdminRentalAgreements = () => {
  const navigate = useNavigate();
  const [reservationRef, setReservationRef] = useState("");
  const [lastName, setLastName] = useState("");
  const [loading, setLoading] = useState(false);

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
        </div>
      </div>
    </>
  );
};

export default AdminRentalAgreements;
