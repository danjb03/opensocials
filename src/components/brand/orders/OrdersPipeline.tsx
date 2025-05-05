
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { OrderStage, orderStageLabels, Order } from '@/types/orders';
import CampaignCard from './CampaignCard';
import { FileText, Users, ClipboardCheck, Calendar, BarChart2 } from 'lucide-react';

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

const OrdersPipeline: React.FC<OrdersPipelineProps> = ({ 
  orders, 
  activeStage, 
  onStageChange, 
  onOrderSelect 
}) => {
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

  return (
    <Tabs value={activeStage} onValueChange={(value) => onStageChange(value as OrderStage)}>
      <TabsList className="grid grid-cols-5 mb-6">
        {stages.map((stage) => (
          <TabsTrigger 
            key={stage} 
            value={stage}
            className="flex items-center py-2"
          >
            {stageIcons[stage]}
            <span className="hidden md:inline">{orderStageLabels[stage]}</span>
            <span className="ml-2 bg-gray-200 text-gray-700 rounded-full px-2 py-0.5 text-xs">
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
                <CampaignCard
                  key={order.id}
                  order={order}
                  onClick={onOrderSelect}
                />
              ))
            ) : (
              <div className="col-span-full py-12 text-center bg-gray-50 rounded-lg border border-dashed">
                <div className="flex flex-col items-center justify-center">
                  {stageIcons[stage]}
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No campaigns in {orderStageLabels[stage]}</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Get started by moving a campaign to this stage
                  </p>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};

export default OrdersPipeline;
