
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Mail, Phone, User, MessageSquare, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { bookingHowTo, pickupHowTo } from '@/seo/howToJsonLd';


// Define form schema with Zod
const formSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(5, { message: "Please enter a valid phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." })
});

type FormValues = z.infer<typeof formSchema>;

const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: ""
    },
  });

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true);
    
    try {
      // In a real implementation, we'd use a service like EmailJS, FormSpree, or a backend API
      // For now, we'll simulate sending an email
      console.log("Form data to send:", data);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
      toast({
        title: "Message Sent",
        description: "Thank you for contacting us. We will get back to you shortly.",
      });
      
      // Reset form
      form.reset();
    } catch (error) {
      console.error("Error submitting form:", error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <PageSEO title="Contact Us – James Blond Rentals NZ" description="Get in touch with James Blond Rentals. Find phone numbers, email and office locations for Auckland, Wellington and Christchurch branches." canonical="/contact" />
      <JsonLd data={{"@context":"https://schema.org","@type":"BreadcrumbList","itemListElement":[{"@type":"ListItem","position":1,"name":"Home","item":"https://jamesblond.co.nz/"},{"@type":"ListItem","position":2,"name":"Contact Us","item":"https://jamesblond.co.nz/contact"}]}} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "AutoRental",
          name: "James Blond Rentals",
          image: "https://jamesblond.co.nz/lovable-uploads/ee23bb91-cc75-4cf1-a745-f44e4a4bbb12.png",
          url: "https://jamesblond.co.nz/contact",
          telephone: "+64800525663",
          email: "info@jamesblond.co.nz",
          priceRange: "$$",
          address: {
            "@type": "PostalAddress",
            streetAddress: "4004 Great North Road",
            addressLocality: "Glen Eden",
            addressRegion: "Auckland",
            postalCode: "0602",
            addressCountry: "NZ",
          },
          geo: {
            "@type": "GeoCoordinates",
            latitude: "-36.8762",
            longitude: "174.6639",
          },
          openingHours: "Mo-Su 08:00-17:00",
          areaServed: {
            "@type": "Country",
            name: "New Zealand",
          },
        }}
      />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: [
            {
              "@type": "Question",
              name: "What do I need to bring when collecting my rental vehicle?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You need a full, valid driver's licence (in English or with an approved translation) and a credit or debit card for the bond. Prepaid cards are not accepted.",
              },
            },
            {
              "@type": "Question",
              name: "What is the minimum age to rent a vehicle?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "You must be at least 21 years old to rent a vehicle with James Blond Rentals. Additional ID may be requested at pickup.",
              },
            },
            {
              "@type": "Question",
              name: "Can I pick up or drop off my rental outside opening hours?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes — after-hours pick up and drop off are available on request. Contact us on 0800 525 663 to arrange this in advance.",
              },
            },
            {
              "@type": "Question",
              name: "Is insurance included in the rental price?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Basic cover is included, and you can upgrade to Premium or Ultimate cover at checkout for reduced excess and extra protection.",
              },
            },
            {
              "@type": "Question",
              name: "Can I return my rental to a different branch?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "One-way hires between our Auckland, Wellington and Christchurch branches are available. Fees may apply — ask our team when booking.",
              },
            },
            {
              "@type": "Question",
              name: "Do you require a bond or security deposit?",
              acceptedAnswer: {
                "@type": "Answer",
                text: "Yes, a pre-authorisation hold is placed on your card at pickup. The amount varies by vehicle type and insurance option selected.",
              },
            },
          ],
        }}
      />
      <JsonLd data={bookingHowTo("https://jamesblond.co.nz/contact")} />
      <JsonLd data={pickupHowTo({ pageUrl: "https://jamesblond.co.nz/contact", locationName: "James Blond Rentals", address: "4004 Great North Road, Glen Eden, Auckland", isAirport: false })} />
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Contact Us</h1>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <div className="prose max-w-none">
              <p className="text-lg mb-6">
                We'd love to hear from you. Please fill out the form, and we'll get back to you as soon as possible.
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-sm text-gray-600">info@jamesblond.co.nz</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="text-sm text-gray-600">0800 525 663</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-gray-600">4004 Great North Road<br />Glen Eden, Auckland 0602</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Send Us a Message</h2>
            
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-4 w-4" />
                          <Input className="pl-10" placeholder="Your name" {...field} />
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
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-4 w-4" />
                          <Input className="pl-10" type="email" placeholder="Your email" {...field} />
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
                      <FormLabel>Phone</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 h-4 w-4" />
                          <Input className="pl-10" placeholder="Your phone number" {...field} />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Message</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="How can we help you?" 
                          className="min-h-[120px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Send className="h-4 w-4" />
                      Send Message
                    </span>
                  )}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
