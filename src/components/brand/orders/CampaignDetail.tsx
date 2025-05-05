
import React, { useState } from 'react';
import { Order, OrderStage } from '@/types/orders';
import CampaignStageNav from './CampaignStageNav';
import CampaignSummary from './CampaignSummary';
import CampaignCreators from './CampaignCreators';
import CampaignContent from './CampaignContent';
import ContractPaymentStage from './ContractPaymentStage';

interface CampaignDetailProps {
  order: Order;
  onClose: () => void;
  onMoveStage: (id: string, newStage: OrderStage) => void;
}

const CampaignDetail: React.FC<CampaignDetailProps> = ({ 
  order,
  onClose,
  onMoveStage
}) => {
  // Define all campaign stages
  const stages: OrderStage[] = [
    'campaign_setup', 
    'creator_selection', 
    'contract_payment', 
    'planning_creation', 
    'content_performance'
  ];
  
  // Get current stage index
  const currentStageIndex = stages.indexOf(order.stage);
  
  // Previous and next stages
  const previousStage = currentStageIndex > 0 ? stages[currentStageIndex - 1] : undefined;
  const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : undefined;
  
  // Handle stage navigation
  const handleMovePrevious = () => {
    if (previousStage) {
      onMoveStage(order.id, previousStage);
    }
  };
  
  const handleMoveNext = () => {
    if (nextStage) {
      onMoveStage(order.id, nextStage);
    }
  };
  
  // Content to display based on current stage
  const renderStageContent = () => {
    switch (order.stage) {
      case 'campaign_setup':
        return <CampaignSummary order={order} />;
      case 'creator_selection':
        return <CampaignCreators creators={order.creators} orderId={order.id} />;
      case 'contract_payment':
        return <ContractPaymentStage order={order} onComplete={handleMoveNext} />;
      case 'planning_creation':
      case 'content_performance':
        return <CampaignContent order={order} />;
      default:
        return <CampaignSummary order={order} />;
    }
  };
  
  return (
    <div className="space-y-8">
      <CampaignStageNav 
        currentStageIndex={currentStageIndex}
        stages={stages}
        previousStage={previousStage}
        nextStage={nextStage}
        onClose={onClose}
        onMovePrevious={handleMovePrevious}
        onMoveNext={handleMoveNext}
        canMovePrevious={currentStageIndex > 0}
        canMoveNext={currentStageIndex < stages.length - 1}
        orderId={order.id}
      />
      
      <div className="bg-white rounded-lg border p-6">
        {renderStageContent()}
      </div>
    </div>
  );
};

export default CampaignDetail;
