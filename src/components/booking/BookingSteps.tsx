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
        {/* Mobile view - 4 separate progress bars */}
        <div className="block sm:hidden">
          <div className="text-center">
            <div className="flex items-center justify-center mb-2">
              <div
                className={cn(
                  "flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-2",
                  "bg-primary text-primary-foreground"
                )}
              >
                {activeStep}
              </div>
              <p className="text-sm font-medium text-primary">
                {steps[activeStep - 1]?.title}
              </p>
            </div>
            {/* 4 separate progress bars */}
            <div className="flex gap-1 mb-1">
              {steps.map((step, index) => {
                const isCompleted = activeStep > step.number;
                const isCurrent = activeStep === step.number;
                const isPrevious = step.number < activeStep;
                
                return (
                  <div
                    key={step.number}
                    className={cn(
                      "flex-1 h-1 rounded-full transition-all duration-300",
                      isCurrent || isCompleted 
                        ? "bg-primary" 
                        : "bg-muted"
                    )}
                    onClick={() => {
                      if (isPrevious && step.path) {
                        window.location.href = step.path;
                      }
                    }}
                    style={{
                      cursor: isPrevious ? 'pointer' : 'default'
                    }}
                  />
                );
              })}
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              Step {activeStep} of {steps.length}
            </div>
          </div>
        </div>

        {/* Desktop view - full steps display with 4 separate progress bars */}
        <div className="hidden sm:block">
          {/* Step indicators */}
          <div className="flex items-center justify-between gap-2 mb-4">
            {steps.map((step, index) => {
              const isCompleted = activeStep > step.number;
              const isCurrent = activeStep === step.number;
              const isPrevious = step.number < activeStep;
              
              const StepContent = (
                <div className="flex items-center cursor-pointer hover:opacity-80 transition-opacity min-w-0">
                  <div
                    className={cn(
                      "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium transition-colors flex-shrink-0",
                      isCurrent
                        ? "bg-primary text-primary-foreground"
                        : isCompleted
                        ? "bg-green-500 text-white"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    {isCompleted ? "✓" : step.number}
                  </div>
                  <div className="ml-3 min-w-0">
                    <p
                      className={cn(
                        "text-sm font-medium transition-colors truncate",
                        isCurrent
                          ? "text-primary"
                          : isCompleted
                          ? "text-green-600"
                          : "text-muted-foreground"
                      )}
                    >
                      {step.title}
                    </p>
                  </div>
                </div>
              );

              return (
                <div key={step.number} className="flex-1">
                  {isPrevious && step.path ? (
                    <Link to={step.path}>
                      {StepContent}
                    </Link>
                  ) : (
                    <div style={{ cursor: isPrevious ? 'pointer' : 'default' }}>
                      {StepContent}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          
          {/* 4 separate progress bars */}
          <div className="flex gap-2">
            {steps.map((step) => {
              const isCompleted = activeStep > step.number;
              const isCurrent = activeStep === step.number;
              const isPrevious = step.number < activeStep;
              
              return (
                <div
                  key={step.number}
                  className={cn(
                    "flex-1 h-2 rounded-full transition-all duration-300 cursor-pointer",
                    isCurrent || isCompleted 
                      ? "bg-primary" 
                      : "bg-muted"
                  )}
                  onClick={() => {
                    if (isPrevious && step.path) {
                      window.location.href = step.path;
                    }
                  }}
                  style={{
                    cursor: isPrevious ? 'pointer' : 'default'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingSteps;