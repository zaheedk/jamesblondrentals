import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Car } from "lucide-react";
import { LocationSelect } from "./form-components/LocationSelect";
import { DateSelect } from "./form-components/DateSelect";
import { TimeSelect } from "./form-components/TimeSelect";
import { OptionSelect } from "./form-components/OptionSelect";
import { useRcmLocations } from "@/hooks/use-rcm-api";
import { RCMLocation } from "@/lib/api/rcm-api-types";

interface SearchFormProps {
  defaultLocationId?: string;
}

export default function SearchForm({ defaultLocationId }: SearchFormProps) {
  const navigate = useNavigate();
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [dropoffLocationId, setDropoffLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState("");
  const [dropoffDate, setDropoffDate] = useState("");
  const [pickupTime, setPickupTime] = useState("12:00");
  const [dropoffTime, setDropoffTime] = useState("16:00");
  const [ageId, setAgeId] = useState("4");
  const { data: locations, isLoading: isLocationsLoading, hasError: hasLocationError } = useRcmLocations();
  const ageOptions = [
    { label: "21-24 years", value: "3" },
    { label: "25-75 years", value: "4" },
    { label: "75+ years", value: "5" },
  ];

  useEffect(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    const formattedDate = format(today, "dd/MM/yyyy");
    setPickupDate(formattedDate);
    setDropoffDate(formattedDate);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const searchParams = new URLSearchParams({
      pickupLocation: pickupLocationId,
      dropoffLocation: dropoffLocationId,
      pickupDate,
      dropoffDate,
      pickupTime,
      dropoffTime,
      age: ageId,
      carCategory: "0",
    }).toString();

    navigate(`/vehicles?${searchParams}`);
  };

  // Set default pickup location if provided
  useEffect(() => {
    if (defaultLocationId && !pickupLocationId) {
      setPickupLocationId(defaultLocationId);
      setDropoffLocationId(defaultLocationId); // Also set default dropoff
    }
  }, [defaultLocationId, pickupLocationId]);

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div className="md:col-span-2 lg:col-span-1">
        <LocationSelect
          id="pickupLocation"
          label="Pickup Location"
          locations={locations || []}
          value={pickupLocationId}
          onValueChange={setPickupLocationId}
          isLoading={isLocationsLoading}
          hasError={hasLocationError}
        />
      </div>

      <div className="md:col-span-2 lg:col-span-1">
        <LocationSelect
          id="dropoffLocation"
          label="Dropoff Location"
          locations={locations || []}
          value={dropoffLocationId}
          onValueChange={setDropoffLocationId}
          isLoading={isLocationsLoading}
          hasError={hasLocationError}
        />
      </div>

      <div>
        <DateSelect id="pickupDate" label="Pickup Date" value={pickupDate} onValueChange={setPickupDate} />
      </div>

      <div>
        <TimeSelect id="pickupTime" label="Pickup Time" value={pickupTime} onValueChange={setPickupTime} />
      </div>

      <div>
        <DateSelect id="dropoffDate" label="Dropoff Date" value={dropoffDate} onValueChange={setDropoffDate} />
      </div>

      <div>
        <TimeSelect id="dropoffTime" label="Dropoff Time" value={dropoffTime} onValueChange={setDropoffTime} />
      </div>

      <div className="lg:col-span-4">
        <OptionSelect id="age" label="Age" options={ageOptions} value={ageId} onValueChange={setAgeId} />
      </div>

      <Button type="submit" className="w-full lg:col-span-4">
        Find Vehicles
      </Button>
    </form>
  );
}
