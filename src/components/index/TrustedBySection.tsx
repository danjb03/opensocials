
import { useEffect, useRef, useState } from 'react';
import { Award, TrendingUp, Target, DollarSign, Users, Trophy } from 'lucide-react';

interface StatCard {
  id: number;
  percentage: string;
  title: string;
  description: string;
  icon: any;
  color: string;
}

export const TrustedBySection = () => {
  const [currentCard, setCurrentCard] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const stats: StatCard[] = [
    {
      id: 1,
      percentage: "92%",
      title: "Consumer Trust",
      description: "of consumers trust influencer marketing content over traditional ads",
      icon: Users,
      color: "from-blue-500/20 to-purple-500/20"
    },
    {
      id: 2,
      percentage: "35%",
      title: "Cost Efficiency",
      description: "more expensive: traditional paid ads vs creator led content",
      icon: DollarSign,
      color: "from-green-500/20 to-blue-500/20"
    },
    {
      id: 3,
      percentage: "74%",
      title: "Content Performance",
      description: "of brands say creators drive their highest performing content",
      icon: TrendingUp,
      color: "from-purple-500/20 to-pink-500/20"
    },
    {
      id: 4,
      percentage: "84.8%",
      title: "Marketing Effectiveness",
      description: "say influencer marketing is effective, not a gamble",
      icon: Target,
      color: "from-orange-500/20 to-red-500/20"
    },
    {
      id: 5,
      percentage: "6.16x",
      title: "ROI Multiplier",
      description: "brands earn $6.16 for every $1 spent on creator campaigns",
      icon: Award,
      color: "from-yellow-500/20 to-orange-500/20"
    },
    {
      id: 6,
      percentage: "6x",
      title: "Return Investment",
      description: "average return on investment for creator partnerships",
      icon: Trophy,
      color: "from-pink-500/20 to-purple-500/20"
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          startCarousel();
        } else {
          stopCarousel();
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
      stopCarousel();
    };
  }, []);

  const startCarousel = () => {
    if (intervalRef.current) return;
    
    intervalRef.current = setInterval(() => {
      setCurrentCard((prev) => (prev + 1) % stats.length);
    }, 3500); // 3.5 seconds per card
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
    setTimeout(startCarousel, 5000); // Restart after 5 seconds
  };

  const getCardStyle = (index: number) => {
    const totalCards = stats.length;
    const currentIndex = currentCard;
    
    let position = index - currentIndex;
    if (position < 0) position += totalCards;
    
    const baseZIndex = 100;
    const zIndex = baseZIndex - position;
    
    const scale = Math.max(0.7, 1 - position * 0.1);
    const translateX = position * 20;
    const translateY = position * 15;
    const opacity = position === 0 ? 1 : Math.max(0.3, 1 - position * 0.3);
    
    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
      zIndex,
      opacity,
    };
  };

  return (
    <div ref={sectionRef} className="relative py-20 mb-20 overflow-hidden">
      <div className="text-center mb-16">
        <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider">Already chosen by leaders</p>
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
          The numbers speak for themselves
        </h2>
      </div>

      <div className="relative h-[500px] max-w-4xl mx-auto flex items-center justify-center perspective-1000">
        {/* Card Stack */}
        <div className="relative w-full max-w-lg">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`absolute inset-0 transition-all duration-700 ease-out cursor-pointer
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={getCardStyle(index)}
                onClick={() => goToCard(index)}
                onMouseEnter={stopCarousel}
                onMouseLeave={startCarousel}
              >
                <div className={`w-full h-80 rounded-3xl backdrop-blur-xl border border-white/10 
                  bg-gradient-to-br ${stat.color} shadow-2xl
                  hover:shadow-3xl hover:scale-105 transition-all duration-300
                  flex flex-col items-center justify-center text-center p-8 relative overflow-hidden`}>
                  
                  {/* Background Pattern */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
                  
                  {/* Icon */}
                  <div className="mb-6 p-4 rounded-full bg-white/10 backdrop-blur-sm">
                    <Icon size={32} className="text-white" />
                  </div>
                  
                  {/* Main Percentage */}
                  <h1 className="text-6xl md:text-7xl font-bold text-white mb-4 font-mono tracking-tight">
                    {stat.percentage}
                  </h1>
                  
                  {/* Title */}
                  <h3 className="text-xl font-semibold text-white mb-3">
                    {stat.title}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-white/80 leading-relaxed max-w-xs">
                    {stat.description}
                  </p>

                  {/* Subtle glow effect */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 
                    opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentCard 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-float" 
          style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-1 h-1 bg-white/30 rounded-full animate-float" 
          style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-1.5 h-1.5 bg-white/25 rounded-full animate-float" 
          style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-40 right-10 w-2 h-2 bg-white/20 rounded-full animate-float" 
          style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};
