import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { TriangleAlert } from "lucide-react";
import { Button } from "@/components/ui/button";
import PageSEO from "@/components/PageSEO";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <PageSEO
        title="Page Not Found | James Blond Rentals"
        description="The page you're looking for doesn't exist. Browse our cars, vans, utes, trucks and minibuses for hire across New Zealand."
        noindex
      />
      <div className="max-w-md mx-auto text-center p-8">
        <div className="flex items-center justify-center gap-3 mb-6">
          <TriangleAlert className="h-6 w-6 text-destructive" />
          <h1 className="text-2xl font-semibold text-foreground">404 page</h1>
        </div>
        
        <div className="bg-muted/50 rounded-lg p-6 mb-6">
          <p className="text-muted-foreground">
            The website does not have this page.
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <Button asChild>
            <Link to="/">Return to Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link to="/vehicles">Browse Vehicles</Link>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
