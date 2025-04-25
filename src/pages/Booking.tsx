
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    
    // Redirect to insurance selection page
    navigate('/insurance-selection');
  }, [navigate]);

  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <div className="animate-pulse">Redirecting to booking flow...</div>
    </div>
  );
};

export default Booking;
