import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserRole } from "@/hooks/use-user-role";
import { format } from "date-fns";

type Outcome = "dropped" | "partial" | "completed";
interface Day { date: string; answered: number; dropped: number; partial: number; completed: number }
interface Call { id: string; start: number; duration: number; title: string | null; language: string; outcome: Outcome; phone?: string | null; phone_source?: "caller_id" | "given" | null; summary?: string | null }

const outcomeLabel: Record<Outcome, string> = { dropped: "Dropped", partial: "Partial", completed: "Completed" };
const outcomeVariant: Record<Outcome, "destructive" | "secondary" | "default"> = { dropped: "destructive", partial: "secondary", completed: "default" };
const pct = (n: number, d: number) => (d ? `${Math.round((n / d) * 100)}%` : "—");

export default function AdminVoiceCalls() {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [range, setRange] = useState("30");
  const [days, setDays] = useState<Day[]>([]);
  const [calls, setCalls] = useState<Call[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true); setError(null);
      const { data, error } = await supabase.functions.invoke("voice-call-stats", { body: { days: Number(range) } });
      if (error || data?.error) setError("Couldn't load call data right now. Please try again.");
      else { setDays(data.days || []); setCalls(data.calls || []); }
      setLoading(false);
    })();
  }, [isAdmin, range]);

  const totals = useMemo(() => days.reduce((t, d) => ({
    answered: t.answered + d.answered, dropped: t.dropped + d.dropped, partial: t.partial + d.partial, completed: t.completed + d.completed,
  }), { answered: 0, dropped: 0, partial: 0, completed: 0 }), [days]);

  if (roleLoading) return <div className="p-8"><Skeleton className="h-8 w-64" /></div>;
  if (!isAdmin) return <div className="p-8 text-muted-foreground">Admins only.</div>;

  const cards = [
    { label: "Calls answered", value: totals.answered, sub: `last ${range} days` },
    { label: "Dropped before talking", value: totals.dropped, sub: pct(totals.dropped, totals.answered) },
    { label: "Partly completed", value: totals.partial, sub: pct(totals.partial, totals.answered) },
    { label: "Completed successfully", value: totals.completed, sub: pct(totals.completed, totals.answered) },
  ];

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Phone Assistant Calls</h1>
          <p className="text-sm text-muted-foreground">Calls answered by Sarah, by New Zealand date.</p>
        </div>
        <Select value={range} onValueChange={setRange}>
          <SelectTrigger className="w-40"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="7">Last 7 days</SelectItem>
            <SelectItem value="30">Last 30 days</SelectItem>
            <SelectItem value="90">Last 90 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {error && <p className="text-destructive">{error}</p>}

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardHeader className="pb-2"><CardTitle className="text-sm font-medium text-muted-foreground">{c.label}</CardTitle></CardHeader>
            <CardContent>{loading ? <Skeleton className="h-8 w-16" /> : <><div className="text-3xl font-bold">{c.value}</div><div className="text-xs text-muted-foreground">{c.sub}</div></>}</CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader><CardTitle>Daily breakdown</CardTitle></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Date</TableHead><TableHead className="text-right">Answered</TableHead>
              <TableHead className="text-right">Dropped</TableHead><TableHead className="text-right">Partial</TableHead>
              <TableHead className="text-right">Completed</TableHead><TableHead className="text-right">Success rate</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {loading ? <TableRow><TableCell colSpan={6}><Skeleton className="h-6 w-full" /></TableCell></TableRow>
                : days.length === 0 ? <TableRow><TableCell colSpan={6} className="text-muted-foreground">No calls in this period.</TableCell></TableRow>
                : days.map((d) => (
                  <TableRow key={d.date}>
                    <TableCell>{format(new Date(`${d.date}T12:00:00`), "EEE d MMM")}</TableCell>
                    <TableCell className="text-right">{d.answered}</TableCell>
                    <TableCell className="text-right">{d.dropped}</TableCell>
                    <TableCell className="text-right">{d.partial}</TableCell>
                    <TableCell className="text-right">{d.completed}</TableCell>
                    <TableCell className="text-right">{pct(d.completed, d.answered)}</TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Calls &amp; callback list</CardTitle><p className="text-sm text-muted-foreground">Dropped and partial calls are the ones to call back.</p></CardHeader>
        <CardContent>
          <Table>
            <TableHeader><TableRow>
              <TableHead>Time</TableHead><TableHead>Phone</TableHead><TableHead>Topic</TableHead><TableHead>Length</TableHead><TableHead>Language</TableHead><TableHead>Outcome</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {calls.slice(0, 150).map((c) => (
                <TableRow key={c.id}>
                  <TableCell>{format(new Date(c.start * 1000), "d MMM, h:mma")}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {c.phone ? <a className="font-medium text-primary underline" href={`tel:${c.phone}`}>{c.phone}</a> : <span className="text-muted-foreground">Not available</span>}
                    {c.phone_source === "given" && <div className="text-xs text-muted-foreground">given during call</div>}
                  </TableCell>
                  <TableCell className="max-w-md"><div className="font-medium">{c.title || "—"}</div>{c.summary && <div className="text-xs text-muted-foreground">{c.summary}</div>}</TableCell>
                  <TableCell>{Math.floor(c.duration / 60)}m {c.duration % 60}s</TableCell>
                  <TableCell className="uppercase">{c.language}</TableCell>
                  <TableCell><Badge variant={outcomeVariant[c.outcome]}>{outcomeLabel[c.outcome]}</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <p className="mt-4 text-xs text-muted-foreground">
            Dropped: hung up after the greeting or within 15 seconds. Completed: Sarah sent a quote, looked up a booking, resent links, logged a change request, callback or breakdown. Partial: talked but none of those finished (including general questions).
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
