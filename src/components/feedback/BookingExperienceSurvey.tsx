import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { getBookingData } from '@/lib/booking-session';

interface BookingExperienceSurveyProps {
  isOpen: boolean;
  onClose: () => void;
  bookingReference?: string;
}

const BookingExperienceSurvey = ({ isOpen, onClose, bookingReference }: BookingExperienceSurveyProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [suggestions, setSuggestions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleRatingSubmit = () => {
    if (rating) {
      setCurrentStep(2);
    }
  };

  const handleFinalSubmit = async () => {
    if (!rating) return;
    
    setIsSubmitting(true);
    try {
      // Get customer details from booking session
      const bookingData = getBookingData();
      console.log('Booking data for feedback:', bookingData);
      console.log('Booking reference from props:', bookingReference);
      
      const customerName = bookingData ? `${bookingData.customerFirstName || ''} ${bookingData.customerLastName || ''}`.trim() : '';
      const customerEmail = bookingData?.customerEmail || '';
      
      console.log('Customer details for feedback submission:', { 
        customerName, 
        customerEmail, 
        bookingReference,
        fullBookingData: bookingData 
      });

      const { error } = await supabase.functions.invoke('submit-feedback', {
        body: {
          rating,
          suggestions,
          bookingReference,
          customerName,
          customerEmail,
        },
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Thank you!",
        description: "Your feedback helps us improve our service.",
        duration: 3000,
      });
      
      onClose();
    } catch (error) {
      console.error('Error submitting feedback:', error);
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-800 rounded-lg p-8 max-w-md w-full relative text-white">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <X className="h-6 w-6" />
        </button>

        {currentStep === 1 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              1/2 - How easy was the booking process?
            </h2>
            <p className="text-gray-300 mb-8">
              This will help us improve your experience.
            </p>

            <div className="flex justify-center space-x-3 mb-8">
              {[1, 2, 3, 4, 5].map((num) => (
                <button
                  key={num}
                  onClick={() => setRating(num)}
                  className={`w-12 h-12 rounded-lg text-xl font-semibold transition-colors ${
                    rating === num
                      ? 'bg-blue-600 text-white'
                      : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                  }`}
                >
                  {num}
                </button>
              ))}
            </div>

            <div className="flex justify-between text-sm text-gray-400 mb-8">
              <span>Very Difficult</span>
              <span>Very Easy</span>
            </div>

            <div className="flex justify-center space-x-2 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
            </div>

            <Button
              onClick={handleRatingSubmit}
              disabled={!rating}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              Next
            </Button>
          </div>
        )}

        {currentStep === 2 && (
          <div className="text-center">
            <h2 className="text-xl font-semibold mb-4">
              2/2 - How could we improve your experience with our booking process?
            </h2>
            <p className="text-gray-300 mb-6">
              This will help us improve your experience.
            </p>

            <textarea
              value={suggestions}
              onChange={(e) => setSuggestions(e.target.value)}
              placeholder="Type your suggestions here..."
              className="w-full h-24 p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-gray-400 resize-none"
            />

            <div className="flex justify-center space-x-2 mb-6 mt-4">
              <div className="w-2 h-2 rounded-full bg-gray-600"></div>
              <div className="w-2 h-2 rounded-full bg-blue-600"></div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setCurrentStep(1)}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-slate-700"
              >
                Back
              </Button>
              <Button
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                {isSubmitting ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingExperienceSurvey;