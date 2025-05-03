import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { RCMLocation } from "@/lib/api/rcm-api-types";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";

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
  // Get current route to determine default location context
  const location = useLocation();
  const isWellingtonPage = location.pathname.includes('wellington');
  
  // Helper function to get location name
  const getLocationName = (locationId: string) => {
    const location = locations.find(loc => String(loc.id) === locationId);
    return location ? location.name : "";
  };
  
  // Function to detect if user is in Wellington region
  const checkWellingtonRegion = async () => {
    try {
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      return data.region?.toLowerCase().includes('wellington') && data.country === 'NZ';
    } catch (error) {
      console.error('Error detecting location:', error);
      return false;
    }
  };

  // Set default location based on user's region
  useEffect(() => {
    if (locations.length > 0 && !value) {
      const setDefaultLocation = async () => {
        // If on Wellington page, always prefer Wellington CBD location
        if (isWellingtonPage) {
          console.log("On Wellington page, looking for Wellington CBD location");
          const wellingtonLocation = locations.find(loc => 
            loc.name.toLowerCase().includes('wellington') && 
            loc.name.toLowerCase().includes('cbd')
          );
          
          if (wellingtonLocation) {
            console.log(`Setting default location to Wellington CBD:`, wellingtonLocation.id);
            onValueChange(String(wellingtonLocation.id));
            return;
          }
        }
        
        // Otherwise, try to detect if user is in Wellington
        const isWellington = await checkWellingtonRegion();
        
        if (isWellington) {
          console.log("User is in Wellington region, setting Wellington CBD as default");
          const wellingtonLocation = locations.find(loc => 
            loc.name.toLowerCase().includes('wellington') && 
            loc.name.toLowerCase().includes('cbd')
          );
          
          if (wellingtonLocation) {
            console.log(`Setting default location to Wellington CBD:`, wellingtonLocation.id);
            onValueChange(String(wellingtonLocation.id));
            return;
          }
        }
        
        // If not Wellington or Wellington location not found, fallback to previous logic
        console.log("Using default location fallback logic");
        
        // Prioritize Kelston location
        const kelstonLocation = locations.find(loc => 
          loc.name.toLowerCase().includes('kelston')
        );
        
        if (kelstonLocation) {
          console.log(`Setting default location to Kelston:`, kelstonLocation.id);
          onValueChange(String(kelstonLocation.id));
          return;
        } 
        
        // Use Auckland Airport as fallback only if Kelston isn't found
        console.log("Kelston location not found, looking for alternatives");
        const aucklandAirportLocation = locations.find(loc => 
          loc.name.toLowerCase().includes('auckland') && 
          loc.name.toLowerCase().includes('airport')
        );
        
        if (aucklandAirportLocation) {
          console.log(`Setting default location to Auckland Airport:`, aucklandAirportLocation.id);
          onValueChange(String(aucklandAirportLocation.id));
          return;
        }
        
        // Last resort: use first available location
        if (locations[0]) {
          console.log(`Setting default location to first available:`, locations[0].id);
          onValueChange(String(locations[0].id));
        }
      };
      
      setDefaultLocation();
    }
  }, [locations, value, onValueChange, isWellingtonPage]);

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
