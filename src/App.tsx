
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createElement, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Booking from "./pages/Booking";

// Use function component syntax to ensure hooks work correctly
const App = () => {
  // Create a client inside the component function
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/vehicles" element={<Vehicles />} />
            <Route path="/vehicle/:id" element={<VehicleDetail />} />
            <Route path="/booking" element={<Booking />} />
            <Route path="/customer-details" element={<div className="container mx-auto p-4 text-center py-12">
              <h1 className="text-2xl font-bold mb-4">Customer Details Page</h1>
              <p className="text-muted-foreground mb-4">This page is coming soon</p>
              <div className="flex justify-center">
                <a href="/" className="bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80">
                  Return to Home
                </a>
              </div>
            </div>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
