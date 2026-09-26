import { useCallback, useEffect, useState } from 'react';
import { z } from 'zod';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Loader2, Plus, Trash2, UserPlus, Camera, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  first_name: z.string().trim().min(1, 'First name is required').max(100),
  last_name: z.string().trim().min(1, 'Last name is required').max(100),
  dob: z.string().min(1, 'Date of birth is required'),
  email: z.string().trim().email('Enter a valid email').max(255).or(z.literal('')),
  phone: z.string().trim().max(30),
  address: z.string().trim().max(200),
  suburb: z.string().trim().max(100),
  city: z.string().trim().max(100),
  postcode: z.string().trim().max(20),
  country: z.string().trim().max(60),
  license_number: z.string().trim().min(1, 'Licence number is required').max(40),
  license_expiry: z.string().min(1, 'Licence expiry is required'),
  license_country: z.string().trim().max(60),
});

type Form = z.infer<typeof schema>;
type Driver = Form & { id: string; licence_front_path: string | null; licence_back_path: string | null };

const empty: Form = {
  first_name: '', last_name: '', dob: '', email: '', phone: '', address: '', suburb: '', city: '',
  postcode: '', country: 'New Zealand', license_number: '', license_expiry: '', license_country: 'New Zealand',
};

const FIELDS: { key: keyof Form; label: string; type?: string; span?: boolean }[] = [
  { key: 'first_name', label: 'First name' },
  { key: 'last_name', label: 'Last name' },
  { key: 'dob', label: 'Date of birth', type: 'date' },
  { key: 'phone', label: 'Mobile', type: 'tel' },
  { key: 'email', label: 'Email', type: 'email', span: true },
  { key: 'address', label: 'Home address', span: true },
  { key: 'suburb', label: 'Suburb' },
  { key: 'city', label: 'City' },
  { key: 'postcode', label: 'Postcode' },
  { key: 'country', label: 'Country' },
  { key: 'license_number', label: 'Licence number' },
  { key: 'license_expiry', label: 'Licence expiry', type: 'date' },
  { key: 'license_country', label: 'Licence country', span: true },
];

export default function AdditionalDriversPanel() {
  const { user } = useAuth();
  const [drivers, setDrivers] = useState<Driver[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<Form | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    const { data, error } = await supabase
      .from('additional_drivers').select('*').eq('user_id', user.id).order('created_at');
    if (error) toast.error(error.message);
    setDrivers((data || []) as Driver[]);
    setLoading(false);
  }, [user]);

  useEffect(() => { load(); }, [load]);

  const save = async () => {
    if (!user || !form) return;
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const row = Object.fromEntries(
      Object.entries(parsed.data).map(([k, v]) => [k, v === '' ? null : v]),
    ) as Record<string, string | null>;
    const { error } = editingId
      ? await supabase.from('additional_drivers').update(row).eq('id', editingId)
      : await supabase.from('additional_drivers').insert({ ...row, user_id: user.id } as any);
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success('Driver saved');
    setForm(null);
    setEditingId(null);
    load();
  };

  const remove = async (d: Driver) => {
    const { error } = await supabase.from('additional_drivers').delete().eq('id', d.id);
    if (error) return toast.error(error.message);
    const paths = [d.licence_front_path, d.licence_back_path].filter(Boolean) as string[];
    if (paths.length) await supabase.storage.from('customer-documents').remove(paths);
    load();
  };

  const upload = async (d: Driver, side: 'front' | 'back', file: File) => {
    if (!user) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') return toast.error('Please upload a photo or PDF');
    if (file.size > 8 * 1024 * 1024) return toast.error('File is too large (max 8MB)');
    setUploading(`${d.id}-${side}`);
    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
    const path = `${user.id}/drivers/${d.id}-${side}-${Date.now()}.${ext}`;
    const { error: upErr } = await supabase.storage.from('customer-documents').upload(path, file, { contentType: file.type });
    if (upErr) { setUploading(null); return toast.error(upErr.message); }
    const col = side === 'front' ? 'licence_front_path' : 'licence_back_path';
    const old = d[col];
    await supabase.from('additional_drivers').update({ [col]: path }).eq('id', d.id);
    if (old) await supabase.storage.from('customer-documents').remove([old]);
    setUploading(null);
    toast.success('Licence photo uploaded');
    load();
  };

  if (loading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      <div className="rounded-lg border bg-card p-5 flex items-start gap-3">
        <UserPlus className="w-5 h-5 mt-0.5 text-primary" />
        <div>
          <p className="font-semibold text-foreground">Additional drivers</p>
          <p className="text-sm text-muted-foreground">
            Add anyone else who will drive. Their details go straight onto your rental agreement, so there is less paperwork at pick-up.
          </p>
        </div>
      </div>

      {drivers.map((d) => (
        <div key={d.id} className="rounded-lg border bg-card p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-foreground">{d.first_name} {d.last_name}</p>
              <p className="text-sm text-muted-foreground">Licence {d.license_number} · expires {d.license_expiry}</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => { setEditingId(d.id); setForm({ ...empty, ...Object.fromEntries(Object.keys(empty).map((k) => [k, (d as any)[k] ?? ''])) } as Form); }}>
                Edit
              </Button>
              <Button variant="ghost" size="sm" onClick={() => remove(d)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-4">
            {(['front', 'back'] as const).map((side) => {
              const has = side === 'front' ? d.licence_front_path : d.licence_back_path;
              const busy = uploading === `${d.id}-${side}`;
              return (
                <label key={side} className="cursor-pointer">
                  <input type="file" accept="image/*,application/pdf" capture="environment" className="hidden"
                    onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(d, side, f); e.target.value = ''; }} />
                  <span className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
                    {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : has ? <CheckCircle2 className="w-4 h-4 text-primary" /> : <Camera className="w-4 h-4" />}
                    Licence {side}{has ? ' (replace)' : ''}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}

      {form ? (
        <div className="rounded-lg border bg-card p-5 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            {FIELDS.map((f) => (
              <div key={f.key} className={f.span ? 'sm:col-span-2' : ''}>
                <Label htmlFor={f.key}>{f.label}</Label>
                <Input id={f.key} type={f.type || 'text'} value={form[f.key]}
                  onChange={(e) => setForm({ ...form, [f.key]: e.target.value })} />
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Save the driver first, then add photos of their licence.</p>
          <div className="flex gap-2">
            <Button onClick={save} disabled={saving}>{saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}Save driver</Button>
            <Button variant="ghost" onClick={() => { setForm(null); setEditingId(null); }}>Cancel</Button>
          </div>
        </div>
      ) : (
        <Button onClick={() => { setEditingId(null); setForm(empty); }}><Plus className="w-4 h-4 mr-2" />Add a driver</Button>
      )}
    </div>
  );
}
