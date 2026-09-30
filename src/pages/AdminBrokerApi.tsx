import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";
import { format } from "date-fns";

interface Broker { id: string; name: string; api_key: string; rcm_credential_ref: string; active: boolean; rate_limit_per_min: number; }
interface LogRow { id: string; broker_id: string | null; method: string | null; status: string; error: string | null; duration_ms: number | null; created_at: string; }

const ENDPOINT = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/agent-api/agent/booking/v3.2`;

const AdminBrokerApi = () => {
  const [brokers, setBrokers] = useState<Broker[]>([]);
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [name, setName] = useState("");
  const [ref, setRef] = useState("");
  const [revealed, setRevealed] = useState<{ title: string; key?: string; secret: string } | null>(null);

  const call = async (body: Record<string, unknown>) => {
    const { data, error } = await supabase.functions.invoke("agent-admin", { body });
    if (error || data?.error) { toast.error(data?.error ?? error?.message ?? "Failed"); return null; }
    return data;
  };
  const load = async () => { const d = await call({ action: "list" }); if (d) { setBrokers(d.brokers); setLogs(d.logs); } };
  useEffect(() => { load(); }, []);

  const create = async () => {
    const d = await call({ action: "create", name, rcm_credential_ref: ref });
    if (d) { setRevealed({ title: `${name} credentials`, key: d.api_key, secret: d.shared_secret }); setName(""); setRef(""); load(); }
  };
  const rotate = async (b: Broker) => {
    if (!confirm(`Issue a new secret for ${b.name}? Their old secret stops working immediately.`)) return;
    const d = await call({ action: "rotate", id: b.id });
    if (d) setRevealed({ title: `New secret for ${b.name}`, key: b.api_key, secret: d.shared_secret });
  };
  const toggle = async (b: Broker, active: boolean) => { if (await call({ action: "toggle", id: b.id, active })) load(); };
  const brokerName = (id: string | null) => brokers.find((b) => b.id === id)?.name ?? "Unknown key";

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Broker API</h1>
        <p className="text-muted-foreground">RCM-compatible agent API. Brokers only change the endpoint and keys.</p>
        <p className="text-sm mt-2 break-all">Endpoint: <code className="bg-muted px-2 py-1 rounded">{ENDPOINT}?apikey=&lt;KEY&gt;</code></p>
      </div>

      {revealed && (
        <Card className="border-primary">
          <CardHeader><CardTitle>{revealed.title}</CardTitle><CardDescription>Copy the secret now — it won't be shown again.</CardDescription></CardHeader>
          <CardContent className="space-y-2 text-sm break-all">
            {revealed.key && <p>API key: <code className="bg-muted px-2 py-1 rounded">{revealed.key}</code></p>}
            <p>Shared secret: <code className="bg-muted px-2 py-1 rounded">{revealed.secret}</code></p>
            <Button variant="outline" size="sm" onClick={() => setRevealed(null)}>I've copied it</Button>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader><CardTitle>Add broker</CardTitle><CardDescription>RCM account = the stored RCM agent credentials to use, e.g. ZUZUCHE or QEEQ.</CardDescription></CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-3">
          <Input placeholder="Broker name" value={name} onChange={(e) => setName(e.target.value)} />
          <Input placeholder="RCM account (ZUZUCHE)" value={ref} onChange={(e) => setRef(e.target.value.toUpperCase())} />
          <Button onClick={create} disabled={!name || !ref}>Generate keys</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Brokers</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Name</TableHead><TableHead>API key</TableHead><TableHead>RCM account</TableHead><TableHead>Active</TableHead><TableHead /></TableRow></TableHeader>
            <TableBody>
              {brokers.map((b) => (
                <TableRow key={b.id}>
                  <TableCell>{b.name}</TableCell>
                  <TableCell className="font-mono text-xs">{b.api_key}</TableCell>
                  <TableCell>{b.rcm_credential_ref}</TableCell>
                  <TableCell><Switch checked={b.active} onCheckedChange={(v) => toggle(b, v)} /></TableCell>
                  <TableCell><Button variant="outline" size="sm" onClick={() => rotate(b)}>New secret</Button></TableCell>
                </TableRow>
              ))}
              {!brokers.length && <TableRow><TableCell colSpan={5} className="text-muted-foreground">No brokers yet.</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Recent calls</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow><TableHead>Time</TableHead><TableHead>Broker</TableHead><TableHead>Method</TableHead><TableHead>Result</TableHead><TableHead>ms</TableHead></TableRow></TableHeader>
            <TableBody>
              {logs.map((l) => (
                <TableRow key={l.id}>
                  <TableCell>{format(new Date(l.created_at), "dd MMM HH:mm:ss")}</TableCell>
                  <TableCell>{brokerName(l.broker_id)}</TableCell>
                  <TableCell>{l.method ?? "—"}</TableCell>
                  <TableCell><Badge variant={l.status === "OK" ? "default" : "destructive"}>{l.status}</Badge> {l.error && <span className="text-xs text-muted-foreground ml-1">{l.error}</span>}</TableCell>
                  <TableCell>{l.duration_ms ?? ""}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminBrokerApi;
