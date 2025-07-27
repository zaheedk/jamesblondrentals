import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { supabase } from '@/lib/supabase-client';
import { validation, sanitizeText } from '@/lib/security';
import { useSecurity } from '@/components/security/SecurityProvider';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(6, { message: "Please enter a valid phone number." }),
  message: z.string().min(10, { message: "Message must be at least 10 characters." }),
  captcha: z.string().min(1, { message: "Please solve the captcha." }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { checkFormRateLimit, csrfToken } = useSecurity();
  const [captchaQuestion, setCaptchaQuestion] = useState(() => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    return { num1, num2, answer: (num1 + num2).toString() };
  });

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      captcha: "",
    },
  });

  const refreshCaptcha = () => {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    setCaptchaQuestion({ num1, num2, answer: (num1 + num2).toString() });
    form.setValue('captcha', '');
  };

  const onSubmit = async (values: ContactFormValues) => {
    // Security validations
    if (values.captcha !== captchaQuestion.answer) {
      toast.error("Incorrect captcha answer. Please try again.");
      refreshCaptcha();
      return;
    }

    // Rate limiting check
    const clientId = `contact_${values.email.toLowerCase()}`;
    if (!checkFormRateLimit(clientId)) {
      toast.error("Too many submissions. Please wait before trying again.");
      return;
    }

    // Enhanced validation
    if (!validation.email(values.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }

    if (!validation.maxLength(values.message, 5000)) {
      toast.error("Message is too long. Please keep it under 5000 characters.");
      return;
    }

    if (!validation.noScriptTags(values.message)) {
      toast.error("Invalid content detected in message.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Sanitize all input data
      const sanitizedData = {
        name: sanitizeText(values.name),
        email: sanitizeText(values.email),
        phone: sanitizeText(values.phone),
        message: sanitizeText(values.message)
      };

      const emailHtml = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${sanitizedData.name}</p>
        <p><strong>Email:</strong> ${sanitizedData.email}</p>
        <p><strong>Phone:</strong> ${sanitizedData.phone}</p>
        <p><strong>Message:</strong></p>
        <p>${sanitizedData.message.replace(/\n/g, '<br>')}</p>
        <hr>
        <p><em>This message was sent via the Auckland contact form on jamesblond.co.nz</em></p>
      `;

      const { error } = await supabase.functions.invoke('send-email', {
        body: {
          to: 'info@jamesblond.co.nz',
          subject: `Contact Form: ${sanitizedData.name} - ${sanitizedData.email}`,
          html: emailHtml,
          type: 'contact-form',
          from_name: sanitizedData.name,
          from_email: sanitizedData.email,
          phone: sanitizedData.phone,
          message: sanitizedData.message,
          csrf_token: csrfToken
        }
      });

      if (error) {
        throw error;
      }

      toast.success("Thank you! Your message has been sent successfully. We'll get back to you soon.");
      form.reset();
      refreshCaptcha();
    } catch (error) {
      console.error('Error sending email:', error);
      toast.error("Sorry, there was an error sending your message. Please try again or call us directly.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Send us a Message</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your full name" {...field} />
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
                  <FormLabel>Email Address</FormLabel>
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
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="Your phone number" {...field} />
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
                      placeholder="Tell us about your rental needs or ask us a question..."
                      className="min-h-[120px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-center gap-4 mb-3">
                <span className="text-sm font-medium">Security Check:</span>
                <span className="text-lg font-mono">
                  {captchaQuestion.num1} + {captchaQuestion.num2} = ?
                </span>
                <Button type="button" variant="outline" size="sm" onClick={refreshCaptcha}>
                  Refresh
                </Button>
              </div>
              <FormField
                control={form.control}
                name="captcha"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Enter the answer" 
                        className="w-32"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

export default ContactForm;