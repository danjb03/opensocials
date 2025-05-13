
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Search, ExternalLink, Star } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

interface Creator {
  id: string;
  name: string;
  platform: string;
  imageUrl: string;
  followers: string;
}

interface CreatorListProps {
  creators: Creator[];
}

const CreatorList: React.FC<CreatorListProps> = ({ creators }) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const goToCreatorSearch = () => {
    navigate('/brand/creators');
  };

  const handleLikeCreator = (creatorId: string) => {
    // This will be implemented in the future to store liked creators
    toast({
      title: "Creator added to your favorites",
      variant: "success",
    });
    // Future implementation: Store this in Supabase
  };

  return (
    <Card className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Your Creator Network
        </CardTitle>
        <Button variant="outline" size="sm" onClick={goToCreatorSearch}>
          <Search className="h-4 w-4 mr-2" />
          Find Creators
        </Button>
      </CardHeader>
      <CardContent>
        {creators.length === 0 ? (
          <div className="text-center py-6">
            <p className="text-muted-foreground mb-4">You haven't added any creators to your network yet</p>
            <Button onClick={goToCreatorSearch}>
              <Search className="h-4 w-4 mr-2" />
              Browse Creator Marketplace
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {creators.map((creator) => (
              <div key={creator.id} className="flex items-center p-3 border rounded-md bg-background">
                <Avatar className="h-10 w-10 mr-3">
                  <AvatarImage src={creator.imageUrl} alt={creator.name} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {creator.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="font-medium truncate">{creator.name}</p>
                  <p className="text-xs text-muted-foreground flex items-center gap-1">
                    {creator.platform} • {creator.followers}
                  </p>
                </div>
                <div className="flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    onClick={() => handleLikeCreator(creator.id)}
                    title="Add to favorites"
                  >
                    <Star className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" title="View profile">
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CreatorList;
