
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Heart, X } from 'lucide-react';

interface Creator {
  id: number;
  name: string;
  platform: string;
}

interface FavoritesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favoriteCreators: string[];
  creators: Creator[];
}

export const FavoritesModal = ({
  isOpen,
  onClose,
  favoriteCreators,
  creators
}: FavoritesModalProps) => {
  const favoritedCreators = creators.filter(creator => 
    favoriteCreators.includes(creator.id.toString())
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-red-500" />
            Favorite Creators
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {favoritedCreators.length > 0 ? (
            favoritedCreators.map((creator) => (
              <div key={creator.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                    <span className="font-medium text-primary">
                      {creator.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-medium">{creator.name}</div>
                    <div className="text-sm text-muted-foreground">{creator.platform}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button size="sm" variant="outline">
                    View Profile
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-500 hover:text-red-600">
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="font-medium mb-2">No Favorite Creators</h3>
              <p className="text-muted-foreground">
                Save creators to your favorites for quick access later.
              </p>
            </div>
          )}
        </div>
        
        {favoritedCreators.length > 0 && (
          <div className="flex gap-3 pt-4 border-t">
            <Button className="flex-1">
              Invite All to Campaign
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
