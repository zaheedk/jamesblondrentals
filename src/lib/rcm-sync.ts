import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type SyncResult = { synced: string[]; skipped: string[]; failed: { booking: string; error: string }[] };
type DriverSyncOptions = {
  bookingId: string;
  reservationReference: string | null;
  driverId: string;
  removed?: { first_name: string; last_name: string };
};

/** Pushes saved portal details onto the customer's open RCM bookings and reports the outcome. */
export async function syncToRcm(action: 'profile', options?: never): Promise<void>;
export async function syncToRcm(action: 'drivers', options: DriverSyncOptions): Promise<void>;
export async function syncToRcm(action: 'profile' | 'drivers', options?: DriverSyncOptions) {
  const { data, error } = await supabase.functions.invoke<SyncResult>('rcm-sync-profile', { body: { action, ...options } });
  if (error || !data) {
    toast.warning('Saved, but not synced to your booking yet. Our team will update it for you.');
    return;
  }
  if (data.failed.length) {
    toast.warning(`Saved, but not synced to booking ${data.failed.map((f) => f.booking).join(', ')}. Our team will update it for you.`);
  } else if (data.synced.length) {
    toast.success(`Also updated on booking ${data.synced.join(', ')}`);
  }
}
