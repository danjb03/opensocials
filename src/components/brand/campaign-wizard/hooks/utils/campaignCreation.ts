
import { supabase } from '@/integrations/supabase/client';
import { CampaignWizardData } from '@/types/campaignWizard';

export const createCampaignFromDraft = async (
  draftData: Partial<CampaignWizardData>, 
  status: string = 'active',
  userId: string,
  currentStep: number
) => {
  if (!userId) {
    console.error('❌ No user authenticated - userId:', userId);
    throw new Error('No user authenticated');
  }

  console.log('🚀 Creating campaign from draft data:', {
    draftData: draftData,
    status: status,
    userId: userId,
    campaignName: draftData.name
  });

  // Prepare the campaign data with proper field mapping
  const campaignData = {
    brand_id: userId, // Use standardized user ID
    name: draftData.name || 'Untitled Campaign',
    description: draftData.description || '',
    campaign_type: draftData.campaign_type || 'Single',
    start_date: draftData.timeline?.start_date ? draftData.timeline.start_date.toISOString().split('T')[0] : null,
    end_date: draftData.timeline?.end_date ? draftData.timeline.end_date.toISOString().split('T')[0] : null,
    budget: draftData.total_budget || 0,
    brief_data: draftData.brief_data || {},
    platforms: draftData.brief_data?.platform_destination || [],
    deliverables: draftData.deliverables || {},
    status: status,
    review_status: 'pending_review', // Always use pending_review for new campaigns
    current_step: currentStep
  };

  console.log('📝 Campaign data being inserted:', campaignData);

  const { data: campaign, error } = await supabase
    .from('projects_new')
    .insert(campaignData)
    .select()
    .single();

  if (error) {
    console.error('❌ Error creating campaign:', error);
    console.error('❌ Campaign data that failed:', campaignData);
    throw error;
  }

  console.log('✅ Campaign created successfully:', campaign);
  console.log('✅ Campaign brand_id:', campaign.brand_id, 'vs user.id:', userId);
  return campaign;
};
