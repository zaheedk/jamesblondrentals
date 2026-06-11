import { useSearchParams } from "react-router-dom";
import { Link } from "react-router-dom";
import { Truck } from "lucide-react";
import SearchForm from "@/components/home/SearchForm";
import { getTruckBySlug } from "@/lib/truck-catalog";

interface TruckQuoteSearchFormProps {
  /**
   * Fallback truck slug to preselect when the URL does not include
   * `?truck=<slug>`. Leave undefined to let the visitor pick.
   */
  fallbackTruckSlug?: string;
}

/**
 * Wraps the standard `SearchForm` for use on city truck-rental pages.
 *
 * Reads `?truck=<slug>` from the URL (set by the CTA buttons on the
 * `/fleet/trucks/*` detail pages or by truck cards on the city page itself),
 * shows a small confirmation banner so the visitor knows we've picked up
 * their selection, and tells the underlying RCM-powered SearchForm to
 * preselect the matching vehicle category. The quote submission to the RCM
 * API then includes the correct `carCategory` automatically.
 */
const TruckQuoteSearchForm = ({ fallbackTruckSlug }: TruckQuoteSearchFormProps = {}) => {
  const [searchParams] = useSearchParams();
  const truckSlug = searchParams.get("truck") || fallbackTruckSlug;
  const selectedTruck = getTruckBySlug(truckSlug);

  return (
    <div className="space-y-4">
      {selectedTruck && (
        <div className="flex items-start gap-3 rounded-2xl border border-primary/20 bg-primary/5 p-4">
          <div className="bg-primary/10 p-2 rounded-full">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">Quoting for</p>
            <p className="font-semibold">{selectedTruck.name}</p>
            <p className="text-xs text-muted-foreground mt-1">
              We've preselected the truck category for you.{" "}
              <Link
                to={`/fleet/trucks/${selectedTruck.slug}`}
                className="text-primary hover:underline"
              >
                View truck details
              </Link>
              .
            </p>
          </div>
        </div>
      )}

      <SearchForm
        defaultCategoryName={selectedTruck?.categoryNameHint}
      />
    </div>
  );
};

export default TruckQuoteSearchForm;