
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
  return (
    <BudgetValidationModal
      isOpen={showValidationModal && !!validationError}
      onClose={onCloseModal}
      onUpdateOffer={onUpdateOffer}
      tier={validationError?.tier || ''}
      campaignType={validationError?.campaignType || ''}
      minPrice={validationError?.minPrice || 0}
      currentOffer={validationError?.currentOffer || 0}
    />
  );
};
