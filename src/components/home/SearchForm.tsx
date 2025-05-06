
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Clock, Calendar, Car } from "lucide-react";
import { LocationSelect } from "./form-components/LocationSelect";
import { DateSelect } from "./form-components/DateSelect";
import { TimeSelect } from "./form-components/TimeSelect";
import { OptionSelect } from "./form-components/OptionSelect";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { RCMLocation } from "@/lib/api/rcm-api-types";

interface SearchFormProps {
  defaultLocationId?: string;
}

export default function SearchForm({ defaultLocationId }: SearchFormProps) {
  const navigate = useNavigate();
  const [pickupLocationId, setPickupLocationId] = useState("");
  const [dropoffLocationId, setDropoffLocationId] = useState("");
  const [pickupDate, setPickupDate] = useState<Date | undefined>(undefined);
  const [dropoffDate, setDropoffDate] = useState<Date | undefined>(undefined);
  const [pickupTime, setPickupTime] = useState("12:00");
  const [dropoffTime, setDropoffTime] = useState("16:00");
  const [ageId, setAgeId] = useState("4");
  
  // Use the correct hook from useRcmApi()
  const { useLocations } = useRcmApi();
  const { data: locations, isLoading: isLocationsLoading, isError: hasLocationError } = useLocations();
  
  const ageOptions = [
    { id: "3", name: "21-24 years", isdefault: false },
    { id: "4", name: "25-75 years", isdefault: true },
    { id: "5", name: "75+ years", isdefault: false },
  ];

  useEffect(() => {
    const today = new Date();
    today.setHours(12, 0, 0, 0);
    setPickupDate(today);
    setDropoffDate(today);
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (!pickupDate || !dropoffDate) {
      return; // Don't submit if dates aren't selected
    }

    const formattedPickupDate = format(pickupDate, "dd/MM/yyyy");
    const formattedDropoffDate = format(dropoffDate, "dd/MM/yyyy");

    const searchParams = new URLSearchParams({
      pickupLocation: pickupLocationId,
      dropoffLocation: dropoffLocationId,
      pickupDate: formattedPickupDate,
      dropoffDate: formattedDropoffDate,
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

  // Create a simple function to get option names for the OptionSelect
  const getAgeOptionName = (id: string) => {
    const option = ageOptions.find(opt => opt.id === id);
    return option ? option.name : "";
  };

  // Generate time options for TimeSelect
  const timeOptions = Array.from({ length: 19 }, (_, i) => {
    const hour = Math.floor(i / 2) + 8;
    const minute = i % 2 === 0 ? "00" : "30";
    return `${hour.toString().padStart(2, '0')}:${minute}`;
  });

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
        <DateSelect
          id="pickupDate"
          label="Pickup Date"
          date={pickupDate}
          onDateChange={setPickupDate}
        />
      </div>

      <div>
        <TimeSelect
          id="pickupTime"
          label="Pickup Time"
          time={pickupTime}
          onTimeChange={setPickupTime}
          timeOptions={timeOptions}
          isLoading={false}
          disabled={!pickupLocationId}
        />
      </div>

      <div>
        <DateSelect
          id="dropoffDate"
          label="Dropoff Date"
          date={dropoffDate}
          onDateChange={setDropoffDate}
        />
      </div>

      <div>
        <TimeSelect
          id="dropoffTime"
          label="Dropoff Time"
          time={dropoffTime}
          onTimeChange={setDropoffTime}
          timeOptions={timeOptions}
          isLoading={false}
          disabled={!dropoffLocationId}
        />
      </div>

      <div className="lg:col-span-4">
        <OptionSelect
          id="age"
          label="Age"
          options={ageOptions}
          value={ageId}
          onValueChange={setAgeId}
          getOptionName={getAgeOptionName}
          isLoading={false}
        />
      </div>

      <Button type="submit" className="w-full lg:col-span-4">
        Find Vehicles
      </Button>
    </form>
  );
}
