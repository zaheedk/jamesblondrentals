
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface DateSelectProps {
  id: string;
  label: string;
  date: Date | undefined;
  onDateChange: (date: Date | undefined) => void;
  disableDate?: (date: Date) => boolean;
  locationId?: string;
  allowSameDay?: boolean;
}

export const DateSelect = ({
  id,
  label,
  date,
  onDateChange,
  disableDate,
  locationId,
  allowSameDay = true // Default to allowing same day selections
}: DateSelectProps) => {
  const [open, setOpen] = useState(false);

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Ensure consistent time part when selecting a date
      const consistentDate = new Date(newDate);
      consistentDate.setHours(12, 0, 0, 0);
      onDateChange(consistentDate);
    } else {
      onDateChange(newDate);
    }
    setOpen(false);
  };

  // Check if the date is Sunday and if the location is Wellington - CBD
  const isWellingtonSunday = (date: Date) => {
    // We don't have the location names here, so we need to check by the ID
    // Wellington - CBD is likely to have a specific ID that we need to identify
    const isWellingtonLocation = locationId && 
      ["63", "64", "65"].includes(locationId); // These IDs should be verified

    if (isWellingtonLocation && date.getDay() === 0) { // 0 is Sunday
      return true;
    }
    return false;
  };

  const combinedDisabledDate = (date: Date) => {
    // First check the passed in disable function
    if (disableDate && disableDate(date)) {
      return true;
    }
    
    // Then check location-specific rules
    if (isWellingtonSunday(date)) {
      return true;
    }
    
    return false;
  };

  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            id={id}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : <span>Select date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 pointer-events-auto">
          <Calendar
            mode="single"
            selected={date}
            onSelect={handleDateSelect}
            initialFocus
            disabled={combinedDisabledDate}
            className="p-3 pointer-events-auto"
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};
