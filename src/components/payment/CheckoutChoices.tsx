import { Link } from "react-router-dom";
import { CreditCard, LockKeyhole, ShieldCheck, Wallet, Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { formatCurrency } from "@/lib/utils";

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
  const payToday = instalments ? total / 4 : amount;
  const bondText = bond > 0 ? `${formatCurrency(bond)} refundable bond at pickup` : "Refundable bond at pickup";

  return (
    <form onSubmit={props.onSubmit} className="space-y-5">
      {/* Payment method toggle */}
      <ToggleGroup
        type="single"
        value={provider}
        onValueChange={(value) => {
          if (value === "windcave" || value === "airwallex") props.onProviderChange(value);
        }}
        aria-label="Payment method"
        className="grid grid-cols-2 gap-1 rounded-lg bg-muted p-1"
      >
        <ToggleGroupItem value="windcave" className="h-12 gap-2 rounded-md text-sm data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-sm">
          <CreditCard className="h-4 w-4 shrink-0" /> Card
        </ToggleGroupItem>
        <ToggleGroupItem value="airwallex" className="h-12 gap-2 rounded-md text-sm data-[state=on]:bg-background data-[state=on]:text-primary data-[state=on]:shadow-sm">
          <Wallet className="h-4 w-4 shrink-0" /> 4 instalments
        </ToggleGroupItem>
      </ToggleGroup>

      {/* Amount choice (card only) */}
      {!instalments && (
        <ToggleGroup
          type="single"
          value={paymentType}
          onValueChange={(value) => {
            if (value === "full" || value === "deposit") props.onPaymentTypeChange(value);
          }}
          aria-label="Amount to pay"
          className="grid gap-2 grid-cols-2"
        >
          <ToggleGroupItem value="full" className="h-auto min-h-16 flex-col items-start gap-0.5 rounded-lg border p-3 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-foreground">
            <span className="text-sm font-semibold">Pay in full</span>
            <span className="text-sm font-semibold">{formatCurrency(total)}</span>
          </ToggleGroupItem>
          <ToggleGroupItem value="deposit" className="h-auto min-h-16 flex-col items-start gap-0.5 rounded-lg border p-3 text-left data-[state=on]:border-primary data-[state=on]:bg-primary/5 data-[state=on]:text-foreground">
            <span className="text-sm font-semibold">{formatCurrency(Math.min(depositAmount, total))} deposit</span>
            <span className="text-xs text-muted-foreground">Rest at pickup</span>
          </ToggleGroupItem>
        </ToggleGroup>
      )}

      {/* Pay today */}
      <div className="rounded-lg bg-muted/50 p-4 space-y-1.5" aria-live="polite">
        <div className="flex justify-between items-baseline gap-4">
          <span className="font-semibold">{instalments ? "First payment today" : "Pay today"}</span>
          <span className="text-2xl font-bold">{formatCurrency(payToday)}</span>
        </div>
        <p className="text-xs text-muted-foreground">
          {instalments
            ? `Then 3 more payments of ${formatCurrency(total / 4)} with Klarna. Subject to approval.`
            : paymentType === "deposit"
              ? `Balance of ${formatCurrency(Math.max(total - amount, 0))} due at pickup. Deposit is non-refundable.`
              : "Nothing more to pay for the rental at pickup."}
        </p>
        <div className="flex items-start gap-2 pt-1.5">
          <ShieldCheck className="h-4 w-4 text-primary shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-foreground">{bondText}</span> — held on your card, not charged today.
          </p>
        </div>
      </div>

      {/* Consent */}
      <div className="space-y-2">
        <div className="flex gap-3 items-start">
          <Checkbox
            id="terms"
            checked={acceptedTerms}
            onCheckedChange={(value) => props.onAcceptTerms(value === true)}
            aria-invalid={props.showConsentError}
            aria-describedby={props.showConsentError ? "consent-error" : "consent-details"}
            className="mt-0.5 shrink-0"
          />
          <Label htmlFor="terms" className="text-sm font-normal leading-relaxed cursor-pointer">
            I agree to the <Link to="/terms" target="_blank" rel="noopener noreferrer" className="text-primary underline">Terms &amp; Conditions</Link>, licence verification and the pickup bond.
          </Label>
        </div>
        {props.showConsentError && (
          <p id="consent-error" role="alert" className="text-sm text-destructive">Please accept the terms before continuing.</p>
        )}
        <details id="consent-details" className="text-xs pl-7 text-muted-foreground">
          <summary className="cursor-pointer text-primary underline">What am I agreeing to?</summary>
          <ul className="mt-2 space-y-1.5 list-disc pl-4">
            <li>The rental Terms &amp; Conditions, including cancellation and refund terms.</li>
            <li>Authorised checks of your licence and rental eligibility.</li>
            <li>The refundable bond is held on your card at pickup and released after return, subject to the rental terms.</li>
            {paymentType === "deposit" && !instalments && (
              <li>Your {formatCurrency(amount)} deposit is non-refundable; the balance is due at pickup.</li>
            )}
          </ul>
        </details>
      </div>

      {/* Actions */}
      <div className="space-y-2">
        <Button type="submit" disabled={props.isLoading} size="lg" className="w-full whitespace-normal h-auto min-h-14 py-3">
          {props.isLoading ? (
            <><Loader2 className="animate-spin" /> Opening secure payment…</>
          ) : (
            <><LockKeyhole /> {instalments ? "Continue with Klarna" : `Pay ${formatCurrency(payToday)}`}</>
          )}
        </Button>
        <Button type="button" variant="link" onClick={props.onSaveQuote} disabled={props.isSavingQuote} className="w-full whitespace-normal h-auto text-sm font-normal text-muted-foreground">
          {props.isSavingQuote ? <><Loader2 className="animate-spin" /> Saving your quote…</> : <><Save /> Not ready? Email me this quote</>}
        </Button>
      </div>
    </form>
  );
}
