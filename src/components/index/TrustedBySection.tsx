
import { useEffect, useRef, useState } from 'react';

interface StatCard {
  id: number;
  number: string;
  suffix: string;
  description: string;
  delay: number;
  size: 'large' | 'medium' | 'small';
  position: string;
}

export const TrustedBySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [animatedNumbers, setAnimatedNumbers] = useState<{ [key: number]: number }>({});
  const sectionRef = useRef<HTMLDivElement>(null);

  const stats: StatCard[] = [
    {
      id: 1,
      number: "92",
      suffix: "%",
      description: "of consumers trust influencer marketing content over traditional ads",
      delay: 0,
      size: 'large',
      position: 'top-0 left-1/4'
    },
    {
      id: 2,
      number: "35",
      suffix: "%",
      description: "more expensive: traditional paid ads vs creator led content",
      delay: 200,
      size: 'medium',
      position: 'top-16 right-1/4'
    },
    {
      id: 3,
      number: "74",
      suffix: "%",
      description: "of brands say creators drive their highest performing content",
      delay: 400,
      size: 'medium',
      position: 'top-32 left-1/6'
    },
    {
      id: 4,
      number: "84.8",
      suffix: "%",
      description: "say influencer marketing is effective, not a gamble",
      delay: 600,
      size: 'small',
      position: 'top-48 right-1/6'
    },
    {
      id: 5,
      number: "6.16",
      suffix: "x",
      description: "ROI: brands earn $6.16 for every $1 spent on creator campaigns",
      delay: 800,
      size: 'large',
      position: 'top-64 left-1/3'
    },
    {
      id: 6,
      number: "6",
      suffix: "x",
      description: "Return on Investment",
      delay: 1000,
      size: 'small',
      position: 'top-80 right-1/3'
    }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          // Start number animations
          stats.forEach((stat) => {
            setTimeout(() => {
              animateNumber(stat.id, parseFloat(stat.number));
            }, stat.delay);
          });
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const animateNumber = (id: number, target: number) => {
    const duration = 2000;
    const steps = 60;
    const stepValue = target / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += stepValue;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      setAnimatedNumbers(prev => ({ ...prev, [id]: current }));
    }, duration / steps);
  };

  const getCardSize = (size: string) => {
    switch (size) {
      case 'large':
        return 'w-80 h-40 p-6';
      case 'medium':
        return 'w-72 h-36 p-5';
      case 'small':
        return 'w-64 h-32 p-4';
      default:
        return 'w-72 h-36 p-5';
    }
  };

  const getNumberSize = (size: string) => {
    switch (size) {
      case 'large':
        return 'text-4xl md:text-5xl';
      case 'medium':
        return 'text-3xl md:text-4xl';
      case 'small':
        return 'text-2xl md:text-3xl';
      default:
        return 'text-3xl md:text-4xl';
    }
  };

  return (
    <div ref={sectionRef} className="relative py-20 mb-20 overflow-hidden">
      <div className="text-center mb-16">
        <p className="text-gray-500 text-sm mb-4 uppercase tracking-wider">Already chosen by leaders</p>
        <h2 className="text-3xl md:text-4xl font-light text-foreground mb-4">
          The numbers speak for themselves
        </h2>
      </div>

      <div className="relative h-96 max-w-6xl mx-auto">
        {stats.map((stat) => (
          <div
            key={stat.id}
            className={`absolute ${stat.position} ${getCardSize(stat.size)} 
              transform transition-all duration-1000 ease-out
              ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}
            style={{
              transitionDelay: `${stat.delay}ms`,
              background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}
          >
            <div className="h-full flex flex-col justify-center items-center text-center group cursor-pointer
              hover:scale-105 hover:shadow-2xl transition-all duration-300
              hover:bg-gradient-to-br hover:from-white/20 hover:to-white/10">
              
              <div className={`${getNumberSize(stat.size)} font-bold text-white mb-2 font-mono`}>
                {animatedNumbers[stat.id] !== undefined 
                  ? animatedNumbers[stat.id].toFixed(stat.number.includes('.') ? 1 : 0)
                  : '0'}{stat.suffix}
              </div>
              
              <p className="text-sm text-gray-300 leading-tight group-hover:text-white transition-colors duration-300">
                {stat.description}
              </p>
              
              {/* Glow effect */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/5 to-white/0 
                opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          </div>
        ))}

        {/* Background decorative elements */}
        <div className="absolute top-10 left-10 w-2 h-2 bg-white/20 rounded-full animate-float" 
          style={{ animationDelay: '0s' }} />
        <div className="absolute top-20 right-20 w-1 h-1 bg-white/30 rounded-full animate-float" 
          style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 left-20 w-1.5 h-1.5 bg-white/25 rounded-full animate-float" 
          style={{ animationDelay: '2s' }} />
        <div className="absolute bottom-10 right-10 w-2 h-2 bg-white/20 rounded-full animate-float" 
          style={{ animationDelay: '0.5s' }} />
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-background to-transparent pointer-events-none" />
    </div>
  );
};
