import { useSearchParams, useNavigate } from "react-router-dom";
import { CalendarClock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Vehicle } from "@/lib/types";
import { isMidweekEligibleVehicle, suggestMidweekDates } from "@/lib/midweek-discount";

interface MidweekDateNudgeProps {
  vehicles: Vehicle[];
}

/**
 * Shown on the results page when the selected dates miss the Mon–Thu 25%
 * early-week discount. Offers a one-tap swap to the nearest qualifying window.
 */
const MidweekDateNudge = ({ vehicles }: MidweekDateNudgeProps) => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const pickupDate = searchParams.get("pickupDate") || "";
  const dropoffDate = searchParams.get("dropoffDate") || "";

  const eligible = vehicles.filter((v) =>
    isMidweekEligibleVehicle(`${v.make || ""} ${v.model || ""}`, v.type as string)
  );
  if (eligible.length === 0) return null;

  const suggestion = suggestMidweekDates(pickupDate, dropoffDate);
  if (!suggestion) return null;

  const rates = eligible
    .map((v) => v.dailyRate || 0)
    .filter((r) => r > 0);
  const cheapest = rates.length ? Math.min(...rates) : 0;
  const days = Math.max(1, suggestion.nights);
  const saving = cheapest ? cheapest * days * 0.25 : 0;

  const applySwap = () => {
    const next = new URLSearchParams(searchParams);
    next.set("pickupDate", suggestion.pickupDate);
    next.set("dropoffDate", suggestion.dropoffDate);
    next.delete("campaignCode");
    navigate(`/vehicles?${next.toString()}`);
  };

  return (
    <div className="mb-6 rounded-lg border bg-muted p-4 sm:p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <CalendarClock className="mt-0.5 h-5 w-5 shrink-0 text-foreground" aria-hidden="true" />
          <div>
            <p className="font-semibold">
              Save 25% by moving to early week
            </p>
            <p className="text-sm text-muted-foreground">
              Same truck or jumbo van, {suggestion.pickupLabel} – {suggestion.dropoffLabel}
              {saving > 0 && (
                <> — from <span className="font-semibold text-foreground">${saving.toFixed(0)} less</span></>
              )}
              . Hire must start and end Mon–Thu.
            </p>
          </div>
        </div>
        <Button onClick={applySwap} className="shrink-0 gap-2">
          Switch to these dates
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default MidweekDateNudge;
