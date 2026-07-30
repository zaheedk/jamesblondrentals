import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Search, Loader2, CheckCircle2, AlertTriangle, ClipboardList, History } from "lucide-react";
import { format } from "date-fns";
import {
  GROOM_CHECKLIST_ITEMS,
  type ChecklistItems,
  type ChecklistStatus,
  hasIssues,
  issueLabels,
  isComplete,
} from "@/lib/groom-checklist";

interface VehicleRow {
  id: string;
  rego: string;
  make: string | null;
  model: string | null;
  year: number | null;
  category: string | null;
  branch: string | null;
  active: boolean;
}

interface RecentChecklist {
  id: string;
  checked_at: string;
  checked_by_name: string;
  issues_found: boolean;
  odometer: number | null;
  notes: string | null;
  items: ChecklistItems;
}

const vehicleLabel = (v: VehicleRow) =>
  [v.year, v.make, v.model].filter(Boolean).join(" ") || v.category || "Vehicle";

const GroomChecklist = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  const [search, setSearch] = useState("");
  const [results, setResults] = useState<VehicleRow[]>([]);
  const [searching, setSearching] = useState(false);
  const [vehicle, setVehicle] = useState<VehicleRow | null>(null);

  const [items, setItems] = useState<ChecklistItems>({});
  const [checkedBy, setCheckedBy] = useState("");
  const [odometer, setOdometer] = useState("");
  const [notes, setNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [recent, setRecent] = useState<RecentChecklist[]>([]);
  const [loadingRecent, setLoadingRecent] = useState(false);

  useEffect(() => {
    if (user && !checkedBy) {
      const meta = (user.user_metadata || {}) as Record<string, string>;
      setCheckedBy(meta.full_name || meta.name || user.email || "");
    }
  }, [user, checkedBy]);

  // Debounced vehicle search
  useEffect(() => {
    const term = search.trim();
    if (term.length < 1) {
      setResults([]);
      return;
    }
    let cancelled = false;
    setSearching(true);
    const t = setTimeout(async () => {
      const { data, error } = await supabase
        .from("vehicles")
        .select("id, rego, make, model, year, category, branch, active")
        .or(`rego.ilike.%${term}%,make.ilike.%${term}%,model.ilike.%${term}%`)
        .eq("active", true)
        .order("rego")
        .limit(25);
      if (cancelled) return;
      if (error) toast.error("Vehicle search failed: " + error.message);
      setResults((data as VehicleRow[]) || []);
      setSearching(false);
    }, 250);
    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [search]);

  const loadRecent = async (vehicleId: string) => {
    setLoadingRecent(true);
    const { data, error } = await supabase
      .from("vehicle_groom_checklists")
      .select("id, checked_at, checked_by_name, issues_found, odometer, notes, items")
      .eq("vehicle_id", vehicleId)
      .order("checked_at", { ascending: false })
      .limit(5);
    if (error) toast.error("Could not load history: " + error.message);
    setRecent(((data as unknown as RecentChecklist[]) || []));
    setLoadingRecent(false);
  };

  const selectVehicle = (v: VehicleRow) => {
    setVehicle(v);
    setResults([]);
    setSearch("");
    setItems({});
    setOdometer("");
    setNotes("");
    loadRecent(v.id);
  };

  const setItem = (key: string, status: ChecklistStatus) =>
    setItems((prev) => ({ ...prev, [key]: prev[key] === status ? undefined : status }));

  const markAllOk = () =>
    setItems(Object.fromEntries(GROOM_CHECKLIST_ITEMS.map((i) => [i.key, "ok" as ChecklistStatus])));

  const complete = useMemo(() => isComplete(items), [items]);
  const issues = useMemo(() => issueLabels(items), [items]);

  const submit = async () => {
    if (!vehicle) return;
    if (!checkedBy.trim()) {
      toast.error("Please enter who completed the check");
      return;
    }
    if (!complete) {
      toast.error("Please mark every item as OK or REQD");
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("vehicle_groom_checklists").insert({
      vehicle_id: vehicle.id,
      vehicle_rego: vehicle.rego,
      checked_by_user_id: user?.id ?? null,
      checked_by_name: checkedBy.trim(),
      items: items as Record<string, string>,
      issues_found: hasIssues(items),
      odometer: odometer.trim() ? parseInt(odometer.trim(), 10) : null,
      notes: notes.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error("Failed to save checklist: " + error.message);
      return;
    }
    toast.success(`Checklist saved for ${vehicle.rego}`);
    setItems({});
    setOdometer("");
    setNotes("");
    loadRecent(vehicle.id);
  };

  if (authLoading || roleLoading) {
    return (
      <div className="container mx-auto px-4 py-10 max-w-2xl space-y-4">
        <Skeleton className="h-10 w-2/3" />
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ClipboardList className="h-6 w-6 text-primary" />
            Vehicle Groom Checklist
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Digital replacement for the paper mirror hanger. Every submission is time-stamped.
          </p>
        </div>
        <Button asChild variant="outline" size="sm">
          <Link to="/admin/groom-checklists">
            <History className="h-4 w-4 mr-1" /> Records
          </Link>
        </Button>
      </div>

      {/* Vehicle search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">1. Find the vehicle</CardTitle>
          <CardDescription>Search by rego, make or model.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. ABC123 or Hiace"
              className="pl-9 uppercase"
              autoComplete="off"
            />
            {searching && (
              <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>

          {results.length > 0 && (
            <ul className="border rounded-md divide-y max-h-72 overflow-auto">
              {results.map((v) => (
                <li key={v.id}>
                  <button
                    type="button"
                    onClick={() => selectVehicle(v)}
                    className="w-full text-left px-3 py-2 hover:bg-muted flex items-center justify-between gap-3"
                  >
                    <span className="font-semibold">{v.rego}</span>
                    <span className="text-sm text-muted-foreground truncate">
                      {vehicleLabel(v)}
                      {v.branch ? ` · ${v.branch}` : ""}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {search.trim().length > 0 && !searching && results.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No vehicles found.{" "}
              <Link to="/admin/vehicles" className="underline">
                Add it to the vehicle register
              </Link>
              .
            </p>
          )}

          {vehicle && (
            <div className="flex items-center justify-between gap-3 rounded-md border bg-muted/40 p-3">
              <div>
                <p className="font-semibold">{vehicle.rego}</p>
                <p className="text-sm text-muted-foreground">
                  {vehicleLabel(vehicle)}
                  {vehicle.branch ? ` · ${vehicle.branch}` : ""}
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={() => setVehicle(null)}>
                Change
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {vehicle && (
        <>
          <Card className="mb-6">
            <CardHeader className="flex flex-row items-center justify-between space-y-0">
              <div>
                <CardTitle className="text-lg">2. Complete the checklist</CardTitle>
                <CardDescription>Mark each item OK or REQD (requires attention).</CardDescription>
              </div>
              <Button variant="outline" size="sm" onClick={markAllOk}>
                All OK
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center text-xs font-semibold text-muted-foreground pb-2 border-b">
                <span>ITEM</span>
                <span className="w-16 text-center">OK</span>
                <span className="w-16 text-center">REQD</span>
              </div>
              {GROOM_CHECKLIST_ITEMS.map((item) => (
                <div
                  key={item.key}
                  className="grid grid-cols-[1fr_auto_auto] gap-x-3 items-center py-2 border-b last:border-b-0"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <Button
                    type="button"
                    size="sm"
                    variant={items[item.key] === "ok" ? "default" : "outline"}
                    className="w-16"
                    onClick={() => setItem(item.key, "ok")}
                    aria-pressed={items[item.key] === "ok"}
                    aria-label={`${item.label} OK`}
                  >
                    OK
                  </Button>
                  <Button
                    type="button"
                    size="sm"
                    variant={items[item.key] === "reqd" ? "destructive" : "outline"}
                    className="w-16"
                    onClick={() => setItem(item.key, "reqd")}
                    aria-pressed={items[item.key] === "reqd"}
                    aria-label={`${item.label} requires attention`}
                  >
                    REQD
                  </Button>
                </div>
              ))}

              {issues.length > 0 && (
                <div className="mt-4 flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 p-3 text-sm">
                  <AlertTriangle className="h-4 w-4 text-destructive mt-0.5 shrink-0" />
                  <span>Requires attention: {issues.join(", ")}</span>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">3. Sign off</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <Label htmlFor="checkedBy">Checked by</Label>
                  <Input
                    id="checkedBy"
                    value={checkedBy}
                    onChange={(e) => setCheckedBy(e.target.value)}
                    maxLength={100}
                    placeholder="Full name"
                  />
                </div>
                <div>
                  <Label htmlFor="odometer">Odometer (km, optional)</Label>
                  <Input
                    id="odometer"
                    value={odometer}
                    onChange={(e) => setOdometer(e.target.value.replace(/[^0-9]/g, ""))}
                    inputMode="numeric"
                    maxLength={7}
                    placeholder="e.g. 128400"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="notes">Notes (optional)</Label>
                <Textarea
                  id="notes"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  maxLength={1000}
                  rows={3}
                  placeholder="Describe any damage or items needing attention"
                />
              </div>
              <Button onClick={submit} disabled={saving} className="w-full" size="lg">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Save checklist
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Recent checks for {vehicle.rego}</CardTitle>
            </CardHeader>
            <CardContent>
              {loadingRecent ? (
                <Skeleton className="h-20 w-full" />
              ) : recent.length === 0 ? (
                <p className="text-sm text-muted-foreground">No previous checklists recorded.</p>
              ) : (
                <ul className="divide-y">
                  {recent.map((r) => (
                    <li key={r.id} className="py-3 flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-medium">
                          {format(new Date(r.checked_at), "d MMM yyyy, h:mm a")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {r.checked_by_name}
                          {r.odometer ? ` · ${r.odometer.toLocaleString()} km` : ""}
                        </p>
                        {issueLabels(r.items || {}).length > 0 && (
                          <p className="text-xs text-destructive mt-1">
                            {issueLabels(r.items || {}).join(", ")}
                          </p>
                        )}
                      </div>
                      <Badge variant={r.issues_found ? "destructive" : "secondary"}>
                        {r.issues_found ? "Issues" : "All OK"}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};

export default GroomChecklist;
