
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { CreatorCard } from './CreatorCard';
import { mockCreators } from './mock-data';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

export const CreatorsTab = () => {
  const [rehiringCreator, setRehiringCreator] = useState<string | null>(null);
  const { toast } = useToast();

  const handleRehire = (creatorId: string) => {
    setRehiringCreator(creatorId);
    
    // Simulate API call
    setTimeout(() => {
      toast({
        title: "Creator Invited",
        description: "The creator has been invited to your new campaign.",
      });
      setRehiringCreator(null);
    }, 1500);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Creators</CardTitle>
        <CardDescription>Performance of creators who participated in this campaign</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {mockCreators.map(creator => (
            <CreatorCard 
              key={creator.id}
              creator={creator}
              onRehire={handleRehire}
              rehiringCreator={rehiringCreator}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
