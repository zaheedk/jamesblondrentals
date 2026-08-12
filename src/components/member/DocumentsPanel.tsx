import { useCallback, useEffect, useRef, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import {
  Loader2, Upload, Camera, CheckCircle2, Clock, XCircle, Trash2, ShieldCheck, FileText,
} from 'lucide-react';

type DocType = 'licence_front' | 'licence_back' | 'passport' | 'proof_of_address';
type DocStatus = 'pending' | 'approved' | 'rejected';

interface DocRow {
  id: string;
  doc_type: DocType;
  file_path: string;
  file_name: string | null;
  status: DocStatus;
  review_notes: string | null;
  created_at: string;
}

const DOC_META: { type: DocType; label: string; hint: string; required: boolean }[] = [
  { type: 'licence_front', label: "Driver's licence — front", hint: 'Photo of the front of your licence', required: true },
  { type: 'licence_back', label: "Driver's licence — back", hint: 'Photo of the back of your licence', required: true },
  { type: 'passport', label: 'Passport or photo ID', hint: 'Required for overseas licences', required: false },
  { type: 'proof_of_address', label: 'Proof of address', hint: 'Utility bill or bank statement (optional)', required: false },
];

const MAX_BYTES = 8 * 1024 * 1024;

function StatusBadge({ status }: { status: DocStatus }) {
  if (status === 'approved') {
    return (
      <Badge className="bg-emerald-600 hover:bg-emerald-600">
        <CheckCircle2 className="w-3 h-3 mr-1" /> Approved
      </Badge>
    );
  }
  if (status === 'rejected') {
    return (
      <Badge variant="destructive">
        <XCircle className="w-3 h-3 mr-1" /> Needs re-upload
      </Badge>
    );
  }
  return (
    <Badge variant="secondary">
      <Clock className="w-3 h-3 mr-1" /> Awaiting review
    </Badge>
  );
}

export default function DocumentsPanel() {
  const { user } = useAuth();
  const [docs, setDocs] = useState<DocRow[]>([]);
  const [previews, setPreviews] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<DocType | null>(null);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const load = useCallback(async () => {
    if (!user) return;
    try {
      const { data, error } = await supabase
        .from('customer_documents')
        .select('id, doc_type, file_path, file_name, status, review_notes, created_at')
        .eq('user_id', user.id);
      if (error) throw error;
      const rows = (data || []) as DocRow[];
      setDocs(rows);

      const urls: Record<string, string> = {};
      await Promise.all(
        rows.map(async (row) => {
          const { data: signed } = await supabase.storage
            .from('customer-documents')
            .createSignedUrl(row.file_path, 60 * 10);
          if (signed?.signedUrl) urls[row.doc_type] = signed.signedUrl;
        }),
      );
      setPreviews(urls);
    } catch (err) {
      console.error('Error loading documents:', err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleFile = async (docType: DocType, file: File) => {
    if (!user) return;
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      toast.error('Please upload an image or PDF');
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error('File is too large (max 8MB)');
      return;
    }

    setBusy(docType);
    try {
      const existing = docs.find((d) => d.doc_type === docType);
      if (existing && existing.status === 'approved') {
        toast.error('This document is already approved. Contact us to change it.');
        return;
      }

      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const path = `${user.id}/${docType}-${Date.now()}.${ext}`;

      const { error: upErr } = await supabase.storage
        .from('customer-documents')
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;

      if (existing) {
        const { error } = await supabase
          .from('customer_documents')
          .update({
            file_path: path,
            file_name: file.name,
            status: 'pending',
            review_notes: null,
            reviewed_at: null,
            reviewed_by: null,
          })
          .eq('id', existing.id);
        if (error) throw error;
        await supabase.storage.from('customer-documents').remove([existing.file_path]);
      } else {
        const { error } = await supabase.from('customer_documents').insert({
          user_id: user.id,
          doc_type: docType,
          file_path: path,
          file_name: file.name,
          status: 'pending',
        });
        if (error) throw error;
      }

      toast.success('Uploaded — our team will verify it shortly');
      await load();
    } catch (err: any) {
      console.error('Upload error:', err);
      toast.error(err.message || 'Upload failed');
    } finally {
      setBusy(null);
      if (inputs.current[docType]) inputs.current[docType]!.value = '';
    }
  };

  const handleRemove = async (row: DocRow) => {
    setBusy(row.doc_type);
    try {
      const { error } = await supabase.from('customer_documents').delete().eq('id', row.id);
      if (error) throw error;
      await supabase.storage.from('customer-documents').remove([row.file_path]);
      toast.success('Document removed');
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Could not remove document');
    } finally {
      setBusy(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  const approvedRequired = DOC_META.filter((m) => m.required).every(
    (m) => docs.find((d) => d.doc_type === m.type)?.status === 'approved',
  );

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div className="rounded-lg border bg-card p-5">
        <div className="flex items-start gap-3">
          <ShieldCheck className={`w-5 h-5 mt-0.5 ${approvedRequired ? 'text-emerald-600' : 'text-muted-foreground'}`} />
          <div>
            <p className="font-semibold text-foreground">
              {approvedRequired ? 'Your licence is verified' : 'Verify your licence for faster checkout'}
            </p>
            <p className="text-sm text-muted-foreground">
              Upload a photo of your licence once and we'll pre-fill your details at every booking. Your documents are
              stored privately and are only visible to our team once you have a booking with us.
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {DOC_META.map((meta) => {
          const row = docs.find((d) => d.doc_type === meta.type);
          const preview = previews[meta.type];
          const isBusy = busy === meta.type;

          return (
            <div key={meta.type} className="rounded-lg border bg-card p-5">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="w-full sm:w-28 h-20 shrink-0 rounded-md border bg-muted/40 overflow-hidden flex items-center justify-center">
                  {preview && !row?.file_name?.toLowerCase().endsWith('.pdf') ? (
                    <img src={preview} alt={meta.label} className="w-full h-full object-cover" loading="lazy" />
                  ) : (
                    <FileText className="w-6 h-6 text-muted-foreground" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="font-semibold text-foreground">{meta.label}</p>
                    {meta.required && !row && <Badge variant="outline">Required</Badge>}
                    {row && <StatusBadge status={row.status} />}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">{meta.hint}</p>
                  {row?.status === 'rejected' && row.review_notes && (
                    <p className="text-sm text-destructive mt-1">{row.review_notes}</p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <input
                    ref={(el) => { inputs.current[meta.type] = el; }}
                    type="file"
                    accept="image/*,application/pdf"
                    capture="environment"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleFile(meta.type, file);
                    }}
                  />
                  <Button
                    variant={row ? 'outline' : 'default'}
                    size="sm"
                    disabled={isBusy || row?.status === 'approved'}
                    onClick={() => inputs.current[meta.type]?.click()}
                  >
                    {isBusy ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : row ? (
                      <Upload className="w-4 h-4 mr-2" />
                    ) : (
                      <Camera className="w-4 h-4 mr-2" />
                    )}
                    {row ? 'Replace' : 'Upload'}
                  </Button>
                  {row && row.status !== 'approved' && (
                    <Button variant="ghost" size="sm" disabled={isBusy} onClick={() => handleRemove(row)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
