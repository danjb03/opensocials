
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
    
    const baseZIndex = 40;
    const zIndex = baseZIndex - position;
    
    // Adjusted positioning to prevent overlapping
    const scale = position === 0 ? 1 : position === 1 ? 0.85 : 0.7;
    const translateX = position === 0 ? 0 : position === 1 ? 60 : 120;
    const translateY = position === 0 ? 0 : position === 1 ? 20 : 40;
    const opacity = position === 0 ? 1 : position === 1 ? 0.6 : 0.3;
    
    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
      zIndex,
      opacity,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
    };
  };

  return (
    <div className="relative h-[600px] max-w-5xl mx-auto flex items-center justify-center perspective-1000">
      {/* Card Stack - Centered within the container */}
      <div className="relative w-full max-w-2xl flex items-center justify-center" style={{ height: '400px' }}>
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

      <NavigationDots 
        stats={statsData} 
        currentCard={currentCard} 
        onCardSelect={goToCard} 
      />

      <BackgroundElements />
    </div>
  );
};
