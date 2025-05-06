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
import InsuranceSelection from "./pages/InsuranceSelection";
import ExtrasSelection from "./pages/ExtrasSelection";
import CustomerDetails from "./pages/CustomerDetails";
import PaymentOptions from "./pages/PaymentOptions";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact"; // Add the new Contact page
import ContactAuckland from "./pages/ContactAuckland";
import ContactWellington from "./pages/ContactWellington";
import ContactChristchurch from "./pages/ContactChristchurch";

import Fleet from "./pages/Fleet";
import FleetCars from "./pages/FleetCars";
import FleetVans from "./pages/FleetVans";
import FleetUtes from "./pages/FleetUtes";
import FleetTrucks from "./pages/FleetTrucks";
import FleetMinibuses from "./pages/FleetMinibuses";
import FleetTrailers from "./pages/FleetTrailers";
import FleetAccessories from "./pages/FleetAccessories";
import PremiumVanDetail from "./pages/PremiumVanDetail"; 
import StandardVanDetail from "./pages/StandardVanDetail";
import StandardRearSeatVanDetail from "./pages/StandardRearSeatVanDetail";
import JumboVanDetail from "./pages/JumboVanDetail";
import SingleCabUteDetail from "./pages/SingleCabUteDetail"; 
import PremiumDoubleCabUteDetail from "./pages/PremiumDoubleCabUteDetail"; 
import PremiumSevenSeatSUVDetail from "./pages/PremiumSevenSeatSUVDetail";
import Premium2WDSUVDetail from "./pages/Premium2WDSUVDetail";
import PremiumCompactSUVDetail from "./pages/PremiumCompactSUVDetail"; 
import PremiumAWDSUVDetail from "./pages/PremiumAWDSUVDetail";
import PremiumEconomyDetail from "./pages/PremiumEconomyDetail";
import PremiumMidsizeDetail from "./pages/PremiumMidsizeDetail";
import PremiumEconomyWagonDetail from "./pages/PremiumEconomyWagonDetail";
import TwoTonneBoxTruckDetail from "./pages/TwoTonneBoxTruckDetail"; 
import TwoTonneBox12m3Detail from "./pages/TwoTonneBox12m3Detail";
import TwoTonneBoxTailLiftDetail from "./pages/TwoTonneBoxTailLiftDetail"; 
import TwoTonneTipperDetail from "./pages/TwoTonneTipperDetail";
import TwoTonneBox16m3Detail from "./pages/TwoTonneBox16m3Detail";
import ThreeTonneBoxTailLiftDetail from "./pages/ThreeTonneBoxTailLiftDetail";
import ThreeTonneBox19m3Detail from "./pages/ThreeTonneBox19m3Detail"; 
import TwelveSeaterMinibusDetail from "./pages/TwelveSeaterMinibusDetail"; 
import TenSeaterMinibusDetail from "./pages/TenSeaterMinibusDetail"; 
import MobilFuelDiscount from "./pages/MobilFuelDiscount"; // Import the new Mobil Fuel Discount page
import CarRentalWellington from "./pages/CarRentalWellington"; // Import the new Wellington car rental page
import CagedTrailerDetail from "./pages/CagedTrailerDetail"; // Import the new Caged Trailer detail page
import LuggageTrailerDetail from "./pages/LuggageTrailerDetail"; // Import the new Luggage Trailer detail page
import CarTransporterTrailerDetail from "./pages/CarTransporterTrailerDetail"; // Import the new Car Transporter Trailer detail page
import ChildSeatDetail from "./pages/ChildSeatDetail"; // Import the new Child Seat detail page
import BoosterSeatDetail from "./pages/BoosterSeatDetail"; // Import the new Booster Seat detail page

import Airport from "./pages/Airport";
import AirportShuttle from "./pages/AirportShuttle";
import AirportDirections from "./pages/AirportDirections";
import AirportAuckland from "./pages/AirportAuckland";
import AirportChristchurch from "./pages/AirportChristchurch";
import AirportWellington from "./pages/AirportWellington";

import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";

import AppLayout from "./components/layout/AppLayout";
import VanDetail from "./pages/VanDetail";

import SingleCabUteDieselDetail from "./pages/SingleCabUteDieselDetail";

const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <AppLayout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/vehicles" element={<Vehicles />} />
              <Route path="/vehicle/:id" element={<VehicleDetail />} />
              <Route path="/booking" element={<Booking />} />
              <Route path="/insurance-selection" element={<InsuranceSelection />} />
              <Route path="/extras-selection" element={<ExtrasSelection />} />
              <Route path="/customer-details" element={<CustomerDetails />} />
              <Route path="/payment-options" element={<PaymentOptions />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              <Route path="/hot-deals/mobil-fuel-discount" element={<MobilFuelDiscount />} /> {/* Mobil fuel discount route */}
              <Route path="/car-rental-wellington-new-zealand" element={<CarRentalWellington />} /> {/* New Wellington car rental page */}

              <Route path="/fleet" element={<Fleet />}>
                <Route path="cars" element={<FleetCars />} />
                <Route path="cars/premium-seven-seat-suv" element={<PremiumSevenSeatSUVDetail />} />
                <Route path="cars/premium-2wd-suv" element={<Premium2WDSUVDetail />} />
                <Route path="cars/premium-compact-suv" element={<PremiumCompactSUVDetail />} />
                <Route path="cars/premium-awd-suv" element={<PremiumAWDSUVDetail />} />
                <Route path="cars/premium-economy" element={<PremiumEconomyDetail />} />
                <Route path="cars/premium-midsize" element={<PremiumMidsizeDetail />} />
                <Route path="cars/premium-economy-wagon" element={<PremiumEconomyWagonDetail />} />
                <Route path="vans" element={<FleetVans />} />
                <Route path="vans/:vanId" element={<VanDetail />} />
                <Route path="vans/premium-van" element={<PremiumVanDetail />} /> 
                <Route path="vans/standard-van" element={<StandardVanDetail />} />
                <Route path="vans/standard-rear-seat-van" element={<StandardRearSeatVanDetail />} />
                <Route path="vans/jumbo-van" element={<JumboVanDetail />} />
                <Route path="utes" element={<FleetUtes />} />
                <Route path="utes/single-cab-ute-petrol" element={<SingleCabUteDetail />} />
                <Route path="utes/single-cab-ute-diesel" element={<SingleCabUteDieselDetail />} />
                <Route path="utes/premium-double-cab-ute" element={<PremiumDoubleCabUteDetail />} />
                <Route path="trucks" element={<FleetTrucks />} />
                <Route path="trucks/2-tonne-box-9m3" element={<TwoTonneBoxTruckDetail />} />
                <Route path="trucks/2-tonne-box-12m3" element={<TwoTonneBox12m3Detail />} />
                <Route path="trucks/2-tonne-box-12m3-tail" element={<TwoTonneBoxTailLiftDetail />} /> 
                <Route path="trucks/2-tonne-tipper" element={<TwoTonneTipperDetail />} />
                <Route path="trucks/2-tonne-box-16m3" element={<TwoTonneBox16m3Detail />} />
                <Route path="trucks/3-tonne-box-18m3" element={<ThreeTonneBoxTailLiftDetail />} />
                <Route path="trucks/3-tonne-box-19m3" element={<ThreeTonneBox19m3Detail />} /> 
                <Route path="minibuses" element={<FleetMinibuses />} />
                <Route path="minibuses/12-seat-minibus" element={<TwelveSeaterMinibusDetail />} />
                <Route path="minibuses/10-seat-minibus" element={<TenSeaterMinibusDetail />} />
                <Route path="trailers" element={<FleetTrailers />} />
                <Route path="trailers/cage-trailer" element={<CagedTrailerDetail />} />
                <Route path="trailers/luggage-trailer" element={<LuggageTrailerDetail />} />
                <Route path="trailers/car-transporter" element={<CarTransporterTrailerDetail />} />
                <Route path="accessories" element={<FleetAccessories />} />
                <Route path="accessories/child-seat" element={<ChildSeatDetail />} />
                <Route path="accessories/booster-seat" element={<BoosterSeatDetail />} />
              </Route>
              
              <Route path="/airport" element={<Airport />} />
              <Route path="/airport/shuttle" element={<AirportShuttle />} />
              <Route path="/airport/directions" element={<AirportDirections />} />
              <Route path="/airport/auckland" element={<AirportAuckland />} />
              <Route path="/airport/christchurch" element={<AirportChristchurch />} />
              <Route path="/airport/wellington" element={<AirportWellington />} />
              
              <Route path="/contact/auckland" element={<ContactAuckland />} />
              <Route path="/contact/wellington" element={<ContactWellington />} />
              <Route path="/contact/christchurch" element={<ContactChristchurch />} />
              <Route path="/faq" element={<FAQ />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AppLayout>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
