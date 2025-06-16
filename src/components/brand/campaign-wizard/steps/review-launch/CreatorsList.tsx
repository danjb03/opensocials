
import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CampaignWizardData } from '@/types/campaignWizard';

interface CreatorsListProps {
  data: Partial<CampaignWizardData>;
}

// Hook to fetch creator details
const useCreatorDetails = (creatorIds: string[]) => {
  return useQuery({
    queryKey: ['creator-details', creatorIds],
    queryFn: async () => {
      if (creatorIds.length === 0) return [];
      
      const { data, error } = await supabase
        .from('creator_profiles')
        .select(`
          id,
          user_id,
          first_name,
          last_name
        `)
        .in('user_id', creatorIds);
      
      if (error) throw error;
      return data || [];
    },
    enabled: creatorIds.length > 0
  });
};

export const CreatorsList: React.FC<CreatorsListProps> = ({ data }) => {
  const selectedCreators = data?.selected_creators || [];
  
  // Fetch creator details
  const creatorIds = selectedCreators.map(c => c.creator_id);
  const { data: creatorDetails, isLoading: creatorsLoading } = useCreatorDetails(creatorIds);

  return (
    <div className="space-y-3">
      <h3 className="font-semibold text-foreground">Selected Creators ({selectedCreators.length})</h3>
      {creatorsLoading ? (
        <div className="space-y-3">
          {[...Array(selectedCreators.length)].map((_, i) => (
            <div key={i} className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <div className="h-10 w-10 bg-muted-foreground rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted-foreground rounded animate-pulse" />
                <div className="h-3 bg-muted-foreground rounded animate-pulse w-3/4" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {selectedCreators.map(creatorData => {
            const creator = creatorDetails?.find(c => c.user_id === creatorData.creator_id);
            const creatorName = creator?.first_name && creator?.last_name 
              ? `${creator.first_name} ${creator.last_name}`
              : creator?.first_name || 'Unknown Creator';
            
            return (
              <div key={creatorData.creator_id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-background text-foreground">{creatorName.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-foreground">{creatorName}</p>
                    <p className="text-sm text-muted-foreground">@creator</p>
                    <p className="text-xs text-blue-400">Creator</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${creatorData.individual_budget}</p>
                  <p className="text-sm text-muted-foreground">creator payout</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
