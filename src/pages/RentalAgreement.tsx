import { useState, useRef, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import SignatureCanvas from "react-signature-canvas";
import { Helmet } from "react-helmet-async";
import { rcmApi } from "@/lib/api/rcm-api";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Loader2, Search, FileText, CheckCircle } from "lucide-react";
import type { RCMBookingInfoResponse } from "@/lib/api/rcm-api-types";

const parseMoneyValue = (value: unknown) => {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  if (typeof value === "string") {
    const parsed = Number.parseFloat(value.replace(/[^0-9.-]/g, ""));
    return Number.isFinite(parsed) ? parsed : 0;
  }
  return 0;
};

const RentalAgreement = () => {
  const [searchParams] = useSearchParams();
  const [reservationRef, setReservationRef] = useState(searchParams.get("ref") || "");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [bookingData, setBookingData] = useState<RCMBookingInfoResponse["results"] | null>(null);
  const [kmsOut, setKmsOut] = useState("");
  const [kmsIn, setKmsIn] = useState("");
  const [fuelOut, setFuelOut] = useState("");
  const [fuelIn, setFuelIn] = useState("");
  const [vehicleRego, setVehicleRego] = useState("");
  const hirerSigRef = useRef<SignatureCanvas>(null);
  const additionalDriverSigRef = useRef<SignatureCanvas>(null);

  useEffect(() => {
    if (searchParams.get("ref")) {
      fetchBookingInfo();
    }
  }, []);

  const fetchBookingInfo = async () => {
    if (!reservationRef.trim()) {
      toast.error("Please enter a reservation reference");
      return;
    }
    setLoading(true);
    setSaved(false);
    try {
      const response = await rcmApi.getBookingInfo(reservationRef.trim());
      if (response.status === "OK" && response.results) {
        setBookingData(response.results);
        // Pre-fill fields from API data
        const booking = response.results.bookinginfo?.[0];
        if (booking) {
          setKmsOut(String(booking.kmsout || ""));
          setKmsIn(String(booking.kmsin || ""));
          setFuelOut(booking.fuelout || "");
          setFuelIn(booking.fuelin || "");
          setVehicleRego(booking.vehiclerego || "");
        }
        toast.success("Booking data loaded");
      } else {
        toast.error(response.error || "Failed to fetch booking info");
      }
    } catch (error) {
      console.error("Error fetching booking info:", error);
      toast.error("Failed to fetch booking data. Please check the reservation reference.");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!bookingData) return;

    const hirerSignature = hirerSigRef.current?.isEmpty()
      ? null
      : hirerSigRef.current?.toDataURL("image/png");

    const additionalDriverSignature = additionalDriverSigRef.current?.isEmpty()
      ? null
      : additionalDriverSigRef.current?.toDataURL("image/png");

    if (!hirerSignature) {
      toast.error("Hirer signature is required");
      return;
    }

    setSaving(true);
    try {
      const customer = bookingData.customerinfo?.[0];
      const { error } = await supabase.from("rental_agreements" as any).insert({
        reservation_ref: reservationRef,
        booking_data: bookingData as any,
        hirer_signature: hirerSignature,
        additional_driver_signature: additionalDriverSignature,
        signed_at: new Date().toISOString(),
        signed_by_name: customer ? `${customer.firstname} ${customer.lastname}` : "",
        kms_out: kmsOut,
        kms_in: kmsIn,
        fuel_out: fuelOut,
        fuel_in: fuelIn,
        vehicle_rego: vehicleRego,
      });

      if (error) throw error;
      setSaved(true);
      toast.success("Rental agreement saved successfully!");
    } catch (error) {
      console.error("Error saving rental agreement:", error);
      toast.error("Failed to save rental agreement");
    } finally {
      setSaving(false);
    }
  };

  const booking = bookingData?.bookinginfo?.[0];
  const customer = bookingData?.customerinfo?.[0];
  const payments = bookingData?.paymentinfo;
  const extras = bookingData?.extrafees;
  const additionalDrivers = bookingData?.additionaldrivers;
  const rentalDays = Math.max(1, parseMoneyValue(booking?.numberofdays) || 1);
  const dailyRate = parseMoneyValue(booking?.dailyrate);
  const insuranceAmount = parseMoneyValue(booking?.insuranceamount);
  const extrasTotal = (extras || []).reduce((sum, extra) => sum + parseMoneyValue(extra.fees), 0);
  const mandatoryFeesTotal = (booking?.mandatoryfees || []).reduce(
    (sum, fee) => sum + parseMoneyValue(fee.totalfeeamount ?? fee.amount),
    0
  );
  const totalCost = parseMoneyValue(booking?.totalcost);
  const totalRateAfterDiscount = parseMoneyValue(booking?.totalrateafterdiscount);
  const reconstructedRentalAmount = totalCost - insuranceAmount - extrasTotal - mandatoryFeesTotal;
  const rentalAmount = totalRateAfterDiscount > 0
    ? totalRateAfterDiscount
    : dailyRate > 0
      ? dailyRate * rentalDays
      : reconstructedRentalAmount > 0
        ? reconstructedRentalAmount
        : totalCost;

  return (
    <>
      <Helmet>
        <title>Rental Agreement | James Blond</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Search */}
          <Card className="mb-6">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <div className="flex-1">
                  <Label htmlFor="reservation-ref">Reservation Reference</Label>
                  <Input
                    id="reservation-ref"
                    value={reservationRef}
                    onChange={(e) => setReservationRef(e.target.value)}
                    placeholder="e.g. 000092DE2AD59C0"
                    onKeyDown={(e) => e.key === "Enter" && fetchBookingInfo()}
                  />
                </div>
                <div className="flex items-end">
                  <Button onClick={fetchBookingInfo} disabled={loading}>
                    {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4 mr-2" />}
                    {loading ? "Loading..." : "Fetch Booking"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {bookingData && (
            <div className="space-y-6" id="rental-agreement">
              {/* Header */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start">
                    <div>
                      <h1 className="text-2xl font-bold text-primary">James Blond</h1>
                      <p className="text-sm text-muted-foreground">
                        {booking?.pickuplocationname || booking?.pickuplocation}
                      </p>
                      <p className="text-sm text-muted-foreground">Tel: 0800 525 663</p>
                      <p className="text-sm text-muted-foreground">Email: info@jamesblond.co.nz</p>
                      <p className="text-sm text-muted-foreground">GST: 140-174-963</p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end">
                        <FileText className="h-5 w-5 text-primary" />
                        <span className="text-lg font-semibold">Rental Agreement</span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        Ref: {booking?.reservationref || reservationRef}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Hirer Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Hirer's Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Name:</span>{" "}
                      {customer?.firstname} {customer?.lastname}
                    </div>
                    <div>
                      <span className="font-medium">DOB:</span>{" "}
                      {customer?.dateofbirth}
                    </div>
                    <div>
                      <span className="font-medium">Licence No:</span>{" "}
                      {customer?.licenseno}
                    </div>
                    <div>
                      <span className="font-medium">Issued In:</span>{" "}
                      {customer?.licenseissued || customer?.country}
                    </div>
                    <div>
                      <span className="font-medium">Expiry:</span>{" "}
                      {customer?.licenseexpires}
                    </div>
                    <div>
                      <span className="font-medium">Phone:</span>{" "}
                      {customer?.phone || customer?.mobile}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Address:</span>{" "}
                      {[customer?.address, customer?.city, customer?.state, customer?.postcode].filter(Boolean).join(", ")}
                    </div>
                    <div className="md:col-span-2">
                      <span className="font-medium">Email:</span>{" "}
                      {customer?.email}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Vehicle Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Vehicle Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Category:</span>{" "}
                      {booking?.vehiclecategory}
                    </div>
                    <div>
                      <span className="font-medium">Description:</span>{" "}
                      {booking?.vehicledescription1}
                    </div>
                    <div>
                      <Label htmlFor="vehicle-rego" className="font-medium">Licence Plate:</Label>
                      <Input
                        id="vehicle-rego"
                        value={vehicleRego}
                        onChange={(e) => setVehicleRego(e.target.value)}
                        placeholder="Enter rego"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <span className="font-medium">Fuel Type:</span>{" "}
                      {booking?.fueltype || "N/A"}
                    </div>
                    <div>
                      <Label htmlFor="kms-out" className="font-medium">Kms Out:</Label>
                      <Input
                        id="kms-out"
                        value={kmsOut}
                        onChange={(e) => setKmsOut(e.target.value)}
                        placeholder="Enter kms"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="kms-in" className="font-medium">Kms In:</Label>
                      <Input
                        id="kms-in"
                        value={kmsIn}
                        onChange={(e) => setKmsIn(e.target.value)}
                        placeholder="Enter kms"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fuel-out" className="font-medium">Fuel Out:</Label>
                      <Input
                        id="fuel-out"
                        value={fuelOut}
                        onChange={(e) => setFuelOut(e.target.value)}
                        placeholder="e.g. Full"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="fuel-in" className="font-medium">Fuel In:</Label>
                      <Input
                        id="fuel-in"
                        value={fuelIn}
                        onChange={(e) => setFuelIn(e.target.value)}
                        placeholder="e.g. Full"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rental Details */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rental Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium">Pickup:</span>{" "}
                      {booking?.pickupdate} {booking?.pickuptime}
                    </div>
                    <div>
                      <span className="font-medium">Pickup Location:</span>{" "}
                      {booking?.pickuplocationname || booking?.pickuplocation}
                    </div>
                    <div>
                      <span className="font-medium">Return:</span>{" "}
                      {booking?.dropoffdate} {booking?.dropofftime}
                    </div>
                    <div>
                      <span className="font-medium">Return Location:</span>{" "}
                      {booking?.dropofflocationname || booking?.dropofflocation}
                    </div>
                    <div>
                      <span className="font-medium">Days:</span>{" "}
                      {booking?.numberofdays}
                    </div>
                    <div>
                      <span className="font-medium">Daily Rate:</span>{" "}
                      ${Number(booking?.dailyrate || 0).toFixed(2)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Rates & Fees */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Rates & Fees</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2 font-medium">Item</th>
                          <th className="text-right py-2 font-medium">Amount</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="py-2">
                            Vehicle Rental ({rentalDays} days × ${dailyRate.toFixed(2)})
                          </td>
                          <td className="text-right py-2">
                            ${rentalAmount.toFixed(2)}
                          </td>
                        </tr>
                        {booking?.insuranceoption && (
                          <tr className="border-b">
                            <td className="py-2">{booking.insuranceoption}</td>
                            <td className="text-right py-2">
                              ${Number(booking?.insuranceamount || 0).toFixed(2)}
                            </td>
                          </tr>
                        )}
                        {extras?.map((extra, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2">{extra.name}</td>
                            <td className="text-right py-2">
                              ${Number(extra.fees || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        {booking?.mandatoryfees?.map((fee, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="py-2">{fee.name || "Mandatory Fee"}</td>
                            <td className="text-right py-2">
                              ${Number(fee.totalfeeamount || fee.amount || 0).toFixed(2)}
                            </td>
                          </tr>
                        ))}
                        <tr className="font-bold border-t-2">
                          <td className="py-2">Total</td>
                          <td className="text-right py-2">
                            ${Number(booking?.totalcost || 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Details */}
              {payments && payments.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Payment Details</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 font-medium">Date</th>
                            <th className="text-left py-2 font-medium">Method</th>
                            <th className="text-left py-2 font-medium">Details</th>
                            <th className="text-right py-2 font-medium">Amount</th>
                          </tr>
                        </thead>
                        <tbody>
                          {payments.map((payment, idx) => (
                            <tr key={idx} className="border-b">
                              <td className="py-2">{payment.paymentdate}</td>
                              <td className="py-2">{payment.paymentmethod}</td>
                              <td className="py-2">{payment.paymentdetails || ""}</td>
                              <td className="text-right py-2">
                                ${Number(payment.paidamount || 0).toFixed(2)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4 text-right font-bold">
                      Balance Due: ${Number(booking?.balancedue || 0).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Additional Drivers */}
              {additionalDrivers && additionalDrivers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Driver(s)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {additionalDrivers.map((driver, idx) => (
                      <div key={idx} className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <span className="font-medium">Name:</span>{" "}
                          {driver.firstname} {driver.lastname}
                        </div>
                        <div>
                          <span className="font-medium">DOB:</span>{" "}
                          {driver.dateofbirth}
                        </div>
                        <div>
                          <span className="font-medium">Licence No:</span>{" "}
                          {driver.licenseno}
                        </div>
                        <div>
                          <span className="font-medium">Expiry:</span>{" "}
                          {driver.licenseexpires}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}

              {/* Terms & Conditions */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Terms & Conditions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-xs text-muted-foreground space-y-3 max-h-64 overflow-y-auto pr-2">
                    <p className="font-semibold text-foreground">
                      SUBJECT TO FOLLOWING TERMS AND CONDITIONS
                    </p>
                    <p>
                      Subject to the terms & conditions contained on the front and reverse hereof of which the hirer(s) acknowledges that they are aware, the hirer agrees to rent the above vehicle and elects to pay all amounts payable under this agreement by the method of payment of which details are given on this document. By signing this contract, you hereby agree to these terms and authorise Kanthawala Ltd charging your credit card for the rental, the bond and any additional costs incurred.
                    </p>
                    <p><strong>1. ACCIDENTS</strong> — Any accident must be reported within twenty four(24) hours and must be accompanied by a police report.</p>
                    <p><strong>2. TRAFFIC INFRINGEMENTS</strong> — The Hirer(s) accept responsibility for all traffic violations infringements. A $35 administration fee will apply for any fines received.</p>
                    <p><strong>3. HIRER(S) RESPONSIBILITY</strong> — Maintaining water and oil levels is the hirer(s) responsibility.</p>
                    <p><strong>4. LATE RETURNS</strong> — Charged at $20.00 per hour for up to 3 hours late, after which full 24 hours rental will be charged.</p>
                    <p><strong>5. PERSONS WHO MAY DRIVE</strong> — The vehicle may be driven only by persons described in this agreement who hold a current driver's licence.</p>
                    <p><strong>6. PAYMENTS</strong> — The hirer shall pay all hire charges as specified in this agreement.</p>
                    <p><strong>7. INSURANCE</strong> — The hirer shall ensure all reasonable care is taken in handling and parking the vehicle.</p>
                    <p><strong>8-19.</strong> Full terms available at jamesblond.co.nz/terms</p>
                  </div>
                </CardContent>
              </Card>

              {/* Signatures */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Signatures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <p className="text-sm text-muted-foreground italic">
                    I accept the terms and conditions of this rental agreement. You should not sign this unless you are sure you understand its effect.
                  </p>

                  {/* Hirer Signature */}
                  <div>
                    <Label className="font-medium mb-2 block">
                      Signature of Hirer — {customer?.firstname} {customer?.lastname}
                    </Label>
                    <div className="border rounded-md bg-white">
                      <SignatureCanvas
                        ref={hirerSigRef}
                        canvasProps={{
                          className: "w-full h-32",
                          style: { width: "100%", height: "128px" },
                        }}
                        backgroundColor="white"
                      />
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => hirerSigRef.current?.clear()}
                    >
                      Clear Signature
                    </Button>
                  </div>

                  {/* Additional Driver Signature */}
                  {additionalDrivers && additionalDrivers.length > 0 && (
                    <div>
                      <Label className="font-medium mb-2 block">
                        Signature of Additional Driver — {additionalDrivers[0]?.firstname} {additionalDrivers[0]?.lastname}
                      </Label>
                      <div className="border rounded-md bg-white">
                        <SignatureCanvas
                          ref={additionalDriverSigRef}
                          canvasProps={{
                            className: "w-full h-32",
                            style: { width: "100%", height: "128px" },
                          }}
                          backgroundColor="white"
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-2"
                        onClick={() => additionalDriverSigRef.current?.clear()}
                      >
                        Clear Signature
                      </Button>
                    </div>
                  )}

                  <Separator />

                  {/* Save Button */}
                  <div className="flex justify-center">
                    {saved ? (
                      <div className="flex items-center gap-2 text-primary">
                        <CheckCircle className="h-5 w-5" />
                        <span className="font-medium">Agreement Saved Successfully</span>
                      </div>
                    ) : (
                      <Button
                        size="lg"
                        onClick={handleSave}
                        disabled={saving}
                        className="px-12"
                      >
                        {saving ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Saving...
                          </>
                        ) : (
                          "Save Signed Agreement"
                        )}
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RentalAgreement;
