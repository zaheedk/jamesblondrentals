
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'sonner';
import { getBookingData } from '@/lib/booking-session';

const Booking = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const data = getBookingData();
    if (!data) {
      toast.error("No booking information found", {
        description: "Please start a new booking.",
      });
      navigate('/');
      return;
    }
    
    // Redirect to insurance and extras selection page
    navigate('/insurance-and-extras');
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <Helmet>
        <title>Book Your Rental Vehicle | James Blond Rentals</title>
        <meta name="description" content="Complete your vehicle booking with James Blond Rentals. Choose from cars, vans, trucks and utes across Auckland, Wellington and Christchurch." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="animate-pulse">Redirecting to booking flow...</div>
    </div>
  );
};

export default Booking;
