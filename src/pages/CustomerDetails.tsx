import React from "react";
import { useNavigate } from "react-router-dom";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { format, isValid, parse } from "date-fns";
import InputMask from "react-input-mask";
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
import { Calendar, User, Mail, Phone, Plane } from "lucide-react";
import { cn, getCampaignCode } from "@/lib/utils";
import { getBookingData, updateBookingData } from "@/lib/booking-session";
import { toast } from "sonner";
import { useRcmApi } from "@/hooks/use-rcm-api";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

import BookingRentalAccordion from '@/components/booking/BookingRentalAccordion';
import ExitIntentPopup from "@/components/ExitIntentPopup";
import DebugApiResponse from '@/components/diagnostics/DebugApiResponse';
import BookingSteps from '@/components/booking/BookingSteps';
import TrustGuaranteeBanner from '@/components/booking/TrustGuaranteeBanner';
import PageSEO from '@/components/PageSEO';


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
  dateOfBirth: z.string().optional().refine((val) => {
    if (!val || val.trim() === "" || val === "dd/mm/yyyy") return true;
    const parsed = parse(val, "dd/MM/yyyy", new Date());
    if (!isValid(parsed)) return false;
    const today = new Date();
    const minDate = new Date(1920, 0, 1);
    return parsed <= today && parsed >= minDate;
  }, "Please enter a valid date of birth (DD/MM/YYYY) between 1920 and today"),
  flightNumber: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof formSchema>;

const defaultValues: Partial<CustomerFormValues> = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dateOfBirth: "",
  flightNumber: "",
};

const CustomerDetails = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const bookingData = getBookingData();
  const { rcmApi } = useRcmApi();
  const { user } = useAuth();
  
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  React.useEffect(() => {
    if (!bookingData) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate("/");
    }
  }, [bookingData, navigate]);

  // Pre-fill form from logged-in user's profile and customer record
  React.useEffect(() => {
    const prefillFromProfile = async () => {
      if (!user) return;
      
      // Start with auth profile data
      const fullName = user.user_metadata?.full_name || user.user_metadata?.name || "";
      const nameParts = fullName.split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";
      
      let prefillData: Partial<CustomerFormValues> = {
        email: user.email || "",
        firstName,
        lastName,
      };

      // Try to get richer data from the customers table
      try {
        const { data: customer } = await supabase
          .from('customers')
          .select('first_name, last_name, email, mobile, phone, dob')
          .eq('user_id', user.id)
          .maybeSingle();

        if (customer) {
          prefillData = {
            firstName: customer.first_name || prefillData.firstName,
            lastName: customer.last_name || prefillData.lastName,
            email: customer.email || prefillData.email,
            phone: customer.mobile || customer.phone || prefillData.phone || "",
            dateOfBirth: customer.dob 
              ? new Date(customer.dob).toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }).replace(/\//g, '/')
              : "",
          };
        }
      } catch (err) {
        console.error('Error fetching customer profile:', err);
      }

      // Only set values that are not empty
      Object.entries(prefillData).forEach(([key, value]) => {
        if (value) {
          form.setValue(key as keyof CustomerFormValues, value);
        }
      });
    };

    prefillFromProfile();
  }, [user, form]);

  const formatDateForApi = (dateStr: string): string => {
    if (!dateStr || dateStr.trim() === "" || dateStr === "dd/mm/yyyy") return "";
    return dateStr; // Already in DD/MM/YYYY format from the mask
  };

  const createBooking = async (formData: CustomerFormValues) => {
    if (!bookingData) return null;
    
    try {
      console.log('Creating booking with data:', { bookingData, formData });
      
      // Prepare optional fees array from selected extras with required qty parameter
      const optionalFees = bookingData.selectedExtras?.map(extra => ({
        id: extra.id,
        qty: extra.quantity // Using the key 'qty' instead of 'quantity' as required by the API
      })) || [];
      
      console.log('Optional fees prepared for API:', optionalFees);
      
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
        // Include insurance ID and extras kms ID
        insuranceid: bookingData.insuranceId || "0",
        extrakmsid: bookingData.extraKmsId || "0",
        // Include optional fees (extras) with correct qty parameter
        optionalfees: optionalFees,
        campaigncode: getCampaignCode(
          bookingData.campaignCode || "", 
          bookingData.pickupDate, 
          bookingData.dropoffDate,
          bookingData.vehicleName,
          bookingData.vehicleCategoryTypeId,
          bookingData.pickupTime,
          bookingData.dropoffTime
        ),
        customer: {
          firstname: formData.firstName,
          lastname: formData.lastName,
          email: formData.email,
          mobile: formData.phone,
          dateofbirth: formatDateForApi(formData.dateOfBirth || "")
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
        
        // Store all reference numbers from the response with detailed logging
        console.log('Response details:', {
          reservationRef: response.reservationRef || (response.results?.reservationref || ""),
          bookingReference: response.bookingReference || (response.results?.bookingref || ""),
          confirmationNumber: response.confirmationNumber || (response.results?.confirmationno || ""),
          reservationNo: response.results?.reservationno?.toString() || ""
        });
        
        const updatedData = updateBookingData({
          reservationRef: response.reservationRef || (response.results?.reservationref || ""),
          bookingReference: response.bookingReference || (response.results?.bookingref || ""),
          confirmationNumber: response.confirmationNumber || (response.results?.confirmationno || ""),
          reservationNo: response.results?.reservationno?.toString() || ""
        });
        
        // Also save customer details to session storage for feedback system
        const customerData = updateBookingData({
          customerFirstName: formData.firstName,
          customerLastName: formData.lastName,
          customerEmail: formData.email,
          customerPhone: formData.phone,
          customerDob: formatDateForApi(formData.dateOfBirth || "")
        });
        
        // Log all the booking reference data
        console.log('Updated booking data with references:', updatedData);
        console.log('Updated booking data with customer info:', customerData);
        
        // Save booking to Supabase database
        try {
          // Calculate totals
          const extrasTotal = (bookingData.selectedExtras || []).reduce((sum, extra) => 
            sum + (extra.price * extra.quantity), 0);
          const insuranceTotal = (bookingData.insurancePrice || 0);
          const vehicleTotal = bookingData.totalcost || bookingData.basePrice || 0;
          const totalAmount = vehicleTotal + extrasTotal + insuranceTotal;
          
          // Format dates from DD/MM/YYYY to YYYY-MM-DD for Postgres
          const formatDateForDB = (dateStr: string): string => {
            if (!dateStr) return new Date().toISOString().split('T')[0];
            if (dateStr.includes('/')) {
              const [day, month, year] = dateStr.split('/');
              return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
            }
            return dateStr;
          };

          const dbBooking = {
            user_id: user?.id || null,
            booking_reference: response.bookingReference || response.results?.bookingref || null,
            reservation_reference: response.reservationRef || response.results?.reservationref || null,
            vehicle_id: bookingData.vehicleId,
            vehicle_name: bookingData.vehicleName || null,
            vehicle_type: bookingData.vehicleCategoryId?.toString() || null,
            vehicle_category: bookingData.vehicleCategoryTypeId || null,
            pickup_location_id: bookingData.pickupLocationId,
            pickup_location_name: bookingData.pickupLocationName || null,
            dropoff_location_id: bookingData.dropoffLocationId,
            dropoff_location_name: bookingData.dropoffLocationName || null,
            pickup_date: formatDateForDB(bookingData.pickupDate),
            pickup_time: bookingData.pickupTime,
            dropoff_date: formatDateForDB(bookingData.dropoffDate),
            dropoff_time: bookingData.dropoffTime,
            total_days: bookingData.numberofdays || bookingData.rentalDays || 1,
            customer_first_name: formData.firstName,
            customer_last_name: formData.lastName,
            customer_email: formData.email,
            customer_phone: formData.phone,
            customer_age: parseInt(bookingData.ageId) || null,
            daily_rate: bookingData.dailyrate || null,
            vehicle_total: vehicleTotal,
            extras_total: extrasTotal,
            insurance_total: insuranceTotal,
            total_amount: totalAmount,
            selected_extras: bookingData.selectedExtras || [],
            insurance_options: {
              id: bookingData.insuranceId,
              name: bookingData.insuranceName,
              price: bookingData.insurancePrice
            },
            booking_status: 'pending',
            payment_status: 'pending',
            special_requirements: formData.flightNumber ? `Flight: ${formData.flightNumber}` : null,
          };
          
          console.log('Saving booking to database:', dbBooking);
          
          let savedBooking: any = null;
          let dbError: any = null;
          if (user?.id) {
            const { data, error } = await supabase
              .from('bookings')
              .insert(dbBooking)
              .select()
              .single();
            savedBooking = data;
            dbError = error;
          } else {
            const { error } = await supabase
              .from('bookings')
              .insert(dbBooking);
            dbError = error;
          }
            
          if (dbError) {
            console.error('Error saving booking to database:', dbError);
            // Don't block the user from continuing even if database save fails
          } else {
            console.log('Booking saved to database successfully:', savedBooking);
          }
        } catch (dbError) {
          console.error('Exception saving booking to database:', dbError);
          // Don't block the user from continuing
        }

        // Auto-create user account for booking and sync to Savo
        // These must be awaited so requests complete before page navigation
        if (formData.email) {
          const fullName = `${formData.firstName || ''} ${formData.lastName || ''}`.trim();
          
          // Create user account (Savo sync happens after payment on PaymentSuccess page)
          const [accountRes] = await Promise.allSettled([
            supabase.functions.invoke('create-booking-account', {
              body: {
                email: formData.email,
                firstName: formData.firstName,
                lastName: formData.lastName,
              },
            }),
          ]);

          // Link booking to created/existing user account
          if (accountRes.status === 'fulfilled' && accountRes.value?.data) {
            const returnedUserId = accountRes.value.data.userId;
            const bookingRef = response.bookingReference || response.results?.bookingref;
            const reservationRef = response.reservationRef || response.results?.reservationref;
            if (returnedUserId && (bookingRef || reservationRef)) {
              const filter = bookingRef
                ? `booking_reference.eq.${bookingRef}`
                : `reservation_reference.eq.${reservationRef}`;
              const { error: updateError } = await supabase
                .from('bookings')
                .update({ user_id: returnedUserId })
                .or(filter)
                .is('user_id', null);
              if (updateError) {
                console.error('Error linking booking to user:', updateError);
              } else {
                console.log(`Booking linked to user ${returnedUserId}`);
              }
            }
            console.log('Auto account creation result:', accountRes.value.data);
          } else if (accountRes.status === 'rejected') {
            console.error('Auto account creation error:', accountRes.reason);
          }

          // Savo sync now happens after payment on PaymentSuccess page
        }
        
        toast.success("Booking created successfully", {
          description: response.confirmationNumber 
            ? `Confirmation #: ${response.confirmationNumber}` 
            : (response.reservationRef 
              ? `Reservation #: ${response.reservationRef}` 
              : "Proceeding to payment")
        });
        
        // WhatsApp functionality disabled
        /*
        if (formData.phone) {
          await sendBookingConfirmation({
            customerName: `${formData.firstName} ${formData.lastName}`,
            customerPhone: formData.phone,
            vehicleName: bookingData.vehicleName || 'Vehicle',
            pickupDate: bookingData.pickupDate,
            dropoffDate: bookingData.dropoffDate,
            pickupLocation: bookingData.pickupLocationName || 'Pickup Location',
            bookingReference: response.reservationRef || response.results?.reservationref || 'TBC',
            totalAmount: bookingData.totalcost || bookingData.basePrice || 0
          });
        }
        */
        
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
        // First check reservationRef directly since that's what we want
        const reservationRef = bookingResponse.reservationRef || bookingResponse.results?.reservationref;
        
        // Fallback to checking reservation number if ref is not available
        const reservationNo = bookingResponse.results?.reservationno;
        
        if (reservationRef || (reservationNo && parseInt(String(reservationNo)) > 0)) {
          navigate("/payment-options");
        } else {
          toast.error("Booking unsuccessful", {
            description: "Please contact support: No reservation reference received"
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
    <div>
      <PageSEO title="Customer Details – Complete Your Booking | James Blond" description="Enter your details to complete your vehicle rental booking with James Blond Rentals." canonical="/customer-details" noindex />
      <BookingSteps currentStep={4} />
      <TrustGuaranteeBanner />
      <div className="container mx-auto px-4 py-8">
        <ExitIntentPopup />
        <BookingRentalAccordion />
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
                    <FormItem>
                      <FormLabel>Date of Birth (optional)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Calendar className="absolute left-3 top-2.5 h-5 w-5 text-muted-foreground" />
                          <InputMask
                            mask="99/99/9999"
                            placeholder="dd/mm/yyyy"
                            maskChar=""
                            value={field.value || ""}
                            onChange={(e) => field.onChange(e.target.value)}
                          >
                            {(inputProps: any) => (
                              <Input 
                                {...inputProps}
                                className="pl-10" 
                              />
                            )}
                          </InputMask>
                        </div>
                      </FormControl>
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
    </div>
  );
};

export default CustomerDetails;