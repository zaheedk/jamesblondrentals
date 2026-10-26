import { Link } from "react-router-dom";
import { CreditCard, LockKeyhole, ShieldCheck, Wallet, Check, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatCurrency } from "@/lib/utils";
import cardBrandsImg from "@/assets/payment-cards.svg";
import klarnaImg from "@/assets/klarna-badge.svg";

interface CheckoutChoicesProps {
  total: number;
  bond: number;
  depositAmount: number;
  provider: "windcave" | "airwallex";
  paymentType: "full" | "deposit";
  onProviderChange: (value: "windcave" | "airwallex") => void;
  onPaymentTypeChange: (value: "full" | "deposit") => void;
  acceptedTerms: boolean;
  onAcceptTerms: (value: boolean) => void;
  showConsentError: boolean;
  isLoading: boolean;
  isSavingQuote: boolean;
  onSaveQuote: () => void;
  onSubmit: (event: React.FormEvent) => void;
}

export default function CheckoutChoices(props: CheckoutChoicesProps) {
  const { total, bond, depositAmount, provider, paymentType, acceptedTerms } = props;
  const instalments = provider === "airwallex";
  const amount = instalments || paymentType === "full" ? total : Math.min(depositAmount, total);
  const remaining = Math.max(total - amount, 0);
  const bondLabel = bond > 0 ? `${formatCurrency(bond)} refundable bond at pickup` : "Refundable bond at pickup";

  return (
    <form onSubmit={props.onSubmit} className="space-y-6">
      <section aria-labelledby="payment-method-heading" className="border-t pt-6">
        <h2 id="payment-method-heading" className="text-lg font-semibold tracking-normal mb-3">How would you like to pay?</h2>
        <ToggleGroup type="single" value={provider} onValueChange={(value) => {
          if (value === "windcave" || value === "airwallex") props.onProviderChange(value);
        }} aria-label="Payment method" className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1">
          <ToggleGroupItem value="windcave" className="h-14 gap-2 rounded-md text-sm data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-sm">
            <CreditCard className="h-4 w-4 shrink-0" /> Card
          </ToggleGroupItem>
          <ToggleGroupItem value="airwallex" className="h-14 gap-2 rounded-md text-sm data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-sm">
            <Wallet className="h-4 w-4 shrink-0" /> 4 instalments
          </ToggleGroupItem>
        </ToggleGroup>

        {!instalments ? (
          <div className="mt-4">
            <div className="flex items-center justify-between gap-3 mb-3">
              <p className="text-sm font-medium">Pay by card today</p>
              <img src={cardBrandsImg} alt="Visa and Mastercard" className="h-8 w-auto" />
            </div>
            <ToggleGroup type="single" value={paymentType} onValueChange={(value) => {
              if (value === "full" || value === "deposit") props.onPaymentTypeChange(value);
            }} aria-label="Amount to pay" className="grid gap-2 sm:grid-cols-2">
              <ToggleGroupItem value="full" className="h-auto min-h-20 justify-between gap-3 rounded-lg border p-4 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-foreground">
                <span><span className="block font-semibold">Full rental</span><span className="block text-xs text-muted-foreground mt-1">No rental balance at pickup</span></span>
                <span className="font-semibold shrink-0">{formatCurrency(total)}</span>
              </ToggleGroupItem>
              <ToggleGroupItem value="deposit" className="h-auto min-h-20 justify-between gap-3 rounded-lg border p-4 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-foreground">
                <span><span className="block font-semibold">Deposit only</span><span className="block text-xs text-muted-foreground mt-1">Non-refundable</span></span>
                <span className="font-semibold shrink-0">{formatCurrency(Math.min(depositAmount, total))}</span>
              </ToggleGroupItem>
            </ToggleGroup>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-sm">Split your rental with Klarna</p>
              <img src={klarnaImg} alt="Klarna" className="h-8 w-auto" />
            </div>
            <div className="grid grid-cols-4 gap-2" aria-label="Estimated instalments">
              {["Today", "2nd", "3rd", "4th"].map((label) => (
                <div key={label} className="border-t-2 border-primary/30 pt-2 text-center">
                  <p className="text-xs text-muted-foreground">{label}</p>
                  <p className="text-sm font-semibold mt-1">{formatCurrency(total / 4)}</p>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">Estimated 4 interest-free payments. Subject to Klarna approval; final amounts and schedule are shown at checkout. The pickup bond is separate.</p>
          </div>
        )}
      </section>

      <section aria-label="Your payment breakdown" className="border-y py-5 space-y-3" aria-live="polite">
        <div className="flex justify-between items-baseline gap-4">
          <span className="font-semibold">{instalments ? "Estimated first payment" : "Pay today"}</span>
          <span className="text-2xl font-bold">{formatCurrency(instalments ? total / 4 : amount)}</span>
        </div>
        {instalments ? (
          <p className="text-sm text-muted-foreground">Rental total {formatCurrency(total)}, split into 4 payments.</p>
        ) : (
          <div className="flex justify-between gap-4 text-sm text-muted-foreground"><span>Rental balance at pickup</span><span>{formatCurrency(remaining)}</span></div>
        )}
        <div className="flex items-start gap-2 pt-2">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-1" />
          <p className="text-sm"><strong>{bondLabel}</strong><span className="block text-muted-foreground">Held on your card, not charged online today. Bring a credit/debit card in the hirer’s name.{bond <= 0 ? " The bond amount will be confirmed before pickup." : ""}</span></p>
        </div>
      </section>

      <section aria-labelledby="consent-heading" className="space-y-3">
        <h2 id="consent-heading" className="text-base font-semibold tracking-normal">Before you continue</h2>
        <div className="flex gap-3 items-start">
          <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(value) => props.onAcceptTerms(value === true)} aria-invalid={props.showConsentError} aria-describedby={props.showConsentError ? "consent-error" : "consent-details"} className="mt-1 shrink-0" />
          <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Terms &amp; Conditions</Link>, driver licence verification and the pickup bond shown above.</Label>
        </div>
        {props.showConsentError && <p id="consent-error" role="alert" className="text-sm text-destructive">Please accept the terms before continuing.</p>}
        <details id="consent-details" className="text-sm pl-7">
          <summary className="cursor-pointer text-primary underline">Read the agreement summary</summary>
          <ul className="mt-3 space-y-2 text-muted-foreground list-disc pl-4">
            <li>You accept the rental Terms &amp; Conditions, including cancellation and refund terms.</li>
            <li>You need a valid licence for your vehicle. You consent to authorised third-party checks of your licence and rental eligibility.</li>
            <li>The refundable bond is held on your card at pickup and released after return, subject to the rental terms.</li>
            {paymentType === "deposit" && !instalments && <li>Your {formatCurrency(amount)} deposit is non-refundable; the remaining rental balance is due at pickup.</li>}
          </ul>
        </details>
      </section>

      <div className="space-y-3">
        <Button type="submit" disabled={props.isLoading} size="lg" className="w-full whitespace-normal h-auto min-h-14 py-3">
          {props.isLoading ? <><Loader2 className="animate-spin" /> Opening secure payment…</> : <><LockKeyhole /> {instalments ? "Continue with Klarna" : `Continue to pay ${formatCurrency(amount)}`}</>}
        </Button>
        <p className="text-xs text-muted-foreground text-center">{instalments ? "Review and approve your payment plan with Klarna." : "Enter your card details on the secure payment page."} Your booking is confirmed after successful payment.</p>
        <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground"><Check className="h-3 w-3" /> Bond excluded from today’s payment</div>
        <Button type="button" variant="link" onClick={props.onSaveQuote} disabled={props.isSavingQuote} className="w-full whitespace-normal h-auto text-sm font-normal text-muted-foreground">
          {props.isSavingQuote ? <><Loader2 className="animate-spin" /> Saving your quote…</> : <><Save /> Not ready? Email me this quote</>}
        </Button>
      </div>
    </form>
  );
}