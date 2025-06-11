
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
      <div className="w-full h-96 rounded-3xl border border-white/10 
        bg-gradient-to-br from-gray-900/98 via-black/95 to-gray-800/98 
        shadow-2xl backdrop-blur-xl hover:shadow-white/5 hover:shadow-3xl
        transition-all duration-700 ease-out hover:border-white/20
        flex flex-col justify-center text-left p-10 relative overflow-hidden
        group">
        
        {/* Solid background to prevent bleed-through */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/95 via-black/98 to-gray-800/95 
          rounded-3xl pointer-events-none" />

        {/* Subtle animated gradient overlay */}
        <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 
          bg-gradient-to-br from-white/[0.02] via-transparent to-white/[0.01] 
          transition-opacity duration-700 pointer-events-none" />

        {/* Icon with enhanced styling */}
        <div className="mb-6 p-4 rounded-2xl bg-white/5 backdrop-blur-sm w-fit relative z-10
          group-hover:bg-white/10 transition-all duration-500 border border-white/10">
          <Icon size={32} className="text-white/90 group-hover:text-white transition-colors duration-500" />
        </div>
        
        {/* Main content with improved typography */}
        <div className="relative z-10 space-y-4">
          <h3 className="text-xl font-medium text-white/90 group-hover:text-white 
            transition-colors duration-500 leading-tight">
            {title}
          </h3>
          
          <h1 className="text-6xl md:text-7xl font-bold text-white font-mono tracking-tight
            group-hover:scale-105 transition-transform duration-700 origin-left">
            {percentage}
          </h1>
          
          <p className="text-sm text-gray-300/90 leading-relaxed max-w-sm
            group-hover:text-gray-200 transition-colors duration-500">
            {description}
          </p>
        </div>

        {/* Corner accent */}
        <div className="absolute top-6 right-6 w-8 h-8 rounded-full bg-white/5 
          group-hover:bg-white/10 transition-all duration-700 pointer-events-none" />
      </div>
    </div>
  );
};
