import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Car, Star, TrendingDown } from 'lucide-react';

interface ExitIntentPopupProps {
  isEnabled?: boolean;
}

const ExitIntentPopup: React.FC<ExitIntentPopupProps> = ({ isEnabled = true }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasShown, setHasShown] = useState(false);

  useEffect(() => {
    if (!isEnabled || hasShown) return;

    const handleMouseLeave = (e: MouseEvent) => {
      // Only trigger if mouse is leaving from the top of the page
      if (e.clientY <= 0 && !isOpen && !hasShown) {
        setIsOpen(true);
        setHasShown(true);
      }
    };

    // Add event listener for mouse leave
    document.addEventListener('mouseleave', handleMouseLeave);

    // Cleanup
    return () => {
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [isEnabled, isOpen, hasShown]);

  const handleContinue = () => {
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="max-w-md mx-auto">
        <DialogHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="bg-gradient-to-r from-primary to-primary/80 p-3 rounded-full">
                <Car className="w-8 h-8 text-white" />
              </div>
              <div className="absolute -top-1 -right-1 bg-yellow-400 rounded-full p-1">
                <Star className="w-3 h-3 text-yellow-800 fill-current" />
              </div>
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
            Wait! Don't Miss Out!
          </DialogTitle>
          <DialogDescription className="text-lg text-gray-700 leading-relaxed">
            <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border border-green-200 mb-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingDown className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-800">Lowest Rates Guaranteed!</span>
              </div>
              <p className="text-gray-800">
                <strong>James Blond Rentals</strong> offers the <strong>cheapest rates</strong> in commercial vehicle hire in Auckland and Wellington.
              </p>
            </div>
            <div className="bg-primary/5 p-3 rounded-lg border border-primary/20">
              <p className="text-primary font-medium">
                🎯 Book now to get the best deal and secure your vehicle today!
              </p>
            </div>
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col gap-3 pt-4">
          <Button 
            onClick={handleContinue}
            className="w-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/80 text-white font-semibold py-3 text-lg shadow-lg"
          >
            Continue Booking
          </Button>
          <p className="text-xs text-gray-500 text-center">
            Don't let this great deal slip away!
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExitIntentPopup;