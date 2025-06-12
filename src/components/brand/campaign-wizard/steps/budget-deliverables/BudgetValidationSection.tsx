
import React from 'react';
import { BudgetValidationModal } from '../../BudgetValidationModal';

interface BudgetValidationSectionProps {
  showValidationModal: boolean;
  validationError: {
    creatorName?: string;
    tier: string;
    campaignType: string;
    minPrice: number;
    currentOffer: number;
  } | null;
  onUpdateOffer: () => void;
  onCloseModal: () => void;
}

export const BudgetValidationSection: React.FC<BudgetValidationSectionProps> = ({
  showValidationModal,
  validationError,
  onUpdateOffer,
  onCloseModal
}) => {
  if (!validationError) return null;

  return (
    <BudgetValidationModal
      isOpen={showValidationModal}
      onClose={onCloseModal}
      onUpdateOffer={onUpdateOffer}
      tier={validationError.tier}
      campaignType={validationError.campaignType}
      minPrice={validationError.minPrice}
      currentOffer={validationError.currentOffer}
    />
  );
};
