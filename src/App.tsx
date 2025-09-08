import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { createElement, useState } from "react";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Vehicles from "./pages/Vehicles";
import VehicleDetail from "./pages/VehicleDetail";
import Booking from "./pages/Booking";
import InsuranceAndExtrasSelection from "./pages/InsuranceAndExtrasSelection";
import CustomerDetails from "./pages/CustomerDetails";
import PaymentOptions from "./pages/PaymentOptions";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ContactAuckland from "./pages/ContactAuckland";
import ContactWellington from "./pages/ContactWellington";
import ContactChristchurch from "./pages/ContactChristchurch";

// Auth Pages
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import MemberDashboard from "./pages/MemberDashboard";

// Blog Pages
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import AdminBlog from "./pages/AdminBlog";
import AdminBlogEditor from "./pages/AdminBlogEditor";
import AdminVehicleRates from "./pages/AdminVehicleRates";
import AdminFeedback from "./pages/AdminFeedback";

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
import Premium12SeatMinibusDetail from "./pages/Premium12SeatMinibusDetail"; // Import the new Premium 12-Seat Minibus page
import MobilFuelDiscount from "./pages/MobilFuelDiscount"; // Import the new Mobil Fuel Discount page
import MidweekTruckVanDiscount from "./pages/MidweekTruckVanDiscount";
import HotDeals from "./pages/HotDeals";
import CarRentalWellington from "./pages/CarRentalWellington"; // Import the new Wellington car rental page
import CarRentalAucklandAirport from "./pages/CarRentalAucklandAirport"; // Import the new Auckland Airport car rental page
import AucklandAirportMinibusRentals from "./pages/AucklandAirportMinibusRentals"; // Import the new Auckland Airport Minibus Rentals page
import CagedTrailerDetail from "./pages/CagedTrailerDetail"; // Import the new Caged Trailer detail page
import LuggageTrailerDetail from "./pages/LuggageTrailerDetail"; // Import the new Luggage Trailer detail page
import CarTransporterTrailerDetail from "./pages/CarTransporterTrailerDetail"; // Import the new Car Transporter Trailer detail page
import ChildSeatDetail from "./pages/ChildSeatDetail"; // Import the new Child Seat detail page
import BoosterSeatDetail from "./pages/BoosterSeatDetail"; // Import the new Booster Seat detail page
import PalletJackDetail from "./pages/PalletJackDetail"; // Import the new Pallet Jack detail page
import StrapsRatchetDetail from "./pages/StrapsRatchetDetail"; // Import the new Straps & Ratchet detail page
import HandTrolleyDetail from "./pages/HandTrolleyDetail"; // Import the new Hand Trolley detail page
import LargeHandTrolleyDetail from "./pages/LargeHandTrolleyDetail"; // Import the new Large Hand Trolley detail page
import WestAucklandTruckRentals from "./pages/WestAucklandTruckRentals"; // Import the new West Auckland Truck Rentals page
import AucklandTruckRentals from "./pages/AucklandTruckRentals"; // Import the new Auckland Truck Rentals page
import WellingtonTruckRentals from "./pages/WellingtonTruckRentals"; // Import the new Wellington Truck Rentals page
import WellingtonCargoVanRentals from "./pages/WellingtonCargoVanRentals"; // Import the new Wellington Cargo Van Rentals page
import WestAucklandCargoVanRentals from "./pages/WestAucklandCargoVanRentals"; // Import the new West Auckland Cargo Van Rentals page
import AucklandAirportCargoVanRentals from "./pages/AucklandAirportCargoVanRentals"; // Import the new Auckland Airport Cargo Van Rentals page
import SouthAucklandCargoVanRentals from "./pages/SouthAucklandCargoVanRentals"; // Import the new South Auckland Cargo Van Rentals page
import CentralAucklandCargoVanRentals from "./pages/CentralAucklandCargoVanRentals"; // Import the new Central Auckland Cargo Van Rentals page
import PriceGuide from "./pages/PriceGuide"; // Import the new Price Guide page
import PeopleMover from "./pages/PeopleMover";
import Airport from "./pages/Airport";
import AirportShuttle from "./pages/AirportShuttle";
import AirportDirections from "./pages/AirportDirections";
import AirportAuckland from "./pages/AirportAuckland";
import AirportChristchurch from "./pages/AirportChristchurch";
import AirportWellington from "./pages/AirportWellington";

import FAQ from "./pages/FAQ";
import Terms from "./pages/Terms";
import JumboTaxiLaunch from "./pages/JumboTaxiLaunch";
import Privacy from "./pages/Privacy";

import AppLayout from "./components/layout/AppLayout";
import { ScrollToTop } from "./components/layout/ScrollToTop";
import VanDetail from "./pages/VanDetail";

import SingleCabUteDieselDetail from "./pages/SingleCabUteDieselDetail";

import FleetCargoVans from "@/pages/FleetCargoVans";
import WinzQuotes from "./pages/WinzQuotes";
import CourierOperatorDeals from "./pages/CourierOperatorDeals";
import AucklandVanHire from "./pages/AucklandVanHire";
import WellingtonMinibusHire from "./pages/WellingtonMinibusHire";


const App = () => {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ScrollToTop />
            <AppLayout>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/vehicles" element={<Vehicles />} />
                <Route path="/vehicle/:id" element={<VehicleDetail />} />
                <Route path="/booking" element={<Booking />} />
                <Route path="/insurance-and-extras" element={<InsuranceAndExtrasSelection />} />
                <Route path="/customer-details" element={<CustomerDetails />} />
                <Route path="/payment-options" element={<PaymentOptions />} />
                <Route path="/payment" element={<Payment />} />
                <Route path="/payment-success" element={<PaymentSuccess />} />
                <Route path="/terms" element={<Terms />} />
                <Route path="/privacy" element={<Privacy />} />
                
                {/* Blog routes */}
                <Route path="/blog" element={<Blog />} />
                <Route path="/blog/:slug" element={<BlogPost />} />
                
                {/* Admin Blog routes */}
                <Route path="/admin/blog" element={
                  <ProtectedRoute>
                    <AdminBlog />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog/new" element={
                  <ProtectedRoute>
                    <AdminBlogEditor />
                  </ProtectedRoute>
                } />
                <Route path="/admin/blog/edit/:id" element={
                  <ProtectedRoute>
                    <AdminBlogEditor />
                  </ProtectedRoute>
                } />
                <Route path="/admin/vehicle-rates" element={
                  <ProtectedRoute>
                    <AdminVehicleRates />
                  </ProtectedRoute>
                } />
                <Route path="/admin/feedback" element={
                  <ProtectedRoute>
                    <AdminFeedback />
                  </ProtectedRoute>
                } />
                
                {/* Auth routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/member-dashboard" element={
                  <ProtectedRoute>
                    <MemberDashboard />
                  </ProtectedRoute>
                } />
                
                {/* Keep existing routes */}
                <Route path="/price-guide" element={<PriceGuide />} />
                <Route path="/people-mover" element={<PeopleMover />} />
                <Route path="/hot-deals/mobil-fuel-discount" element={<MobilFuelDiscount />} />
                <Route path="/hot-deals/midweek-truck-van-discount" element={<MidweekTruckVanDiscount />} />
                <Route path="/hot-deals/courier-operator-deals" element={<CourierOperatorDeals />} />
                <Route path="/hot-deals" element={<HotDeals />} />
                <Route path="/car-rental-wellington-new-zealand" element={<CarRentalWellington />} />
                <Route path="/car-rental-auckland-airport-new-zealand" element={<CarRentalAucklandAirport />} />
                <Route path="/auckland-airport-minibus-rentals-hire" element={<AucklandAirportMinibusRentals />} />
                <Route path="/west-auckland-truck-rentals-hire" element={<WestAucklandTruckRentals />} />
                <Route path="/auckland-truck-rentals-hire" element={<AucklandTruckRentals />} />
                <Route path="/wellington-truck-rentals-hire" element={<WellingtonTruckRentals />} />
                <Route path="/wellington-cargo-van-rentals-hire" element={<WellingtonCargoVanRentals />} />
                <Route path="/west-auckland-cargo-van-rentals-hire" element={<WestAucklandCargoVanRentals />} />
                <Route path="/south-auckland-cargo-van-rentals-hire" element={<SouthAucklandCargoVanRentals />} />
                <Route path="/central-auckland-cargo-van-rentals-hire" element={<CentralAucklandCargoVanRentals />} />
                <Route path="/auckland-airport-cargo-van-rentals-hire" element={<AucklandAirportCargoVanRentals />} />

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
                  <Route path="minibus" element={<FleetMinibuses />} />
                  <Route path="minibus/12-seat-minibus" element={<TwelveSeaterMinibusDetail />} />
                  <Route path="minibus/10-seat-minibus" element={<TenSeaterMinibusDetail />} />
                  <Route path="minibus/premium-12-seat-minibus" element={<Premium12SeatMinibusDetail />} /> {/* Premium 12-Seat Minibus route */}
                  <Route path="trailers" element={<FleetTrailers />} />
                  <Route path="trailers/cage-trailer" element={<CagedTrailerDetail />} />
                  <Route path="trailers/luggage-trailer" element={<LuggageTrailerDetail />} />
                  <Route path="trailers/car-transporter" element={<CarTransporterTrailerDetail />} />
                  <Route path="accessories" element={<FleetAccessories />} />
                  <Route path="accessories/child-seat" element={<ChildSeatDetail />} />
                  <Route path="accessories/booster-seat" element={<BoosterSeatDetail />} />
                  <Route path="accessories/pallet-jack" element={<PalletJackDetail />} />
                  <Route path="accessories/straps-ratchet" element={<StrapsRatchetDetail />} />
                  <Route path="accessories/hand-trolley" element={<HandTrolleyDetail />} />
                  <Route path="accessories/large-hand-trolley" element={<LargeHandTrolleyDetail />} />
                </Route>
                
                <Route path="/fleet/cargo-vans" element={<FleetCargoVans />} />
                
                {/* ... keep existing code (airport routes) */}
                <Route path="/airport" element={<Airport />} />
                <Route path="/airport/shuttle" element={<AirportShuttle />} />
                <Route path="/airport/directions" element={<AirportDirections />} />
                <Route path="/airport/auckland" element={<AirportAuckland />} />
                <Route path="/airport/christchurch" element={<AirportChristchurch />} />
                <Route path="/airport/wellington" element={<AirportWellington />} />
                
                <Route path="/contact/auckland" element={<ContactAuckland />} />
                <Route path="/contact/wellington" element={<ContactWellington />} />
                <Route path="/contact/christchurch" element={<ContactChristchurch />} />
                <Route path="/winz-quotes" element={<WinzQuotes />} />
                <Route path="/12-seater-van-hire-auckland" element={<AucklandVanHire />} />
                <Route path="/wellington-10-12-seat-van-minibus-rental" element={<WellingtonMinibusHire />} />
                
                <Route path="/jumbo-taxi-launch" element={<JumboTaxiLaunch />} />
                <Route path="/faq" element={<FAQ />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </AppLayout>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
