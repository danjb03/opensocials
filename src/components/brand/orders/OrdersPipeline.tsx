
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

  const handleOrderClick = (orderId: string, stage: OrderStage) => {
    // For campaign_setup stage, redirect to wizard instead of opening detail
    if (stage === 'campaign_setup') {
      handleContinueDraft(orderId);
    } else {
      onOrderSelect(orderId);
    }
  };

  return (
    <div className="space-y-6">
      <Tabs value={activeStage} onValueChange={(value) => onStageChange(value as OrderStage)}>
        <TabsList className="grid grid-cols-5 h-auto p-1 bg-muted/50 rounded-lg">
          {stages.map((stage) => {
            const count = getOrdersByStage(stage).length;
            return (
              <TabsTrigger 
                key={stage} 
                value={stage}
                className="flex flex-col items-center py-3 px-2 data-[state=active]:bg-background data-[state=active]:shadow-sm rounded-md transition-all"
              >
                <div className="flex items-center mb-1">
                  {stageIcons[stage]}
                  <span className="hidden sm:inline text-sm font-medium">{orderStageLabels[stage]}</span>
                </div>
                <div className="flex items-center justify-center">
                  <span className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium min-w-[1.5rem] h-6 flex items-center justify-center">
                    {count}
                  </span>
                </div>
              </TabsTrigger>
            );
          })}
        </TabsList>

        {stages.map((stage) => (
          <TabsContent key={stage} value={stage} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getOrdersByStage(stage).length > 0 ? (
                getOrdersByStage(stage).map((order) => (
                  <div key={order.id} className="relative group">
                    <CampaignCard
                      order={order}
                      onClick={(id) => handleOrderClick(id, stage)}
                    />
                    {/* Continue Draft Button for Setup Stage - now just visual, main click handles navigation */}
                    {stage === 'campaign_setup' && (
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleContinueDraft(order.id);
                          }}
                          className="text-xs h-8 px-3 bg-background/90 backdrop-blur-sm border shadow-sm hover:bg-background"
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
                    className="animate-fade-in py-12"
                    action={
                      stage === 'campaign_setup' ? {
                        label: "Create Campaign",
                        onClick: () => navigate('/brand/create-campaign'),
                        variant: "default" as const
                      } : undefined
                    }
                  />
                </div>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default OrdersPipeline;
