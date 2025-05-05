
import React from 'react';
import { Creator } from '@/types/orders';
import { Button } from '@/components/ui/button';
import { Bell, UserPlus, Search } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import CreatorCard from './CreatorCard';
import { useNavigate } from 'react-router-dom';

interface CampaignCreatorsProps {
  creators: Creator[];
  orderId: string;
}

const CampaignCreators: React.FC<CampaignCreatorsProps> = ({ creators, orderId }) => {
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const handleInviteCreator = async (creatorId: string, creatorName: string) => {
    try {
      // Find creator in database by ID
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', creatorId)
        .single();

      if (creatorError) throw creatorError;

      // Create a formal invitation for the creator
      const { error } = await supabase
        .from('creator_invitations')
        .insert({
          creator_id: creatorId,
          campaign_id: orderId,
          status: 'pending',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Update local state to reflect that the creator has been invited
      toast({
        title: "Invitation sent",
        description: `${creatorName} has been invited to participate in this campaign.`,
      });
    } catch (error) {
      console.error('Error inviting creator:', error);
      toast({
        title: "Invitation failed",
        description: "There was an error sending the invitation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleFindMoreCreators = () => {
    // Navigate to creator search with the current campaign ID pre-selected
    navigate(`/brand/creator-search?campaign=${orderId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-gray-900">Creators ({creators.length})</h3>
        <Button 
          size="sm" 
          variant="default" 
          className="flex items-center gap-1"
          onClick={handleFindMoreCreators}
        >
          <Search className="h-4 w-4 mr-1" />
          Search for more creators
        </Button>
      </div>
      
      <div className="space-y-3">
        {creators.length > 0 ? (
          creators.map(creator => (
            <CreatorCard 
              key={creator.id} 
              creator={creator} 
              onNotifyInterest={handleNotifyCreator}
              onInviteCreator={handleInviteCreator}
              showInviteButton={creator.status !== 'accepted' && creator.status !== 'declined' && creator.status !== 'completed'}
            />
          ))
        ) : (
          <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed">
            <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-2" />
            <p className="text-gray-500 mb-4">No creators assigned to this campaign yet</p>
            <Button 
              variant="default" 
              size="sm" 
              className="mx-auto"
              onClick={handleFindMoreCreators}
            >
              <Search className="h-4 w-4 mr-1" />
              Search for creators
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCreators;
