
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
      className={`absolute inset-0 cursor-pointer select-none
        ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
      style={style}
      onClick={onClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <div className="w-full h-[420px] rounded-2xl border border-white/20 
        bg-black/95 backdrop-blur-xl relative overflow-hidden
        group transition-all duration-700 ease-out hover:border-blue-400/30
        shadow-2xl hover:shadow-blue-500/10">
        
        {/* Solid black background to prevent text bleed-through */}
        <div className="absolute inset-0 bg-black rounded-2xl" />
        
        {/* Blue hue gradient overlay on top */}
        <div className="absolute top-0 left-0 right-0 h-24 
          bg-gradient-to-b from-blue-600/15 via-blue-400/8 to-transparent 
          rounded-t-2xl" />
        
        {/* Blue hue gradient overlay on bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-24 
          bg-gradient-to-t from-blue-600/15 via-blue-400/8 to-transparent 
          rounded-b-2xl" />
        
        {/* Subtle blue glow effect on hover */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 
          bg-gradient-to-br from-blue-500/5 via-transparent to-blue-400/5 
          transition-opacity duration-700" />
        
        {/* Enhanced shadow backdrop */}
        <div className="absolute -inset-2 bg-gradient-to-br from-blue-900/20 via-transparent to-blue-800/20 
          rounded-3xl blur-xl opacity-60 group-hover:opacity-80 transition-opacity duration-700 -z-10" />

        {/* Icon with enhanced blue accent */}
        <div className="relative z-20 mt-8 ml-8 mb-6 p-4 rounded-xl 
          bg-gradient-to-br from-blue-500/20 to-blue-600/10 backdrop-blur-sm w-fit
          border border-blue-400/20 group-hover:border-blue-300/30 
          transition-all duration-500 shadow-lg shadow-blue-500/10">
          <Icon size={28} className="text-blue-100 group-hover:text-white transition-colors duration-500" />
        </div>
        
        {/* Main content with improved typography and blue accents */}
        <div className="relative z-20 space-y-6 px-8">
          <h3 className="text-xl font-medium text-white/95 group-hover:text-white 
            transition-colors duration-500 leading-tight">
            {title}
          </h3>
          
          <h1 className="text-7xl md:text-8xl font-bold text-white font-mono tracking-tight
            group-hover:scale-105 transition-transform duration-700 origin-left
            drop-shadow-lg">
            {percentage}
          </h1>
          
          <p className="text-base text-gray-300/90 leading-relaxed max-w-lg
            group-hover:text-gray-200 transition-colors duration-500">
            {description}
          </p>
        </div>

        {/* Corner accent with blue tint */}
        <div className="absolute top-6 right-6 w-10 h-10 rounded-full 
          bg-gradient-to-br from-blue-400/20 to-blue-600/10
          group-hover:from-blue-300/30 group-hover:to-blue-500/20 
          transition-all duration-700 shadow-lg shadow-blue-500/20" />
        
        {/* Bottom accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 
          bg-gradient-to-r from-transparent via-blue-400/30 to-transparent
          group-hover:via-blue-300/50 transition-all duration-700" />
      </div>
    </div>
  );
};
