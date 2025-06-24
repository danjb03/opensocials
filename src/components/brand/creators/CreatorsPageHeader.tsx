
import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Users, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CreatorsPageHeaderProps {
  selectedCount: number;
  favoriteCount: number;
  onShowFavorites: () => void;
}

export const CreatorsPageHeader = ({
  selectedCount,
  favoriteCount,
  onShowFavorites
}: CreatorsPageHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-1">
        <h1 className="text-3xl font-bold text-foreground">Discover Creators</h1>
        <p className="text-muted-foreground">
          Find and connect with content creators for your campaigns
        </p>
      </div>
      
      <div className="flex items-center gap-3">
        {favoriteCount > 0 && (
          <Button
            variant="outline"
            onClick={onShowFavorites}
            className="flex items-center gap-2"
          >
            <Heart className="h-4 w-4" />
            Favorites ({favoriteCount})
          </Button>
        )}
        
        {selectedCount > 0 && (
          <Button
            onClick={() => navigate('/brand/create-campaign')}
            className="flex items-center gap-2"
          >
            <Plus className="h-4 w-4" />
            Create Campaign ({selectedCount} selected)
          </Button>
        )}
        
        <Button
          variant="outline"
          onClick={() => navigate('/brand/create-campaign')}
          className="flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>
    </div>
  );
};
