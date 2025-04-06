
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RCMLocation } from "@/lib/api/rcm-api-types";

interface LocationSelectProps {
  id: string;
  label: string;
  locations: RCMLocation[];
  value: string;
  onValueChange: (value: string) => void;
  isLoading: boolean;
  hasError: boolean;
  disabled?: boolean;
  placeholder?: string;
}

export const LocationSelect = ({
  id,
  label,
  locations,
  value,
  onValueChange,
  isLoading,
  hasError,
  disabled = false,
  placeholder
}: LocationSelectProps) => {
  // Helper function to get location name
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => String(loc.id) === locationId);
    return location ? location.name : "";
  };

  return (
    <div className="space-y-2">
      {label && <Label htmlFor={id}>{label}</Label>}
      <Select 
        value={value} 
        onValueChange={(value) => {
          console.log(`Setting ${id} to:`, value);
          onValueChange(value);
        }}
        disabled={disabled}
      >
        <SelectTrigger id={id} className={isLoading ? "animate-pulse" : ""}>
          <SelectValue>
            {value ? getLocationName(value) : 
              isLoading ? "Loading locations..." : 
              hasError ? "Choose location" : 
              placeholder || `Select ${label.toLowerCase()}`}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locations.map((location) => (
            <SelectItem key={location.id} value={String(location.id)}>
              {location.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hasError && <p className="text-xs text-amber-600">Using fallback locations - couldn't connect to server</p>}
    </div>
  );
};
