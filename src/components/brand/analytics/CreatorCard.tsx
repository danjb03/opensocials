
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { Repeat } from 'lucide-react';
import { getPerformanceBadge } from './mock-data';
import { CreatorAnalyticsCard } from '@/components/creator/CreatorAnalyticsCard';

interface Creator {
  id: string;
  name: string;
  handle: string;
  platform: string;
  performance: string;
  engagement: string;
  reach: string;
  posts: number;
  avatar: string;
}

interface CreatorCardProps {
  creator: Creator;
  onRehire: (creatorId: string) => void;
  rehiringCreator: string | null;
}

export const CreatorCard = ({ creator, onRehire, rehiringCreator }: CreatorCardProps) => {
  return (
    <Card key={creator.id} className="overflow-hidden">
      <div className="flex flex-col lg:flex-row">
        <div className="lg:w-1/2 p-4 lg:p-6 flex flex-col lg:border-r">
          <div className="flex items-center space-x-4 mb-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={creator.avatar} alt={creator.name} />
              <AvatarFallback>{creator.name.substring(0, 2)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-medium">{creator.name}</h3>
              <p className="text-sm text-gray-500">{creator.handle}</p>
              <div className="mt-1">
                <Badge variant="outline" className="text-xs">{creator.platform}</Badge>
              </div>
            </div>
          </div>
          
          <div className="mb-4">
            <Badge className={`${getPerformanceBadge(creator.performance)} text-xs`}>
              {creator.performance === 'high' 
                ? 'High Performer' 
                : creator.performance === 'medium'
                  ? 'Average Performer'
                  : 'Below Average'
              }
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-500">Engagement</p>
              <p className="text-xl font-medium">{creator.engagement}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Reach</p>
              <p className="text-xl font-medium">{creator.reach}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Posts</p>
              <p className="text-xl font-medium">{creator.posts}</p>
            </div>
          </div>
          
          <div className="flex justify-end space-x-3">
            <Button variant="outline">
              View Profile
            </Button>
            <Button 
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
              onClick={() => onRehire(creator.id)}
              disabled={rehiringCreator === creator.id}
            >
              {rehiringCreator === creator.id ? (
                <>
                  <span className="mr-2">Inviting...</span>
                </>
              ) : (
                <>
                  <Repeat className="mr-2 h-4 w-4" />
                  Rehire Creator
                </>
              )}
            </Button>
          </div>
        </div>
        
        {/* Analytics Card in right half */}
        <div className="lg:w-1/2 p-4 lg:p-6">
          <CreatorAnalyticsCard creator_id={creator.id} />
        </div>
      </div>
    </Card>
  );
};
