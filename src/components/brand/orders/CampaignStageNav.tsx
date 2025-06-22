
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { OrderStage, orderStageLabels } from '@/types/orders';
import { DeleteCampaignModal } from '@/components/brand/modals/DeleteCampaignModal';

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
  orderId: string;
  orderTitle?: string;
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
  orderId,
  orderTitle,
}) => {
  const currentStage = stages[currentStageIndex];
  const isContractPaymentStage = currentStage === 'contract_payment';
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  // Simplified message for stage info
  const getStageMessage = () => {
    if (isContractPaymentStage) {
      return "Complete all required steps to proceed";
    }
    return `Stage: ${currentStageIndex + 1} of ${stages.length}`;
  };

  return (
    <>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={onClose}>
              <ChevronLeft className="h-4 w-4 mr-1" /> Back to campaigns
            </Button>
            
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-1 hover:bg-red-50 text-red-600 border-red-200"
              onClick={() => setShowDeleteModal(true)}
            >
              <Trash2 className="h-4 w-4 mr-1" /> Delete Campaign
            </Button>
          </div>
          
          <div className="flex space-x-3">
            {canMovePrevious && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={onMovePrevious}
                className="shadow-sm"
              >
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous Stage
              </Button>
            )}
            
            {canMoveNext && !isContractPaymentStage && (
              <Button 
                size="sm" 
                onClick={onMoveNext}
                className="shadow-sm bg-black text-white hover:bg-gray-800"
              >
                Complete Next Steps <ChevronRight className="h-4 w-4 ml-1" />
              </Button>
            )}
          </div>
        </div>
        
        <div className="border-t bg-black border-gray-800 flex justify-between p-4 mt-4">
          <div className="text-sm text-white">
            {getStageMessage()}
          </div>
        </div>
      </div>

      <DeleteCampaignModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        campaignId={orderId}
        campaignName={orderTitle}
      />
    </>
  );
};

export default CampaignStageNav;
