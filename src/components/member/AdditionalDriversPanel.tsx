import { useCallback, useEffect, useMemo, useState } from 'react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { Camera, CheckCircle2, Loader2, Plus, Trash2, UserPlus } from 'lucide-react';
import { syncToRcm } from '@/lib/rcm-sync';

const schema = z.object({
  first_name: z.string().trim().max(100),
  last_name: z.string().trim().max(100),
  dob: z.string(),
  email: z.string().trim().email('Enter a valid email').max(255).or(z.literal('')),
  phone: z.string().trim().max(30),
  address: z.string().trim().max(200),
  suburb: z.string().trim().max(100),
  city: z.string().trim().max(100),
  postcode: z.string().trim().max(20),
  country: z.string().trim().max(60),
  license_number: z.string().trim().max(40),
  license_expiry: z.string(),
  license_country: z.string().trim().max(60),
}).refine((data) => data.first_name || data.last_name, { message: 'Enter at least a first or last name', path: ['first_name'] });

type Form = z.infer<typeof schema>;
type Driver = Form & { id: string; licence_front_path: string | null; licence_back_path: string | null };

const empty: Form = {
  first_name: '', last_name: '', dob: '', email: '', phone: '', address: '', suburb: '', city: '',
  postcode: '', country: 'New Zealand', license_number: '', license_expiry: '', license_country: 'New Zealand',
};

const FIELDS: { key: keyof Form; label: string; type?: string; span?: boolean }[] = [
  { key: 'first_name', label: 'First name' }, { key: 'last_name', label: 'Last name' },
  { key: 'dob', label: 'Date of birth', type: 'date' }, { key: 'phone', label: 'Mobile', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email', span: true }, { key: 'address', label: 'Home address', span: true },
  { key: 'suburb', label: 'Suburb' }, { key: 'city', label: 'City' }, { key: 'postcode', label: 'Postcode' },
  { key: 'country', label: 'Country' }, { key: 'license_number', label: 'Licence number' },
  { key: 'license_expiry', label: 'Licence expiry', type: 'date' },
  { key: 'license_country', label: 'Licence issued in', span: true },
];

type Props = { bookingId: string; reservationReference: string | null; readOnly?: boolean };

export default function AdditionalDriversPanel({ bookingId, reservationReference, readOnly = false }: Props) {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [assignedIds, setAssignedIds] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedDriver, setSelectedDriver] = useState('');
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const [driverResult, assignmentResult] = await Promise.all([
      supabase.from('additional_drivers').select('*').eq('user_id', user.id).order('created_at'),
      supabase.from('booking_additional_drivers').select('driver_id').eq('booking_id', bookingId),
    ]);
    if (driverResult.error || assignmentResult.error) toast.error(driverResult.error?.message || assignmentResult.error?.message);
    setDrivers((driverResult.data || []) as Driver[]);
    setAssignedIds((assignmentResult.data || []).map((row) => row.driver_id));
    setLoading(false);
  }, [bookingId, user]);

  useEffect(() => { load(); }, [load]);

  const assigned = useMemo(() => drivers.filter((driver) => assignedIds.includes(driver.id)), [drivers, assignedIds]);
  const available = useMemo(() => drivers.filter((driver) => !assignedIds.includes(driver.id)), [drivers, assignedIds]);

  const sync = (driver: Driver, removed = false) => syncToRcm('drivers', {
    bookingId,
    reservationReference,
    driverId: driver.id,
    removed: removed ? { first_name: driver.first_name, last_name: driver.last_name } : undefined,
  });

  const assign = async (driverId: string) => {
    if (!user || !reservationReference) return;
    setSaving(true);
    const { error } = await supabase.from('booking_additional_drivers').insert({
      user_id: user.id, booking_id: bookingId, driver_id: driverId,
    });
    setSaving(false);
    if (error) return toast.error(error.message);
    const driver = drivers.find((item) => item.id === driverId);
    setSelectedDriver('');
    await load();
    if (driver) await sync(driver);
  };

  const save = async () => {
    if (!user || !form || !reservationReference) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) return toast.error(parsed.error.issues[0].message);
    setSaving(true);
    const row = Object.fromEntries(Object.entries(parsed.data).map(([key, value]) => [key, value === '' ? null : value]));
    let driverId = editingId;
    if (editingId) {
      const { error } = await supabase.from('additional_drivers').update(row).eq('id', editingId).eq('user_id', user.id);
      if (error) { setSaving(false); return toast.error(error.message); }
    } else {
      const { data, error } = await supabase.from('additional_drivers').insert({ ...row, user_id: user.id } as any).select().single();
      if (error || !data) { setSaving(false); return toast.error(error?.message || 'Could not save driver'); }
      driverId = data.id;
      const { error: assignmentError } = await supabase.from('booking_additional_drivers').insert({
        user_id: user.id, booking_id: bookingId, driver_id: driverId,
      });
      if (assignmentError) { setSaving(false); return toast.error(assignmentError.message); }
    }
    setSaving(false);
    const saved = { ...parsed.data, id: driverId as string, licence_front_path: null, licence_back_path: null };
    toast.success(editingId ? 'Driver updated for this booking' : 'Driver added to this booking');
    setForm(null);
    setEditingId(null);
    await load();
    await sync(saved);
  };

  const unassign = async (driver: Driver) => {
    const { error } = await supabase.from('booking_additional_drivers')
      .delete().eq('booking_id', bookingId).eq('driver_id', driver.id);
    if (error) return toast.error(error.message);
    await load();
    await sync(driver, true);
  };

  const upload = async (driver: Driver, side: 'front' | 'back', file: File) => {
    if (!user) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return toast.error('Please upload a photo or PDF');
    if (file.size > 8 * 1024 * 1024) return toast.error('File is too large (max 8MB)');
    setUploading(`${driver.id}-${side}`);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/drivers/${driver.id}-${side}-${Date.now()}.${ext}`;
    const { error } = await supabase.storage.from('customer-documents').upload(path, file, { contentType: file.type });
    if (error) { setUploading(null); return toast.error(error.message); }
    const column = side === 'front' ? 'licence_front_path' : 'licence_back_path';
    const oldPath = driver[column];
    await supabase.from('additional_drivers').update({ [column]: path }).eq('id', driver.id).eq('user_id', user.id);
    if (oldPath) await supabase.storage.from('customer-documents').remove([oldPath]);
    setUploading(null);
    toast.success('Licence photo uploaded');
    load();
  };

  if (loading) return <div className="flex justify-center py-6"><Loader2 className="h-5 w-5 animate-spin text-primary" /></div>;

  return (
    <section className="mt-4 border-t border-border pt-4">
      <div className="flex items-start gap-2.5">
        <UserPlus className="mt-0.5 h-4 w-4 text-primary" />
        <div>
          <h4 className="font-semibold text-foreground">Additional drivers</h4>
          <p className="text-xs text-muted-foreground">Drivers added here apply only to this booking.</p>
        </div>
      </div>

      {assigned.length === 0 && <p className="mt-3 text-sm text-muted-foreground">No additional drivers on this booking.</p>}
      <div className="mt-3 divide-y divide-border rounded-md border border-border bg-card">
        {assigned.map((driver) => (
          <div key={driver.id} className="p-3">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="font-medium text-foreground">{driver.first_name} {driver.last_name}</p>
                <p className="text-xs text-muted-foreground">Licence {driver.license_number} · expires {driver.license_expiry}</p>
              </div>
              {!readOnly && (
                <div className="flex gap-1">
                  <Button variant="outline" size="sm" onClick={() => {
                    setEditingId(driver.id);
                    const next = { ...empty, ...Object.fromEntries(Object.keys(empty).map((key) => [key, (driver as any)[key] ?? ''])) } as Form;
                    setForm(next);
                  }}>Edit</Button>
                  <Button variant="ghost" size="icon" aria-label={`Remove ${driver.first_name} from this booking`} onClick={() => unassign(driver)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {!readOnly && (
              <div className="mt-3 flex flex-wrap gap-2">
                {(['front', 'back'] as const).map((side) => {
                  const hasFile = side === 'front' ? driver.licence_front_path : driver.licence_back_path;
                  const busy = uploading === `${driver.id}-${side}`;
                  return (
                    <label key={side} className="cursor-pointer">
                      <input type="file" accept="image/*,application/pdf" capture="environment" className="hidden"
                        onChange={(event) => { const file = event.target.files?.[0]; if (file) upload(driver, side, file); event.target.value = ''; }} />
                      <span className="inline-flex items-center gap-1.5 rounded-md border border-border px-2.5 py-1.5 text-xs text-foreground hover:bg-muted">
                        {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : hasFile ? <CheckCircle2 className="h-3.5 w-3.5 text-primary" /> : <Camera className="h-3.5 w-3.5" />}
                        Licence {side}{hasFile ? ' (replace)' : ''}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>

      {!readOnly && reservationReference && !form && (
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          {available.length > 0 && (
            <div className="flex min-w-0 flex-1 gap-2">
              <Select value={selectedDriver} onValueChange={setSelectedDriver}>
                <SelectTrigger><SelectValue placeholder="Choose a past driver" /></SelectTrigger>
                <SelectContent>
                  {available.map((driver) => <SelectItem key={driver.id} value={driver.id}>{driver.first_name} {driver.last_name}</SelectItem>)}
                </SelectContent>
              </Select>
              <Button variant="outline" disabled={!selectedDriver || saving} onClick={() => assign(selectedDriver)}>Add</Button>
            </div>
          )}
          <Button onClick={() => { setEditingId(null); setForm(empty); }}><Plus className="mr-2 h-4 w-4" />New driver</Button>
        </div>
      )}

      {!reservationReference && <p className="mt-3 text-xs text-muted-foreground">Drivers can be added once this booking is confirmed.</p>}

      {form && (
        <div className="mt-4 space-y-4 border-t border-border pt-4">
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELDS.map((field) => (
              <div key={field.key} className={field.span ? 'sm:col-span-2' : ''}>
                <Label htmlFor={`${bookingId}-${field.key}`}>{field.label}</Label>
                <Input id={`${bookingId}-${field.key}`} type={field.type || 'text'} value={form[field.key]}
                  onChange={(event) => setForm({ ...form, [field.key]: event.target.value })} />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">This driver will be retained so you can use them on a future booking.</p>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}Save driver</Button>
            <Button variant="ghost" onClick={() => { setForm(null); setEditingId(null); }}>Cancel</Button>
          </div>
        </div>
      )}
    </section>
  );
}