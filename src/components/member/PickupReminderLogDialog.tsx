import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ClipboardList, RefreshCw, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';

export default function PickupReminderLogDialog() {
  const [open, setOpen] = useState(false);
  const [channel, setChannel] = useState('all');
  const [page, setPage] = useState(0);
  const [statuses, setStatuses] = useState<Record<string, string>>({});
  const [checking, setChecking] = useState<string | null>(null);
  const records = useQuery({
    queryKey: ['pickup-reminder-log', channel, page], enabled: open,
    queryFn: async () => {
      let query = supabase.from('pickup_activation_reminder_log').select('*', { count: 'exact' })
        .order('sent_at', { ascending: false }).order('id').range(page * 25, page * 25 + 24);
      if (channel !== 'all') query = query.eq('channel', channel);
      const { data, error, count } = await query;
      if (error) throw error;
      return { rows: data ?? [], count: count ?? 0 };
    },
  });
  const settings = useQuery({
    queryKey: ['pickup-reminder-settings'], enabled: open,
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('send-pickup-activation-reminders', { body: { settings: true } });
      if (error || data?.error) throw new Error('Unable to read reminder settings.');
      return data as { smsEnabled: boolean };
    },
  });
  async function checkDelivery(id: string) {
    setChecking(id);
    try {
      const { data, error } = await supabase.functions.invoke('send-pickup-activation-reminders', { body: { smsStatusId: id } });
      if (error || data?.error) throw new Error('Unable to check delivery.');
      setStatuses(prev => ({ ...prev, [id]: data.success > 0 ? 'Delivered' : data.failed > 0 ? 'Failed delivery' : 'Pending delivery' }));
    } catch {
      setStatuses(prev => ({ ...prev, [id]: 'Delivery check unavailable' }));
    } finally { setChecking(null); }
  }
  const count = records.data?.count ?? 0;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="w-full justify-start gap-2 whitespace-nowrap"><ClipboardList className="h-4 w-4" />Pick-up reminder logs</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle>Pick-up reminder logs</DialogTitle></DialogHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground">Customer texts: {settings.isError ? 'Status unavailable' : settings.isPending ? 'Checking…' : settings.data?.smsEnabled ? 'Live · daily at 9am NZ during daylight saving' : 'Paused'}</p>
          <div className="flex items-center gap-2">
            <Select value={channel} onValueChange={value => { setChannel(value); setPage(0); }}>
              <SelectTrigger className="w-36" aria-label="Message channel"><SelectValue /></SelectTrigger>
              <SelectContent><SelectItem value="all">Email & text</SelectItem><SelectItem value="email">Email</SelectItem><SelectItem value="sms">Text</SelectItem></SelectContent>
            </Select>
            <Button variant="outline" size="icon" title="Refresh logs" aria-label="Refresh logs" disabled={records.isFetching} onClick={() => { void records.refetch(); void settings.refetch(); }}><RefreshCw className="h-4 w-4" /></Button>
          </div>
        </div>
        {records.isError ? <p role="alert" className="text-destructive text-sm">Unable to load logs. Please check your admin sign-in and retry.</p> : records.isPending ? <p role="status">Loading reminders…</p> : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="border-b border-border text-muted-foreground"><tr><th className="p-2">Sent (NZ)</th><th className="p-2">Booking</th><th className="p-2">Customer</th><th className="p-2">Channel</th><th className="p-2">Status</th></tr></thead>
                <tbody>{records.data?.rows.map(row => (
                  <tr key={row.id} className="border-b border-border align-top">
                    <td className="p-2 whitespace-nowrap">{new Date(row.sent_at).toLocaleString('en-NZ', { timeZone: 'Pacific/Auckland', dateStyle: 'medium', timeStyle: 'short' })}</td>
                    <td className="p-2 whitespace-nowrap">{row.booking_reference}</td><td className="p-2 break-all">{row.customer_email}</td><td className="p-2">{row.channel === 'sms' ? 'Text · TNZ' : 'Email'}</td>
                    <td className="p-2"><span>{row.provider_id ? statuses[row.provider_id] || 'Accepted by provider' : 'Submission pending'}</span>
                      {row.channel === 'sms' && row.provider_id && <Button variant="link" size="sm" className="px-0 block" disabled={checking !== null} onClick={() => { if (row.provider_id) void checkDelivery(row.provider_id); }}>{checking === row.provider_id ? 'Checking…' : 'Check delivery'}</Button>}
                      {row.provider_id && <span className="block text-xs text-muted-foreground break-all">{row.provider_id}</span>}
                    </td>
                  </tr>
                ))}</tbody>
              </table>
              {count === 0 && <p className="py-8 text-center text-muted-foreground">No {channel === 'sms' ? 'customer texts' : 'reminders'} recorded yet.</p>}
            </div>
            <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
              <span>{count === 0 ? '0 records' : `${page * 25 + 1}–${Math.min((page + 1) * 25, count)} of ${count}`}</span>
              <div className="flex gap-2"><Button variant="outline" size="icon" aria-label="Previous page" disabled={page === 0 || records.isFetching} onClick={() => setPage(p => p - 1)}><ChevronLeft className="h-4 w-4" /></Button><Button variant="outline" size="icon" aria-label="Next page" disabled={(page + 1) * 25 >= count || records.isFetching} onClick={() => setPage(p => p + 1)}><ChevronRight className="h-4 w-4" /></Button></div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}