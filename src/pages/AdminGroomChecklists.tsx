import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Download, Search, ClipboardList } from "lucide-react";
import { format } from "date-fns";
import { GROOM_CHECKLIST_ITEMS, issueLabels, type ChecklistItems } from "@/lib/groom-checklist";

interface ChecklistRow {
  id: string;
  vehicle_rego: string;
  checked_at: string;
  checked_by_name: string;
  issues_found: boolean;
  odometer: number | null;
  notes: string | null;
  items: ChecklistItems;
}

const RANGES = [
  { label: "Last 7 days", value: "7" },
  { label: "Last 30 days", value: "30" },
  { label: "Last 90 days", value: "90" },
  { label: "All time", value: "all" },
];

const AdminGroomChecklists = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  const [rows, setRows] = useState<ChecklistRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState("30");
  const [query, setQuery] = useState("");
  const [onlyIssues, setOnlyIssues] = useState(false);

  useEffect(() => {
    if (!user || !isOfficeAdmin) return;
    const run = async () => {
      setLoading(true);
      let q = supabase
        .from("vehicle_groom_checklists")
        .select("id, vehicle_rego, checked_at, checked_by_name, issues_found, odometer, notes, items")
        .order("checked_at", { ascending: false })
        .limit(5000);
      if (range !== "all") {
        const since = new Date(Date.now() - parseInt(range, 10) * 86400000).toISOString();
        q = q.gte("checked_at", since);
      }
      const { data, error } = await q;
      if (error) toast.error("Failed to load checklists: " + error.message);
      setRows((data as unknown as ChecklistRow[]) || []);
      setLoading(false);
    };
    run();
  }, [user, isOfficeAdmin, range]);

  const filtered = useMemo(() => {
    const t = query.trim().toLowerCase();
    return rows.filter((r) => {
      if (onlyIssues && !r.issues_found) return false;
      if (!t) return true;
      return (
        r.vehicle_rego.toLowerCase().includes(t) || r.checked_by_name.toLowerCase().includes(t)
      );
    });
  }, [rows, query, onlyIssues]);

  const exportCsv = () => {
    const headers = [
      "Date/time",
      "Rego",
      "Checked by",
      "Odometer",
      ...GROOM_CHECKLIST_ITEMS.map((i) => i.label),
      "Issues",
      "Notes",
    ];
    const lines = filtered.map((r) =>
      [
        format(new Date(r.checked_at), "yyyy-MM-dd HH:mm"),
        r.vehicle_rego,
        r.checked_by_name,
        r.odometer ?? "",
        ...GROOM_CHECKLIST_ITEMS.map((i) => (r.items?.[i.key] || "").toUpperCase()),
        issueLabels(r.items || {}).join(" | "),
        (r.notes || "").replace(/"/g, '""'),
      ]
        .map((c) => `"${String(c)}"`)
        .join(",")
    );
    const blob = new Blob([[headers.join(","), ...lines].join("\n")], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `groom-checklists-${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (authLoading || roleLoading) {
    return (
      <div className="container mx-auto px-4 py-10 space-y-4">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (!isOfficeAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Access restricted</h1>
        <p className="text-muted-foreground">This page is only available to James Blond staff.</p>
      </div>
    );
  }

  const issueCount = filtered.filter((r) => r.issues_found).length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Groom Checklist Records</h1>
          <p className="text-muted-foreground text-sm mt-1">
            {filtered.length} checks · {issueCount} with items requiring attention
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/groom-checklist">
              <ClipboardList className="h-4 w-4 mr-1" /> New checklist
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/admin/vehicles">Vehicle register</Link>
          </Button>
          <Button onClick={exportCsv} disabled={!filtered.length}>
            <Download className="h-4 w-4 mr-1" /> Export CSV
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Records</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 min-w-[220px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search rego or person…"
                className="pl-9"
              />
            </div>
            <Select value={range} onValueChange={setRange}>
              <SelectTrigger className="w-[170px]">
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
            <Button variant={onlyIssues ? "default" : "outline"} onClick={() => setOnlyIssues((v) => !v)}>
              Issues only
            </Button>
          </div>

          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No checklists recorded yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date / time</TableHead>
                    <TableHead>Rego</TableHead>
                    <TableHead>Checked by</TableHead>
                    <TableHead>Odometer</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Requires attention</TableHead>
                    <TableHead>Notes</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell className="whitespace-nowrap">
                        {format(new Date(r.checked_at), "d MMM yyyy, h:mm a")}
                      </TableCell>
                      <TableCell className="font-semibold">{r.vehicle_rego}</TableCell>
                      <TableCell>{r.checked_by_name}</TableCell>
                      <TableCell>{r.odometer ? r.odometer.toLocaleString() : "—"}</TableCell>
                      <TableCell>
                        <Badge variant={r.issues_found ? "destructive" : "secondary"}>
                          {r.issues_found ? "Issues" : "All OK"}
                        </Badge>
                      </TableCell>
                      <TableCell className="max-w-[220px] text-sm">
                        {issueLabels(r.items || {}).join(", ") || "—"}
                      </TableCell>
                      <TableCell className="max-w-[260px] text-sm text-muted-foreground">
                        {r.notes || "—"}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminGroomChecklists;
