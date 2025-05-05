
import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { OrderStage, orderStageLabels } from '@/types/orders';

interface CampaignStageNavProps {
  currentStageIndex: number;
  stages: OrderStage[];
  previousStage?: OrderStage;
  nextStage?: OrderStage;
  onClose: () => void;
  onMovePrevious: () => void;
  onMoveNext: () => void;
  canMovePrevious: boolean;
  canMoveNext: boolean;
}

const CampaignStageNav: React.FC<CampaignStageNavProps> = ({
  currentStageIndex,
  stages,
  previousStage,
  nextStage,
  onClose,
  onMovePrevious,
  onMoveNext,
  canMovePrevious,
  canMoveNext,
}) => {
  const currentStage = stages[currentStageIndex];
  const isContractPaymentStage = currentStage === 'contract_payment';
  
  // Conditional message for Contract & Payment stage
  const getStageMessage = () => {
    if (isContractPaymentStage) {
      return "Complete all required steps to proceed";
    }
    return `Stage: ${currentStageIndex + 1} of ${stages.length}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to campaigns
        </Button>
        <div className="flex space-x-2">
          {canMovePrevious && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onMovePrevious}
            >
              Move to {orderStageLabels[previousStage!]}
            </Button>
          )}
          {canMoveNext && !isContractPaymentStage && (
            <Button 
              size="sm" 
              onClick={onMoveNext}
            >
              Move to {orderStageLabels[nextStage!]} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
      <div className="border-t bg-gray-50 flex justify-between p-4 mt-4">
        <div className="text-sm text-gray-500">
          {getStageMessage()}
        </div>
        <div className="flex space-x-2">
          {canMovePrevious && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={onMovePrevious}
            >
              Previous Stage
            </Button>
          )}
          {canMoveNext && !isContractPaymentStage && (
            <Button 
              size="sm" 
              onClick={onMoveNext}
            >
              Next Stage
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignStageNav;
