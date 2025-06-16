
import { useState, useEffect, useRef } from 'react';
import { StatCard } from './StatCard';
import { NavigationDots } from './NavigationDots';
import { BackgroundElements } from './BackgroundElements';
import { statsData } from './statsData';

interface StatsCarouselProps {
  isVisible: boolean;
}

export const StatsCarousel = ({ isVisible }: StatsCarouselProps) => {
  const [currentCard, setCurrentCard] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isVisible) {
      startCarousel();
    } else {
      stopCarousel();
    }

    return () => {
      stopCarousel();
    };
  }, [isVisible]);

  const startCarousel = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % statsData.length);
    }, 4500);
  };

  const stopCarousel = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const goToCard = (index: number) => {
    setCurrentCard(index);
    stopCarousel();
    setTimeout(startCarousel, 6000);
  };

  const getCardStyle = (index: number) => {
    const totalCards = statsData.length;
    const currentIndex = currentCard;
    
    let position = index - currentIndex;
    if (position < 0) position += totalCards;
    
    const baseZIndex = 50;
    const zIndex = baseZIndex - position;
    
    // Mobile-first responsive scaling and positioning
    const isMobile = window.innerWidth < 768;
    
    if (isMobile) {
      // On mobile, show cards more clearly with minimal blur/shadow
      const scale = position === 0 ? 1 : position === 1 ? 0.9 : 0.8;
      const translateX = position === 0 ? 0 : position === 1 ? 30 : position === 2 ? 60 : 90;
      const translateY = position === 0 ? 0 : 10;
      const opacity = position === 0 ? 1 : position === 1 ? 0.7 : 0.5;
      const blur = position === 0 ? 0 : position === 1 ? 0.5 : 1;
      
      return {
        transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
        zIndex,
        opacity,
        filter: `blur(${blur}px)`,
        transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
      };
    } else {
      // Desktop styling (keep existing)
      const scale = position === 0 ? 1 : position === 1 ? 0.85 : position === 2 ? 0.7 : 0.55;
      const translateX = position === 0 ? 0 : position === 1 ? 100 : position === 2 ? 200 : 300;
      const translateY = position === 0 ? 0 : position === 1 ? 30 : position === 2 ? 60 : 90;
      const opacity = position === 0 ? 1 : position === 1 ? 0.6 : position === 2 ? 0.3 : 0.1;
      const blur = position === 0 ? 0 : position === 1 ? 0.5 : position === 2 ? 1.5 : 3;
      
      return {
        transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
        zIndex,
        opacity,
        filter: `blur(${blur}px)`,
        transition: 'all 0.8s cubic-bezier(0.4, 0.0, 0.2, 1)',
      };
    }
  };

  return (
    <div className="relative py-8 md:py-12 overflow-hidden bg-black">
      {/* Lighter gradient masks for mobile */}
      <div className="absolute inset-0 pointer-events-none z-40">
        <div className="absolute top-0 left-0 w-16 md:w-48 h-full bg-gradient-to-r from-black via-black/60 to-transparent md:via-black/90" />
        <div className="absolute top-0 right-0 w-16 md:w-48 h-full bg-gradient-to-l from-black via-black/60 to-transparent md:via-black/90" />
        <div className="absolute top-0 left-0 right-0 h-12 md:h-24 bg-gradient-to-b from-black via-black/60 to-transparent md:via-black/80" />
        <div className="absolute bottom-0 left-0 right-0 h-12 md:h-24 bg-gradient-to-t from-black via-black/60 to-transparent md:via-black/80" />
      </div>

      {/* Main carousel container with responsive height */}
      <div className="relative h-[420px] md:h-[480px] max-w-7xl mx-auto flex items-center justify-center px-4 md:px-8">
        {/* Card stack container with better perspective */}
        <div className="relative w-full max-w-sm md:max-w-2xl flex items-center justify-center" style={{ height: '360px', perspective: '800px' }}>
          {statsData.map((stat, index) => (
            <StatCard
              key={stat.id}
              percentage={stat.percentage}
              title={stat.title}
              description={stat.description}
              icon={stat.icon}
              step={stat.step}
              style={getCardStyle(index)}
              onClick={() => goToCard(index)}
              onMouseEnter={stopCarousel}
              onMouseLeave={startCarousel}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>

      {/* Navigation dots with reduced spacing */}
      <div className="relative z-50 mt-4 md:mt-6">
        <NavigationDots 
          stats={statsData} 
          currentCard={currentCard} 
          onCardSelect={goToCard} 
        />
      </div>

      {/* Refined background elements */}
      <BackgroundElements />
      
      {/* Enhanced atmospheric elements with blue tints */}
      <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-blue-400/10 rounded-full animate-pulse" 
        style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-blue-300/15 rounded-full animate-pulse" 
        style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
      <div className="absolute top-1/2 left-1/6 w-1 h-1 bg-blue-500/20 rounded-full animate-pulse" 
        style={{ animationDelay: '2.5s', animationDuration: '5s' }} />
    </div>
  );
};
