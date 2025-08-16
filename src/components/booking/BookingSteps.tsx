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
  { number: 3, title: 'MAKE YOUR RENTAL EVEN BETTER', path: '/extras-selection' },
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
    if (path.includes('extras') || path.includes('insurance')) return 3;
    if (path.includes('payment') || path.includes('customer-details')) return 4;
    return 1;
  };

  const activeStep = detectCurrentStep();

  return (
    <div className={cn("w-full bg-background border-b", className)}>
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <React.Fragment key={step.number}>
              <Link to={step.path || '#'} className="flex items-center cursor-pointer hover:opacity-80 transition-opacity">
                <div
                  className={cn(
                    "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors",
                    activeStep === step.number
                      ? "bg-primary text-primary-foreground"
                      : activeStep > step.number
                      ? "bg-green-500 text-white"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {activeStep > step.number ? "✓" : step.number}
                </div>
                <div className="ml-3">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      activeStep === step.number
                        ? "text-primary"
                        : activeStep > step.number
                        ? "text-green-600"
                        : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </p>
                </div>
              </Link>
              
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4">
                  <div
                    className={cn(
                      "h-1 rounded-full transition-colors",
                      activeStep > step.number
                        ? "bg-green-500"
                        : "bg-muted"
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;