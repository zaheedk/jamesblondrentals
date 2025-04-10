
import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, User, Mail, Phone, Plane } from "lucide-react";
import { cn } from "@/lib/utils";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { useRcmApi } from "@/hooks/use-rcm-api";

const formSchema = z.object({
  firstName: z.string().min(2, {
    message: "First name must be at least 2 characters.",
  }),
  lastName: z.string().min(2, {
    message: "Last name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  phone: z.string().min(5, {
    message: "Please enter a valid phone number.",
  }),
  dateOfBirth: z.date().optional(),
  flightNumber: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<CustomerFormValues> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  flightNumber: "",
};

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const bookingData = getBookingData();
  const { rcmApi } = useRcmApi();
  
  React.useEffect(() => {
    if (!bookingData) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate("/");
    }
  }, [bookingData, navigate]);

  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const formatDateForApi = (dateStr: string): string => {
    try {
      if (dateStr.includes('/')) {
        return dateStr; // Already in the correct format
      }
      
      const date = new Date(dateStr);
      return format(date, 'dd/MM/yyyy');
    } catch (error) {
      console.error('Date formatting error:', error);
      return dateStr; // Return as-is if formatting fails
    }
  };

  const createBooking = async (formData: CustomerFormValues) => {
    if (!bookingData) return null;
    
    try {
      console.log('Creating booking with data:', { bookingData, formData });
      
      const bookingRequest = {
        vehiclecategoryid: bookingData.vehicleId,
        vehiclecategorytypeid: bookingData.vehicleCategoryTypeId,
        pickuplocationid: bookingData.pickupLocationId,
        pickupdate: formatDateForApi(bookingData.pickupDate),
        pickuptime: bookingData.pickupTime,
        dropofflocationid: bookingData.dropoffLocationId,
        dropoffdate: formatDateForApi(bookingData.dropoffDate),
        dropofftime: bookingData.dropoffTime,
        ageid: bookingData.ageId,
        bookingtype: 2, // 2=booking (not quote)
        customer: {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          mobile: formData.phone,
          dateofbirth: formData.dateOfBirth ? format(formData.dateOfBirth, 'dd/MM/yyyy') : undefined
        },
        flightin: formData.flightNumber,
        emailoption: 1, // 1=default behavior
        referralid: "",
        foundusid: "",
        remark: "",
        numbertravelling: 1, // Default value
        arrivalpoint: "",
        departurepoint: "",
        areaofuseid: "",
        newsletter: 0,
        transmission: 0
      };
      
      console.log('Sending booking request:', bookingRequest);
      const response = await rcmApi.createBooking(bookingRequest);
      
      if (response.status === "OK") {
        console.log('Booking created successfully:', response);
        
        // Store all reference numbers from the response
        const updatedData = updateBookingData({
          reservationRef: response.reservationRef || response.results?.reservationref,
          bookingReference: response.bookingReference || response.results?.bookingref,
          confirmationNumber: response.confirmationNumber || response.results?.confirmationno,
          reservationNo: response.results?.reservationno?.toString()
        });
        
        // Log all the booking reference data
        console.log('Updated booking data with references:', updatedData);
        
        toast.success("Booking created successfully", {
          description: response.confirmationNumber 
            ? `Confirmation #: ${response.confirmationNumber}` 
            : "Proceeding to payment"
        });
        
        return response;
      } else {
        throw new Error(response.error || "Failed to create booking");
      }
    } catch (error) {
      console.error('Booking creation error:', error);
      toast.error("Booking creation failed", {
        description: error instanceof Error ? error.message : "An unexpected error occurred"
      });
      return null;
    }
  };

  const onSubmit = async (data: CustomerFormValues) => {
    setIsSubmitting(true);
    
    try {
      const bookingResponse = await createBooking(data);
      
      if (bookingResponse) {
        // Check reservation number to ensure booking was successful
        const reservationNo = bookingResponse.results?.reservationno;
        if (reservationNo && parseInt(reservationNo.toString()) > 0) {
          navigate("/payment");
        } else {
          toast.error("Booking unsuccessful", {
            description: "Please contact support with this message: ReservationNo <= 0"
          });
          setIsSubmitting(false);
        }
      } else {
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("Error processing form:", error);
      toast.error("Something went wrong", {
        description: "Please try again later.",
      });
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Customer Details</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input className="pl-10" placeholder="John" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input className="pl-10" placeholder="Doe" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input className="pl-10" placeholder="john.doe@example.com" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number*</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input className="pl-10" placeholder="+1 234 567 8900" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of Birth (optional)</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-10 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1920-01-01")
                            }
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        Used for age verification (optional)
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="flightNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Flight Number (optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Plane className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <Input className="pl-10" placeholder="AA1234" {...field} />
                        </div>
                      </FormControl>
                      <FormDescription>
                        For airport pickup coordination
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-between pt-4 border-t border-gray-200">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => navigate(-1)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="min-w-[120px]"
                >
                  {isSubmitting ? "Processing..." : "Complete Booking"}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
