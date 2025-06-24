
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Users, TrendingUp, MapPin, Calendar } from 'lucide-react';

interface CreatorProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string | null;
}

export const CreatorProfileModal = ({
  isOpen,
  onClose,
  creatorId
}: CreatorProfileModalProps) => {
  // Mock creator data - in real app this would fetch from API
  const creator = {
    id: creatorId,
    name: 'Sample Creator',
    platform: 'Instagram',
    followers: '50K',
    engagement: '3.2%',
    bio: 'Content creator specializing in lifestyle and fashion.',
    location: 'Los Angeles, CA',
    joinDate: '2023-01-15'
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Creator Profile</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-start gap-4">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary">
                {creator.name.charAt(0)}
              </span>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold">{creator.name}</h3>
              <p className="text-muted-foreground">{creator.bio}</p>
              <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {creator.location}
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(creator.joinDate).toLocaleDateString()}
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">{creator.followers}</div>
              <div className="text-sm text-muted-foreground">Followers</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <TrendingUp className="h-6 w-6 mx-auto mb-2 text-primary" />
              <div className="font-semibold">{creator.engagement}</div>
              <div className="text-sm text-muted-foreground">Engagement</div>
            </div>
            <div className="text-center p-4 bg-muted/50 rounded-lg">
              <Badge variant="outline" className="mb-2">
                {creator.platform}
              </Badge>
              <div className="text-sm text-muted-foreground">Platform</div>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button className="flex-1">
              Invite to Campaign
            </Button>
            <Button variant="outline">
              Save to Favorites
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
