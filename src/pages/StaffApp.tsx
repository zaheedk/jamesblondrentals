import { Link, Navigate } from "react-router-dom";
import { Camera, FileSignature, ClipboardList, Images, History } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useUserRole } from "@/hooks/use-user-role";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

const tools = [
  {
    to: "/photos",
    label: "Vehicle Photos",
    description: "Capture inspection photos for a booking or rego",
    Icon: Camera,
  },
  {
    to: "/ra",
    label: "Rental Agreement",
    description: "Open, complete and sign a rental agreement",
    Icon: FileSignature,
  },
  {
    to: "/admin/groom-checklist",
    label: "Groom Checklist",
    description: "Digital mirror-hanger vehicle check",
    Icon: ClipboardList,
  },
];

const secondary = [
  { to: "/photo-gallery", label: "Photo gallery", Icon: Images },
  { to: "/admin/groom-checklists", label: "Checklist records", Icon: History },
];

const StaffApp = () => {
  const { user, loading } = useAuth();
  const { isOfficeAdmin, isLoading: roleLoading } = useUserRole();

  if (loading || roleLoading) {
    return (
      <div className="container mx-auto max-w-md px-4 py-10 space-y-4">
        <Skeleton className="h-10 w-2/3" />
        <Skeleton className="h-56 w-full" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;

  if (!isOfficeAdmin) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-2">Access restricted</h1>
        <p className="text-muted-foreground">
          This app is only available to James Blond staff.
        </p>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-md px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Staff Tools</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Signed in as {user.email}
        </p>
      </header>

      <div className="space-y-3">
        {tools.map(({ to, label, description, Icon }) => (
          <Link key={to} to={to} className="block">
            <Card className="transition-colors hover:bg-muted/50 active:bg-muted">
              <CardContent className="flex items-center gap-4 p-5">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Icon className="h-6 w-6" />
                </span>
                <span>
                  <span className="block text-base font-semibold">{label}</span>
                  <span className="block text-sm text-muted-foreground">
                    {description}
                  </span>
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-8 grid grid-cols-2 gap-3">
        {secondary.map(({ to, label, Icon }) => (
          <Link
            key={to}
            to={to}
            className="flex items-center gap-2 rounded-lg border px-3 py-3 text-sm font-medium hover:bg-muted"
          >
            <Icon className="h-4 w-4 text-muted-foreground" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default StaffApp;