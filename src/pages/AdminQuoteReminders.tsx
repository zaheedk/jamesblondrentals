import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUserRole } from "@/hooks/use-user-role";
import { format } from "date-fns";

interface LogRow {
  id: string; booking_reference: string; customer_email: string; kind: string; sent_at: string;
  opened_at: string | null; open_count: number; clicked_at: string | null; click_count: number;
}
interface BookingRow {
  booking_reference: string | null; reservation_reference: string | null; booking_status: string | null;
  payment_status: string | null; vehicle_name: string | null; vehicle_category: string | null;
  pickup_date: string; total_amount: number | null; customer_first_name: string | null; customer_last_name: string | null;
}

const isConfirmed = (b?: BookingRow) =>
  !!b && (["paid", "succeeded", "completed"].includes((b.payment_status || "").toLowerCase()) ||
    ["confirmed", "booked"].includes((b.booking_status || "").toLowerCase()));

const fmt = (d: string | null) => (d ? format(new Date(d), "d MMM, h:mma") : "—");

export default function AdminQuoteReminders() {
  const { isAdmin, isLoading: roleLoading } = useUserRole();
  const [logs, setLogs] = useState<LogRow[]>([]);
  const [bookings, setBookings] = useState<Record<string, BookingRow>>({});
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    if (!isAdmin) return;
    (async () => {
      setLoading(true);
      const { data } = await supabase.from("quote_reminder_log").select("*").order("sent_at", { ascending: false }).limit(1000);
      const rows = (data || []) as LogRow[];
      setLogs(rows);
      const refs = [...new Set(rows.map((r) => r.booking_reference))];
      const map: Record<string, BookingRow> = {};
      for (let i = 0; i < refs.length; i += 100) {
        const chunk = refs.slice(i, i + 100);
        const { data: b } = await supabase.from("bookings")
          .select("booking_reference, reservation_reference, booking_status, payment_status, vehicle_name, vehicle_category, pickup_date, total_amount, customer_first_name, customer_last_name")
          .or(`booking_reference.in.(${chunk.join(",")}),reservation_reference.in.(${chunk.join(",")})`);
        (b || []).forEach((x: BookingRow) => {
          if (x.booking_reference) map[x.booking_reference] = x;
          if (x.reservation_reference) map[x.reservation_reference] = x;
        });
      }
      setBookings(map);
      setLoading(false);
    })();
  }, [isAdmin]);

  // One row per quote, combining first + final reminder
  const quotes = useMemo(() => {
    const g: Record<string, { ref: string; email: string; reminders: LogRow[] }> = {};
    logs.forEach((l) => {
      (g[l.booking_reference] ||= { ref: l.booking_reference, email: l.customer_email, reminders: [] }).reminders.push(l);
    });
    return Object.values(g).map((q) => {
      const b = bookings[q.ref];
      return {
        ...q, booking: b,
        sent: q.reminders.map((r) => r.sent_at).sort()[0],
        opens: q.reminders.reduce((s, r) => s + r.open_count, 0),
        clicks: q.reminders.reduce((s, r) => s + r.click_count, 0),
        firstOpen: q.reminders.map((r) => r.opened_at).filter(Boolean).sort()[0] || null,
        firstClick: q.reminders.map((r) => r.clicked_at).filter(Boolean).sort()[0] || null,
        confirmed: isConfirmed(b),
      };
    }).sort((a, b) => b.sent.localeCompare(a.sent));
  }, [logs, bookings]);

  const shown = quotes.filter((q) =>
    filter === "all" ? true : filter === "opened" ? q.opens > 0 : filter === "clicked" ? q.clicks > 0 : q.confirmed);

  const total = quotes.length;
  const opened = quotes.filter((q) => q.opens > 0).length;
  const clicked = quotes.filter((q) => q.clicks > 0).length;
  const confirmed = quotes.filter((q) => q.confirmed);
  const revenue = confirmed.reduce((s, q) => s + Number(q.booking?.total_amount || 0), 0);
  const pct = (n: number) => (total ? `${Math.round((n / total) * 100)}%` : "0%");

  if (roleLoading) return <div className="container mx-auto p-8"><Skeleton className="h-40 w-full" /></div>;
  if (!isAdmin) return <div className="container mx-auto p-16 text-center">Admins only.</div>;

  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Quote Reminder Results</h1>
        <p className="text-muted-foreground">Opens, clicks and confirmed bookings for each quote that received a reminder. Opens are approximate (some email apps block images).</p>
      </div>

      <div className="grid gap-4 grid-cols-2 md:grid-cols-5">
        {[
          ["Quotes reminded", String(total)],
          ["Opened", `${opened} (${pct(opened)})`],
          ["Clicked confirm", `${clicked} (${pct(clicked)})`],
          ["Confirmed bookings", `${confirmed.length} (${pct(confirmed.length)})`],
          ["Confirmed value", `$${revenue.toLocaleString("en-NZ", { maximumFractionDigits: 0 })}`],
        ].map(([k, v]) => (
          <Card key={k}><CardHeader className="pb-1"><CardTitle className="text-sm font-medium text-muted-foreground">{k}</CardTitle></CardHeader>
            <CardContent className="text-2xl font-bold">{v}</CardContent></Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All quotes</SelectItem>
            <SelectItem value="opened">Opened</SelectItem>
            <SelectItem value="clicked">Clicked</SelectItem>
            <SelectItem value="confirmed">Confirmed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Card><CardContent className="p-0 overflow-x-auto">
        {loading ? <div className="p-6"><Skeleton className="h-60 w-full" /></div> : (
          <Table>
            <TableHeader><TableRow>
              <TableHead>Quote</TableHead><TableHead>Customer</TableHead><TableHead>Vehicle</TableHead>
              <TableHead>Pickup</TableHead><TableHead>Reminders</TableHead><TableHead>Opens</TableHead>
              <TableHead>Clicks</TableHead><TableHead>Status</TableHead><TableHead className="text-right">Value</TableHead>
            </TableRow></TableHeader>
            <TableBody>
              {shown.length === 0 && <TableRow><TableCell colSpan={9} className="text-center text-muted-foreground py-8">No reminders yet.</TableCell></TableRow>}
              {shown.map((q) => (
                <TableRow key={q.ref}>
                  <TableCell className="font-mono text-xs">{q.ref}</TableCell>
                  <TableCell>
                    <div className="font-medium">{[q.booking?.customer_first_name, q.booking?.customer_last_name].filter(Boolean).join(" ") || "—"}</div>
                    <div className="text-xs text-muted-foreground">{q.email}</div>
                  </TableCell>
                  <TableCell>{q.booking?.vehicle_name || q.booking?.vehicle_category || "—"}</TableCell>
                  <TableCell>{q.booking?.pickup_date ? format(new Date(q.booking.pickup_date), "d MMM yyyy") : "—"}</TableCell>
                  <TableCell className="space-x-1">
                    {q.reminders.map((r) => <Badge key={r.id} variant="outline" title={fmt(r.sent_at)}>{r.kind === "final" ? "Final" : "First"}</Badge>)}
                    <div className="text-xs text-muted-foreground mt-1">{fmt(q.sent)}</div>
                  </TableCell>
                  <TableCell>{q.opens}<div className="text-xs text-muted-foreground">{q.firstOpen ? fmt(q.firstOpen) : ""}</div></TableCell>
                  <TableCell>{q.clicks}<div className="text-xs text-muted-foreground">{q.firstClick ? fmt(q.firstClick) : ""}</div></TableCell>
                  <TableCell>{q.confirmed ? <Badge>Confirmed</Badge> : <Badge variant="secondary">Quote</Badge>}</TableCell>
                  <TableCell className="text-right">{q.booking?.total_amount != null ? `$${Number(q.booking.total_amount).toFixed(2)}` : "—"}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent></Card>
    </div>
  );
}
