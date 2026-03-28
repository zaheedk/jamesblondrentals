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
import { Loader2, Search, FileText, CheckCircle, Download, ShieldCheck } from "lucide-react";
import type { RCMBookingInfoResponse } from "@/lib/api/rcm-api-types";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

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
  const [alreadySigned, setAlreadySigned] = useState(false);
  const [existingSignature, setExistingSignature] = useState<string | null>(null);
  const [existingAdditionalSig, setExistingAdditionalSig] = useState<string | null>(null);
  const [signedAt, setSignedAt] = useState<string | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
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
    setAlreadySigned(false);
    setExistingSignature(null);
    setExistingAdditionalSig(null);
    setSignedAt(null);
    setPdfUrl(null);
    try {
      // Check if agreement already exists in Supabase
      const { data: existingAgreements } = await supabase
        .from("rental_agreements" as any)
        .select("*")
        .eq("reservation_ref", reservationRef.trim())
        .not("hirer_signature", "is", null);

      if (existingAgreements && (existingAgreements as any[]).length > 0) {
        const existing = (existingAgreements as any[])[0];
        setAlreadySigned(true);
        setSaved(true);
        setExistingSignature(existing.hirer_signature);
        setExistingAdditionalSig(existing.additional_driver_signature);
        setSignedAt(existing.signed_at);
      }

      const response = await rcmApi.getBookingInfo(reservationRef.trim());
      if (response.status === "OK" && response.results) {
        console.log("RCM API full response:", JSON.stringify(response.results, null, 2));
        console.log("bookinginfo[0] keys:", Object.keys(response.results.bookinginfo?.[0] || {}));
        console.log("vehiclerego:", response.results.bookinginfo?.[0]?.vehiclerego);
        console.log("fueltype:", response.results.bookinginfo?.[0]?.fueltype);
        setBookingData(response.results);
        // Pre-fill fields from API data
        const booking = response.results.bookinginfo?.[0];
        if (booking) {
          setKmsOut(String(booking.kmsout || ""));
          setKmsIn(String(booking.kmsin || ""));
          setFuelOut(booking.fuelout || "");
          setFuelIn(booking.fuelin || "");
          setVehicleRego(booking.vehicle_registrationnumber || booking.vehiclerego || "");
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

  const generatePdf = async (): Promise<Blob | null> => {
    const element = document.getElementById("rental-agreement");
    if (!element) return null;

    try {
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = pdfWidth / imgWidth;
      const totalPdfHeight = imgHeight * ratio;
      let position = 0;

      // Add pages as needed
      while (position < totalPdfHeight) {
        if (position > 0) pdf.addPage();
        pdf.addImage(imgData, "JPEG", 0, -position, pdfWidth, totalPdfHeight);
        position += pdfHeight;
      }

      return pdf.output("blob");
    } catch (error) {
      console.error("Error generating PDF:", error);
      return null;
    }
  };

  const handleSave = async () => {
    if (!bookingData || alreadySigned) return;

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
      const booking = bookingData.bookinginfo?.[0];
      const agreementRef = booking?.reservationdocumentno || booking?.reservationno || reservationRef;

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
      setAlreadySigned(true);
      setExistingSignature(hirerSignature);
      setExistingAdditionalSig(additionalDriverSignature);
      setSignedAt(new Date().toISOString());
      toast.success("Rental agreement saved successfully!");

      // Generate PDF and upload to storage
      toast.info("Generating PDF...");
      const pdfBlob = await generatePdf();
      let downloadUrl: string | null = null;

      if (pdfBlob) {
        const fileName = `agreement-${reservationRef}-${Date.now()}.pdf`;
        const { error: uploadError } = await supabase.storage
          .from("signed-agreements")
          .upload(fileName, pdfBlob, {
            contentType: "application/pdf",
            upsert: false,
          });

        if (!uploadError) {
          const { data: urlData } = supabase.storage
            .from("signed-agreements")
            .getPublicUrl(fileName);
          downloadUrl = urlData?.publicUrl || null;
          setPdfUrl(downloadUrl);
          toast.success("PDF generated and stored");
        } else {
          console.error("Error uploading PDF:", uploadError);
        }
      }

      // Email the signed agreement with download link
      const customerEmail = customer?.email;
      if (customerEmail) {
        const vehicleName = booking?.vehiclecategory || "Vehicle";
        const pickupDate = booking?.pickupdate || "";
        const dropoffDate = booking?.dropoffdate || "";

        const downloadSection = downloadUrl
          ? `<tr style="border-top: 2px solid #1a365d;">
               <td colspan="2" style="padding: 16px 8px; text-align: center;">
                 <a href="${downloadUrl}" style="display: inline-block; background-color: #1a365d; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Download Signed Agreement (PDF)</a>
               </td>
             </tr>`
          : "";

        try {
          await supabase.functions.invoke('send-postmark-email', {
            body: {
              to: customerEmail,
              subject: `Your Signed Rental Agreement - ${agreementRef} | James Blond Rentals`,
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                  <h1 style="color: #1a365d; font-size: 24px;">James Blond Rentals</h1>
                  <h2 style="color: #333; font-size: 18px;">Signed Rental Agreement Confirmation</h2>
                  <p>Dear ${customer?.firstname || 'Customer'},</p>
                  <p>Thank you for signing your rental agreement. Here is a summary of your rental:</p>
                  <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 8px; font-weight: bold;">Agreement Ref:</td>
                      <td style="padding: 8px;">${agreementRef}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 8px; font-weight: bold;">Vehicle:</td>
                      <td style="padding: 8px;">${vehicleName}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 8px; font-weight: bold;">Registration:</td>
                      <td style="padding: 8px;">${vehicleRego || 'N/A'}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 8px; font-weight: bold;">Pickup:</td>
                      <td style="padding: 8px;">${pickupDate} ${booking?.pickuptime || ''}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 8px; font-weight: bold;">Return:</td>
                      <td style="padding: 8px;">${dropoffDate} ${booking?.dropofftime || ''}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 8px; font-weight: bold;">Total Cost:</td>
                      <td style="padding: 8px;">$${Number(booking?.totalcost || 0).toFixed(2)}</td>
                    </tr>
                    <tr style="border-bottom: 1px solid #e2e8f0;">
                      <td style="padding: 8px; font-weight: bold;">Signed By:</td>
                      <td style="padding: 8px;">${customer?.firstname} ${customer?.lastname}</td>
                    </tr>
                    ${downloadSection}
                  </table>
                  <p style="color: #666; font-size: 13px;">This email confirms that the rental agreement has been electronically signed. A copy of the full terms and conditions was presented at the time of signing.</p>
                  <p style="color: #666; font-size: 13px;">If you have any questions, please contact us at <a href="tel:0800525663">0800 525 663</a> or <a href="mailto:info@jamesblond.co.nz">info@jamesblond.co.nz</a>.</p>
                  <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 20px 0;" />
                  <p style="color: #999; font-size: 11px;">James Blond Rentals | GST: 140-174-963</p>
                </div>
              `,
              from: 'James Blond Rentals <info@jamesblond.co.nz>',
            },
          });
          toast.success("Confirmation email sent to " + customerEmail);
        } catch (emailError) {
          console.error("Error sending confirmation email:", emailError);
          toast.error("Agreement saved but failed to send confirmation email");
        }
      }
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
  const extraDrivers = bookingData?.extradrivers;
  const allAdditionalDrivers = [
    ...(additionalDrivers || []),
    ...(extraDrivers || []),
  ];
  const rateInfo = bookingData?.rateinfo;
  const rentalDays = Math.max(1, parseMoneyValue(booking?.numberofdays) || 1);
  // Prefer rateinfo daily rate (after discount), fallback to bookinginfo dailyrate
  const rateInfoDailyRate = rateInfo?.[0]?.dailyrateafterdiscount ?? rateInfo?.[0]?.dailyratebeforediscount;
  const dailyRate = rateInfoDailyRate != null && rateInfoDailyRate > 0
    ? rateInfoDailyRate
    : parseMoneyValue(booking?.dailyrate);
  const insuranceAmount = parseMoneyValue(booking?.insuranceamount);
  const extrasTotal = (extras || []).reduce((sum, extra) => sum + parseMoneyValue(extra.fees), 0);
  const mandatoryFeesTotal = (booking?.mandatoryfees || []).reduce(
    (sum, fee) => sum + parseMoneyValue(fee.totalfeeamount ?? fee.amount),
    0
  );
  const totalCost = parseMoneyValue(booking?.totalcost);
  const totalRateAfterDiscount = parseMoneyValue(booking?.totalrateafterdiscount);
  // Sum rateinfo subtotals for multi-season rentals
  const rateInfoSubtotal = (rateInfo || []).reduce((sum, r) => sum + (r.ratesubtotal || 0), 0);
  const reconstructedRentalAmount = totalCost - insuranceAmount - extrasTotal - mandatoryFeesTotal;
  const rentalAmount = rateInfoSubtotal > 0
    ? rateInfoSubtotal
    : totalRateAfterDiscount > 0
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
                        Ref: {booking?.reservationdocumentno || booking?.reservationno || booking?.reservationref || reservationRef}
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
                      <Label className="font-medium">Licence Plate:</Label>
                      <div className="mt-1 px-3 py-2 border rounded-md bg-muted text-sm">{vehicleRego || "N/A"}</div>
                    </div>
                    <div>
                      <span className="font-medium">Fuel Type:</span>{" "}
                      {booking?.fueltype || "N/A"}
                    </div>
                    <div>
                      <Label className="font-medium">Kms Out:</Label>
                      <div className="mt-1 px-3 py-2 border rounded-md bg-muted text-sm">{kmsOut || "N/A"}</div>
                    </div>
                    <div>
                      <Label className="font-medium">Kms In:</Label>
                      <div className="mt-1 px-3 py-2 border rounded-md bg-muted text-sm">{kmsIn || "N/A"}</div>
                    </div>
                    <div>
                      <Label className="font-medium">Fuel Out:</Label>
                      <div className="mt-1 px-3 py-2 border rounded-md bg-muted text-sm">{fuelOut || "N/A"}</div>
                    </div>
                    <div>
                      <Label className="font-medium">Fuel In:</Label>
                      <div className="mt-1 px-3 py-2 border rounded-md bg-muted text-sm">{fuelIn || "N/A"}</div>
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
                              <td className="py-2">{payment.paymenttype || payment.paymentmethod || ""}</td>
                              <td className="py-2">{payment.paysource || payment.paymentdetails || ""}</td>
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
              {allAdditionalDrivers.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Additional Driver(s)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {allAdditionalDrivers.map((driver, idx) => (
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
                  <div className="text-xs text-muted-foreground space-y-3 max-h-96 overflow-y-auto pr-2">
                    <p className="font-semibold text-foreground">
                      SUBJECT TO FOLLOWING TERMS AND CONDITIONS
                    </p>
                    <p>
                      Subject to the terms & conditions contained on the front and reverse hereof of which the hirer(s) acknowledges that they are aware, the hirer agrees to rent the above vehicle and elects to pay all amounts payable under this agreement by the method of payment of which details are given on this document. By signing this contract, you hereby agree to these terms and authorise Kanthawala Ltd charging your credit card for the rental, the bond and any additional costs incurred.
                    </p>

                    <p><strong>1. ACCIDENTS</strong></p>
                    <p>Any accident must be reported within twenty four(24) hours and must be accompanied by a police report. Should the hirer(s) fail to comply with any conditions of this contract, all losses and damages suffered by the owner arising out of such failure shall be borne by and paid for by the hirer(s).</p>

                    <p><strong>2. TRAFFIC INFRINGEMENTS</strong></p>
                    <p>The Hirer(s) accept responsibility for all traffic violations infringements, including parking, speeding and lane violations and impound fees incurred during the rental. A $35 administration fee will apply for any fines received.</p>

                    <p><strong>3. HIRER(S) RESPONSIBILITY</strong></p>
                    <p>Maintaining water and oil levels is the hirer(s) responsibility. Any approved cost incurred will be reimbursed upon production of a receipt. Should any malfunction of the vehicle occur, any warning light or any sign of overheating, you must stop the vehicle immediately and contact James Blond or you will be held liable and loss of bond may occur.</p>
                    <p>Vehicles are provided with a full tank of fuel, and must be returned with full tank of fuel. If not, hirer is liable for Fuel cost plus $50.00 fee.</p>
                    <p>Vehicles are provided in a clean and tidy manner and should be returned in a similar state otherwise a cleaning fee of $200.00 will apply.</p>
                    <p>The hirer accepts that SMOKING and/or transporting ANIMALS in the vehicle is strictly PROHIBITED. Doing so will incur a strict $200.00 Fine.</p>

                    <p><strong>4. LATE RETURNS</strong></p>
                    <p>Will be charged for at the rate at $20.00 per hour for up to 3 hours late, after which full 24 hours rental will be charged, including the insurance fee. A non-compliance fee of $200 will be charged if returned late without prior approval of James Blond Rentals.</p>

                    <p><strong>5. PERSONS WHO MAY DRIVE VEHICLE</strong></p>
                    <p>The vehicle may be driven during the period of hire only by the persons described in this agreement and only if such person holds a current driver's license appropriate for the vehicle at the time when they are driving the vehicle. Non-compliance will result in a $200 fine.</p>

                    <p><strong>6. PAYMENTS BY HIRER</strong></p>
                    <p>The hirer shall pay to the owner as payment for the hire of the vehicle, accessories, insurance upgrade options, and any extra charges incurred for the period of hire the sum as specified in this agreement. In addition the hirer shall pay to the owner on termination of the hiring a distance charge at the rate referred to in this agreement. The total distance that the hirer may run the vehicle during the period of hire shall not exceed the number of kilometres specified in this agreement. The hirer shall also pay for fuel (but not oil) used in the vehicle during the period of hire.</p>

                    <p><strong>7. INSURANCE</strong></p>
                    <p>The hirer shall ensure that all reasonable care is taken in handling and parking the vehicle, and that it is left securely locked when not in use. The insurance excess will be determined by the insurance option taken by the customer prior to checkout.</p>

                    <p><strong>8. INDEMNITY</strong></p>
                    <p>Subject to the exclusions set out below, the hirer and any driver authorised to drive the vehicle is:</p>
                    <p className="pl-4">(a) fully indemnified in respect of any liability he/she might have to the owner in respect of loss or of damage to the vehicle and any consequential loss of revenue or other expenses of the owner including towing and salvage costs associated with the recovery of the vehicle and its accessories and spare parts.</p>
                    <p className="pl-4">(b) indemnified to the extent of $NZ250,000 in respect of any liability he/she might have for damage to any property (including injury to any animal) belonging to any other 3rd party person and arising out of the use of the vehicle.</p>

                    <p><strong>9. EXCLUSIONS</strong></p>
                    <p>The indemnities referred to above shall not apply where the damage, injury or loss arises when:</p>
                    <p className="pl-4">(a) The driver of the vehicle is under the influence of alcohol, or any drug which affects his/her ability to drive the vehicle;</p>
                    <p className="pl-4">(b) The vehicle is in an unsafe or un-roadworthy condition that arose during the course of the hire and that caused or contributed to the damage or loss, and the hirer or the driver was aware or ought to have been aware of the unsafe or un-roadworthy condition of the vehicle;</p>
                    <p className="pl-4">(c) The vehicle is operated in any race, speed test, rally or contest;</p>
                    <p className="pl-4">(d) Any damage caused to the vehicle above the height of the windscreen or third party damage to property caused by the vehicle above this height is excluded from our cover and will be the responsibility of the hirer;</p>
                    <p className="pl-4">(e) The vehicle is driven by any person who at the time when he/she drives the vehicle is disqualified from holding or has never held a driver's license appropriate for that vehicle;</p>
                    <p className="pl-4">(f) The vehicle is damaged due to driver abuse or negligence, or is wilfully or recklessly damaged by the hirer or any other person named in this agreement, or driving the vehicle under the authority of the hirer, or is lost as a result of the wilful or reckless behaviour of the hirer or any such person; This includes but is not limited to burnt out clutch, overloading, incorrect fuel etc;</p>
                    <p className="pl-4">(g) The vehicle is operated on any of the following roads: Skipper's Canyon Queenstown; Ball Hut Access Mt Cook; Crown Range Queenstown; unsealed section of SH1 far north beyond Waitiki Landing; all beaches and off-road unsealed areas;</p>
                    <p className="pl-4">(h) The vehicle is operated outside the term of hire or any agreed extension of that term.</p>
                    <p className="pl-4">(i) Any insurance claim received by any other party after the termination of the hire where the hirer has not advised the company will be deemed to be a claim against the hirer.</p>
                    <p>It is agreed between the owner and hirer that Section 11 of the Insurance Law Reform Act 1977 shall apply with respect to the above exclusions as if this clause constituted a contract of insurance.</p>

                    <p><strong>10. OWNERS OBLIGATIONS</strong></p>
                    <p>The owner shall supply the vehicle in a safe & roadworthy condition & shall be responsible for all ordinary costs of running the vehicle during the term of the hire except to the extent that by the terms of this agreement those costs are payable by the hirer.</p>

                    <p><strong>11. MECHANICAL REPAIRS & ACCIDENTS</strong></p>
                    <p>If the vehicle is damaged or requires repair or salvage, because of an accident or breakdown, the hirer shall advise the owner of the full circumstances by telephone or email as soon as possible but no later than 24 hours after the accident.</p>

                    <p><strong>12. REPAIRS/SALVAGE</strong></p>
                    <p>The hirer shall not arrange or undertake any repairs or salvage without the authority of the owner except to the extent to the extent that the repairs or salvage are necessary to prevent further damage to the vehicle or to other property.</p>

                    <p><strong>13. TAMPERING</strong></p>
                    <p>The hirer shall ensure that no person shall interfere with the distance recorder or speedometer or, except in an emergency, any part of the engine, transmission, braking, electrical or suspension systems of the vehicle.</p>

                    <p><strong>14. PUNCTURES, TYRE DAMAGE, GLASS, LENSES & HEADLIGHT DAMAGE</strong></p>
                    <p>Are at the hirer's expense unless they have upgraded to an insurance option providing extra cover for this.</p>

                    <p><strong>15. USE OF THE VEHICLE</strong></p>
                    <p>The hirer shall not:</p>
                    <p className="pl-4">(a) use or permit the vehicle to be used for the carriage of passengers for hire or reward unless the vehicle is hired with the knowledge of the owner for use in passenger service licensed under part VII of the Transport Act 1962 or exempted from licensing under that Act.</p>
                    <p className="pl-4">(b) sublet or hire the vehicle to any other person nor permit the vehicle to be operated outside his/her authority;</p>
                    <p className="pl-4">(c) operate the vehicle, or permit it to be operated or driven.</p>

                    <p><strong>16. RETURN OF THE VEHICLE</strong></p>
                    <p className="pl-4">(a) The hirer shall, at or before the expiry of the term of hire, deliver the vehicle to the owner's place of business or the owner's agent at the agent's place of business, or obtain the owner's consent to the continuation of hire.</p>
                    <p className="pl-4">(b) Where a vehicle remains overdue and no contact has been made by the hirer and outstanding rental payments are due, James Blond Ltd will consider the vehicle as stolen and will take appropriate measures to recover their vehicle passing all associated costs to the hirer.</p>

                    <p><strong>17. IMMEDIATE RETURN OF VEHICLE WHERE DEFAULT OR DAMAGE</strong></p>
                    <p>The owner shall have the right to terminate the hiring and take immediate possession of the vehicle if the hirer fails to comply with any of the terms of this agreement or if the vehicle is damaged. The termination of the hiring under the authority of this clause shall be without prejudice to the other rights of the owner and the rights of the hirer under this agreement or otherwise.</p>

                    <p><strong>18. CANCELLATION FEES</strong></p>
                    <p>Under any circumstances, a minimum Cancellation fee of $50.00 will apply. A cancellation fee of 1 days hireage at the total daily rate will be incurred if the rental is cancelled 24-72 hours prior to pick up, and a fee of either $150 or 50% of the total rental whichever is the greater will be incurred in the event of cancellation within 24 hrs or if you fail to collect the car.</p>

                    <p><strong>19. DAMAGE REPAIRS/REMEDIATION</strong></p>
                    <p>The owner will arrange for any repairs at his discretion with a repair agent/provider of his choosing.</p>

                    <Separator className="my-3" />

                    <p className="font-semibold text-foreground">NOTE TO THE HIRER</p>
                    <p>The owner must give you at least one copy of this agreement. A copy must be kept in the vehicle throughout the term of the hire and produced on demand by any Police Officer, Traffic Officer or any other authorised employee of the Land Safety Transport Authority. Vehicle may be fitted and monitored with GPS Tracking Technology.</p>
                    <p>Please note that unless prior credit terms have been agreed and approved by James Blond Ltd, then your account is required to remain in credit at all times. When you return our vehicle, any shortfall is payable immediately upon return of the vehicle. Should you be unable to pay we will send the matter for immediate collection, holding you liable for all other costs that may be incurred in the pursuit of your debt. This may include, but is not limited to, additional collection agents' fees, legal costs and any court costs that we may incur in the pursuit of outstanding rental.</p>
                  </div>
                </CardContent>
              </Card>

              {/* Signatures */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Signatures</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {alreadySigned ? (
                    <>
                      <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-md">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <div>
                          <p className="font-medium text-green-800">This agreement has been signed</p>
                          {signedAt && (
                            <p className="text-xs text-green-600">
                              Signed on: {new Date(signedAt).toLocaleString("en-NZ")}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Show existing hirer signature */}
                      <div>
                        <Label className="font-medium mb-2 block">
                          Signature of Hirer — {customer?.firstname} {customer?.lastname}
                        </Label>
                        {existingSignature && (
                          <div className="border rounded-md bg-white p-2">
                            <img src={existingSignature} alt="Hirer signature" className="max-h-32" />
                          </div>
                        )}
                      </div>

                      {/* Show existing additional driver signature */}
                      {existingAdditionalSig && (
                        <div>
                          <Label className="font-medium mb-2 block">
                            Signature of Additional Driver
                          </Label>
                          <div className="border rounded-md bg-white p-2">
                            <img src={existingAdditionalSig} alt="Additional driver signature" className="max-h-32" />
                          </div>
                        </div>
                      )}

                      {pdfUrl && (
                        <div className="flex justify-center">
                          <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                            <Button variant="outline" size="lg">
                              <Download className="h-4 w-4 mr-2" />
                              Download Signed Agreement (PDF)
                            </Button>
                          </a>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
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
                      {allAdditionalDrivers.length > 0 && (
                        <div>
                          <Label className="font-medium mb-2 block">
                            Signature of Additional Driver — {allAdditionalDrivers[0]?.firstname} {allAdditionalDrivers[0]?.lastname}
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
                    </>
                  )}
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
