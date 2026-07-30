import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Loader2, Plus, Trash2 } from "lucide-react";
import { z } from "zod";

interface RefRow {
  id: string;
  code: string;
  name: string;
}

type RefTable = "vehicle_categories" | "branches";

const refSchema = z.object({
  code: z.string().trim().min(1, "Code is required").max(20, "Code must be 20 characters or less"),
  name: z.string().trim().min(1, "Name is required").max(80, "Name must be 80 characters or less"),
});

const RefSection = ({
  table,
  title,
  description,
  codePlaceholder,
  namePlaceholder,
}: {
  table: RefTable;
  title: string;
  description: string;
  codePlaceholder: string;
  namePlaceholder: string;
}) => {
  const [rows, setRows] = useState<RefRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ code: "", name: "" });

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from(table).select("id, code, name").order("code");
    if (error) toast.error(`Failed to load ${title.toLowerCase()}: ${error.message}`);
    setRows((data as RefRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const save = async () => {
    const parsed = refSchema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setSaving(true);
    const { error } = await supabase.from(table).insert({
      code: parsed.data.code.toUpperCase(),
      name: parsed.data.name,
    });
    setSaving(false);
    if (error) {
      toast.error(
        error.code === "23505" ? "That code already exists" : `Failed to save: ${error.message}`
      );
      return;
    }
    toast.success("Record added");
    setForm({ code: "", name: "" });
    load();
  };

  const remove = async (row: RefRow) => {
    const { error } = await supabase.from(table).delete().eq("id", row.id);
    if (error) {
      toast.error("Delete failed: " + error.message);
      return;
    }
    setRows((prev) => prev.filter((r) => r.id !== row.id));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid gap-3 sm:grid-cols-[140px_1fr_auto] sm:items-end">
          <div>
            <Label htmlFor={`${table}-code`}>Code *</Label>
            <Input
              id={`${table}-code`}
              value={form.code}
              onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
              maxLength={20}
              className="uppercase"
              placeholder={codePlaceholder}
            />
          </div>
          <div>
            <Label htmlFor={`${table}-name`}>Name *</Label>
            <Input
              id={`${table}-name`}
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              maxLength={80}
              placeholder={namePlaceholder}
            />
          </div>
          <Button onClick={save} disabled={saving}>
            {saving ? <Loader2 className="h-4 w-4 mr-1 animate-spin" /> : <Plus className="h-4 w-4 mr-1" />}
            Add
          </Button>
        </div>

        {loading ? (
          <Skeleton className="h-40 w-full" />
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">No records yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-32">Code</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.id}>
                    <TableCell className="font-semibold">{row.code}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm" onClick={() => remove(row)}>
                        <Trash2 className="h-4 w-4" />
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
  );
};

const AdminReferenceData = () => {
  const { user, loading: authLoading } = useAuth();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

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
    <div className="container mx-auto px-4 py-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Categories &amp; Branches</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Maintain the code and name lists used across the fleet and bookings.
        </p>
      </div>

      <RefSection
        table="vehicle_categories"
        title="Vehicle Categories"
        description="Each category needs a short code and a display name."
        codePlaceholder="VAN"
        namePlaceholder="Standard Van"
      />
      <RefSection
        table="branches"
        title="Branches"
        description="Each branch needs a short code and a display name."
        codePlaceholder="AKLW"
        namePlaceholder="West Auckland"
      />
    </div>
  );
};

export default AdminReferenceData;