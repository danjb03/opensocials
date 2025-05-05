
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Creator } from '@/types/orders';
import { sendEmail } from '@/utils/email';

export function useCreatorInvitations() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  
  const handleNotifyCreator = async (creatorId: string, creatorName: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [`notify-${creatorId}`]: true }));
      
      // Find creator in database by ID
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('id, email')
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

      // Send an email notification if email is available
      if (creatorData?.email) {
        await sendEmail({
          to: creatorData.email,
          subject: 'New Interest in Collaboration',
          html: `
            <h2>Someone is interested in working with you!</h2>
            <p>A brand has expressed interest in collaborating with you on a campaign.</p>
            <p>Log in to your account to view details and respond.</p>
            <p><a href="${window.location.origin}/creator/deals" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Details</a></p>
          `,
        });
      }

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

  const handleInviteCreator = async (creatorId: string, creatorName: string, campaignId?: string) => {
    try {
      setIsLoading(prev => ({ ...prev, [`invite-${creatorId}`]: true }));
      
      // Find creator in database by ID
      const { data: creatorData, error: creatorError } = await supabase
        .from('profiles')
        .select('id, email')
        .eq('id', creatorId)
        .single();

      if (creatorError) throw creatorError;

      const currentUser = await supabase.auth.getUser();
      const brandId = currentUser.data.user?.id;
      
      if (!brandId) throw new Error("Brand ID not found");

      // Get brand information
      const { data: brandData, error: brandError } = await supabase
        .from('profiles')
        .select('company_name, display_name')
        .eq('id', brandId)
        .single();
        
      if (brandError) throw brandError;
      
      const brandName = brandData.company_name || brandData.display_name || 'A brand';

      // Get campaign info if campaign ID is provided
      let campaignName = "a campaign";
      if (campaignId) {
        const { data: campaignData, error: campaignError } = await supabase
          .from('projects')
          .select('name')
          .eq('id', campaignId)
          .single();
          
        if (!campaignError && campaignData) {
          campaignName = campaignData.name;
        }
      }

      // Use the brand_creator_connections table with a specific status
      const { error } = await supabase
        .from('brand_creator_connections')
        .insert({
          creator_id: creatorId,
          brand_id: brandId,
          status: 'invited',
          project_id: campaignId, // Store the campaign ID if provided
          created_at: new Date().toISOString()
        });

      if (error) throw error;

      // Send an email notification to the creator
      if (creatorData?.email) {
        await sendEmail({
          to: creatorData.email,
          subject: `Invitation to Collaborate on ${campaignName}`,
          html: `
            <h2>You've Been Invited to Collaborate!</h2>
            <p>${brandName} has invited you to participate in their campaign: ${campaignName}.</p>
            <p>Log in to your account to view the details and accept or decline this invitation.</p>
            <p><a href="${window.location.origin}/creator/deals" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Invitation</a></p>
          `,
        });
      }

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
