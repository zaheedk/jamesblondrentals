import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Download } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

interface SearchEvent {
  id: string;
  created_at: string;
  pickup_location_name: string | null;
  dropoff_location_name: string | null;
  same_location: boolean | null;
  category_name: string | null;
  pickup_date: string | null;
  dropoff_date: string | null;
  pickup_time: string | null;
  dropoff_time: string | null;
  has_promo_code: boolean | null;
  promo_code: string | null;
  page_path: string | null;
  referrer: string | null;
  session_id: string | null;
}

const RANGES = [
  { label: "Last 24 hours", value: "1" },
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "All time", value: "all" },
];

const AdminSearchEvents = () => {
  const [events, setEvents] = useState<SearchEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");
  const [locationFilter, setLocationFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      let query = supabase
        .from("search_events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(5000);

      if (range !== "all") {
        const days = parseInt(range, 10);
        const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte("created_at", since);
      }
      const { data, error } = await query;
      if (error) {
        toast.error("Failed to load search events: " + error.message);
        setEvents([]);
      } else {
        setEvents((data as SearchEvent[]) || []);
      }
      setLoading(false);
    };
    fetch();
  }, [range]);

  const filtered = useMemo(() => {
    return events.filter((e) => {
      if (
        locationFilter &&
        !(e.pickup_location_name || "").toLowerCase().includes(locationFilter.toLowerCase())
      )
        return false;
      if (
        categoryFilter &&
        !(e.category_name || "").toLowerCase().includes(categoryFilter.toLowerCase())
      )
        return false;
      return true;
    });
  }, [events, locationFilter, categoryFilter]);

  const summary = useMemo(() => {
    const byLocation = new Map<string, number>();
    const byCategory = new Map<string, number>();
    const byDay = new Map<string, number>();
    const sessions = new Set<string>();
    let promo = 0;
    for (const e of filtered) {
      const loc = e.pickup_location_name || "Unknown";
      byLocation.set(loc, (byLocation.get(loc) || 0) + 1);
      const cat = e.category_name || "All Categories";
      byCategory.set(cat, (byCategory.get(cat) || 0) + 1);
      const day = format(new Date(e.created_at), "yyyy-MM-dd");
      byDay.set(day, (byDay.get(day) || 0) + 1);
      if (e.session_id) sessions.add(e.session_id);
      if (e.has_promo_code) promo++;
    }
    const sort = (m: Map<string, number>) =>
      Array.from(m.entries()).sort((a, b) => b[1] - a[1]);
    return {
      total: filtered.length,
      sessions: sessions.size,
      promo,
      byLocation: sort(byLocation),
      byCategory: sort(byCategory),
      byDay: Array.from(byDay.entries()).sort((a, b) => a[0].localeCompare(b[0])),
    };
  }, [filtered]);

  const exportCsv = () => {
    const headers = [
      "created_at",
      "pickup_location_name",
      "dropoff_location_name",
      "same_location",
      "category_name",
      "pickup_date",
      "pickup_time",
      "dropoff_date",
      "dropoff_time",
      "has_promo_code",
      "promo_code",
      "page_path",
      "referrer",
      "session_id",
    ];
    const escape = (v: unknown) => {
      if (v === null || v === undefined) return "";
      const s = String(v).replace(/"/g, '""');
      return `"${s}"`;
    };
    const rows = filtered.map((e) =>
      headers.map((h) => escape((e as any)[h])).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `search-events-${format(new Date(), "yyyyMMdd-HHmm")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto py-8 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Search Events Report</h1>
          <p className="text-muted-foreground">
            Every "Find Your Vehicle" search submitted from the website.
          </p>
        </div>
        <Button onClick={exportCsv} disabled={!filtered.length}>
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">Date range</label>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {RANGES.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Pickup location contains</label>
            <Input
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              placeholder="e.g. Hamilton, Wellington"
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">Category contains</label>
            <Input
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              placeholder="e.g. Truck, Van"
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total searches</CardDescription>
            <CardTitle className="text-3xl">{summary.total.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Unique sessions</CardDescription>
            <CardTitle className="text-3xl">{summary.sessions.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>With promo code</CardDescription>
            <CardTitle className="text-3xl">{summary.promo.toLocaleString()}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Top pickup locations</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Location</TableHead>
                  <TableHead className="text-right">Searches</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.byLocation.slice(0, 15).map(([name, count]) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell className="text-right font-medium">{count}</TableCell>
                  </TableRow>
                ))}
                {!summary.byLocation.length && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Categories searched</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead className="text-right">Searches</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.byCategory.map(([name, count]) => (
                  <TableRow key={name}>
                    <TableCell>{name}</TableCell>
                    <TableCell className="text-right font-medium">{count}</TableCell>
                  </TableRow>
                ))}
                {!summary.byCategory.length && (
                  <TableRow>
                    <TableCell colSpan={2} className="text-center text-muted-foreground">
                      No data
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent searches</CardTitle>
          <CardDescription>
            Showing the {Math.min(filtered.length, 200)} most recent of {filtered.length}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>When</TableHead>
                    <TableHead>Pickup</TableHead>
                    <TableHead>Dropoff</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Dates</TableHead>
                    <TableHead>Promo</TableHead>
                    <TableHead>Page</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.slice(0, 200).map((e) => (
                    <TableRow key={e.id}>
                      <TableCell className="whitespace-nowrap text-xs">
                        {format(new Date(e.created_at), "d MMM HH:mm")}
                      </TableCell>
                      <TableCell>{e.pickup_location_name || "-"}</TableCell>
                      <TableCell>
                        {e.same_location ? (
                          <span className="text-muted-foreground">(same)</span>
                        ) : (
                          e.dropoff_location_name || "-"
                        )}
                      </TableCell>
                      <TableCell>{e.category_name || "All"}</TableCell>
                      <TableCell className="whitespace-nowrap text-xs">
                        {e.pickup_date} {e.pickup_time}
                        <br />
                        → {e.dropoff_date} {e.dropoff_time}
                      </TableCell>
                      <TableCell>
                        {e.has_promo_code ? (
                          <Badge variant="secondary">{e.promo_code || "yes"}</Badge>
                        ) : (
                          "-"
                        )}
                      </TableCell>
                      <TableCell className="text-xs text-muted-foreground max-w-[240px] truncate">
                        {e.page_path || "/"}
                      </TableCell>
                    </TableRow>
                  ))}
                  {!filtered.length && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        No searches recorded yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSearchEvents;