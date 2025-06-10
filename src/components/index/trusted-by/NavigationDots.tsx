
interface NavigationDotsProps {
  stats: any[];
  currentCard: number;
  onCardSelect: (index: number) => void;
}

export const NavigationDots = ({ stats, currentCard, onCardSelect }: NavigationDotsProps) => {
  return (
    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
      {stats.map((_, index) => (
        <button
          key={index}
          onClick={() => onCardSelect(index)}
          className={`w-2 h-2 rounded-full transition-all duration-300 ${
            index === currentCard 
              ? 'bg-white scale-125' 
              : 'bg-white/40 hover:bg-white/60'
          }`}
        />
      ))}
    </div>
  );
};
