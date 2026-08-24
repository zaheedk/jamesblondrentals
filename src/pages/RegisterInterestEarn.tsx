import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Check, Mail, Phone, ArrowRight, Truck, Wallet, ShieldCheck, TrendingUp } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import JsonLd from '@/components/JsonLd';
import { supabase } from '@/integrations/supabase/client';
import { brandedEmailHtml } from '@/lib/email-template';
import heroImage from '@/assets/earn-from-your-van-hero.jpg';

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

const schema = z.object({
  name: z.string().trim().min(2, { message: 'Please enter your full name.' }).max(100),
  email: z.string().trim().email({ message: 'Please enter a valid email address.' }).max(255),
  phone: z
    .string()
    .trim()
    .min(6, { message: 'Please enter a valid phone number.' })
    .max(30)
    .regex(/^[0-9+()\s-]+$/, { message: 'Phone can only contain numbers, spaces and + ( ) -' }),
});

type FormValues = z.infer<typeof schema>;

const benefits = [
  { Icon: Wallet, title: 'Share of net revenue', text: 'Your van, ute or truck earns while we handle bookings and payments.' },
  { Icon: TrendingUp, title: 'Real demand', text: 'Our commercial fleet pages and Google Ads already bring daily enquiries.' },
  { Icon: ShieldCheck, title: 'We manage the admin', text: 'Rental agreements, driver checks, bonds, damage claims and infringements.' },
  { Icon: Truck, title: 'You keep the asset', text: 'The vehicle stays in your name — block out dates when you need it.' },
];

const steps = [
  { title: 'Register your interest', text: 'Send us your name, email and phone. No obligation and no joining fee.' },
  { title: 'We assess demand and fit', text: 'We check utilisation and rates for your vehicle type and branch, then walk you through the revenue share.' },
  { title: 'Your vehicle starts earning', text: 'We list it, take the bookings and handle the admin. You receive a monthly statement and payout.' },
];



const RegisterInterestEarn = () => {
  const [submitted, setSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: '', email: '', phone: '' },
  });

  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    try {
      const html = brandedEmailHtml('Earn From Your Van or Truck – New Interest', `
        <p>A vehicle owner has registered their interest.</p>
        <p><strong>Name:</strong> ${escapeHtml(values.name)}</p>
        <p><strong>Email:</strong> ${escapeHtml(values.email)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(values.phone)}</p>
        <p style="color:#666;font-size:12px;">Submitted via /earn-from-your-van-or-truck on jamesblond.co.nz</p>
      `);

      const { error } = await supabase.functions.invoke('send-email-resend', {
        body: {
          to: 'zaheed@jamesblond.co.nz',
          subject: `Earn From Your Van or Truck: ${values.name}`,
          html,
          replyTo: values.email,
        },
      });

      if (error) throw error;

      setSubmitted(true);
      form.reset();
      toast.success('Thanks! We will be in touch shortly.');
    } catch (err) {
      toast.error('Sorry, we could not send your details. Please try again or call 0800 525 663.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <PageSEO
        title="Earn From Your Van or Truck – Register Interest | James Blond"
        description="Own a van, ute or truck sitting idle? Register your interest and earn a share of the rental revenue while James Blond handles bookings, payments and admin."
        canonical="/earn-from-your-van-or-truck"
      />
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'WebPage',
          name: 'Earn From Your Van or Truck – Register Interest',
          url: 'https://www.jamesblond.co.nz/earn-from-your-van-or-truck',
          description:
            'Register your interest to earn rental revenue from your van, ute or truck with James Blond Rentals.',
        }}
      />

      <section className="relative overflow-hidden border-b border-border bg-gradient-to-br from-primary/5 via-background to-background">
        <div className="pointer-events-none absolute -top-32 -right-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="container relative mx-auto px-6 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 bg-card border border-border shadow-sm rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide uppercase text-primary mb-6">
              <Truck className="w-4 h-4" />
              Vehicle Owner Partnerships
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6">
              Earn from your van or truck
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              If your cargo van, ute, furniture truck or minibus spends most of the week parked, it can be
              earning instead. Register your interest and our team will talk you through how the
              revenue share works.
            </p>

            <ul className="grid sm:grid-cols-2 gap-3 mb-8">
              {['No joining fee', 'Monthly payouts', 'We handle the bookings', 'You keep the asset'].map((point) => (
                <li key={point} className="flex items-center gap-2 text-sm font-medium text-foreground">
                  <Check className="h-4 w-4 text-primary shrink-0" /> {point}
                </li>
              ))}
            </ul>

            <div className="relative mb-8">
              <img
                src={heroImage}
                alt="Van owner handing keys to a James Blond rental agent"
                width={1280}
                height={960}
                className="w-full rounded-3xl border border-border shadow-lg object-cover aspect-[16/10]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <Button variant="outline" asChild>
                <a href="tel:0800525663">
                  <Phone className="mr-2 h-4 w-4" /> 0800 525 663
                </a>
              </Button>
              <Button variant="ghost" asChild>
                <Link to="/list-your-vehicle" className="inline-flex items-center gap-1">
                  How it works <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </Button>
            </div>
          </div>


          <Card className="lg:sticky lg:top-24 border-border/70 shadow-xl rounded-3xl">
            <CardContent className="p-6 md:p-8">
              <div className="mb-6 hidden lg:flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                <Wallet className="h-4 w-4" /> Free, no obligation
              </div>
              {submitted ? (
                <div className="text-center py-8">
                  <div className="mx-auto mb-4 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="w-6 h-6 text-primary" />
                  </div>
                  <h2 className="text-xl font-bold mb-2">Thanks — we have your details</h2>
                  <p className="text-muted-foreground">
                    Our team will be in touch shortly to discuss your vehicle. If it is urgent, call{' '}
                    <a href="tel:0800525663" className="text-primary font-medium">0800 525 663</a>.
                  </p>
                </div>
              ) : (
                <>
                  <h2 className="text-2xl font-bold mb-2">Register your interest</h2>
                  <p className="text-sm text-muted-foreground mb-6">
                    Three details, no obligation. We will call or email you back.
                  </p>
                  <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Full name</FormLabel>
                            <FormControl>
                              <Input placeholder="Your full name" autoComplete="name" {...field} />
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
                            <FormLabel>Email address</FormLabel>
                            <FormControl>
                              <Input type="email" placeholder="you@example.com" autoComplete="email" {...field} />
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
                            <FormLabel>Phone number</FormLabel>
                            <FormControl>
                              <Input type="tel" placeholder="021 123 4567" autoComplete="tel" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit" variant="cta" className="w-full" size="lg" disabled={isSubmitting}>
                        {isSubmitting ? 'Sending...' : (
                          <span className="inline-flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Register my interest
                          </span>
                        )}
                      </Button>
                      <p className="text-xs text-muted-foreground text-center">
                        We only use your details to contact you about listing your vehicle.
                      </p>
                    </form>
                  </Form>
                </>
              )}
            </CardContent>
          </Card>
        </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 md:py-20">
        <div className="max-w-2xl mb-10">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-3">Why owners partner with us</h2>
          <p className="text-muted-foreground">
            You own the vehicle. We bring the customers and run the rental end to end.
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {benefits.map(({ Icon, title, text }) => (
            <div
              key={title}
              className="group border border-border rounded-2xl p-6 bg-card hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold mb-2 text-base">{title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-muted/30 border-y border-border py-16 md:py-20">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-10">How it works</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {steps.map((step, i) => (
              <div key={step.title} className="relative bg-card border border-border rounded-2xl p-6">
                <span className="absolute -top-4 left-6 w-9 h-9 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center shadow-md">
                  {i + 1}
                </span>
                <h3 className="font-semibold mt-4 mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-4">
            <Button size="lg" variant="cta" asChild>
              <a href="#top" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }); }}>
                <Mail className="mr-2 h-4 w-4" /> Register my interest
              </a>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <a href="tel:0800525663">
                <Phone className="mr-2 h-4 w-4" /> 0800 525 663
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};


export default RegisterInterestEarn;
