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
import { supabase } from '@/lib/supabase-client';

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
  zapierWebhookUrl: z.string().url({ message: "Please enter a valid Zapier webhook URL." }).min(1, { message: "Zapier webhook URL is required." }),
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
      zapierWebhookUrl: "",
    },
  });

  const onSubmit = async (values: WinzQuoteFormValues) => {
    setIsSubmitting(true);

    try {
      console.log("Triggering Zapier webhook:", values.zapierWebhookUrl);

      const webhookData = {
        timestamp: new Date().toISOString(),
        triggered_from: window.location.origin,
        customer_name: `${values.firstName} ${values.lastName}`,
        customer_email: values.email,
        customer_phone: values.phone,
        winz_client_number: values.winzClientNumber,
        vehicle_type: values.vehicleType,
        pickup_date: values.pickupDate,
        return_date: values.returnDate,
        pickup_location: values.pickupLocation,
        return_location: values.returnLocation,
        additional_requirements: values.additionalRequirements || 'None specified',
        email_subject: `WINZ Quote Request: ${values.firstName} ${values.lastName} - ${values.winzClientNumber}`,
        email_body: `
New WINZ Quote Request

Customer Information:
- Name: ${values.firstName} ${values.lastName}
- Email: ${values.email}
- Phone: ${values.phone}
- WINZ Client Number: ${values.winzClientNumber}

Rental Details:
- Vehicle Type: ${values.vehicleType}
- Pickup Date: ${values.pickupDate}
- Return Date: ${values.returnDate}
- From Address: ${values.pickupLocation}
- To Address: ${values.returnLocation}

${values.additionalRequirements ? `Additional Requirements: ${values.additionalRequirements}` : ''}

Quote Includes:
- Best Insurance for vehicles
- Comprehensive Insurance for trailers
- $1000 bond for vehicle or trailer hire

This WINZ quote request was submitted via jamesblond.co.nz
        `.trim()
      };

      const response = await fetch(values.zapierWebhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify(webhookData),
      });

      // Since we're using no-cors, we won't get a proper response status
      toast.success("Thank you! Your WINZ quote request has been sent to Zapier. We'll send you a detailed quote via email within 24 hours.");
      form.reset();
    } catch (error) {
      console.error('Error triggering Zapier webhook:', error);
      toast.error("Sorry, there was an error submitting your request. Please check your Zapier webhook URL and try again.");
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

            <div className="grid md:grid-cols-2 gap-4">
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

            <FormField
              control={form.control}
              name="zapierWebhookUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zapier Webhook URL *</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://hooks.zapier.com/hooks/catch/..."
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-sm text-muted-foreground mt-2">
                    Create a Zap with a webhook trigger, then paste the webhook URL here. The webhook will send the quote data to your connected email service.
                  </p>
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