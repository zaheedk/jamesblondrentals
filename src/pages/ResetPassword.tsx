
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Lock, EyeOff, Eye } from 'lucide-react';
import PageSEO from '@/components/PageSEO';
import { completePasswordRecovery } from '@/lib/complete-password-recovery';


const formSchema = z.object({
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string().min(8, 'Password must be at least 8 characters'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type FormValues = z.infer<typeof formSchema>;

export default function ResetPassword() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkingLink, setCheckingLink] = useState(true);
  const [validLink, setValidLink] = useState(false);

  useEffect(() => {
    let active = true;
    // The auth client may already have consumed and cleared the recovery URL.
    // Wait for initialization and verify the user instead of checking that hash.
    const checkLink = async () => {
      try {
        const { data, error: authError } = await supabase.auth.getUser();
        if (!active) return;
        setValidLink(!authError && !!data.user);
        if (authError || !data.user) {
          setError('This link is invalid or has expired. Please request a new password reset link.');
        }
      } catch {
        if (active) setError('Unable to verify your link. Please refresh and try again.');
      } finally {
        if (active) setCheckingLink(false);
      }
    };
    void checkLink();
    return () => { active = false; };
  }, []);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: FormValues) => {
    if (checkingLink || !validLink) return;
    try {
      setIsSubmitting(true);
      setError(null);
      
      await completePasswordRecovery(
        data.password,
        password => supabase.auth.updateUser({ password }),
        async () => {
          const { data: verified, error: authError } = await supabase.auth.getUser();
          return !authError && !!verified.user;
        },
        destination => navigate(destination, { replace: true }),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to save your password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-12">
      <PageSEO title="Reset Password – James Blond Rentals" description="Set a new password for your James Blond Rentals account using your secure reset link." canonical="/reset-password" noindex />
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl">Set New Password</CardTitle>
          <CardDescription>
            Enter your new password below
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showPassword ? "text" : "password"}
                            className="pl-8"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Confirm New Password</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type={showConfirmPassword ? "text" : "password"}
                            className="pl-8"
                            {...field}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute right-0 top-0"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isSubmitting || checkingLink || !validLink}
                >
                  {checkingLink ? 'Checking link...' : isSubmitting ? 'Saving...' : 'Save password & continue'}
                </Button>
              </form>
            </Form>
        </CardContent>
      </Card>
    </div>
  );
}
