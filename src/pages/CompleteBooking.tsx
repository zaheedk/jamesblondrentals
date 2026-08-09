import React, { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { toast } from "sonner";
import { Loader2, ShieldCheck, CalendarClock, MapPin, Car, Phone } from "lucide-react";
import PageSEO from "@/components/PageSEO";
import TrustGuaranteeBanner from "@/components/booking/TrustGuaranteeBanner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { rcmApi } from "@/lib/api/rcm-api";
import { saveBookingData } from "@/lib/booking-session";

type QuoteInfo = {
  reservationRef: string;
  reservationNo: string;
  vehicleName: string;
  vehicleCategory: string;
  vehicleImage?: string;
  pickupDate: string;
  pickupTime: string;
  dropoffDate: string;
  dropoffTime: string;
  pickupLocation: string;
  dropoffLocation: string;
  days: number;
  dailyRate: number;
  totalCost: number;
  paidToDate: number;
  balanceDue: number;
  securityBond: number;
  firstName: string;
  lastName: string;
  email: string;
  mandatoryFees: Array<{ name: string; amount: number }>;
};

const DEPOSIT_AMOUNT = 50;

const num = (v: unknown): number => {
  const n = typeof v === "number" ? v : parseFloat(String(v ?? "0").replace(/[^0-9.\-]/g, ""));
  return Number.isFinite(n) ? n : 0;
};

const money = (n: number) =>
  `$${n.toLocaleString("en-NZ", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const CompleteBooking = () => {
  const navigate = useNavigate();
  const params = useParams();
  const [searchParams] = useSearchParams();

  const refFromUrl = params.reference || searchParams.get("ref") || searchParams.get("reservationref") || "";
  const surnameFromUrl = searchParams.get("surname") || searchParams.get("lastname") || "";

  const [reference, setReference] = useState(refFromUrl);
  const [surname, setSurname] = useState(surnameFromUrl);
  const [quote, setQuote] = useState<QuoteInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPaying, setIsPaying] = useState(false);
  const [paymentChoice, setPaymentChoice] = useState<"full" | "deposit">("full");
  const [error, setError] = useState<string | null>(null);

  const lookup = useCallback(async (ref: string, lastName?: string) => {
    if (!ref.trim()) {
      setError("Please enter your quote or reservation reference.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const trimmed = ref.trim();
      const response = trimmed.length > 10
        ? await rcmApi.getBookingInfoByReference(trimmed)
        : await rcmApi.getBookingInfoByReservationNo(trimmed, lastName?.trim() || undefined);

      const info = response.results?.bookinginfo?.[0];
      const customer = response.results?.customerinfo?.[0];

      if (response.status !== "OK" || !info) {
        setQuote(null);
        setError(
          "We couldn't find that quote. Please check the reference from your email, or call us on 0800 525 663 and we'll finish it for you."
        );
        return;
      }

      // Security bond is held on the card at pick up — never charged online
      const bondFee = (response.results?.extrafees as any[] | undefined)?.find(
        (fee: any) => fee?.isbondfee === true
      );
      const securityBond = bondFee ? num(bondFee.fees) : 0;

      const rawTotal = num(info.totalrateafterdiscount) || num(info.totalcost);
      const totalCost = Math.max(rawTotal - securityBond, 0);
      const paidToDate = num(info.payment);
      const balanceDue = Math.max(totalCost - paidToDate, 0);

      setQuote({
        reservationRef: String(info.reservationref || trimmed),
        reservationNo: String(info.reservationno || ""),
        vehicleName:
          [info.vehiclemake, info.vehiclemodel].filter(Boolean).join(" ") ||
          info.vehicledescription1 ||
          info.vehiclecategory ||
          "Your vehicle",
        vehicleCategory: info.vehiclecategory || "",
        vehicleImage: info.vehicleimage || undefined,
        pickupDate: info.pickupdate || "",
        pickupTime: info.pickuptime || "",
        dropoffDate: info.dropoffdate || "",
        dropoffTime: info.dropofftime || "",
        pickupLocation: info.pickuplocationname || info.pickuplocation || "",
        dropoffLocation: info.dropofflocationname || info.dropofflocation || "",
        days: num(info.numberofdays),
        dailyRate: num(info.dailyrate),
        totalCost,
        paidToDate,
        balanceDue,
        securityBond,
        firstName: customer?.firstname || "",
        lastName: customer?.lastname || "",
        email: customer?.email || "",
        mandatoryFees: (info.mandatoryfees || [])
          .map((fee) => ({
            name: fee.name || "Fee",
            amount: num(fee.totalfeeamount ?? fee.amount),
          }))
          .filter((fee) => !/bond/i.test(fee.name)),
      });
    } catch (err) {
      console.error("Quote lookup failed:", err);
      setQuote(null);
      setError(
        "We couldn't load that quote right now. Please try again, or call 0800 525 663 and we'll complete your booking over the phone."
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (refFromUrl) {
      lookup(refFromUrl, surnameFromUrl);
    }
  }, [refFromUrl, surnameFromUrl, lookup]);

  const handlePayNow = () => {
    if (!quote) return;
    setIsPaying(true);
    try {
      const dueNow = quote.balanceDue > 0 ? quote.balanceDue : quote.totalCost;
      const amount = paymentChoice === "deposit" ? Math.min(DEPOSIT_AMOUNT, dueNow) : dueNow;
      saveBookingData({
        vehicleId: quote.reservationRef,
        vehicleName: quote.vehicleName,
        vehicleCategoryTypeId: "",
        pickupLocationId: "",
        pickupLocationName: quote.pickupLocation,
        dropoffLocationId: "",
        dropoffLocationName: quote.dropoffLocation,
        pickupDate: quote.pickupDate,
        pickupTime: quote.pickupTime,
        dropoffDate: quote.dropoffDate,
        dropoffTime: quote.dropoffTime,
        ageId: "",
        basePrice: quote.totalCost,
        vehicleImage: quote.vehicleImage,
        paymentAmount: amount,
        paymentType: paymentChoice,
        reservationRef: quote.reservationRef,
        reservationNo: quote.reservationNo,
        customerFirstName: quote.firstName,
        customerLastName: quote.lastName,
        customerEmail: quote.email,
        numberofdays: quote.days,
        dailyrate: quote.dailyRate,
        totalcost: quote.totalCost,
        payment: quote.paidToDate,
        balancedue: quote.balanceDue,
        totalRateAfterDiscount: quote.totalCost,
        mandatoryFees: quote.mandatoryFees,
      });
      navigate("/payment");
    } catch (err) {
      console.error("Failed to start payment:", err);
      toast.error("We couldn't start the payment. Please try again.");
      setIsPaying(false);
    }
  };

  const dueNow = quote ? (quote.balanceDue > 0 ? quote.balanceDue : quote.totalCost) : 0;
  const amountDueNow = paymentChoice === "deposit" ? Math.min(DEPOSIT_AMOUNT, dueNow) : dueNow;

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO
        title="Complete Your Booking | James Blond Rentals"
        description="Confirm your James Blond Rentals quote and pay securely to lock in your vehicle."
        noindex
      />

      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Complete your booking</h1>
        <p className="text-muted-foreground mb-6">
          Your vehicle isn't reserved until payment is made. Confirm the details below and pay securely
          to lock it in.
        </p>

        <TrustGuaranteeBanner className="mb-6 w-full rounded-lg border" />

        {!quote && (
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Find your quote</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="reference">Quote / reservation reference</Label>
                  <Input
                    id="reference"
                    value={reference}
                    onChange={(e) => setReference(e.target.value)}
                    placeholder="e.g. Q12345 or 12345"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="surname">Surname (optional)</Label>
                  <Input
                    id="surname"
                    value={surname}
                    onChange={(e) => setSurname(e.target.value)}
                    placeholder="As it appears on your quote"
                  />
                </div>
              </div>
              {error && <p className="text-sm text-destructive">{error}</p>}
              <Button onClick={() => lookup(reference, surname)} disabled={isLoading} size="lg">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Looking up your quote
                  </>
                ) : (
                  "Find my quote"
                )}
              </Button>
              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <Phone className="h-4 w-4" /> Prefer to talk? Call 0800 525 663 and we'll finish it for you.
              </p>
            </CardContent>
          </Card>
        )}

        {quote && (
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">
                Quote {quote.reservationNo || quote.reservationRef}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-start gap-3">
                <Car className="h-5 w-5 mt-1 text-muted-foreground" />
                <div>
                  <p className="font-semibold">{quote.vehicleName}</p>
                  {quote.vehicleCategory && (
                    <p className="text-sm text-muted-foreground">{quote.vehicleCategory}</p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-start gap-3">
                  <CalendarClock className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Pick-up</p>
                    <p>{quote.pickupDate} {quote.pickupTime}</p>
                    <p className="text-muted-foreground">{quote.pickupLocation}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-1 text-muted-foreground" />
                  <div className="text-sm">
                    <p className="font-medium">Drop-off</p>
                    <p>{quote.dropoffDate} {quote.dropoffTime}</p>
                    <p className="text-muted-foreground">{quote.dropoffLocation}</p>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                {quote.days > 0 && quote.dailyRate > 0 && (
                  <div className="flex justify-between">
                    <span>
                      {quote.days} day{quote.days === 1 ? "" : "s"} @ {money(quote.dailyRate)} / day
                    </span>
                    <span>{money(quote.days * quote.dailyRate)}</span>
                  </div>
                )}
                {quote.mandatoryFees.map((fee) => (
                  <div key={fee.name} className="flex justify-between">
                    <span>{fee.name}</span>
                    <span>{money(fee.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between font-semibold text-base pt-2">
                  <span>Rental total (excludes security bond)</span>
                  <span>{money(quote.totalCost)}</span>
                </div>
                {quote.paidToDate > 0 && (
                  <div className="flex justify-between">
                    <span>Already paid</span>
                    <span>-{money(quote.paidToDate)}</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground pt-1">
                  A refundable security bond
                  {quote.securityBond > 0 ? ` of ${money(quote.securityBond)}` : " of $200–$300"} is held on
                  your card at pick up — it is not charged online today.
                </p>
              </div>

              <Separator />

              <div className="space-y-3">
                <p className="font-semibold text-sm">Choose how much to pay now</p>
                <button
                  type="button"
                  onClick={() => setPaymentChoice("full")}
                  className={`w-full text-left border rounded-md p-3 flex items-center justify-between ${
                    paymentChoice === "full" ? "border-primary ring-1 ring-primary" : ""
                  }`}
                >
                  <span>
                    <span className="block font-medium">Pay in full</span>
                    <span className="block text-sm text-muted-foreground">
                      Rental total, excluding the security bond
                    </span>
                  </span>
                  <span className="font-bold">{money(dueNow)}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentChoice("deposit")}
                  className={`w-full text-left border rounded-md p-3 flex items-center justify-between ${
                    paymentChoice === "deposit" ? "border-primary ring-1 ring-primary" : ""
                  }`}
                >
                  <span>
                    <span className="block font-medium">Pay a {money(DEPOSIT_AMOUNT)} deposit</span>
                    <span className="block text-sm text-muted-foreground">
                      Non-refundable. Balance of {money(Math.max(dueNow - DEPOSIT_AMOUNT, 0))} due at pick up.
                    </span>
                  </span>
                  <span className="font-bold">{money(Math.min(DEPOSIT_AMOUNT, dueNow))}</span>
                </button>
              </div>

              <Button onClick={handlePayNow} disabled={isPaying} size="lg" className="w-full">
                {isPaying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Opening secure payment
                  </>
                ) : (
                  `Pay ${money(amountDueNow)} & confirm booking`
                )}
              </Button>

              <p className="text-sm text-muted-foreground flex items-center gap-2">
                <ShieldCheck className="h-4 w-4" /> Secure card payment via Windcave. Your booking is
                confirmed the moment payment succeeds.
              </p>

              <button
                type="button"
                className="text-sm underline text-muted-foreground"
                onClick={() => {
                  setQuote(null);
                  setError(null);
                }}
              >
                Look up a different quote
              </button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CompleteBooking;
