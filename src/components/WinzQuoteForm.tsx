import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

const winzQuoteFormSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." }),
  winzClientNumber: z.string().min(9, { message: "WINZ client number must be 9 digits." }).max(9, { message: "WINZ client number must be 9 digits." }),
  vehicleType: z.string().min(1, { message: "Please select a vehicle type." }),
  pickupDate: z.string().min(1, { message: "Please select a pickup date." }),
  returnDate: z.string().min(1, { message: "Please select a return date." }),
  pickupLocation: z.string().min(1, { message: "Please enter a pickup address." }),
  returnLocation: z.string().min(1, { message: "Please enter a return address." }),
  additionalRequirements: z.string().optional(),
});

type WinzQuoteFormValues = z.infer<typeof winzQuoteFormSchema>;

const WinzQuoteForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<WinzQuoteFormValues>({
    resolver: zodResolver(winzQuoteFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      winzClientNumber: "",
      vehicleType: "",
      pickupDate: "",
      returnDate: "",
      pickupLocation: "",
      returnLocation: "",
      additionalRequirements: "",
    },
  });

  const onSubmit = async (values: WinzQuoteFormValues) => {
    setIsSubmitting(true);

    try {
      const idempotencyKey = `winz-${Date.now()}-${values.winzClientNumber}`;

      const { error } = await supabase.functions.invoke('send-transactional-email', {
        body: {
          templateName: 'winz-quote-notification',
          recipientEmail: 'info@jamesblond.co.nz',
          idempotencyKey,
          templateData: {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            phone: values.phone,
            winzClientNumber: values.winzClientNumber,
            vehicleType: values.vehicleType,
            pickupDate: values.pickupDate,
            returnDate: values.returnDate,
            pickupLocation: values.pickupLocation,
            returnLocation: values.returnLocation,
            additionalRequirements: values.additionalRequirements,
          },
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Thank you! Your WINZ quote request has been submitted successfully. We'll send you a detailed quote via email within 24 hours.");
      form.reset();
    } catch (error) {
      console.error('Error sending WINZ quote request:', error);
      toast.error("Sorry, there was an error submitting your request. Please try again or call us directly at 0800 525 663.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Request Your WINZ Quote</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your first name" {...field} />
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
                    <FormLabel>Last Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Your last name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address *</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="your.email@example.com" {...field} />
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
                    <FormLabel>Phone Number *</FormLabel>
                    <FormControl>
                      <Input type="tel" placeholder="Your phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="winzClientNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>WINZ 9-Digit Client Number *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="123456789" 
                      maxLength={9}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="vehicleType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Type *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select vehicle type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="premium-van">Premium Van</SelectItem>
                      <SelectItem value="standard-van">Standard Van</SelectItem>
                      <SelectItem value="jumbo-van">Jumbo Van</SelectItem>
                      <SelectItem value="single-cab-ute">Single Cab Ute</SelectItem>
                      <SelectItem value="double-cab-ute">Double Cab Ute</SelectItem>
                      <SelectItem value="2-tonne-truck">2 Tonne Truck</SelectItem>
                      <SelectItem value="3-tonne-truck">3 Tonne Truck</SelectItem>
                      <SelectItem value="cage-trailer">Cage Trailer</SelectItem>
                      <SelectItem value="luggage-trailer">Luggage Trailer</SelectItem>
                      <SelectItem value="other">Other (please specify in additional requirements)</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickupDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Pickup Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Return Date *</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="pickupLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>From Address *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="returnLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>To Address *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="additionalRequirements"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional Requirements (Optional)</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Please specify any additional requirements, accessories needed, or special circumstances..."
                      className="min-h-[100px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />


            <Button type="submit" className="w-full" disabled={isSubmitting} size="lg">
              {isSubmitting ? "Submitting Request..." : "Request WINZ Quote"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default WinzQuoteForm;