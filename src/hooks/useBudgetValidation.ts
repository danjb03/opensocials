
import { useState } from 'react';
import { usePricingFloorsByType } from '@/hooks/usePricingFloorsByType';
import { useCreatorTiers } from '@/hooks/useCreatorTiers';
import { CampaignWizardData } from '@/types/campaignWizard';

export const useBudgetValidation = (data?: Partial<CampaignWizardData>) => {
  const [showValidationModal, setShowValidationModal] = useState(false);
  const [validationError, setValidationError] = useState<{
    creatorName?: string;
    tier: string;
    campaignType: string;
    minPrice: number;
    currentOffer: number;
  } | null>(null);

  // Get pricing floors for the current campaign type
  const { data: pricingFloors } = usePricingFloorsByType(data?.campaign_type || 'Single');
  
  // Get creator tiers for validation
  const creatorIds = data?.selected_creators?.map(c => c.creator_id) || [];
  const { data: creatorTiers } = useCreatorTiers(creatorIds);

  const validateCreatorBudgets = (): boolean => {
    if (!data?.selected_creators || !pricingFloors || !creatorTiers) {
      return true; // Skip validation if data not loaded
    }

    for (const creator of data.selected_creators) {
      const tier = creatorTiers[creator.creator_id];
      const minPrice = pricingFloors[tier];
      
      if (minPrice && creator.individual_budget < minPrice) {
        setValidationError({
          tier,
          campaignType: data.campaign_type || 'Single',
          minPrice,
          currentOffer: creator.individual_budget
        });
        setShowValidationModal(true);
        return false;
      }
    }

    return true;
  };

  const handleUpdateOffer = () => {
    setShowValidationModal(false);
    setValidationError(null);
  };

  const handleCloseValidationModal = () => {
    setShowValidationModal(false);
    setValidationError(null);
  };

  // Show a warning if we have selected creators but no pricing data loaded yet
  const showPricingWarning = data?.selected_creators?.length && (!pricingFloors || !creatorTiers);

  return {
    showValidationModal,
    validationError,
    validateCreatorBudgets,
    handleUpdateOffer,
    handleCloseValidationModal,
    showPricingWarning
  };
};
