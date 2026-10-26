import React, { useState } from "react";
import { Card } from "@/components/ui/card";
import { RCMInsuranceOption } from "@/lib/api/rcm-api-types";
import { Check, X, ShieldCheck, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface InsuranceOptionsProps {
  insuranceOptions: RCMInsuranceOption[];
  selectedInsuranceId: string | number | null;
  onSelectInsurance: (insuranceId: string | number) => void;
  currencySymbol: string;
  numberOfDays: number;
}

type Line = { text: string; type: "include" | "exclude" | "neutral" };

/** Turn RCM's loose HTML description into clean, typed bullet lines. */
const parseLines = (html: string): Line[] => {
  if (!html) return [];
  const normalised = html
    .replace(/<\s*(br|\/li|\/p|\/div)\s*\/?\s*>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&/gi, "&");

  return normalised
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .map((text) => {
      if (/exclud/i.test(text)) return { text, type: "exclude" as const };
      if (/includ/i.test(text)) return { text, type: "include" as const };
      return { text, type: "neutral" as const };
    });
};

/**
 * RCM returns a blank placeholder row (id 0, no name, no cover text, $0) when a
 * vehicle has no cover tiers configured. That row is not a choice the customer
 * can make, so it must never be rendered as a card.
 */
export const filterRealInsuranceOptions = (
  options?: RCMInsuranceOption[] | null
): RCMInsuranceOption[] =>
  (options ?? []).filter((option) => {
    const hasName = Boolean(
      (option.name || option.description || option.feedescription || "").trim()
    );
    const hasCoverText = Boolean(
      (option.feedescription1 || option.feedescription2 || option.feedescription3 || "").trim()
    );
    const hasPrice = (parseFloat(String(option.totalinsuranceamount)) || 0) > 0;
    return hasName || hasCoverText || hasPrice;
  });

const InsuranceOptions = ({
  insuranceOptions,
  selectedInsuranceId,
  onSelectInsurance,
  currencySymbol,
  numberOfDays,
}: InsuranceOptionsProps) => {
  // Accordion state shared across all cards: only one option's details open at a time.
  const [openId, setOpenId] = useState<string | null>(null);

  const options = filterRealInsuranceOptions(insuranceOptions);

  if (options.length === 0) {
    return null;
  }

  const sorted = [...options].sort(
    (a, b) =>
      (parseFloat(a.totalinsuranceamount?.toString() || "0") || 0) -
      (parseFloat(b.totalinsuranceamount?.toString() || "0") || 0)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
      {sorted.map((insurance, index) => {
        const total = parseFloat(insurance.totalinsuranceamount?.toString() || "0") || 0;
        const dailyRate = numberOfDays > 0 ? total / numberOfDays : total;
        const title = (insurance.feedescription || insurance.name || "Insurance Option").trim();
        const lines = parseLines(insurance.feedescription1 || "");
        const isSelected = selectedInsuranceId?.toString() === insurance.id.toString();
        const isOpen = openId === insurance.id.toString();

        const lowerTitle = title.toLowerCase();
        const isPeaceOfMind = lowerTitle.includes("peace of mind");
        const badge = isPeaceOfMind
          ? { label: "Best cover", tone: "primary" as const }
          : lowerTitle.includes("easy rider")
          ? { label: "Risk taker", tone: "warning" as const }
          : index === 1
          ? { label: "Most popular", tone: "primary" as const }
          : null;

        return (
          <Card
            key={insurance.id}
            role="button"
            tabIndex={0}
            aria-pressed={isSelected}
            onClick={() => onSelectInsurance(insurance.id)}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                onSelectInsurance(insurance.id);
              }
            }}
            className={cn(
              "relative flex flex-col h-full overflow-hidden rounded-2xl p-0 cursor-pointer transition-all duration-300 bg-card",
              isSelected
                ? "border-2 border-primary shadow-lg md:-translate-y-1"
                : "border border-border hover:border-primary/40 hover:shadow-md hover:-translate-y-0.5"
            )}
          >
            {/* Selection tick: the only control, the card itself is the button */}
            <span
              className={cn(
                "absolute right-4 top-4 z-10 w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "border-2 border-border bg-background"
              )}
              aria-hidden
            >
              {isSelected && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
            </span>

            {badge && (
              <div className="flex justify-center pt-4">
                <span
                  className={cn(
                    "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
                    badge.tone === "primary"
                      ? "bg-primary/10 text-primary"
                      : "bg-destructive/10 text-destructive"
                  )}
                >
                  {badge.tone === "primary" && <ShieldCheck className="w-3.5 h-3.5" />}
                  {badge.label}
                </span>
              </div>
            )}

            <div className={cn("flex-1 flex flex-col px-5 pb-5", badge ? "pt-3" : "pt-6")}>
              {/* Accordion trigger: the option name opens/closes the details */}
              <button
                type="button"
                aria-expanded={isOpen}
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenId(isOpen ? null : insurance.id.toString());
                }}
                className="flex w-full items-start justify-between gap-3 text-left pr-8 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-md"
              >
                <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug">
                  {title}
                </h3>
                {lines.length > 0 && (
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 shrink-0 mt-1 text-muted-foreground transition-transform duration-200",
                      isOpen && "rotate-180"
                    )}
                    aria-hidden
                  />
                )}
              </button>

              {isOpen && lines.length > 0 && (
                <ul className="mt-4 space-y-2.5">
                  {lines.map((line, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm text-muted-foreground">
                      {line.type === "exclude" ? (
                        <X className="w-4 h-4 mt-0.5 shrink-0 text-destructive" aria-hidden />
                      ) : line.type === "include" ? (
                        <Check className="w-4 h-4 mt-0.5 shrink-0 text-primary" aria-hidden />
                      ) : (
                        <span className="w-1.5 h-1.5 mt-2 shrink-0 rounded-full bg-border" />
                      )}
                      <span className="leading-snug">{line.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-auto pt-4 border-t border-border">
                {dailyRate > 0 ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-foreground tracking-tight">
                      {currencySymbol}
                      {dailyRate.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">per day</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-foreground tracking-tight">Included</div>
                )}
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default InsuranceOptions;
