
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Creator } from '@/types/creator';
import { CreatorAnalyticsCard } from '@/components/creator/CreatorAnalyticsCard';

interface CreatorCardProps {
  creator: Creator;
  isSelected: boolean;
  onToggle: () => void;
  onViewProfile: () => void;
}

export const CreatorCard: React.FC<CreatorCardProps> = ({
  creator,
  isSelected,
  onToggle,
  onViewProfile,
}) => {
  return (
    <Card className={`transition-all duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <div className="flex-shrink-0">
            <Avatar className="h-16 w-16">
              <AvatarImage src={creator.imageUrl} alt={creator.name} />
              <AvatarFallback>{creator.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold text-lg truncate">{creator.name}</h3>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewProfile}
                >
                  View Profile
                </Button>
                <Button
                  variant={isSelected ? "default" : "outline"}
                  size="sm"
                  onClick={onToggle}
                >
                  {isSelected ? 'Selected' : 'Select'}
                </Button>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-3">
              <Badge variant="secondary">{creator.platform}</Badge>
              <Badge variant="outline">{creator.contentType}</Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground mb-4">
              <div>
                <span className="font-medium">Followers:</span> {creator.followers}
              </div>
              <div>
                <span className="font-medium">Engagement:</span> {creator.engagement}
              </div>
            </div>

            {/* Analytics Card */}
            <div className="mt-4">
              <CreatorAnalyticsCard creator_id={creator.id.toString()} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
