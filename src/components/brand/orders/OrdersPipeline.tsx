
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/ui/empty-state';
import { OrderStage, orderStageLabels, Order } from '@/types/orders';
import CampaignCard from './CampaignCard';
import { FileText, Users, ClipboardCheck, Calendar, BarChart2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface OrdersPipelineProps {
  orders: Order[];
  activeStage: OrderStage;
  onStageChange: (stage: OrderStage) => void;
  onOrderSelect: (id: string) => void;
}

// Map icons to stages
const stageIcons: Record<OrderStage, React.ReactNode> = {
  campaign_setup: <FileText className="h-4 w-4 mr-2" />,
  creator_selection: <Users className="h-4 w-4 mr-2" />,
  contract_payment: <ClipboardCheck className="h-4 w-4 mr-2" />,
  planning_creation: <Calendar className="h-4 w-4 mr-2" />,
  content_performance: <BarChart2 className="h-4 w-4 mr-2" />,
};

// Map icons for empty states (without margins)
const stageIconsForEmpty: Record<OrderStage, any> = {
  campaign_setup: FileText,
  creator_selection: Users,
  contract_payment: ClipboardCheck,
  planning_creation: Calendar,
  content_performance: BarChart2,
};

const OrdersPipeline: React.FC<OrdersPipelineProps> = ({ 
  orders, 
  activeStage, 
  onStageChange, 
  onOrderSelect 
}) => {
  const navigate = useNavigate();
  
  const stages: OrderStage[] = [
    'campaign_setup', 
    'creator_selection', 
    'contract_payment', 
    'planning_creation', 
    'content_performance'
  ];

  // Filter orders by stage
  const getOrdersByStage = (stage: OrderStage) => {
    return orders.filter(order => order.stage === stage);
  };

  const handleContinueDraft = (orderId: string) => {
    navigate(`/brand/create-campaign?draft=${orderId}`);
  };

  return (
    <Tabs value={activeStage} onValueChange={(value) => onStageChange(value as OrderStage)}>
      <TabsList className="grid grid-cols-5 mb-6">
        {stages.map((stage) => (
          <TabsTrigger 
            key={stage} 
            value={stage}
            className="flex items-center py-2 text-foreground"
          >
            {stageIcons[stage]}
            <span className="hidden md:inline text-foreground">{orderStageLabels[stage]}</span>
            <span className="ml-2 bg-muted text-foreground rounded-full px-2 py-0.5 text-xs">
              {getOrdersByStage(stage).length}
            </span>
          </TabsTrigger>
        ))}
      </TabsList>

      {stages.map((stage) => (
        <TabsContent key={stage} value={stage} className="mt-0">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getOrdersByStage(stage).length > 0 ? (
              getOrdersByStage(stage).map((order) => (
                <div key={order.id} className="relative">
                  <CampaignCard
                    order={order}
                    onClick={onOrderSelect}
                  />
                  {/* Continue Draft Button for Setup Stage */}
                  {stage === 'campaign_setup' && (
                    <div className="absolute top-2 right-2">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleContinueDraft(order.id);
                        }}
                        className="text-xs h-7 px-2"
                      >
                        Continue Draft
                      </Button>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="col-span-full">
                <EmptyState
                  icon={stageIconsForEmpty[stage]}
                  title={`No campaigns in ${orderStageLabels[stage]}`}
                  description={
                    stage === 'campaign_setup' 
                      ? "Get started by creating your first campaign."
                      : "Campaigns will move here as they progress through the workflow."
                  }
                  className="animate-fade-in"
                  action={
                    stage === 'campaign_setup' ? (
                      <Button onClick={() => navigate('/brand/create-campaign')}>
                        <Plus className="h-4 w-4 mr-2" />
                        Create Campaign
                      </Button>
                    ) : undefined
                  }
                />
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default OrdersPipeline;
