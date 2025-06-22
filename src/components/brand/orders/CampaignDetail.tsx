
import React, { useState, useEffect } from 'react';
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
  // Local state to manage order updates
  const [currentOrder, setCurrentOrder] = useState(order);
  
  // Update local state when props change
  useEffect(() => {
    setCurrentOrder(order);
  }, [order]);
  
  // Define all campaign stages
  const stages: OrderStage[] = [
    'campaign_setup', 
    'creator_selection', 
    'contract_payment', 
    'planning_creation', 
    'content_performance'
  ];
  
  // Get current stage index
  const currentStageIndex = stages.indexOf(currentOrder.stage);
  
  // Previous and next stages
  const previousStage = currentStageIndex > 0 ? stages[currentStageIndex - 1] : undefined;
  const nextStage = currentStageIndex < stages.length - 1 ? stages[currentStageIndex + 1] : undefined;
  
  // Handle stage navigation
  const handleMovePrevious = () => {
    if (previousStage) {
      console.log('Moving to previous stage:', previousStage);
      onMoveStage(currentOrder.id, previousStage);
      // Update local state to reflect the change immediately
      setCurrentOrder({
        ...currentOrder,
        stage: previousStage
      });
    }
  };
  
  const handleMoveNext = () => {
    if (nextStage) {
      console.log('Moving to next stage:', nextStage);
      onMoveStage(currentOrder.id, nextStage);
      // Update local state to reflect the change immediately
      setCurrentOrder({
        ...currentOrder,
        stage: nextStage
      });
    }
  };
  
  // Handle order updates
  const handleOrderUpdate = (updatedOrder: Order) => {
    setCurrentOrder(updatedOrder);
  };
  
  // Content to display based on current stage
  const renderStageContent = () => {
    switch (currentOrder.stage) {
      case 'campaign_setup':
        return <CampaignSummary order={currentOrder} onUpdateOrder={handleOrderUpdate} />;
      case 'creator_selection':
        return <CampaignCreators creators={currentOrder.creators} orderId={currentOrder.id} />;
      case 'contract_payment':
        return <ContractPaymentStage order={currentOrder} onComplete={handleMoveNext} />;
      case 'planning_creation':
        return (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-2">Planning & Creation Stage</h3>
              <p className="text-blue-700 mb-4">
                Creators are now working on content creation. You can track progress and communicate with creators.
              </p>
              <div className="flex gap-3">
                <button 
                  onClick={handleMoveNext}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                >
                  Mark as Complete
                </button>
              </div>
            </div>
            <CampaignCreators creators={currentOrder.creators} orderId={currentOrder.id} />
          </div>
        );
      case 'content_performance':
        return <CampaignContent order={currentOrder} />;
      default:
        return <CampaignSummary order={currentOrder} onUpdateOrder={handleOrderUpdate} />;
    }
  };
  
  return (
    <div className="max-w-3xl mx-auto">
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
        orderId={currentOrder.id}
        orderTitle={currentOrder.title}
      />
      
      <div className="mt-5">
        {renderStageContent()}
      </div>
    </div>
  );
};

export default CampaignDetail;
