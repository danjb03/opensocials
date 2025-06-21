
import { Button } from '@/components/ui/button';
import { ViewToggle } from './ViewToggle';
import { Heart } from 'lucide-react';

interface CreatorSearchHeaderProps {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
  onShowFavorites: () => void;
}

export const CreatorSearchHeader = ({ 
  viewMode, 
  onViewChange, 
  onShowFavorites 
}: CreatorSearchHeaderProps) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-foreground">Find Creators</h1>
        <p className="text-foreground">Instantly see who's right for your campaign</p>
      </div>
      
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          onClick={onShowFavorites}
          className="flex items-center gap-2 text-foreground"
        >
          <Heart className="h-4 w-4" />
          Your Creator Lists
        </Button>
        <ViewToggle viewMode={viewMode} onViewChange={onViewChange} />
      </div>
    </div>
  );
};
