
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

interface FireworksAnimationProps {
  show: boolean;
  onComplete?: () => void;
  duration?: number;
  className?: string;
}

export function FireworksAnimation({
  show,
  onComplete,
  duration = 2000,
  className
}: FireworksAnimationProps) {
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
      'fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm pointer-events-none',
      className
    )}>
      {/* Fireworks particles */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Central burst */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-8 bg-gradient-to-t from-yellow-400 via-orange-500 to-red-500 animate-ping"
              style={{
                transform: `rotate(${i * 45}deg)`,
                transformOrigin: '50% 100%',
                animationDelay: `${i * 0.1}s`,
                animationDuration: '0.8s'
              }}
            />
          ))}
        </div>

        {/* Side bursts */}
        <div className="absolute top-1/3 left-1/4 transform -translate-x-1/2 -translate-y-1/2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-6 bg-gradient-to-t from-blue-400 via-purple-500 to-pink-500 animate-ping"
              style={{
                transform: `rotate(${i * 60}deg)`,
                transformOrigin: '50% 100%',
                animationDelay: `${0.3 + i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>

        <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-6 bg-gradient-to-t from-green-400 via-cyan-500 to-blue-500 animate-ping"
              style={{
                transform: `rotate(${i * 60}deg)`,
                transformOrigin: '50% 100%',
                animationDelay: `${0.5 + i * 0.1}s`,
                animationDuration: '0.6s'
              }}
            />
          ))}
        </div>

        {/* Falling sparkles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-yellow-300 rounded-full animate-bounce"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 1}s`,
              animationDuration: '1.5s'
            }}
          />
        ))}
      </div>

      {/* Congratulations message */}
      <div className="relative z-10 text-center animate-fade-in pointer-events-auto">
        <div className="bg-card/90 backdrop-blur-sm p-8 rounded-lg shadow-lg border max-w-md mx-4">
          <div className="space-y-4">
            <div className="text-6xl animate-bounce">🎉</div>
            <h2 className="text-2xl font-bold text-foreground">
              Congratulations!
            </h2>
            <p className="text-lg text-foreground">
              You've successfully launched your first campaign!
            </p>
            <div className="text-sm text-muted-foreground">
              Your campaign is now live and visible to creators
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
