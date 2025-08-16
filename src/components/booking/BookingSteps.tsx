import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
  path?: string;
}

const steps: Step[] = [
  { number: 1, title: 'EDIT ITINERARY', path: '/' },
  { number: 2, title: 'CHOOSE A CAR', path: '/vehicles' },
  { number: 3, title: 'INSURANCE & EXTRAS', path: '/insurance-and-extras' },
  { number: 4, title: 'REVIEW & BOOK', path: '/payment' }
];

interface BookingStepsProps {
  currentStep?: number;
  className?: string;
}

const BookingSteps = ({ currentStep, className }: BookingStepsProps) => {
  const location = useLocation();
  
  // Auto-detect current step based on route if not provided
  const detectCurrentStep = () => {
    if (currentStep) return currentStep;
    
    const path = location.pathname;
    if (path === '/' || path.includes('index')) return 1;
    if (path.includes('vehicles')) return 2;
    if (path.includes('insurance') || path.includes('extras')) return 3;
    if (path.includes('payment') || path.includes('customer-details')) return 4;
    return 1;
  };

  const activeStep = detectCurrentStep();

  return (
    <div className={cn("w-full bg-background border-b", className)}>
      <div className="container mx-auto px-2 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between gap-1 sm:gap-2">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-center min-w-0 flex-1">
              <Link to={step.path || '#'} className="flex items-center cursor-pointer hover:opacity-80 transition-opacity min-w-0">
                <div
                  className={cn(
                    "flex items-center justify-center w-6 h-6 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-medium transition-colors flex-shrink-0",
                    activeStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : activeStep > step.number
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {activeStep > step.number ? "✓" : step.number}
                </div>
                <div className="ml-1 sm:ml-3 min-w-0">
                  <p
                    className={cn(
                      "text-xs sm:text-sm font-medium transition-colors truncate",
                      activeStep === step.number
                        ? "text-primary"
                        : activeStep > step.number
                        ? "text-green-600"
                        : "text-muted-foreground"
                    )}
                  >
                    <span className="hidden sm:inline">{step.title}</span>
                    <span className="sm:hidden">
                      {step.title === 'EDIT ITINERARY' ? 'EDIT' : 
                       step.title === 'CHOOSE A CAR' ? 'CHOOSE' :
                       step.title === 'INSURANCE & EXTRAS' ? 'INSUR' :
                       'BOOK'}
                    </span>
                  </p>
                </div>
              </Link>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-1 sm:mx-4 min-w-[10px]">
                  <div
                    className={cn(
                      "h-0.5 sm:h-1 rounded-full transition-colors",
                      activeStep > step.number
                        ? "bg-green-500"
                        : "bg-muted"
                    )}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;