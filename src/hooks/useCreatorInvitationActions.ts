
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { sendEmail } from '@/utils/email';

export function useCreatorInvitationActions() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState<Record<string, boolean>>({});
  
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

      // Update the brand_creator_connections table
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
            <h2>You've Been Invited to a Campaign</h2>
            <p>${brandName} has invited you to participate in their campaign: ${campaignName}.</p>
            <p>Log in to your account to view the details.</p>
            <p><a href="${window.location.origin}/creator/deals" style="display: inline-block; background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Invitation</a></p>
          `,
        });
      }

      toast({
        title: "Creator invited",
        description: `${creatorName} has been invited to this campaign.`,
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
    handleInviteCreator, 
    isLoading 
  };
}
