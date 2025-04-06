
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RCMLocation } from "@/lib/api/rcm-api-types";
import { useEffect } from "react";

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

  // Set default to Kelston when locations are loaded
  useEffect(() => {
    if (locations.length > 0 && !value) {
      console.log("LocationSelect: Looking for Kelston in", locations.map(loc => loc.name));
      
      const kelstonLocation = locations.find(loc => 
        loc.name.toLowerCase().includes('kelston')
      );
      
      if (kelstonLocation) {
        console.log(`Setting default location to Kelston:`, kelstonLocation.id);
        onValueChange(String(kelstonLocation.id));
      } else {
        console.log("Kelston location not found, setting to first available location");
        // If Kelston isn't found, set to first location as fallback
        if (locations[0]) {
          console.log(`Setting default location to first available:`, locations[0].id);
          onValueChange(String(locations[0].id));
        }
      }
    }
  }, [locations, value, onValueChange]);

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
        <SelectContent className="z-50 bg-white">
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
