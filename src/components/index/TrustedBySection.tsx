
import { useEffect, useRef, useState } from 'react';
import { TrustedBySectionHeader } from './trusted-by/TrustedBySectionHeader';
import { StatsCarousel } from './trusted-by/StatsCarousel';

export const TrustedBySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={sectionRef} className="relative pt-2 pb-4 mb-8 overflow-hidden bg-black">
      <TrustedBySectionHeader />
      <StatsCarousel isVisible={isVisible} />
      
      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </div>
  );
};
