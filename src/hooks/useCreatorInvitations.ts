
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Creator } from '@/types/orders';

export function useCreatorInvitations() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  
  const handleNotifyCreator = async (creatorId: string, creatorName: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [`notify-${creatorId}`]: true }));
      
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
    } finally {
      setIsLoading(prev => ({ ...prev, [`notify-${creatorId}`]: false }));
    }
  };

  const handleInviteCreator = async (creatorId: string, creatorName: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [`invite-${creatorId}`]: true }));
      
      // Find creator in database by ID
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', creatorId)
        .single();

      if (creatorError) throw creatorError;

      // Use the brand_creator_connections table with a specific status
      const { error } = await supabase
        .from('brand_creator_connections')
        .insert({
          creator_id: creatorId,
          brand_id: (await supabase.auth.getUser()).data.user?.id,
          status: 'invited',
          created_at: new Date().toISOString()
        });

      if (error) throw error;

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
    } finally {
      setIsLoading(prev => ({ ...prev, [`invite-${creatorId}`]: false }));
    }
  };

  return { 
    handleNotifyCreator, 
    handleInviteCreator, 
    isLoading 
  };
}
