import { useMemo } from "react";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { Vehicle } from "@/lib/types";

interface TradeUpBannerProps {
  vehicles: Vehicle[];
  onSelectVehicle?: (vehicleId: string | number) => void;
}

/**
 * Detects a smaller vehicle in the current results that has a
 * larger sibling also in the results, and prompts the user to
 * upgrade for the price difference. Uses real prices from the
 * current availability response — no hard-coded numbers.
 */

// Ordered from smaller -> larger within the same use-case cluster.
// A match fires when both a "smaller" and a matching "larger"
// keyword appear in the results.
const UPGRADE_RULES: Array<{
  smaller: RegExp;
  larger: RegExp;
  headline: (diff: number) => string;
  reason: string;
}> = [
  {
    smaller: /(8\s*seat|estima|people\s*mover)/i,
    larger: /(10\s*seat|12\s*seat|hiace|minibus|deliver\s*9)/i,
    headline: (d) => `Travelling as a group? A 12-seater is only $${d.toFixed(0)} more.`,
    reason: "More seats, more luggage room, one bill — still on a car licence.",
  },
  {
    smaller: /(10\s*seat)/i,
    larger: /(12\s*seat|deliver\s*9)/i,
    headline: (d) => `Bump up to a 12-seat minibus for just $${d.toFixed(0)} more.`,
    reason: "Two extra seats and more headroom for the same standard car licence.",
  },
  {
    smaller: /(standard\s*van|short\s*wheel)/i,
    larger: /(jumbo|premium\s*van|long\s*wheel|3.?tonne|3t\b|box|tail\s*lift)/i,
    headline: (d) => `Moving a household? A bigger van/truck is only $${d.toFixed(0)} more.`,
    reason: "Fewer trips, tail-lift options, and load-height that fits a fridge upright.",
  },
  {
    smaller: /(2\s*tonne|2t\b|12m3|16m3)/i,
    larger: /(3\s*tonne|3t\b|19m3|tail\s*lift|curtain)/i,
    headline: (d) => `Upgrade to a 3-tonne for $${d.toFixed(0)} more and finish in one trip.`,
    reason: "Bigger box, tail-lift on request, still a car-licence truck.",
  },
  {
    smaller: /(single\s*cab)/i,
    larger: /(double\s*cab|dual\s*cab)/i,
    headline: (d) => `Bring the crew — a double-cab ute is $${d.toFixed(0)} more.`,
    reason: "Seats five, same tray and towing capacity.",
  },
];

const getPrice = (v: Vehicle): number => {
  const raw = (v as any).ratesubtotal ?? v.price;
  const n = typeof raw === "number" ? raw : parseFloat(raw as string);
  return Number.isFinite(n) ? n : 0;
};

const getName = (v: Vehicle) => `${v.make ?? ""} ${v.model ?? ""}`.trim();

const TradeUpBanner = ({ vehicles, onSelectVehicle }: TradeUpBannerProps) => {
  const match = useMemo(() => {
    if (!vehicles || vehicles.length < 2) return null;

    for (const rule of UPGRADE_RULES) {
      const smallerCandidates = vehicles.filter((v) => rule.smaller.test(getName(v)));
      const largerCandidates = vehicles.filter((v) => rule.larger.test(getName(v)));
      if (smallerCandidates.length === 0 || largerCandidates.length === 0) continue;

      const smaller = smallerCandidates.reduce((a, b) => (getPrice(a) <= getPrice(b) ? a : b));
      const larger = largerCandidates
        .filter((v) => getPrice(v) > getPrice(smaller))
        .reduce<Vehicle | null>(
          (a, b) => (a === null || getPrice(b) < getPrice(a) ? b : a),
          null,
        );
      if (!larger) continue;

      const diff = getPrice(larger) - getPrice(smaller);
      if (diff <= 0 || diff > 120) continue; // only prompt when the gap is real but reasonable

      return { smaller, larger, diff, rule };
    }
    return null;
  }, [vehicles]);

  if (!match) return null;

  const handleClick = () => {
    if (onSelectVehicle) {
      onSelectVehicle(match.larger.id);
      return;
    }
    const el = document.getElementById(`vehicle-${match.larger.id}`);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="mb-6 rounded-lg border border-yellow-300 bg-yellow-50 p-4 md:p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
      <div className="flex items-start gap-3">
        <Sparkles className="h-5 w-5 text-yellow-600 mt-0.5 shrink-0" />
        <div>
          <p className="font-semibold text-gray-900">
            {match.rule.headline(match.diff)}
          </p>
          <p className="text-sm text-gray-700 mt-1">
            {match.rule.reason} <span className="text-gray-500">Recommended: {getName(match.larger)}.</span>
          </p>
        </div>
      </div>
      <button
        type="button"
        onClick={handleClick}
        className="inline-flex items-center gap-1.5 self-start md:self-center bg-yellow-400 hover:bg-yellow-500 text-black px-4 py-2 rounded font-medium text-sm whitespace-nowrap"
      >
        See the upgrade <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
};

export default TradeUpBanner;