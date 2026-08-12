import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useUserRole } from '@/hooks/use-user-role';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PageSEO from '@/components/PageSEO';
import { toast } from 'sonner';
import { Loader2, CheckCircle2, XCircle, ArrowLeft, ExternalLink } from 'lucide-react';

type DocStatus = 'pending' | 'approved' | 'rejected';

interface DocRow {
  id: string;
  user_id: string;
  doc_type: string;
  file_path: string;
  file_name: string | null;
  status: DocStatus;
  review_notes: string | null;
  created_at: string;
}

const TYPE_LABELS: Record<string, string> = {
  licence_front: "Licence — front",
  licence_back: "Licence — back",
  passport: 'Passport / photo ID',
  proof_of_address: 'Proof of address',
};

export default function AdminCustomerDocuments() {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [rows, setRows] = useState<DocRow[]>([]);
  const [customers, setCustomers] = useState<Record<string, { name: string; email: string }>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DocStatus>('pending');
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('customer_documents')
        .select('*')
        .eq('status', filter)
        .order('created_at', { ascending: false });
      if (error) throw error;
      const docRows = (data || []) as DocRow[];
      setRows(docRows);

      const userIds = [...new Set(docRows.map((r) => r.user_id))];
      if (userIds.length) {
        const { data: custs } = await supabase
          .from('customers')
          .select('user_id, first_name, last_name, email')
          .in('user_id', userIds);
        const map: Record<string, { name: string; email: string }> = {};
        (custs || []).forEach((c: any) => {
          if (c.user_id) map[c.user_id] = { name: `${c.first_name || ''} ${c.last_name || ''}`.trim(), email: c.email || '' };
        });
        setCustomers(map);
      }
    } catch (err) {
      console.error('Error loading documents:', err);
      toast.error('Could not load documents');
    } finally {
      setLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    if (isAdmin) load();
  }, [isAdmin, load]);

  const openFile = async (path: string) => {
    const { data, error } = await supabase.storage.from('customer-documents').createSignedUrl(path, 300);
    if (error || !data?.signedUrl) {
      toast.error('Could not open file');
      return;
    }
    window.open(data.signedUrl, '_blank', 'noopener,noreferrer');
  };

  const review = async (row: DocRow, status: DocStatus) => {
    setBusy(row.id);
    try {
      const { data: authUser } = await supabase.auth.getUser();
      const { error } = await supabase
        .from('customer_documents')
        .update({
          status,
          review_notes: notes[row.id]?.trim() || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: authUser?.user?.id || null,
        })
        .eq('id', row.id);
      if (error) throw error;
      toast.success(status === 'approved' ? 'Document approved' : 'Document rejected');
      await load();
    } catch (err: any) {
      toast.error(err.message || 'Could not update document');
    } finally {
      setBusy(null);
    }
  };

  if (roleLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-6 h-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p className="text-muted-foreground">You do not have access to this page.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <PageSEO title="Customer Documents – Admin" description="Verify customer licence and identity documents." canonical="/admin/customer-documents" noindex />

      <div className="flex items-center justify-between mb-6">
        <div>
          <Link to="/member-dashboard" className="text-sm text-muted-foreground inline-flex items-center gap-1 mb-2">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to dashboard
          </Link>
          <h1 className="text-3xl font-bold">Customer Documents</h1>
          <p className="text-muted-foreground">Verify licence and ID uploads so checkout can be pre-filled.</p>
        </div>
      </div>

      <Tabs value={filter} onValueChange={(v) => setFilter(v as DocStatus)} className="mb-6">
        <TabsList>
          <TabsTrigger value="pending">Awaiting review</TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : rows.length === 0 ? (
        <p className="text-muted-foreground py-8">No documents in this list.</p>
      ) : (
        <div className="grid gap-4">
          {rows.map((row) => {
            const cust = customers[row.user_id];
            return (
              <Card key={row.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base flex flex-wrap items-center gap-2">
                    {cust?.name || 'Customer'}
                    <span className="text-sm font-normal text-muted-foreground">{cust?.email}</span>
                    <Badge variant="outline">{TYPE_LABELS[row.doc_type] || row.doc_type}</Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => openFile(row.file_path)}>
                      <ExternalLink className="w-4 h-4 mr-2" /> View document
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Uploaded {new Date(row.created_at).toLocaleString('en-NZ')}
                    </span>
                  </div>

                  {row.status === 'pending' && (
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Input
                        placeholder="Reason (shown to customer if rejected)"
                        value={notes[row.id] || ''}
                        onChange={(e) => setNotes((p) => ({ ...p, [row.id]: e.target.value }))}
                      />
                      <div className="flex gap-2">
                        <Button size="sm" disabled={busy === row.id} onClick={() => review(row, 'approved')}>
                          <CheckCircle2 className="w-4 h-4 mr-2" /> Approve
                        </Button>
                        <Button size="sm" variant="destructive" disabled={busy === row.id} onClick={() => review(row, 'rejected')}>
                          <XCircle className="w-4 h-4 mr-2" /> Reject
                        </Button>
                      </div>
                    </div>
                  )}

                  {row.status !== 'pending' && row.review_notes && (
                    <p className="text-sm text-muted-foreground">Note: {row.review_notes}</p>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
