
import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  id: string;
  label: string;
  completed?: boolean;
}

interface ProgressIndicatorProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressIndicator({ steps, currentStep, className }: ProgressIndicatorProps) {
  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, index) => {
        const stepNumber = index + 1;
        const isActive = stepNumber === currentStep;
        const isCompleted = step.completed || stepNumber < currentStep;
        const isUpcoming = stepNumber > currentStep;

        return (
          <React.Fragment key={step.id}>
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300',
                  {
                    'bg-primary border-primary text-primary-foreground animate-scale-in': isActive,
                    'bg-green-600 border-green-600 text-white': isCompleted,
                    'border-muted-foreground text-muted-foreground': isUpcoming,
                  }
                )}
              >
                {isCompleted ? (
                  <Check className="w-4 h-4 animate-scale-in" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              <span
                className={cn(
                  'mt-2 text-xs text-center transition-colors duration-300',
                  {
                    'text-primary font-medium': isActive,
                    'text-green-600': isCompleted,
                    'text-muted-foreground': isUpcoming,
                  }
                )}
              >
                {step.label}
              </span>
            </div>
            
            {index < steps.length - 1 && (
              <div className="flex-1 mx-4">
                <div
                  className={cn(
                    'h-0.5 transition-all duration-500',
                    isCompleted || (isActive && index < currentStep - 1)
                      ? 'bg-green-600'
                      : 'bg-muted'
                  )}
                />
              </div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
}
