import React from "react";
import { Card } from "@/components/ui/card";
import { RCMInsuranceOption } from "@/lib/api/rcm-api-types";
import { Check, X, ShieldCheck } from "lucide-react";
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
    .replace(/&amp;/gi, "&");

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

const InsuranceOptions = ({
  insuranceOptions,
  selectedInsuranceId,
  onSelectInsurance,
  numberOfDays,
}: InsuranceOptionsProps) => {
  if (!insuranceOptions || insuranceOptions.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Insurance Options</h3>
        <Card className="p-4">
          <div className="text-sm text-muted-foreground italic">No insurance options available</div>
        </Card>
      </div>
    );
  }

  const sorted = [...insuranceOptions].sort(
    (a, b) =>
      (parseFloat(a.totalinsuranceamount?.toString() || "0") || 0) -
      (parseFloat(b.totalinsuranceamount?.toString() || "0") || 0)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6 mt-10">
      {sorted.map((insurance, index) => {
        const total = parseFloat(insurance.totalinsuranceamount?.toString() || "0") || 0;
        const dailyRate = numberOfDays > 0 ? total / numberOfDays : total;
        const title = (insurance.feedescription || insurance.name || "Insurance Option").trim();
        const lines = parseLines(insurance.feedescription1 || "");
        const isSelected = selectedInsuranceId?.toString() === insurance.id.toString();

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
              <h3 className="text-base md:text-lg font-semibold text-foreground leading-snug">
                {title}
              </h3>

              {lines.length > 0 && (
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

              <div className="mt-6 pt-4 border-t border-border">
                {dailyRate > 0 ? (
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-2xl font-bold text-foreground tracking-tight">
                      ${dailyRate.toFixed(2)}
                    </span>
                    <span className="text-sm text-muted-foreground">per day</span>
                  </div>
                ) : (
                  <div className="text-2xl font-bold text-foreground tracking-tight">Included</div>
                )}
              </div>
            </div>

            <div
              className={cn(
                "w-full text-center py-3 text-sm font-semibold transition-colors",
                isSelected
                  ? "bg-primary text-primary-foreground"
                  : "bg-cta text-cta-foreground hover:bg-cta/90"
              )}
              onClick={(e) => {
                e.stopPropagation();
                onSelectInsurance(insurance.id);
              }}
            >
              {isSelected ? (
                <span className="inline-flex items-center justify-center gap-1.5">
                  <Check className="w-4 h-4" /> Selected
                </span>
              ) : (
                "Select"
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export default InsuranceOptions;
