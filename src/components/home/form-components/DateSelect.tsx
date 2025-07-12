
import { useState } from "react";
import * as React from "react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { getNowInNZ } from "./DateTimeUtils";

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

  // Check if a location is Wellington CBD
  const isWellingtonCBD = (locId: string | undefined) => {
    // Use a simple check for Wellington CBD location ID or name pattern
    // This should match the logic used in other components
    return locId && (
      locId === "63" || locId === "64" || locId === "65" || // Known Wellington CBD IDs
      locId.toLowerCase().includes('wellington')
    );
  };

  // Auto-set to next Monday if Wellington CBD is selected and current date is Sunday
  React.useEffect(() => {
    if (!locationId || !isWellingtonCBD(locationId)) return;
    
    const today = getNowInNZ();
    const isSunday = today.getDay() === 0;
    
    if (isSunday && (!date || date.toDateString() === today.toDateString())) {
      // Calculate next Monday
      const nextMonday = new Date(today);
      nextMonday.setDate(today.getDate() + 1); // Move to Monday
      nextMonday.setHours(12, 0, 0, 0);
      
      console.log('Wellington CBD selected on Sunday, auto-setting to Monday:', nextMonday);
      onDateChange(nextMonday);
    }
  }, [locationId, date, onDateChange]);

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
    if (isWellingtonCBD(locationId) && date.getDay() === 0) { // 0 is Sunday
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
