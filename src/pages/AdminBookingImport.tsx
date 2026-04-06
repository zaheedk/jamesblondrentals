import { useState, useRef, useCallback } from "react";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Upload, FileText, CheckCircle2, XCircle, Loader2, AlertTriangle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface ParsedBooking {
  reservation_reference: string | null;
  booking_reference: string | null;
  booking_status: string;
  vehicle_category: string | null;
  vehicle_name: string | null;
  vehicle_type: string | null;
  vehicle_rego: string | null;
  car_id: string | null;
  brand: string | null;
  transmission: string | null;
  pickup_location_name: string | null;
  pickup_date: string;
  pickup_time: string;
  dropoff_location_name: string | null;
  dropoff_date: string;
  dropoff_time: string;
  customer_first_name: string | null;
  customer_last_name: string | null;
  customer_email: string | null;
  customer_phone: string | null;
  customer_address: string | null;
  customer_license_number: string | null;
  customer_age: number | null;
  total_days: number;
  daily_rate: number | null;
  total_amount: number | null;
  payment_status: string;
  // New fields
  converted_from: string | null;
  booking_type: string | null;
  date_booked: string | null;
  date_closed: string | null;
  booked_by: string | null;
  hired_by: string | null;
  youngest_driver: number | null;
  no_travelling: number | null;
  source: string | null;
  agency: string | null;
  agency_branch: string | null;
  agent_name: string | null;
  agent_email: string | null;
  referrals: string | null;
  referral_name: string | null;
  reference_no: string | null;
  rcm_customer_id: string | null;
  company_name: string | null;
  customer_dob: string | null;
  license_issued: string | null;
  license_exp_date: string | null;
  occupation: string | null;
  customer_suburb: string | null;
  customer_state: string | null;
  customer_postcode: string | null;
  customer_country: string | null;
  local_address: string | null;
  customer_mobile: string | null;
  customer_fax: string | null;
  mailing_list: string | null;
  extra_fee_1: string | null;
  extra_fee_1_value: number | null;
  extra_fee_2: string | null;
  extra_fee_2_value: number | null;
  extra_fee_3: string | null;
  extra_fee_3_value: number | null;
  extra_fee_4: string | null;
  extra_fee_4_value: number | null;
  extra_fee_5: string | null;
  extra_fee_5_value: number | null;
  extra_fee_6: string | null;
  extra_fee_6_value: number | null;
  extra_fee_7: string | null;
  extra_fee_7_value: number | null;
  extra_fee_8: string | null;
  extra_fee_8_value: number | null;
  extra_fee_9: string | null;
  extra_fee_9_value: number | null;
  extra_fee_10: string | null;
  extra_fee_10_value: number | null;
  state_tax: number | null;
  sales_tax: number | null;
  booking_total: number | null;
  agent_commission: number | null;
  agent_collected: number | null;
  insurance_fee: number | null;
  total_extra_inc_insurance: number | null;
  rcm_ref_no: string | null;
  kms_out: string | null;
  kms_in: string | null;
  fuel_out: string | null;
  fuel_in: string | null;
  vehicle_total: number | null;
  payment_method: string | null;
}

function parseDate(d: string): string | null {
  if (!d?.trim()) return null;
  const months: Record<string, string> = {
    Jan: "01", Feb: "02", Mar: "03", Apr: "04", May: "05", Jun: "06",
    Jul: "07", Aug: "08", Sep: "09", Oct: "10", Nov: "11", Dec: "12",
  };
  const m1 = d.trim().match(/^(\d{1,2})\/([A-Za-z]{3})\/(\d{4})$/);
  if (m1) {
    const mo = months[m1[2]];
    if (mo) return `${m1[3]}-${mo}-${m1[1].padStart(2, "0")}`;
  }
  const m2 = d.trim().match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (m2) return `${m2[3]}-${m2[2].padStart(2, "0")}-${m2[1].padStart(2, "0")}`;
  return null;
}

function parseDateTime(d: string): string | null {
  const dateStr = parseDate(d);
  if (!dateStr) return null;
  return dateStr + "T00:00:00Z";
}

function parseTime(t: string): string | null {
  const v = t?.trim();
  if (!v) return null;
  if (/^\d{1,2}:\d{2}$/.test(v)) return v + ":00";
  return v;
}

function parseNum(v: string): number | null {
  if (!v?.trim()) return null;
  const n = parseFloat(v.trim().replace(/,/g, ""));
  return isNaN(n) ? null : n;
}

function parseInt2(v: string): number | null {
  const n = parseNum(v);
  return n !== null ? Math.floor(n) : null;
}

function str(v: string | undefined): string | null {
  const s = v?.trim().replace(/^#/, "");
  return s || null;
}

function mapStatus(s: string): string {
  const lower = (s || "").trim().toLowerCase();
  if (["returned", "closed"].includes(lower)) return "completed";
  if (["confirmed", "open"].includes(lower)) return "confirmed";
  if (["cancelled", "canceled"].includes(lower)) return "cancelled";
  return lower || "confirmed";
}

function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (i + 1 < text.length && text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ",") {
        current.push(field);
        field = "";
      } else if (ch === "\n" || ch === "\r") {
        if (ch === "\r" && i + 1 < text.length && text[i + 1] === "\n") i++;
        current.push(field);
        field = "";
        if (current.some((c) => c.trim())) rows.push(current);
        current = [];
      } else {
        field += ch;
      }
    }
  }
  current.push(field);
  if (current.some((c) => c.trim())) rows.push(current);
  return rows;
}

function makeUniqueHeaders(raw: string[]): string[] {
  const seen: Record<string, number> = {};
  return raw.map((h) => {
    const key = h.trim();
    if (key in seen) {
      seen[key]++;
      return `${key}_${seen[key]}`;
    }
    seen[key] = 0;
    return key;
  });
}

const AdminBookingImport = () => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [parsed, setParsed] = useState<ParsedBooking[]>([]);
  const [skipped, setSkipped] = useState(0);
  const [importing, setImporting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<{ inserted: number; errors: number; duplicates: number } | null>(null);
  const [errorMessages, setErrorMessages] = useState<string[]>([]);

  const handleFileSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setFile(f);
    setParsed([]);
    setResults(null);
    setErrorMessages([]);

    const text = await f.text();
    const rows = parseCSV(text);
    if (rows.length < 2) {
      toast.error("CSV file appears empty");
      return;
    }

    const headers = makeUniqueHeaders(rows[0]);
    const dataRows = rows.slice(1);
    const records: ParsedBooking[] = [];
    let skipCount = 0;

    for (const row of dataRows) {
      const r: Record<string, string> = {};
      headers.forEach((h, i) => (r[h] = row[i] || ""));

      const pickupDate = parseDate(r["Date"] || "");
      const dropoffDate = parseDate(r["Date_1"] || "");
      const pickupTime = parseTime(r["Time"] || "");
      const dropoffTime = parseTime(r["Time_1"] || "");

      if (!pickupDate || !dropoffDate || !pickupTime || !dropoffTime) {
        skipCount++;
        continue;
      }

      const totalDays = parseInt2(r["Days"] || "") || 1;
      const status = mapStatus(r["Status"] || "");

      records.push({
        reservation_reference: str(r["Res"]),
        booking_reference: str(r["Res"]),
        booking_status: status,
        vehicle_category: str(r["Category"]),
        vehicle_name: str(r["Model"]),
        vehicle_type: str(r["Category"]),
        vehicle_rego: str(r["Rego#"]),
        car_id: str(r["CarID"]),
        brand: str(r["Brand"]),
        transmission: str(r["Transmission"]),
        pickup_location_name: str(r["Pickup"]),
        pickup_date: pickupDate,
        pickup_time: pickupTime,
        dropoff_location_name: str(r["Dropoff"]),
        dropoff_date: dropoffDate,
        dropoff_time: dropoffTime,
        customer_first_name: str(r["FirstName"]),
        customer_last_name: str(r["LastName"]),
        customer_email: str(r["Email"]),
        customer_phone: str(r["Phone"]),
        customer_address: str(r["Address"]),
        customer_license_number: str(r["Licence#"]),
        customer_age: parseInt2(r["Age"] || ""),
        total_days: totalDays,
        daily_rate: parseNum(r["DailyRates"] || ""),
        total_amount: parseNum(r["BookingTotal"] || ""),
        payment_status: status === "completed" ? "paid" : "pending",
        // New fields
        converted_from: str(r["ConvertedFrom"]),
        booking_type: str(r["Type"]),
        date_booked: parseDateTime(r["DateBooked"] || ""),
        date_closed: parseDateTime(r["DateClosed"] || ""),
        booked_by: str(r["Bookedby"]),
        hired_by: str(r["Hiredby"]),
        youngest_driver: parseInt2(r["YoungestDriver"] || ""),
        no_travelling: parseInt2(r["No.Travelling"] || ""),
        source: str(r["Source"]),
        agency: str(r["Agency"]),
        agency_branch: str(r["AgencyBranch"]),
        agent_name: str(r["Agent"]),
        agent_email: str(r["AgentEmail"]),
        referrals: str(r["Referrals"]),
        referral_name: str(r["ReferralName"]),
        reference_no: str(r["ReferenceNo"]),
        rcm_customer_id: str(r["CustomerID"]),
        company_name: str(r["CompanyName"]),
        customer_dob: parseDate(r["DOB"] || ""),
        license_issued: str(r["Issued"]),
        license_exp_date: parseDate(r["ExpDate"] || ""),
        occupation: str(r["Occupation"]),
        customer_suburb: str(r["Suburb/Town"]),
        customer_state: str(r["State"]),
        customer_postcode: str(r["PostCode"]),
        customer_country: str(r["Country"]),
        local_address: str(r["LocalAddress"]),
        customer_mobile: str(r["Mobile"]),
        customer_fax: str(r["Fax"]),
        mailing_list: str(r["MailingList"]),
        extra_fee_1: str(r["ExtraFee1"]),
        extra_fee_1_value: parseNum(r["ExtraFee1Value"] || ""),
        extra_fee_2: str(r["ExtraFee2"]),
        extra_fee_2_value: parseNum(r["ExtraFee2Value"] || ""),
        extra_fee_3: str(r["ExtraFee3"]),
        extra_fee_3_value: parseNum(r["ExtraFee3Value"] || ""),
        extra_fee_4: str(r["ExtraFee4"]),
        extra_fee_4_value: parseNum(r["ExtraFee4Value"] || ""),
        extra_fee_5: str(r["ExtraFee5"]),
        extra_fee_5_value: parseNum(r["ExtraFee5Value"] || ""),
        extra_fee_6: str(r["ExtraFee6"]),
        extra_fee_6_value: parseNum(r["ExtraFee6Value"] || ""),
        extra_fee_7: str(r["ExtraFee7"]),
        extra_fee_7_value: parseNum(r["ExtraFee7Value"] || ""),
        extra_fee_8: str(r["ExtraFee8"]),
        extra_fee_8_value: parseNum(r["ExtraFee8Value"] || ""),
        extra_fee_9: str(r["ExtraFee9"]),
        extra_fee_9_value: parseNum(r["ExtraFee9Value"] || ""),
        extra_fee_10: str(r["ExtraFee10"]),
        extra_fee_10_value: parseNum(r["ExtraFee10Value"] || ""),
        state_tax: parseNum(r["StateTax"] || ""),
        sales_tax: parseNum(r["SalesTax"] || ""),
        booking_total: parseNum(r["BookingTotal"] || ""),
        agent_commission: parseNum(r["AgentCommission"] || ""),
        agent_collected: parseNum(r["AgentCollected"] || ""),
        insurance_fee: parseNum(r["Insurace"] || ""),
        total_extra_inc_insurance: parseNum(r["TotalExtra(inc ins.)"] || ""),
        rcm_ref_no: str(r["RcmRefNo"]),
        kms_out: str(r["KmsOut"]),
        kms_in: str(r["KmsIn"]),
        fuel_out: str(r["FuelOut"]),
        fuel_in: str(r["FuelIn"]),
        vehicle_total: parseNum(r["TotalRates"] || ""),
        payment_method: str(r["PaymentType"]),
      });
    }
    setParsed(records);
    setSkipped(skipCount);
    toast.success(`Parsed ${records.length} bookings (${skipCount} skipped)`);
  }, []);

  const handleImport = useCallback(async () => {
    if (parsed.length === 0) return;
    setImporting(true);
    setProgress(0);
    setResults(null);
    setErrorMessages([]);

    // Fetch existing refs to detect duplicates
    let existingRefs = new Set<string>();
    try {
      // Fetch in pages of 1000
      let page = 0;
      let hasMore = true;
      while (hasMore) {
        const { data } = await supabase
          .from("bookings")
          .select("reservation_reference,booking_reference")
          .range(page * 1000, (page + 1) * 1000 - 1);
        if (data && data.length > 0) {
          for (const row of data) {
            if (row.reservation_reference) existingRefs.add(row.reservation_reference);
            if (row.booking_reference) existingRefs.add(row.booking_reference);
          }
          if (data.length < 1000) hasMore = false;
          page++;
        } else {
          hasMore = false;
        }
      }
    } catch {
      // Continue anyway
    }

    let inserted = 0;
    let errors = 0;
    let duplicates = 0;
    const errs: string[] = [];
    const BATCH = 50;

    // Filter out duplicates
    const toInsert = parsed.filter((rec) => {
      if (rec.reservation_reference && existingRefs.has(rec.reservation_reference)) {
        duplicates++;
        return false;
      }
      if (rec.booking_reference && existingRefs.has(rec.booking_reference)) {
        duplicates++;
        return false;
      }
      return true;
    });

    for (let i = 0; i < toInsert.length; i += BATCH) {
      const batch = toInsert.slice(i, i + BATCH);
      const { error } = await supabase.from("bookings").insert(batch as any);

      if (error) {
        // Try one by one
        for (const rec of batch) {
          const { error: singleErr } = await supabase.from("bookings").insert(rec as any);
          if (singleErr) {
            errors++;
            if (errs.length < 10) errs.push(`${rec.reservation_reference}: ${singleErr.message}`);
          } else {
            inserted++;
          }
        }
      } else {
        inserted += batch.length;
      }

      setProgress(Math.round(((i + batch.length) / toInsert.length) * 100));
    }

    setResults({ inserted, errors, duplicates });
    setErrorMessages(errs);
    setImporting(false);

    if (inserted > 0) {
      toast.success(`Successfully imported ${inserted} bookings`);
    }
    if (errors > 0) {
      toast.error(`${errors} records failed to import`);
    }
  }, [parsed]);

  return (
    <>
      <Helmet>
        <title>Import Bookings | Admin | James Blond</title>
      </Helmet>

      <div className="min-h-screen bg-muted/30 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <h1 className="text-3xl font-bold text-foreground">Import Bookings from CSV</h1>
          <p className="text-muted-foreground">
            Upload an RCM booking export CSV file to import bookings into the database.
          </p>

          {/* File Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Select CSV File
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                ref={fileRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              <div
                onClick={() => fileRef.current?.click()}
                className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center cursor-pointer hover:border-primary/50 transition-colors"
              >
                <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-3" />
                {file ? (
                  <div>
                    <p className="font-medium text-foreground">{file.name}</p>
                    <p className="text-sm text-muted-foreground">{(file.size / 1024).toFixed(1)} KB</p>
                  </div>
                ) : (
                  <p className="text-muted-foreground">Click to select a CSV file</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Parse Results */}
          {parsed.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Parsed Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <Badge variant="default" className="text-sm px-3 py-1">
                    {parsed.length} bookings ready
                  </Badge>
                  {skipped > 0 && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {skipped} skipped (invalid dates)
                    </Badge>
                  )}
                </div>

                {/* Preview table */}
                <div className="overflow-x-auto max-h-64 overflow-y-auto border rounded-md">
                  <table className="w-full text-xs">
                    <thead className="bg-muted sticky top-0">
                      <tr>
                        <th className="p-2 text-left">Ref</th>
                        <th className="p-2 text-left">Status</th>
                        <th className="p-2 text-left">Vehicle</th>
                        <th className="p-2 text-left">Pickup</th>
                        <th className="p-2 text-left">Customer</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {parsed.slice(0, 20).map((b, i) => (
                        <tr key={i} className="border-t">
                          <td className="p-2 font-mono">{b.reservation_reference}</td>
                          <td className="p-2">{b.booking_status}</td>
                          <td className="p-2">{b.vehicle_name}</td>
                          <td className="p-2">{b.pickup_date}</td>
                          <td className="p-2">{b.customer_last_name}</td>
                          <td className="p-2 text-right">
                            {b.total_amount != null ? `$${b.total_amount.toFixed(2)}` : "-"}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsed.length > 20 && (
                    <p className="text-xs text-muted-foreground p-2 text-center">
                      Showing first 20 of {parsed.length} records...
                    </p>
                  )}
                </div>

                <Button
                  onClick={handleImport}
                  disabled={importing}
                  size="lg"
                  className="w-full"
                >
                  {importing ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Import {parsed.length} Bookings
                    </>
                  )}
                </Button>

                {importing && (
                  <div className="space-y-2">
                    <Progress value={progress} />
                    <p className="text-sm text-muted-foreground text-center">{progress}%</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {results && (
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Import Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex flex-wrap gap-3">
                  {results.inserted > 0 && (
                    <Badge className="bg-green-500 text-sm px-3 py-1">
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      {results.inserted} imported
                    </Badge>
                  )}
                  {results.duplicates > 0 && (
                    <Badge variant="secondary" className="text-sm px-3 py-1">
                      {results.duplicates} duplicates skipped
                    </Badge>
                  )}
                  {results.errors > 0 && (
                    <Badge variant="destructive" className="text-sm px-3 py-1">
                      <XCircle className="h-3 w-3 mr-1" />
                      {results.errors} errors
                    </Badge>
                  )}
                </div>

                {errorMessages.length > 0 && (
                  <div className="bg-destructive/10 rounded-md p-3 text-sm space-y-1">
                    <p className="font-medium text-destructive">Error details:</p>
                    {errorMessages.map((msg, i) => (
                      <p key={i} className="text-destructive/80 text-xs font-mono">{msg}</p>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminBookingImport;
