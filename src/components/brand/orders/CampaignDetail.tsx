
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Order, OrderStage } from '@/types/orders';
import CampaignSummary from './CampaignSummary';
import CampaignCreators from './CampaignCreators';
import CampaignContent from './CampaignContent';
import CampaignStageNav from './CampaignStageNav';
import ContractPaymentStage from './ContractPaymentStage';

interface CampaignDetailProps {
  order: Order;
  onClose: () => void;
  onMoveStage: (id: string, newStage: OrderStage) => void;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ order, onClose, onMoveStage }) => {
  const stages: OrderStage[] = [
    'campaign_setup', 
    'creator_selection', 
    'contract_payment', 
    'planning_creation', 
    'content_performance'
  ];
  
  const currentStageIndex = stages.indexOf(order.stage);
  const canMoveToPrevious = currentStageIndex > 0;
  const canMoveToNext = currentStageIndex < stages.length - 1;
  const previousStage = canMoveToPrevious ? stages[currentStageIndex - 1] : undefined;
  const nextStage = canMoveToNext ? stages[currentStageIndex + 1] : undefined;

  const handleMoveNext = () => {
    if (nextStage) {
      onMoveStage(order.id, nextStage);
    }
  };

  const handleMovePrevious = () => {
    if (previousStage) {
      onMoveStage(order.id, previousStage);
    }
  };

  // Show Contract & Payment stage component when the campaign is in that stage
  if (order.stage === 'contract_payment') {
    return (
      <div className="space-y-6">
        <CampaignStageNav
          currentStageIndex={currentStageIndex}
          stages={stages}
          previousStage={previousStage}
          nextStage={nextStage}
          onClose={onClose}
          onMovePrevious={handleMovePrevious}
          onMoveNext={handleMoveNext}
          canMovePrevious={canMoveToPrevious}
          canMoveNext={false} // Disable next button as it's handled by the ContractPaymentStage component
        />

        <Card>
          <CardHeader>
            <CampaignSummary order={order} />
          </CardHeader>
        </Card>
        
        <ContractPaymentStage 
          order={order} 
          onMoveStage={onMoveStage} 
        />
      </div>
    );
  }

  // Default view for other stages
  return (
    <div className="space-y-6">
      <CampaignStageNav
        currentStageIndex={currentStageIndex}
        stages={stages}
        previousStage={previousStage}
        nextStage={nextStage}
        onClose={onClose}
        onMovePrevious={handleMovePrevious}
        onMoveNext={handleMoveNext}
        canMovePrevious={canMoveToPrevious}
        canMoveNext={canMoveToNext}
      />

      <Card>
        <CardHeader>
          <CampaignSummary order={order} />
        </CardHeader>
        <CardContent className="space-y-6">
          <CampaignCreators creators={order.creators} />
          
          {order.contentItems && order.contentItems.length > 0 && (
            <>
              <Separator />
              <CampaignContent contentItems={order.contentItems} />
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignDetail;
