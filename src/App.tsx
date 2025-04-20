
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
import CustomerDetails from "./pages/CustomerDetails";
import PaymentOptions from "./pages/PaymentOptions";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";

import Fleet from "./pages/Fleet";
import FleetCars from "./pages/FleetCars";
import FleetVans from "./pages/FleetVans";
import FleetTrucks from "./pages/FleetTrucks";
import FleetMinibuses from "./pages/FleetMinibuses";
import FleetTrailers from "./pages/FleetTrailers";
import FleetFurnitureTruck from "./pages/FleetFurnitureTruck";

import Airport from "./pages/Airport";
import AirportAbout from "./pages/AirportAbout";
import AirportShuttle from "./pages/AirportShuttle";
import AirportDirections from "./pages/AirportDirections";

import FAQ from "./pages/FAQ";

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
            <Route path="/customer-details" element={<CustomerDetails />} />
            <Route path="/payment-options" element={<PaymentOptions />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />

            <Route path="/fleet" element={<Fleet />}>
              <Route path="cars" element={<FleetCars />} />
              <Route path="vans" element={<FleetVans />} />
              <Route path="trucks" element={<FleetTrucks />} />
              <Route path="minibuses" element={<FleetMinibuses />} />
              <Route path="trailers" element={<FleetTrailers />} />
              <Route path="furniture-truck" element={<FleetFurnitureTruck />} />
            </Route>
            <Route path="/airport" element={<Airport />}>
              <Route path="about" element={<AirportAbout />} />
              <Route path="shuttle" element={<AirportShuttle />} />
              <Route path="directions" element={<AirportDirections />} />
            </Route>
            <Route path="/faq" element={<FAQ />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
