
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
    
    // Enhanced positioning for better flow and no overlap
    const scale = position === 0 ? 1 : position === 1 ? 0.88 : position === 2 ? 0.76 : 0.64;
    const translateX = position === 0 ? 0 : position === 1 ? 80 : position === 2 ? 160 : 240;
    const translateY = position === 0 ? 0 : position === 1 ? 30 : position === 2 ? 60 : 90;
    const opacity = position === 0 ? 1 : position === 1 ? 0.7 : position === 2 ? 0.4 : 0.2;
    const blur = position === 0 ? 0 : position === 1 ? 1 : position === 2 ? 2 : 3;
    
    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
      zIndex,
      opacity,
      filter: `blur(${blur}px)`,
      transition: 'all 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    };
  };

  return (
    <div className="relative py-16 overflow-hidden">
      {/* Main carousel container with proper masking */}
      <div className="relative h-[500px] max-w-6xl mx-auto flex items-center justify-center">
        
        {/* Gradient masks to hide overflowing content */}
        <div className="absolute inset-0 pointer-events-none z-40">
          <div className="absolute top-0 left-0 w-32 h-full bg-gradient-to-r from-black to-transparent" />
          <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-black to-transparent" />
          <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-black to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Card stack container */}
        <div className="relative w-full max-w-lg flex items-center justify-center perspective-1000" style={{ height: '400px' }}>
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

      {/* Enhanced navigation dots */}
      <div className="relative z-50 mt-8">
        <NavigationDots 
          stats={statsData} 
          currentCard={currentCard} 
          onCardSelect={goToCard} 
        />
      </div>

      {/* Refined background elements */}
      <BackgroundElements />
      
      {/* Additional atmospheric elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-white/5 rounded-full animate-pulse" 
        style={{ animationDelay: '0.5s', animationDuration: '3s' }} />
      <div className="absolute bottom-1/3 right-1/4 w-1 h-1 bg-white/8 rounded-full animate-pulse" 
        style={{ animationDelay: '1.5s', animationDuration: '4s' }} />
    </div>
  );
};
