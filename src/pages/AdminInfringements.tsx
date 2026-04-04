import React, { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Upload,
  FileText,
  Search,
  Download,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Car,
  User,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { rcmApi } from "@/lib/api/rcm-api";
import { generateDeclarationPDF, type DeclarationData } from "@/lib/generate-declaration-pdf";

// Known agencies with postal addresses
const KNOWN_AGENCIES: Record<string, { name: string; address: string }> = {
  auckland_transport: {
    name: "Auckland Transport",
    address: "Private Bag 92260\nAuckland 1142",
  },
  qldc: {
    name: "Queenstown Lakes District Council",
    address: "Private Bag 50072\nQueenstown 9348",
  },
  nzta: {
    name: "NZ Transport Agency",
    address: "PO Box 5550\nPalmerston North 4441",
  },
  smart_compliance: {
    name: "Smart Compliance Management",
    address: "PO Box 12584\nAuckland 1642",
  },
  wellington_cc: {
    name: "Wellington City Council",
    address: "PO Box 2199\nWellington 6140",
  },
  christchurch_cc: {
    name: "Christchurch City Council",
    address: "PO Box 73016\nChristchurch 8154",
  },
};

interface ExtractedData {
  notice_number: string;
  vehicle_registration: string;
  offence_date: string;
  offence_time: string;
  issuing_agency_name: string;
  issuing_agency_address: string;
  offence_description: string;
  fee_amount: string;
  vehicle_make?: string;
  vehicle_type?: string;
  location_of_offence?: string;
}

interface BookingMatch {
  reservationNo: string;
  driverName: string;
  driverAddress: string;
  driverDOB: string;
  driverLicenceNo: string;
  licenceIssuedIn: string;
  driverEmail: string;
  vehicleRego: string;
}

const normalizeReservationNumber = (value: string) =>
  value
    .trim()
    .replace(/^#?[A-Z]+-/, "")
    .replace(/^#/, "");

const COMPANY_NAME = "Kanthawala Ltd";
const COMPANY_ADDRESS = "4004 Great North Road\nGlen Eden\nAuckland";
const DECLARANT_NAME = "Marcelo Furlaneto Faleiro";

const AdminInfringements = () => {
  const [file, setFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedData | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [bookingMatch, setBookingMatch] = useState<BookingMatch | null>(null);
  const [manualReservationNo, setManualReservationNo] = useState("");
  const [manualLastName, setManualLastName] = useState("");

  // Editable fields for the declaration
  const [agencyName, setAgencyName] = useState("");
  const [agencyAddress, setAgencyAddress] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected && selected.type === "application/pdf") {
      setFile(selected);
      setExtractedData(null);
      setBookingMatch(null);
    } else {
      toast.error("Please select a PDF file");
    }
  };

  const convertPdfToImage = async (pdfFile: File): Promise<string> => {
    // Use PDF.js to render the first page to a canvas
    const pdfjsLib = await import("pdfjs-dist");
    pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
      'pdfjs-dist/build/pdf.worker.min.mjs',
      import.meta.url
    ).toString();
    
    const arrayBuffer = await pdfFile.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const page = await pdf.getPage(1);
    
    const scale = 2.0;
    const viewport = page.getViewport({ scale });
    const canvas = document.createElement("canvas");
    canvas.width = viewport.width;
    canvas.height = viewport.height;
    const ctx = canvas.getContext("2d")!;
    
    await page.render({ canvasContext: ctx, viewport, canvas } as any).promise;
    
    // Convert to base64 JPEG
    const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
    return dataUrl.split(",")[1]; // Return just the base64 part
  };

  const extractInfringement = async () => {
    if (!file) return;
    setIsExtracting(true);
    try {
      const imageBase64 = await convertPdfToImage(file);
      
      const { data, error } = await supabase.functions.invoke("process-infringement", {
        body: { imageBase64 },
      });

      if (error) throw error;
      if (data?.error) throw new Error(data.error);

      const extracted = data.data as ExtractedData;
      setExtractedData(extracted);

      // Set agency fields from extraction
      setAgencyName(extracted.issuing_agency_name || "");
      setAgencyAddress(extracted.issuing_agency_address || "");

      // Check if extracted agency matches a known one
      const matchedAgency = Object.values(KNOWN_AGENCIES).find(
        (a) =>
          extracted.issuing_agency_name
            ?.toLowerCase()
            .includes(a.name.toLowerCase().split(" ")[0])
      );
      if (matchedAgency) {
        setAgencyName(matchedAgency.name);
        setAgencyAddress(matchedAgency.address);
      }

      toast.success("Infringement details extracted successfully");
      
      // Auto-match booking (don't await - let it run after extraction completes)
      setTimeout(() => autoMatchBooking(extracted), 100);
    } catch (err) {
      console.error("Extraction error:", err);
      toast.error(
        err instanceof Error ? err.message : "Failed to extract infringement details"
      );
    } finally {
      setIsExtracting(false);
    }
  };

  const autoMatchBooking = useCallback(async (data: ExtractedData) => {
    setIsSearching(true);
    try {
      const rego = data.vehicle_registration?.trim().toUpperCase();
      if (!rego) {
        toast.error("No vehicle registration extracted");
        return;
      }

      let offenceDateISO = "";
      if (data.offence_date) {
        const parts = data.offence_date.split("/");
        if (parts.length === 3) {
          offenceDateISO = `${parts[2]}-${parts[1]}-${parts[0]}`;
        }
      }

      const bookingColumns = [
        "id",
        "booking_reference",
        "reservation_reference",
        "pickup_date",
        "dropoff_date",
        "customer_first_name",
        "customer_last_name",
        "customer_email",
        "customer_address",
        "customer_license_number",
        "booking_data",
        "vehicle_rego",
      ].join(",");

      const applyRcmMatch = async (reservationRef: string, matchedRego = rego) => {
        const response = await rcmApi.request<any>("POST", "bookinginfo", {
          method: "bookinginfo",
          reservationref: reservationRef,
        });

        const bookingInfo = response?.results?.bookinginfo?.[0] as Record<string, any> | undefined;
        const customerInfo = response?.results?.customerinfo?.[0] as Record<string, any> | undefined;

        if (!bookingInfo && !customerInfo) {
          return false;
        }

        setBookingMatch({
          reservationNo: normalizeReservationNumber(
            String(
              bookingInfo?.reservationno ||
                bookingInfo?.reservationdocumentno ||
                response?.results?.reservationno ||
                ""
            )
          ),
          driverName: `${customerInfo?.firstname || bookingInfo?.firstname || ""} ${customerInfo?.lastname || bookingInfo?.lastname || ""}`.trim(),
          driverAddress: [
            customerInfo?.address || bookingInfo?.address || "",
            customerInfo?.city || bookingInfo?.city || "",
            customerInfo?.postcode || bookingInfo?.postcode || "",
            customerInfo?.country || bookingInfo?.country || "",
          ].filter(Boolean).join(", "),
          driverDOB: String(customerInfo?.dateofbirth || bookingInfo?.dateofbirth || ""),
          driverLicenceNo: String(
            customerInfo?.licenseno ||
              bookingInfo?.licenseno ||
              bookingInfo?.drivinglicenseno ||
              ""
          ),
          licenceIssuedIn: String(
            customerInfo?.licenseissued ||
              bookingInfo?.licensecountry ||
              bookingInfo?.drivinglicensecountry ||
              "New Zealand"
          ),
          driverEmail: String(customerInfo?.email || bookingInfo?.email || ""),
          vehicleRego: String(
            bookingInfo?.vehicle_registrationnumber || bookingInfo?.registrationnumber || matchedRego
          ),
        });

        toast.success("Booking auto-matched from rental agreement");
        return true;
      };

      const applyBookingMatch = async (b: Record<string, any>, matchedRego = rego) => {
        // Try to get customer info from booking_data JSONB first
        const bookingInfoArr = Array.isArray(b.booking_data?.bookinginfo) ? b.booking_data.bookinginfo : [];
        const bookingInfo = bookingInfoArr[0] as Record<string, any> | undefined;
        const customerInfoArr = Array.isArray(b.booking_data?.customerinfo) ? b.booking_data.customerinfo : [];
        const customerInfo = customerInfoArr[0] as Record<string, any> | undefined;

        const firstName = b.customer_first_name || customerInfo?.firstname || bookingInfo?.firstname || "";
        const lastName = b.customer_last_name || customerInfo?.lastname || bookingInfo?.lastname || "";

        // If we have no customer name from DB at all, try RCM API with the long ref
        if (!firstName && !lastName && b.booking_reference) {
          const rcmMatched = await applyRcmMatch(b.booking_reference, matchedRego);
          if (rcmMatched) return;
        }

        let customerData: Record<string, any> | null = null;
        const email = b.customer_email || customerInfo?.email || bookingInfo?.email || "";
        if (email) {
          const { data: customers } = await supabase
            .from("customers")
            .select("*")
            .eq("email", email)
            .limit(1);
          customerData = customers?.[0] || null;
        }

        const driverAddress = customerData
          ? [customerData.address, customerData.suburb, customerData.city, customerData.postcode, customerData.country].filter(Boolean).join(", ")
          : customerInfo
            ? [customerInfo.address, customerInfo.city, customerInfo.postcode, customerInfo.country].filter(Boolean).join(", ")
            : b.customer_address || "";

        setBookingMatch({
          reservationNo: normalizeReservationNumber(
            b.reservation_reference || b.booking_reference || ""
          ),
          driverName: `${firstName} ${lastName}`.trim(),
          driverAddress,
          driverDOB: customerData?.dob || customerInfo?.dateofbirth || "",
          driverLicenceNo: customerData?.license_number || customerInfo?.licenseno || b.customer_license_number || "",
          licenceIssuedIn: customerData?.license_country || customerInfo?.licenseissued || "New Zealand",
          driverEmail: email || customerData?.email || "",
          vehicleRego: b.vehicle_rego || bookingInfo?.vehicle_registrationnumber || matchedRego,
        });
        toast.success("Booking auto-matched from database!");
      };

      const { data: directAgreementMatches } = await supabase
        .from("bookings")
        .select("booking_reference, vehicle_rego, booking_data")
        .ilike("vehicle_rego", `%${rego}%`)
        .limit(20);

      const { data: agreementsForJsonSearch } = await supabase
        .from("bookings")
        .select("booking_reference, vehicle_rego, booking_data")
        .not("booking_reference", "is", null)
        .order("created_at", { ascending: false })
        .limit(500);

      const jsonAgreementMatches = (agreementsForJsonSearch || []).filter((agreement: Record<string, any>) => {
        const storedRego = String(agreement.vehicle_rego || "").trim().toUpperCase();
        const bookingInfo = Array.isArray(agreement.booking_data?.bookinginfo)
          ? agreement.booking_data.bookinginfo[0]
          : null;
        const bookingDataRego = String(
          bookingInfo?.vehicle_registrationnumber || bookingInfo?.vehiclerego || ""
        )
          .trim()
          .toUpperCase();

        return storedRego === rego || bookingDataRego === rego;
      });

      const matchedAgreements = [...(directAgreementMatches || []), ...jsonAgreementMatches] as Record<string, any>[];

      const agreementReservationNumbers = Array.from(
        new Set(
          matchedAgreements.flatMap((agreement) => {
            const bookingInfos = Array.isArray(agreement.booking_data?.bookinginfo)
              ? agreement.booking_data.bookinginfo
              : [];

            return bookingInfos
              .flatMap((info: Record<string, any>) => [
                String(info?.reservationno || "").trim(),
                normalizeReservationNumber(String(info?.reservationdocumentno || "")),
              ])
              .filter(Boolean);
          })
        )
      );

      if (agreementReservationNumbers.length > 0) {
        let bookingsQuery = supabase
          .from("bookings")
          .select(bookingColumns)
          .in("reservation_reference", agreementReservationNumbers);

        if (offenceDateISO) {
          bookingsQuery = bookingsQuery
            .lte("pickup_date", offenceDateISO)
            .gte("dropoff_date", offenceDateISO);
        }

        const { data: matchedBookings } = await bookingsQuery.limit(5);

        const matchedBookingRows = (matchedBookings || []) as Record<string, any>[];
        if (matchedBookingRows.length > 0) {
          const exactRefBooking = matchedBookingRows.find((booking) =>
            agreementReservationNumbers.includes(String(booking.reservation_reference || "").trim())
          );
          if (exactRefBooking) {
            await applyBookingMatch(exactRefBooking);
            return;
          }
        }
      }

      const agreementReservationRefs = Array.from(
        new Set(
          matchedAgreements
            .flatMap((agreement) => {
              const bookingInfos = Array.isArray(agreement.booking_data?.bookinginfo)
                ? agreement.booking_data.bookinginfo
                : [];

              return [
                String(agreement.booking_reference || "").trim(),
                ...bookingInfos.map((info: Record<string, any>) => String(info?.reservationref || "").trim()),
              ];
            })
            .filter(Boolean)
        )
      );

      for (const reservationRef of agreementReservationRefs) {
        const matched = await applyRcmMatch(reservationRef, rego);
        if (matched) {
          return;
        }
      }

      if (offenceDateISO) {
        const { data: dateBookings } = await supabase
          .from("bookings")
          .select(bookingColumns)
          .lte("pickup_date", offenceDateISO)
          .gte("dropoff_date", offenceDateISO)
          .order("pickup_date", { ascending: false })
          .limit(50);

        if (dateBookings && dateBookings.length > 0) {
          toast.info(`Found ${dateBookings.length} booking(s) for that date, but none linked cleanly to rego ${rego}. Please confirm the reservation number below.`);
        } else {
          toast.warning("No bookings found for this vehicle/date. Use manual search below.");
        }
      } else {
        toast.warning("Could not parse offence date. Use manual search below.");
      }
    } catch (err) {
      console.error("Auto-match error:", err);
      toast.error("Auto-match failed. Use manual search below.");
    } finally {
      setIsSearching(false);
    }
  }, []);

  const searchByReservationNo = async () => {
    if (!manualReservationNo.trim()) {
      toast.error("Please enter a reservation number");
      return;
    }
    setIsSearching(true);
    try {
      // Try RCM API first
      let found = false;
      try {
        const response = await rcmApi.getBookingInfoByReservationNo(
          manualReservationNo.trim(),
          manualLastName.trim() || undefined
        );
        const info = response?.results?.bookinginfo?.[0] as Record<string, any> | undefined;
        if (info) {
          const mainDriver = {
            firstName: info.firstname || info.customer_firstname || "",
            lastName: info.lastname || info.customer_lastname || "",
            address: [info.address || info.customer_address || "", info.suburb || info.customer_suburb || "", info.city || info.customer_city || "", info.postcode || info.customer_postcode || "", info.country || info.customer_country || ""].filter(Boolean).join(", "),
            dob: info.dob || info.dateofbirth || info.customer_dob || "",
            licenceNo: info.licensenumber || info.drivinglicenseno || info.customer_license || "",
            licenceCountry: info.licensecountry || info.drivinglicensecountry || "New Zealand",
            email: info.email || info.customer_email || "",
            vehicleRego: info.vehicle_registrationnumber || info.registrationnumber || "",
          };

          setBookingMatch({
            reservationNo: manualReservationNo.trim(),
            driverName: `${mainDriver.firstName} ${mainDriver.lastName}`.trim(),
            driverAddress: mainDriver.address,
            driverDOB: mainDriver.dob,
            driverLicenceNo: mainDriver.licenceNo,
            licenceIssuedIn: mainDriver.licenceCountry,
            driverEmail: mainDriver.email,
            vehicleRego: mainDriver.vehicleRego,
          });
          found = true;
          toast.success("Booking found via RCM API");
        }
      } catch (rcmErr) {
        console.warn("RCM API lookup failed, trying Supabase fallback:", rcmErr);
      }

      // Fallback to Supabase
      if (!found) {
        const { data: bookings } = await supabase
          .from("bookings")
          .select("*")
          .or(`reservation_reference.eq.${manualReservationNo.trim()},booking_reference.eq.${manualReservationNo.trim()}`)
          .limit(1);

        if (bookings && bookings.length > 0) {
          const b = bookings[0];
          let customerData: Record<string, any> | null = null;
          if (b.customer_email) {
            const { data: customers } = await supabase.from("customers").select("*").eq("email", b.customer_email).limit(1);
            customerData = customers?.[0] || null;
          }

          setBookingMatch({
            reservationNo: normalizeReservationNumber(
              b.reservation_reference || b.booking_reference || manualReservationNo
            ),
            driverName: `${b.customer_first_name || ""} ${b.customer_last_name || ""}`.trim(),
            driverAddress: customerData ? [customerData.address, customerData.suburb, customerData.city, customerData.postcode, customerData.country].filter(Boolean).join(", ") : b.customer_address || "",
            driverDOB: customerData?.dob || "",
            driverLicenceNo: customerData?.license_number || b.customer_license_number || "",
            licenceIssuedIn: customerData?.license_country || "New Zealand",
            driverEmail: b.customer_email || customerData?.email || "",
            vehicleRego: "",
          });
          found = true;
          toast.success("Booking found in database");
        }
      }

      if (!found) {
        toast.error("No booking found with that reference");
      }
    } catch (err) {
      console.error("Booking search error:", err);
      toast.error("Failed to search for booking");
    } finally {
      setIsSearching(false);
    }
  };

  const selectKnownAgency = (key: string) => {
    const agency = KNOWN_AGENCIES[key];
    if (agency) {
      setAgencyName(agency.name);
      setAgencyAddress(agency.address);
    }
  };

  const generateDeclaration = () => {
    if (!extractedData || !bookingMatch) {
      toast.error("Please extract infringement and match booking first");
      return;
    }

    const today = new Date();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const declarationDate = `${dayNames[today.getDay()]}, ${monthNames[today.getMonth()]} ${today.getDate()}, ${today.getFullYear()}`;

    const data: DeclarationData = {
      agencyName,
      agencyAddress,
      vehicleRegistration: extractedData.vehicle_registration,
      noticeNumber: extractedData.notice_number,
      offenceDate: `${extractedData.offence_date} ${extractedData.offence_time}`,
      rentalAgreementNumber: bookingMatch.reservationNo,
      driverName: bookingMatch.driverName,
      driverAddress: bookingMatch.driverAddress,
      driverDOB: bookingMatch.driverDOB,
      driverLicenceNo: bookingMatch.driverLicenceNo,
      licenceIssuedIn: bookingMatch.licenceIssuedIn,
      driverEmail: bookingMatch.driverEmail,
      declarantName: DECLARANT_NAME,
      companyName: COMPANY_NAME,
      companyAddress: COMPANY_ADDRESS,
      declarationDate,
    };

    const doc = generateDeclarationPDF(data);
    const filename = `Declaration_${extractedData.notice_number}_${extractedData.vehicle_registration}.pdf`;
    doc.save(filename);
    toast.success(`Declaration downloaded: ${filename}`);
  };

  return (
    <div className="container mx-auto py-6 px-4 max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Infringement Processing</h1>
        <Badge variant="outline">Transfer of Liability</Badge>
      </div>

      {/* Step 1: Upload */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <Upload className="h-5 w-5" />
            Step 1: Upload Infringement Notice
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="flex-1"
            />
            <Button
              onClick={extractInfringement}
              disabled={!file || isExtracting}
              className="shrink-0"
            >
              {isExtracting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Extracting...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Extract Details
                </>
              )}
            </Button>
          </div>
          {file && (
            <p className="text-sm text-muted-foreground">
              Selected: {file.name} ({(file.size / 1024).toFixed(1)} KB)
            </p>
          )}
        </CardContent>
      </Card>

      {/* Step 2: Extracted Details */}
      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <CheckCircle2 className="h-5 w-5 text-primary" />
              Step 2: Extracted Infringement Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-xs text-muted-foreground">Notice Number</Label>
                <p className="font-medium">{extractedData.notice_number}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Vehicle Registration</Label>
                <p className="font-medium">{extractedData.vehicle_registration}</p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Offence Date & Time</Label>
                <p className="font-medium">
                  {extractedData.offence_date} {extractedData.offence_time}
                </p>
              </div>
              <div>
                <Label className="text-xs text-muted-foreground">Fee Amount</Label>
                <p className="font-medium">{extractedData.fee_amount}</p>
              </div>
              <div className="md:col-span-2">
                <Label className="text-xs text-muted-foreground">Offence</Label>
                <p className="font-medium">{extractedData.offence_description}</p>
              </div>
              {extractedData.location_of_offence && (
                <div className="md:col-span-2">
                  <Label className="text-xs text-muted-foreground">Location</Label>
                  <p className="font-medium">{extractedData.location_of_offence}</p>
                </div>
              )}
            </div>

            <Separator />

            {/* Agency selection */}
            <div className="space-y-3">
              <Label className="font-semibold">Issuing Agency (To)</Label>
              <div className="flex flex-wrap gap-2">
                {Object.entries(KNOWN_AGENCIES).map(([key, agency]) => (
                  <Button
                    key={key}
                    variant={agencyName === agency.name ? "default" : "outline"}
                    size="sm"
                    onClick={() => selectKnownAgency(key)}
                  >
                    {agency.name}
                  </Button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label>Agency Name</Label>
                  <Input
                    value={agencyName}
                    onChange={(e) => setAgencyName(e.target.value)}
                    placeholder="Agency name"
                  />
                </div>
                <div>
                  <Label>Agency Address</Label>
                  <Textarea
                    value={agencyAddress}
                    onChange={(e) => setAgencyAddress(e.target.value)}
                    placeholder="Postal address (one line per row)"
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Match Booking */}
      {extractedData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              {isSearching ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : bookingMatch ? (
                <CheckCircle2 className="h-5 w-5 text-primary" />
              ) : (
                <Search className="h-5 w-5" />
              )}
              Step 3: Match Rental Booking
              {isSearching && <span className="text-sm font-normal text-muted-foreground ml-2">Auto-matching...</span>}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-3 bg-muted rounded-md text-sm">
              <p>
                <strong>Vehicle:</strong> {extractedData.vehicle_registration} |{" "}
                <strong>Date:</strong> {extractedData.offence_date}
              </p>
            </div>

            {!bookingMatch && !isSearching && (
              <>
                <p className="text-sm text-muted-foreground">Auto-match didn't find a result. Search manually:</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <div className="flex-1">
                    <Label>Reservation Number</Label>
                    <Input
                      value={manualReservationNo}
                      onChange={(e) => setManualReservationNo(e.target.value)}
                      placeholder="e.g. 28016"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Last Name (optional)</Label>
                    <Input
                      value={manualLastName}
                      onChange={(e) => setManualLastName(e.target.value)}
                      placeholder="For RCM API search"
                    />
                  </div>
                  <Button
                    onClick={searchByReservationNo}
                    disabled={isSearching || !manualReservationNo.trim()}
                    className="self-end shrink-0"
                  >
                    <Search className="mr-2 h-4 w-4" />
                    Search
                  </Button>
                </div>
              </>
            )}

            {bookingMatch && (
              <div className="border rounded-md p-4 space-y-3 bg-accent/50">
                <div className="flex items-center gap-2 text-primary">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="font-semibold">Booking Found</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <EditableField
                    label="Driver Name"
                    value={bookingMatch.driverName}
                    onChange={(v) => setBookingMatch({ ...bookingMatch, driverName: v })}
                  />
                  <EditableField
                    label="Date of Birth"
                    value={bookingMatch.driverDOB}
                    onChange={(v) => setBookingMatch({ ...bookingMatch, driverDOB: v })}
                  />
                  <EditableField
                    label="Address"
                    value={bookingMatch.driverAddress}
                    onChange={(v) => setBookingMatch({ ...bookingMatch, driverAddress: v })}
                    multiline
                  />
                  <EditableField
                    label="Licence Number"
                    value={bookingMatch.driverLicenceNo}
                    onChange={(v) => setBookingMatch({ ...bookingMatch, driverLicenceNo: v })}
                  />
                  <EditableField
                    label="Licence Issued In"
                    value={bookingMatch.licenceIssuedIn}
                    onChange={(v) => setBookingMatch({ ...bookingMatch, licenceIssuedIn: v })}
                  />
                  <EditableField
                    label="Email"
                    value={bookingMatch.driverEmail}
                    onChange={(v) => setBookingMatch({ ...bookingMatch, driverEmail: v })}
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 4: Generate */}
      {extractedData && bookingMatch && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Download className="h-5 w-5" />
              Step 4: Generate Statutory Declaration
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button onClick={generateDeclaration} size="lg" className="w-full">
              <Download className="mr-2 h-5 w-5" />
              Generate & Download Declaration PDF
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

// Helper component for editable fields in booking match
const EditableField = ({
  label,
  value,
  onChange,
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  multiline?: boolean;
}) => (
  <div>
    <Label className="text-xs text-muted-foreground">{label}</Label>
    {multiline ? (
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={2}
        className="text-sm"
      />
    ) : (
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-sm"
      />
    )}
  </div>
);

export default AdminInfringements;
