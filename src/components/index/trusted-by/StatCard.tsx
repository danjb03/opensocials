
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  percentage: string;
  title: string;
  description: string;
  icon: LucideIcon;
  step: string;
  style: React.CSSProperties;
  onClick: () => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
  isVisible: boolean;
}

export const StatCard = ({
  percentage,
  title,
  description,
  icon: Icon,
  step,
  style,
  onClick,
  onMouseEnter,
  onMouseLeave,
  isVisible,
}: StatCardProps) => {
  return (
    <div
      className={`absolute inset-0 cursor-pointer
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full h-96 rounded-2xl border border-white/20 
        bg-gradient-to-br from-gray-900/95 to-black/95 shadow-2xl backdrop-blur-xl
        hover:shadow-3xl hover:scale-105 transition-all duration-300
        flex flex-col justify-center text-left p-12 relative overflow-hidden">
        
        {/* Solid background overlay to prevent see-through effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 to-black/95 pointer-events-none" />

        {/* Icon */}
        <div className="mb-8 p-3 rounded-full bg-white/10 backdrop-blur-sm w-fit relative z-10">
          <Icon size={28} className="text-white/90" />
        </div>
        
        {/* Main Content */}
        <div className="relative z-10">
          <h3 className="text-2xl font-semibold text-white mb-4">
            {title}
          </h3>
          
          <h1 className="text-7xl md:text-8xl font-bold text-white mb-6 font-mono tracking-tight">
            {percentage}
          </h1>
          
          <p className="text-base text-gray-200 leading-relaxed max-w-md">
            {description}
          </p>
        </div>

        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-white/0 via-white/3 to-white/0 
          opacity-0 hover:opacity-100 transition-opacity duration-500 pointer-events-none z-5" />
      </div>
    </div>
  );
};
