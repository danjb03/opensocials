
interface NavigationDotsProps {
  stats: any[];
  currentCard: number;
  onCardSelect: (index: number) => void;
}

export const NavigationDots = ({ stats, currentCard, onCardSelect }: NavigationDotsProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex space-x-3 bg-white/5 backdrop-blur-sm rounded-full px-4 py-2 border border-white/10">
        {stats.map((_, index) => (
          <button
            key={index}
            onClick={() => onCardSelect(index)}
            className={`relative transition-all duration-500 ease-out ${
              index === currentCard 
                ? 'w-8 h-3 bg-white rounded-full shadow-lg shadow-white/20' 
                : 'w-3 h-3 bg-white/30 rounded-full hover:bg-white/50 hover:scale-110'
            }`}
            aria-label={`Go to statistic ${index + 1}`}
          >
            {index === currentCard && (
              <div className="absolute inset-0 bg-white/20 rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
