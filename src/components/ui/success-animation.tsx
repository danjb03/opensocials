
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { Check, Sparkles } from 'lucide-react';

interface SuccessAnimationProps {
  show: boolean;
  message?: string;
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

export function SuccessAnimation({
  show,
  message = 'Success!',
  onComplete,
  duration = 2000,
  className
}: SuccessAnimationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
      const timer = setTimeout(() => {
        setIsVisible(false);
        onComplete?.();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [show, duration, onComplete]);

  if (!isVisible) return null;

  return (
    <div className={cn(
      'fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-fade-in',
      className
    )}>
      <div className="relative bg-card p-8 rounded-lg shadow-lg border animate-scale-in">
        {/* Background sparkles */}
        <div className="absolute inset-0 overflow-hidden rounded-lg">
          <Sparkles className="absolute top-2 right-2 w-4 h-4 text-primary animate-pulse" />
          <Sparkles className="absolute bottom-2 left-2 w-3 h-3 text-primary animate-pulse" style={{ animationDelay: '0.5s' }} />
          <Sparkles className="absolute top-1/2 left-1/4 w-2 h-2 text-primary animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        
        {/* Main content */}
        <div className="relative flex flex-col items-center space-y-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center animate-scale-in">
            <Check className="w-8 h-8 text-green-600" />
          </div>
          
          <div className="text-center">
            <h3 className="text-lg font-semibold text-foreground animate-fade-in" style={{ animationDelay: '0.2s' }}>
              {message}
            </h3>
          </div>
        </div>
      </div>
    </div>
  );
}
