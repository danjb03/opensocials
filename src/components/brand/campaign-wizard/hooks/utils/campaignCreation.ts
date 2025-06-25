
import { supabase } from '@/integrations/supabase/client';
import { CampaignWizardData } from '@/types/campaignWizard';

export const createCampaignFromDraft = async (
  formData: Partial<CampaignWizardData>,
  status: string,
  userId: string,
  currentStep: number
) => {
  console.log('🚀 Creating campaign from draft with data:', {
    name: formData.name,
    status,
    userId,
    currentStep
  });

  // Determine the correct review status based on the campaign status
  const reviewStatus = status === 'active' ? 'pending_review' : 'draft';
  const reviewStage = status === 'active' ? 'creator_selection' : 'campaign_setup';
  
  const campaignPayload = {
    brand_id: userId,
    name: formData.name || 'Untitled Campaign',
    description: formData.description || '',
    objective: formData.objective || '',
    campaign_type: formData.campaign_type || 'Single',
    platforms: formData.brief_data?.platform_destination || [],
    budget: formData.total_budget || 0,
    currency: 'USD', // Default currency since it's not in CampaignWizardData
    start_date: formData.timeline?.start_date ? formData.timeline.start_date.toISOString().split('T')[0] : null,
    end_date: formData.timeline?.end_date ? formData.timeline.end_date.toISOString().split('T')[0] : null,
    deliverables: formData.deliverables || {},
    status: status,
    review_status: reviewStatus,
    review_stage: reviewStage,
    current_step: currentStep
  };

  console.log('📝 Campaign payload:', campaignPayload);

  const { data: campaign, error } = await supabase
    .from('projects_new')
    .insert(campaignPayload)
    .select()
    .single();

  if (error) {
    console.error('❌ Campaign creation error:', error);
    throw new Error(`Failed to create campaign: ${error.message}`);
  }

  console.log('✅ Campaign created successfully:', campaign);
  return campaign;
};
