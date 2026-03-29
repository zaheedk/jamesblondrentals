import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';
import { Loader2, Save, User, CreditCard, MapPin, Phone, Mail, Globe, Calendar, Hash } from 'lucide-react';

interface ProfileData {
  first_name: string;
  last_name: string;
  mobile: string;
  license_number: string;
  license_expiry: string;
  license_country: string;
  address: string;
  suburb: string;
  city: string;
  postcode: string;
  country: string;
}

const initialData: ProfileData = {
  first_name: '',
  last_name: '',
  mobile: '',
  license_number: '',
  license_expiry: '',
  license_country: '',
  address: '',
  suburb: '',
  city: '',
  postcode: '',
  country: 'New Zealand',
};

function FieldWithIcon({ icon: Icon, label, required, children }: {
  icon: React.ElementType;
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        <Icon className="w-3.5 h-3.5" />
        {label}
        {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
    </div>
  );
}

export default function ProfileForm() {
  const { user } = useAuth();
  const [form, setForm] = useState<ProfileData>(initialData);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [existingId, setExistingId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;
    loadProfile();
  }, [user]);

  const loadProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setExistingId(data.id);
        setForm({
          first_name: data.first_name || '',
          last_name: data.last_name || '',
          mobile: data.mobile || '',
          license_number: data.license_number || '',
          license_expiry: (data as any).license_expiry || '',
          license_country: (data as any).license_country || '',
          address: data.address || '',
          suburb: (data as any).suburb || '',
          city: data.city || '',
          postcode: data.postcode || '',
          country: data.country || 'New Zealand',
        });
      }
    } catch (err) {
      console.error('Error loading profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: keyof ProfileData, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!user) return;
    if (!form.first_name.trim() || !form.last_name.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    setSaving(true);
    try {
      const payload = {
        first_name: form.first_name.trim(),
        last_name: form.last_name.trim(),
        email: user.email || '',
        mobile: form.mobile.trim() || null,
        license_number: form.license_number.trim() || null,
        license_expiry: form.license_expiry || null,
        license_country: form.license_country.trim() || null,
        address: form.address.trim() || null,
        suburb: form.suburb.trim() || null,
        city: form.city.trim() || null,
        postcode: form.postcode.trim() || null,
        country: form.country.trim() || null,
        user_id: user.id,
      };

      if (existingId) {
        const { error } = await supabase
          .from('customers')
          .update(payload)
          .eq('id', existingId);
        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('customers')
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        if (data) setExistingId(data.id);
      }

      toast.success('Profile saved successfully');
    } catch (err: any) {
      console.error('Error saving profile:', err);
      toast.error(err.message || 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Personal Details */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <User className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Personal Details</h3>
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldWithIcon icon={User} label="First Name" required>
              <Input
                value={form.first_name}
                onChange={e => handleChange('first_name', e.target.value)}
                className="h-11"
              />
            </FieldWithIcon>
            <FieldWithIcon icon={User} label="Last Name" required>
              <Input
                value={form.last_name}
                onChange={e => handleChange('last_name', e.target.value)}
                className="h-11"
              />
            </FieldWithIcon>
          </div>
          <FieldWithIcon icon={Mail} label="Email">
            <Input value={user?.email || ''} disabled className="h-11 bg-muted/50 text-muted-foreground" />
          </FieldWithIcon>
          <FieldWithIcon icon={Phone} label="Mobile">
            <Input
              value={form.mobile}
              onChange={e => handleChange('mobile', e.target.value)}
              placeholder="+64 21 123 4567"
              className="h-11"
            />
          </FieldWithIcon>
        </div>
      </section>

      <Separator />

      {/* License Details */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <CreditCard className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Driver's License</h3>
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-5">
          <FieldWithIcon icon={Hash} label="License Number">
            <Input
              value={form.license_number}
              onChange={e => handleChange('license_number', e.target.value)}
              className="h-11"
            />
          </FieldWithIcon>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldWithIcon icon={Calendar} label="Date of Expiry">
              <Input
                type="date"
                value={form.license_expiry}
                onChange={e => handleChange('license_expiry', e.target.value)}
                className="h-11"
              />
            </FieldWithIcon>
            <FieldWithIcon icon={Globe} label="Country of Issue">
              <Input
                value={form.license_country}
                onChange={e => handleChange('license_country', e.target.value)}
                placeholder="New Zealand"
                className="h-11"
              />
            </FieldWithIcon>
          </div>
        </div>
      </section>

      <Separator />

      {/* Home Address */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10">
            <MapPin className="w-4 h-4 text-primary" />
          </div>
          <h3 className="text-lg font-bold text-foreground">Home Address</h3>
        </div>
        <div className="rounded-lg border bg-card p-6 space-y-5">
          <FieldWithIcon icon={MapPin} label="Street Address">
            <Input
              value={form.address}
              onChange={e => handleChange('address', e.target.value)}
              placeholder="123 Queen Street"
              className="h-11"
            />
          </FieldWithIcon>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldWithIcon icon={MapPin} label="Suburb">
              <Input
                value={form.suburb}
                onChange={e => handleChange('suburb', e.target.value)}
                className="h-11"
              />
            </FieldWithIcon>
            <FieldWithIcon icon={MapPin} label="City">
              <Input
                value={form.city}
                onChange={e => handleChange('city', e.target.value)}
                className="h-11"
              />
            </FieldWithIcon>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <FieldWithIcon icon={Hash} label="Postcode">
              <Input
                value={form.postcode}
                onChange={e => handleChange('postcode', e.target.value)}
                className="h-11"
              />
            </FieldWithIcon>
            <FieldWithIcon icon={Globe} label="Country">
              <Input
                value={form.country}
                onChange={e => handleChange('country', e.target.value)}
                className="h-11"
              />
            </FieldWithIcon>
          </div>
        </div>
      </section>

      {/* Save Button */}
      <div className="flex justify-end pt-2 pb-4">
        <Button onClick={handleSave} disabled={saving} size="lg" className="min-w-[160px]">
          {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
          Save Profile
        </Button>
      </div>
    </div>
  );
}
