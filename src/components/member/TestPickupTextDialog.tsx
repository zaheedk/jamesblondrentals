import { useState } from 'react';
import { MessageSquare, Loader2, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';

export default function TestPickupTextDialog() {
  const [phone, setPhone] = useState('+64275353037');
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState('');
  const [failed, setFailed] = useState(false);

  async function sendTest() {
    setSending(true);
    setResult('');
    setFailed(false);
    try {
      const { data, error } = await supabase.functions.invoke('send-pickup-activation-reminders', {
        body: { testPhone: phone.trim() },
      });
      if (error) {
        const response = error.context;
        if (response instanceof Response) {
          if (response.status === 401) throw new Error('Your sign-in has expired. Please sign in again.');
          if (response.status === 403) throw new Error('An admin account is required to send test texts.');
          const details = await response.json().catch(() => null);
          if (details?.error) throw new Error(details.error);
        }
        throw new Error('The test text could not be sent. Please try again.');
      }
      if (data?.error) throw new Error(data.error);
      if (!data?.sms) throw new Error('TNZ did not confirm the test text submission.');
      setResult('Test text accepted by TNZ. Check your mobile; delivery is not yet confirmed.');
    } catch (error) {
      setFailed(true);
      setResult(error instanceof Error ? error.message : 'The test text could not be sent.');
    } finally {
      setSending(false);
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full justify-start gap-2 whitespace-nowrap">
          <MessageSquare className="h-4 w-4 shrink-0" />
          Send test text
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader><DialogTitle>Test pick-up reminder</DialogTitle></DialogHeader>
        <div className="space-y-2">
          <Label htmlFor="pickup-test-phone">NZ mobile number</Label>
          <Input id="pickup-test-phone" type="tel" value={phone} onChange={event => setPhone(event.target.value)} disabled={sending} autoComplete="tel" />
        </div>
        <blockquote className="border-l-2 border-primary pl-4 text-sm leading-relaxed text-muted-foreground break-words whitespace-pre-line">
          [SAMPLE] James Blond Rentals{'\n'}Hi Zaheed, you have a pick-up tomorrow at 09:00. Add your details here for a faster pick-up: https://www.jamesblond.co.nz/login Call 0800 525 663 if you need assistance. Reply STOP to opt out.
        </blockquote>
        {result && <p role={failed ? 'alert' : 'status'} className={`text-sm ${failed ? 'text-destructive' : 'text-foreground'}`}>{result}</p>}
        <Button onClick={sendTest} disabled={sending || !phone.trim()} className="gap-2">
          {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          {sending ? 'Sending…' : 'Send test text'}
        </Button>
      </DialogContent>
    </Dialog>
  );
}