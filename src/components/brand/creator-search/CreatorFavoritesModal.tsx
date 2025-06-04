
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Heart, X, UserPlus } from 'lucide-react';
import { useCreatorFavorites } from '@/hooks/useCreatorFavorites';

interface CreatorFavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInviteCreator?: (creatorId: string, creatorName: string) => void;
}

export const CreatorFavoritesModal: React.FC<CreatorFavoritesModalProps> = ({
  isOpen,
  onClose,
  onInviteCreator
}) => {
  const { favorites, isLoading, toggleFavorite } = useCreatorFavorites();

  if (isLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-red-500" />
              Your Creator Favorites
            </DialogTitle>
          </DialogHeader>
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Your Creator Favorites ({favorites.length})
          </DialogTitle>
        </DialogHeader>
        
        {favorites.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No favorites yet</h3>
            <p className="text-gray-500">
              Start adding creators to your favorites list to quickly access them for future campaigns.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {favorites.map((favorite) => {
              const creator = favorite.creator_profiles;
              if (!creator) return null;
              
              const displayName = creator.first_name && creator.last_name 
                ? `${creator.first_name} ${creator.last_name}`
                : creator.first_name || creator.username || 'Unknown Creator';
              
              return (
                <div 
                  key={favorite.creator_id}
                  className="flex items-center gap-4 p-4 border rounded-lg hover:bg-gray-50"
                >
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={creator.avatar_url || '/placeholder.svg'} alt={displayName} />
                    <AvatarFallback>
                      {displayName.slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{displayName}</h4>
                      {creator.primary_platform && (
                        <Badge variant="outline" className="text-xs">
                          {creator.primary_platform}
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">
                      {creator.bio || 'No bio available'}
                    </p>
                    
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      {creator.follower_count && (
                        <span>{creator.follower_count.toLocaleString()} followers</span>
                      )}
                      {creator.engagement_rate && (
                        <span>{creator.engagement_rate}% engagement</span>
                      )}
                      {creator.audience_type && (
                        <span>{creator.audience_type}</span>
                      )}
                    </div>
                    
                    {creator.industries && Array.isArray(creator.industries) && creator.industries.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {creator.industries.slice(0, 3).map((industry, index) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {industry}
                          </Badge>
                        ))}
                        {creator.industries.length > 3 && (
                          <span className="text-xs text-gray-500">
                            +{creator.industries.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {onInviteCreator && (
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => onInviteCreator(creator.user_id, displayName)}
                        className="flex items-center gap-1"
                      >
                        <UserPlus className="h-3 w-3" />
                        Invite
                      </Button>
                    )}
                    
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => toggleFavorite(creator.user_id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
