
interface NavigationDotsProps {
  stats: any[];
  currentCard: number;
  onCardSelect: (index: number) => void;
}

export const NavigationDots = ({ stats, currentCard, onCardSelect }: NavigationDotsProps) => {
  return (
    <div className="flex justify-center">
      <div className="flex space-x-4 bg-black/40 backdrop-blur-lg rounded-full px-6 py-3 border border-white/10
        shadow-2xl shadow-blue-500/10">
        {stats.map((_, index) => (
          <button
            key={index}
            onClick={() => onCardSelect(index)}
            className={`relative transition-all duration-500 ease-out ${
              index === currentCard 
                ? 'w-10 h-4 bg-gradient-to-r from-blue-400 to-blue-500 rounded-full shadow-lg shadow-blue-400/40' 
                : 'w-4 h-4 bg-white/20 rounded-full hover:bg-blue-300/40 hover:scale-110'
            }`}
            aria-label={`Go to statistic ${index + 1}`}
          >
            {index === currentCard && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-300/30 to-blue-400/30 
                rounded-full animate-pulse" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};
