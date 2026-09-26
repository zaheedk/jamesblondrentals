import { useCallback, useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { CreditCard, Loader2, Lock, CheckCircle2 } from 'lucide-react';

interface SavedCard {
  card_brand: string | null;
  card_last4: string | null;
  card_expiry: string | null;
  status: string;
}

export default function PaymentCardPanel() {
  const { user } = useAuth();
  const [card, setCard] = useState<SavedCard | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    if (!user) return;
    const { data } = await supabase
      .from('saved_payment_methods')
      .select('card_brand, card_last4, card_expiry, status')
      .eq('user_id', user.id)
      .maybeSingle();
    setCard(data as SavedCard | null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const result = params.get('card_result');
    (async () => {
      if (result === 'success') {
        setBusy(true);
        const { error } = await supabase.functions.invoke('airwallex-save-card', { body: { action: 'confirm' } });
        if (error) toast.error('We could not confirm your card yet — please refresh in a minute');
        else toast.success('Card saved securely');
        setBusy(false);
      } else if (result === 'failed') {
        toast.error('Card was not saved. Please try again.');
      }
      if (result) {
        params.delete('card_result');
        const q = params.toString();
        window.history.replaceState({}, '', window.location.pathname + (q ? `?${q}` : '') + '#card');
      }
      await load();
    })();
  }, [load]);

  const start = async () => {
    setBusy(true);
    try {
      const returnUrl = `${window.location.origin}/member-dashboard?tab=card`;
      const { data, error } = await supabase.functions.invoke('airwallex-save-card', {
        body: { action: 'start', returnUrl },
      });
      if (error || !data?.checkoutUrl) throw new Error(data?.error || error?.message || 'Could not open secure link');
      window.location.href = data.checkoutUrl;
    } catch (e: any) {
      toast.error(e.message);
      setBusy(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;
  }

  const active = card?.status === 'active';

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      <div className="rounded-lg border bg-card p-6">
        <div className="flex items-start gap-4">
          <CreditCard className="w-6 h-6 text-primary mt-1" />
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <p className="font-semibold text-foreground">Card for pick-up</p>
              {active && <Badge><CheckCircle2 className="w-3 h-3 mr-1" /> Saved</Badge>}
            </div>
            {active ? (
              <p className="text-sm text-muted-foreground mt-1">
                {(card?.card_brand || 'Card').toUpperCase()} ending {card?.card_last4 ?? '••••'}
                {card?.card_expiry ? ` · expires ${card.card_expiry}` : ''}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Save a card now so pick-up is quicker. We only charge it for your rental at the counter — nothing is charged today.
              </p>
            )}
            <Button className="mt-4" onClick={start} disabled={busy}>
              {busy && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {active ? 'Replace card' : 'Add card securely'}
            </Button>
          </div>
        </div>
      </div>
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        <Lock className="w-3 h-3" /> Card details are entered on Airwallex's secure page. James Blond never sees or stores your card number.
      </p>
    </div>
  );
}
