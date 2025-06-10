
import { useEffect, useRef, useState } from 'react';
import { Award, TrendingUp, Target, DollarSign, Users, Trophy } from 'lucide-react';

interface StatCard {
  id: number;
  percentage: string;
  title: string;
  description: string;
  icon: any;
  step: string;
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
      step: "Step 1"
    },
    {
      id: 2,
      percentage: "35%",
      title: "Cost Efficiency", 
      description: "more expensive: traditional paid ads vs creator led content",
      icon: DollarSign,
      step: "Step 2"
    },
    {
      id: 3,
      percentage: "74%",
      title: "Content Performance",
      description: "of brands say creators drive their highest performing content",
      icon: TrendingUp,
      step: "Step 3"
    },
    {
      id: 4,
      percentage: "84.8%",
      title: "Marketing Effectiveness",
      description: "say influencer marketing is effective, not a gamble",
      icon: Target,
      step: "Step 4"
    },
    {
      id: 5,
      percentage: "6.16x",
      title: "ROI Multiplier",
      description: "brands earn $6.16 for every $1 spent on creator campaigns",
      icon: Award,
      step: "Step 5"
    },
    {
      id: 6,
      percentage: "6x",
      title: "Return Investment",
      description: "average return on investment for creator partnerships",
      icon: Trophy,
      step: "Step 6"
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
    }, 4500); // Increased from 3500 to 4500ms
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
    setTimeout(startCarousel, 6000); // Increased pause time when manually clicked
  };

  const getCardStyle = (index: number) => {
    const totalCards = stats.length;
    const currentIndex = currentCard;
    
    let position = index - currentIndex;
    if (position < 0) position += totalCards;
    
    const baseZIndex = 100;
    const zIndex = baseZIndex - position;
    
    // Enhanced card shuffle animation - cards move left before going to back
    const scale = position === 0 ? 1 : position === 1 ? 0.92 : 0.84;
    const translateX = position === 0 ? 0 : position === 1 ? 40 : 80;
    const translateY = position * 25;
    const opacity = position === 0 ? 1 : position === 1 ? 0.9 : 0.7; // Reduced transparency
    
    return {
      transform: `translateX(${translateX}px) translateY(${translateY}px) scale(${scale})`,
      zIndex,
      opacity,
      transition: 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)', // Smoother transition
    };
  };

  return (
    <div ref={sectionRef} className="relative py-8 mb-16 overflow-hidden bg-black"> {/* Reduced padding and margin */}
      <div className="text-center mb-8"> {/* Reduced bottom margin */}
        <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider">The numbers speak for themselves</p>
        <h2 className="text-3xl md:text-4xl font-light text-white mb-4">
          Process is <span className="italic text-gray-400">Result</span>
        </h2>
        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
          Thoughtful, intentional creator partnerships are what make brands stand out.
        </p>
      </div>

      <div className="relative h-[650px] max-w-5xl mx-auto flex items-center justify-center perspective-1000"> {/* Increased height */}
        {/* Card Stack */}
        <div className="relative w-full max-w-2xl">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.id}
                className={`absolute inset-0 cursor-pointer
                  ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
                style={getCardStyle(index)}
                onClick={() => goToCard(index)}
                onMouseEnter={stopCarousel}
                onMouseLeave={startCarousel}
              >
                <div className="w-full h-96 rounded-2xl backdrop-blur-xl border border-white/20 
                  bg-gradient-to-br from-gray-800/70 to-gray-900/60 shadow-2xl  
                  hover:shadow-3xl hover:scale-105 transition-all duration-300
                  flex flex-col justify-center text-left p-12 relative overflow-hidden">
                  
                  {/* Enhanced dark overlay for better contrast */}
                  <div className="absolute inset-0 bg-gradient-to-br from-black/30 to-gray-900/20 pointer-events-none" />
                  
                  {/* Step indicator */}
                  <div className="absolute top-6 left-6">
                    <span className="text-xs text-gray-400 font-medium tracking-wider uppercase">
                      {stat.step}
                    </span>
                  </div>

                  {/* Icon */}
                  <div className="mb-8 p-3 rounded-full bg-white/10 backdrop-blur-sm w-fit">
                    <Icon size={28} className="text-white/90" />
                  </div>
                  
                  {/* Main Content */}
                  <div className="relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-4">
                      {stat.title}
                    </h3>
                    
                    <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 font-mono tracking-tight">
                      {stat.percentage}
                    </h1>
                    
                    <p className="text-base text-gray-200 leading-relaxed max-w-md"> {/* Improved text contrast */}
                      {stat.description}
                    </p>
                  </div>

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/3 to-white/0 
                    opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation Dots */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {stats.map((_, index) => (
            <button
              key={index}
              onClick={() => goToCard(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentCard 
                  ? 'bg-white scale-125' 
                  : 'bg-white/40 hover:bg-white/60'
              }`}
            />
          ))}
        </div>

        {/* Background Elements */}
        <div className="absolute top-10 left-10 w-1 h-1 bg-white/10 rounded-full animate-float" 
          style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-1 h-1 bg-white/15 rounded-full animate-float" 
          style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-20 w-1 h-1 bg-white/10 rounded-full animate-float" 
          style={{ animationDelay: '2s' }} />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};
