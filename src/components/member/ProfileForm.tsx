import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, Save } from 'lucide-react';

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
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Personal Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Personal Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="first_name">First Name *</Label>
              <Input id="first_name" value={form.first_name} onChange={e => handleChange('first_name', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="last_name">Last Name *</Label>
              <Input id="last_name" value={form.last_name} onChange={e => handleChange('last_name', e.target.value)} />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user?.email || ''} disabled className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="mobile">Mobile</Label>
            <Input id="mobile" value={form.mobile} onChange={e => handleChange('mobile', e.target.value)} placeholder="+64 21 123 4567" />
          </div>
        </CardContent>
      </Card>

      {/* License Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">License Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="license_number">License Number</Label>
            <Input id="license_number" value={form.license_number} onChange={e => handleChange('license_number', e.target.value)} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="license_expiry">Date of Expiry</Label>
              <Input id="license_expiry" type="date" value={form.license_expiry} onChange={e => handleChange('license_expiry', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="license_country">Country of Issue</Label>
              <Input id="license_country" value={form.license_country} onChange={e => handleChange('license_country', e.target.value)} placeholder="New Zealand" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Home Address */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Home Address</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="address">Street Address</Label>
            <Input id="address" value={form.address} onChange={e => handleChange('address', e.target.value)} placeholder="123 Queen Street" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="suburb">Suburb</Label>
              <Input id="suburb" value={form.suburb} onChange={e => handleChange('suburb', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" value={form.city} onChange={e => handleChange('city', e.target.value)} />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="postcode">Postcode</Label>
              <Input id="postcode" value={form.postcode} onChange={e => handleChange('postcode', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" value={form.country} onChange={e => handleChange('country', e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSave} disabled={saving} size="lg">
        {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
        Save Profile
      </Button>
    </div>
  );
}
