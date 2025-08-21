import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface BookingExperienceSurveyProps {
  isOpen: boolean;
  onClose: () => void;
}

const BookingExperienceSurvey = ({ isOpen, onClose }: BookingExperienceSurveyProps) => {
  const [rating, setRating] = useState<number | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [feedback, setFeedback] = useState('');
  const { toast } = useToast();

  if (!isOpen) return null;

  const handleRatingSubmit = () => {
    if (rating) {
      setCurrentStep(2);
    }
  };

  const handleFinalSubmit = () => {
    // Here you could send the feedback to your analytics or database
    console.log('Survey submitted:', { rating, feedback });
    
    toast({
      title: "Thank you!",
      description: "Your feedback helps us improve our service.",
      duration: 3000,
    });
    
    onClose();
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
              2/2 - Any additional feedback?
            </h2>
            <p className="text-gray-300 mb-6">
              Help us understand what we can improve.
            </p>

            <textarea
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              placeholder="Optional: Share your thoughts about the booking process..."
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
                className="flex-1 bg-blue-600 hover:bg-blue-700"
              >
                Submit
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingExperienceSurvey;