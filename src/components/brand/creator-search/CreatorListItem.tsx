
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Creator } from '@/types/creator';
import { CreatorAnalyticsCard } from '@/components/creator/CreatorAnalyticsCard';

interface CreatorListItemProps {
  creator: Creator;
  isSelected: boolean;
  onToggle: () => void;
  onViewProfile: () => void;
}

export const CreatorListItem: React.FC<CreatorListItemProps> = ({
  creator,
  isSelected,
  onToggle,
  onViewProfile,
}) => {
  return (
    <Card className={`mb-4 transition-all duration-200 ${isSelected ? 'ring-2 ring-primary' : ''}`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-6">
          <div className="flex items-start gap-4 flex-1">
            <Checkbox 
              checked={isSelected}
              onCheckedChange={onToggle}
              className="mt-1"
            />
            
            <Avatar className="h-16 w-16 flex-shrink-0">
              <AvatarImage src={creator.imageUrl} alt={creator.name} />
              <AvatarFallback>{creator.name.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-lg">{creator.name}</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onViewProfile}
                >
                  View Profile
                </Button>
              </div>
              
              <div className="flex flex-wrap gap-2 mb-3">
                <Badge variant="secondary">{creator.platform}</Badge>
                <Badge variant="outline">{creator.contentType}</Badge>
                {creator.skills?.slice(0, 3).map((skill, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
              
              <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground mb-3">
                <div>
                  <span className="font-medium">Followers:</span> {creator.followers}
                </div>
                <div>
                  <span className="font-medium">Engagement:</span> {creator.engagement}
                </div>
                <div>
                  <span className="font-medium">Price:</span> {creator.priceRange}
                </div>
                <div>
                  <span className="font-medium">Audience:</span> {creator.audience}
                </div>
              </div>
              
              {creator.about && (
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">
                  {creator.about}
                </p>
              )}
            </div>
          </div>
          
          {/* Analytics Card in right sidebar */}
          <div className="w-80 flex-shrink-0">
            <CreatorAnalyticsCard creator_id={creator.id} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
