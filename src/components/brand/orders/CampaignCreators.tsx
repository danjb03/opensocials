
import React from 'react';
import { Creator } from '@/types/orders';
import { Button } from '@/components/ui/button';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CreatorCard from './CreatorCard';

interface CampaignCreatorsProps {
  creators: Creator[];
}

const CampaignCreators: React.FC<CampaignCreatorsProps> = ({ creators }) => {
  const { toast } = useToast();

  const handleNotifyCreator = async (creatorId: string, creatorName: string) => {
    try {
      // Find creator in database by ID
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', creatorId)
        .single();

      if (creatorError) throw creatorError;

      // Create a deal to notify the creator of interest
      const { error } = await supabase
        .from('deals')
        .insert({
          creator_id: creatorId,
          brand_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'pending',
          title: 'Campaign interest notification',
          value: 0, // Placeholder value, will be updated when terms are agreed
          description: 'A brand has shown interest in working with you on a campaign.'
        });

      if (error) throw error;

      toast({
        title: "Creator notified",
        description: `${creatorName} has been notified of your interest.`,
      });
    } catch (error) {
      console.error('Error notifying creator:', error);
      toast({
        title: "Notification failed",
        description: "There was an error notifying the creator. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-3">Creators ({creators.length})</h3>
      <div className="space-y-3">
        {creators.length > 0 ? (
          creators.map(creator => (
            <div key={creator.id} className="flex flex-col space-y-2">
              <CreatorCard creator={creator} />
              <div className="ml-auto">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-1 text-xs"
                  onClick={() => handleNotifyCreator(creator.id, creator.name)}
                >
                  <Bell className="h-3.5 w-3.5 mr-1" />
                  Notify Interest
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-md">
            No creators assigned to this campaign yet
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignCreators;
