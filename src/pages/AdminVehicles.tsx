import { useEffect, useMemo, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Plus, Search, Loader2, Upload, ClipboardList } from "lucide-react";
import { z } from "zod";

interface VehicleRow {
  id: string;
  rego: string;
  make: string | null;
  model: string | null;
  year: number | null;
  category: string | null;
  branch: string | null;
  active: boolean;
  created_at: string;
}

const vehicleSchema = z.object({
  rego: z.string().trim().min(1, "Rego is required").max(12, "Rego must be 12 characters or less"),
  make: z.string().trim().max(60).optional().or(z.literal("")),
  model: z.string().trim().max(60).optional().or(z.literal("")),
  year: z
    .string()
    .trim()
    .optional()
    .refine((v) => !v || (/^\d{4}$/.test(v) && +v >= 1950 && +v <= 2100), "Enter a valid year"),
  category: z.string().trim().max(60).optional().or(z.literal("")),
  branch: z.string().trim().max(60).optional().or(z.literal("")),
});

const emptyForm = { rego: "", make: "", model: "", year: "", category: "", branch: "" };

const AdminVehicles = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  const [vehicles, setVehicles] = useState<VehicleRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [importing, setImporting] = useState(false);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("vehicles")
      .select("id, rego, make, model, year, category, branch, active, created_at")
      .order("rego")
      .limit(2000);
    if (error) toast.error("Failed to load vehicles: " + error.message);
    setVehicles((data as VehicleRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    if (user && isOfficeAdmin) load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, isOfficeAdmin]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return vehicles;
    return vehicles.filter((v) =>
      [v.rego, v.make, v.model, v.category, v.branch]
        .filter(Boolean)
        .some((f) => (f as string).toLowerCase().includes(q))
    );
  }, [vehicles, query]);

  const save = async () => {
    const parsed = vehicleSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const { error } = await supabase.from("vehicles").insert({
      rego: form.rego.trim().toUpperCase(),
      make: form.make.trim() || null,
      model: form.model.trim() || null,
      year: form.year.trim() ? parseInt(form.year.trim(), 10) : null,
      category: form.category.trim() || null,
      branch: form.branch.trim() || null,
    });
    setSaving(false);
    if (error) {
      toast.error(
        error.code === "23505" ? "That rego already exists in the register" : "Failed to add vehicle: " + error.message
      );
      return;
    }
    toast.success("Vehicle added");
    setForm(emptyForm);
    setOpen(false);
    load();
  };

  const toggleActive = async (v: VehicleRow) => {
    const { error } = await supabase.from("vehicles").update({ active: !v.active }).eq("id", v.id);
    if (error) {
      toast.error("Update failed: " + error.message);
      return;
    }
    setVehicles((prev) => prev.map((x) => (x.id === v.id ? { ...x, active: !x.active } : x)));
  };

  const importCsv = async (file: File) => {
    setImporting(true);
    try {
      const text = await file.text();
      const lines = text.split(/\r?\n/).filter((l) => l.trim());
      if (lines.length < 2) throw new Error("CSV appears to be empty");
      const headers = lines[0].split(",").map((h) => h.trim().toLowerCase());
      const idx = (name: string) => headers.indexOf(name);
      const regoIdx = idx("rego");
      if (regoIdx === -1) throw new Error("CSV must include a 'rego' column");

      const rows = lines.slice(1).map((line) => {
        const cells = line.split(",").map((c) => c.trim());
        const get = (n: string) => {
          const i = idx(n);
          return i === -1 || !cells[i] ? null : cells[i];
        };
        const yearRaw = get("year");
        return {
          rego: (cells[regoIdx] || "").toUpperCase(),
          make: get("make"),
          model: get("model"),
          year: yearRaw && /^\d{4}$/.test(yearRaw) ? parseInt(yearRaw, 10) : null,
          category: get("category"),
          branch: get("branch"),
        };
      }).filter((r) => r.rego);

      if (!rows.length) throw new Error("No valid rows found");

      const { error } = await supabase.from("vehicles").insert(rows);
      if (error) throw error;
      toast.success(`Imported ${rows.length} vehicles`);
      load();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Import failed");
    } finally {
      setImporting(false);
    }
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-wrap items-start justify-between gap-3 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Vehicle Register</h1>
          <p className="text-muted-foreground text-sm mt-1">
            Vehicles available for groom checklists. {vehicles.length} recorded.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link to="/admin/groom-checklist">
              <ClipboardList className="h-4 w-4 mr-1" /> New checklist
            </Link>
          </Button>
          <Button variant="outline" asChild disabled={importing}>
            <label className="cursor-pointer">
              {importing ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Upload className="h-4 w-4 mr-1" />}
              Import CSV
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                onChange={(e) => {
                  const f = e.target.files?.[0];
                  if (f) importCsv(f);
                  e.target.value = "";
                }}
              />
            </label>
          </Button>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-1" /> Add vehicle
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add vehicle</DialogTitle>
              </DialogHeader>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Label htmlFor="rego">Rego *</Label>
                  <Input
                    id="rego"
                    value={form.rego}
                    onChange={(e) => setForm({ ...form, rego: e.target.value.toUpperCase() })}
                    maxLength={12}
                    className="uppercase"
                  />
                </div>
                <div>
                  <Label htmlFor="make">Make</Label>
                  <Input id="make" value={form.make} onChange={(e) => setForm({ ...form, make: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="model">Model</Label>
                  <Input id="model" value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })} />
                </div>
                <div>
                  <Label htmlFor="year">Year</Label>
                  <Input
                    id="year"
                    value={form.year}
                    onChange={(e) => setForm({ ...form, year: e.target.value.replace(/[^0-9]/g, "") })}
                    maxLength={4}
                    inputMode="numeric"
                  />
                </div>
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input
                    id="category"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    placeholder="Van, Truck, Car…"
                  />
                </div>
                <div className="sm:col-span-2">
                  <Label htmlFor="branch">Branch</Label>
                  <Input
                    id="branch"
                    value={form.branch}
                    onChange={(e) => setForm({ ...form, branch: e.target.value })}
                    placeholder="Auckland, Wellington…"
                  />
                </div>
              </div>
              <Button onClick={save} disabled={saving} className="mt-2">
                {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Save vehicle
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Vehicles</CardTitle>
          <CardDescription>CSV columns supported: rego, make, model, year, category, branch.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative mb-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search rego, make, model…"
              className="pl-9"
            />
          </div>
          {loading ? (
            <Skeleton className="h-64 w-full" />
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">No vehicles found.</p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Rego</TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Branch</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered.map((v) => (
                    <TableRow key={v.id}>
                      <TableCell className="font-semibold">{v.rego}</TableCell>
                      <TableCell>{[v.year, v.make, v.model].filter(Boolean).join(" ") || "—"}</TableCell>
                      <TableCell>{v.category || "—"}</TableCell>
                      <TableCell>{v.branch || "—"}</TableCell>
                      <TableCell>
                        <Badge variant={v.active ? "secondary" : "outline"}>
                          {v.active ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm" onClick={() => toggleActive(v)}>
                          {v.active ? "Deactivate" : "Reactivate"}
                        </Button>
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

export default AdminVehicles;
