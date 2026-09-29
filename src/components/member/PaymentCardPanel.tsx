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
    const ref = params.get('card_ref');
    const result = params.get('result');
    (async () => {
      const onceKey = `card-confirm-${result}`;
      if (ref && result && !sessionStorage.getItem(onceKey)) {
        sessionStorage.setItem(onceKey, '1');
        setBusy(true);
        const { data, error } = await supabase.functions.invoke('rcm-save-card', { body: { action: 'confirm', ref, result } });
        if (error) toast.error('We could not confirm your card yet. Please try again.');
        else if (data?.status === 'active') toast.success('Card saved securely on your booking');
        else toast.error(data?.message || 'Card was not saved. Please try again.');
        setBusy(false);
      }
      if (ref || result) {
        ['card_ref', 'result', 'userid'].forEach((k) => params.delete(k));
        const q = params.toString();
        window.history.replaceState({}, '', window.location.pathname + (q ? `?${q}` : ''));
      }
      await load();
    })();
  }, [load]);

  const start = async () => {
    setBusy(true);
    try {
      const returnUrl = `${window.location.origin}/member-dashboard?tab=card`;
      const { data, error } = await supabase.functions.invoke('rcm-save-card', {
        body: { action: 'start', returnUrl },
      });
      if (error || !data?.checkoutUrl) {
        let msg = data?.error || '';
        try { msg = msg || (await (error as any)?.context?.json?.())?.error || ''; } catch { /* ignore */ }
        throw new Error(msg || 'Could not open the secure card page. Please try again.');
      }
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
                {(card?.card_brand || 'Card').toUpperCase()}
                {card?.card_last4 ? ` ending in •••• ${card.card_last4}` : ' saved securely'}
                {card?.card_expiry ? ` · expires ${card.card_expiry}` : ''}
              </p>
            ) : (
              <p className="text-sm text-muted-foreground mt-1">
                Save a card now so pick-up is quicker. It's saved on your booking and only charged at the counter — nothing is charged today.
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
        <Lock className="w-3 h-3" /> Card details are entered on Windcave's secure page. James Blond never sees or stores your card number.
      </p>
    </div>
  );
}
