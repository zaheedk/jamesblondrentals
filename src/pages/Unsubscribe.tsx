import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2, MailX } from 'lucide-react';
import PageSEO from '@/components/PageSEO';

type Status = 'loading' | 'valid' | 'already_unsubscribed' | 'invalid' | 'success' | 'error';

const Unsubscribe = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<Status>('loading');
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus('invalid');
      return;
    }
    const validate = async () => {
      try {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        const anonKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;
        const res = await fetch(
          `${supabaseUrl}/functions/v1/handle-email-unsubscribe?token=${token}`,
          { headers: { apikey: anonKey } }
        );
        const data = await res.json();
        if (!res.ok) {
          setStatus('invalid');
        } else if (data.valid === false && data.reason === 'already_unsubscribed') {
          setStatus('already_unsubscribed');
        } else if (data.valid) {
          setStatus('valid');
        } else {
          setStatus('invalid');
        }
      } catch {
        setStatus('invalid');
      }
    };
    validate();
  }, [token]);

  const handleUnsubscribe = async () => {
    if (!token) return;
    setProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('handle-email-unsubscribe', {
        body: { token },
      });
      if (error) throw error;
      if (data?.success) {
        setStatus('success');
      } else if (data?.reason === 'already_unsubscribed') {
        setStatus('already_unsubscribed');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="container mx-auto py-20 px-4 flex items-center justify-center min-h-[60vh]">
      <PageSEO
        title="Email Unsubscribe | James Blond Rentals"
        description="Manage your James Blond Rentals email subscription preferences and unsubscribe from marketing communications."
        noindex
      />
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Email Preferences</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          {status === 'loading' && (
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-muted-foreground">Validating your request...</p>
            </div>
          )}
          {status === 'valid' && (
            <div className="flex flex-col items-center gap-4">
              <MailX className="h-12 w-12 text-muted-foreground" />
              <p>Would you like to unsubscribe from James Blond Car Rentals emails?</p>
              <Button onClick={handleUnsubscribe} disabled={processing} variant="destructive">
                {processing ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                {processing ? 'Processing...' : 'Confirm Unsubscribe'}
              </Button>
            </div>
          )}
          {status === 'success' && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <p className="font-medium">You have been unsubscribed</p>
              <p className="text-sm text-muted-foreground">You will no longer receive emails from us.</p>
            </div>
          )}
          {status === 'already_unsubscribed' && (
            <div className="flex flex-col items-center gap-3">
              <CheckCircle className="h-12 w-12 text-muted-foreground" />
              <p className="font-medium">Already unsubscribed</p>
              <p className="text-sm text-muted-foreground">You were already unsubscribed from our emails.</p>
            </div>
          )}
          {status === 'invalid' && (
            <div className="flex flex-col items-center gap-3">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="font-medium">Invalid or expired link</p>
              <p className="text-sm text-muted-foreground">This unsubscribe link is no longer valid.</p>
            </div>
          )}
          {status === 'error' && (
            <div className="flex flex-col items-center gap-3">
              <XCircle className="h-12 w-12 text-destructive" />
              <p className="font-medium">Something went wrong</p>
              <p className="text-sm text-muted-foreground">Please try again or contact us at info@jamesblond.co.nz</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Unsubscribe;
