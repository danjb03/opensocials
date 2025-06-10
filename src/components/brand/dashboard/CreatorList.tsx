
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, MessageCircle, TrendingUp } from 'lucide-react';

interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: string;
  followers: string;
  engagement: string;
  categories: string[];
  imageUrl?: string;
}

interface CreatorListProps {
  creators: Creator[];
  onViewProfile?: (creatorId: string) => void;
}

const CreatorList: React.FC<CreatorListProps> = ({ creators, onViewProfile }) => {
  if (creators.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Recommended Creators</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-foreground">No recommended creators at the moment.</p>
            <p className="text-foreground mt-2">Create a campaign to get personalized recommendations.</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-foreground">
          <TrendingUp className="h-5 w-5" />
          Recommended Creators
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {creators.map((creator) => (
            <div key={creator.id} className="flex items-center justify-between p-4 border rounded-lg bg-background">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  {creator.imageUrl ? (
                    <img src={creator.imageUrl} alt={creator.name} className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <span className="text-foreground font-medium">{creator.name.charAt(0)}</span>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-foreground">{creator.name}</h4>
                  <p className="text-foreground">@{creator.handle} • {creator.platform}</p>
                  <div className="flex items-center gap-4 mt-1 text-sm">
                    <div className="flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5 text-foreground" />
                      <span className="text-foreground">{creator.followers} Followers</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageCircle className="h-3.5 w-3.5 text-foreground" />
                      <span className="text-foreground">{creator.engagement} Engagement</span>
                    </div>
                  </div>
                  <div className="flex gap-1 mt-2">
                    {creator.categories.slice(0, 2).map((category) => (
                      <Badge key={category} variant="secondary" className="text-xs">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onViewProfile?.(creator.id)}
              >
                View Profile
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CreatorList;
