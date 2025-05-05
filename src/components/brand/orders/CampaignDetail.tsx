
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { CheckCircle, XCircle, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Order, OrderStage, orderStageLabels } from '@/types/orders';
import { formatCurrency } from '@/utils/project';

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

  const getStatusColor = (status: string) => {
    switch(status) {
      case 'accepted':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'declined':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'invited':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'accepted':
      case 'completed':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      case 'declined':
        return <XCircle className="h-4 w-4 mr-1" />;
      default:
        return <Clock className="h-4 w-4 mr-1" />;
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Button variant="outline" size="sm" onClick={onClose}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Back to campaigns
        </Button>
        <div className="flex space-x-2">
          {canMoveToPrevious && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleMovePrevious}
            >
              Move to {orderStageLabels[previousStage!]}
            </Button>
          )}
          {canMoveToNext && (
            <Button 
              size="sm" 
              onClick={handleMoveNext}
            >
              Move to {orderStageLabels[nextStage!]} <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-xl flex items-center justify-between">
            {order.title}
            <Badge className="ml-2">{orderStageLabels[order.stage]}</Badge>
          </CardTitle>
          <CardDescription>
            Campaign ID: {order.id}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Budget</p>
              <p className="text-lg font-semibold">{formatCurrency(order.budget, order.currency)}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Platforms</p>
              <div className="flex flex-wrap gap-1">
                {order.platformsList.map(platform => (
                  <Badge key={platform} variant="outline">{platform}</Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium text-gray-500">Created On</p>
              <p className="font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium text-gray-900 mb-3">Creators ({order.creators.length})</h3>
            <div className="space-y-3">
              {order.creators.length > 0 ? (
                order.creators.map(creator => (
                  <div 
                    key={creator.id} 
                    className="flex items-center justify-between rounded-md border p-3"
                  >
                    <div className="flex items-center">
                      <img 
                        src={creator.imageUrl} 
                        alt={creator.name} 
                        className="h-10 w-10 rounded-full object-cover mr-3"
                      />
                      <div>
                        <p className="font-medium">{creator.name}</p>
                        <p className="text-sm text-gray-500">{creator.platform}</p>
                      </div>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={`flex items-center ${getStatusColor(creator.status)}`}
                    >
                      {getStatusIcon(creator.status)}
                      <span className="capitalize">{creator.status}</span>
                    </Badge>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-md">
                  No creators assigned to this campaign yet
                </p>
              )}
            </div>
          </div>

          {order.contentItems && order.contentItems.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Content Items</h3>
                <div className="space-y-3">
                  {order.contentItems.map(item => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between rounded-md border p-3"
                    >
                      <div className="flex items-center">
                        <div>
                          <p className="font-medium">{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</p>
                          <p className="text-sm text-gray-500">By {item.creatorName} • {item.platform}</p>
                        </div>
                      </div>
                      <Badge
                        variant="outline"
                        className={`capitalize ${
                          item.status === 'published' ? 'bg-green-100 text-green-800' :
                          item.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          item.status === 'submitted' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {item.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardContent>
        <CardFooter className="border-t bg-gray-50 flex justify-between">
          <div className="text-sm text-gray-500">
            Stage: {currentStageIndex + 1} of {stages.length}
          </div>
          <div className="flex space-x-2">
            {canMoveToPrevious && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleMovePrevious}
              >
                Previous Stage
              </Button>
            )}
            {canMoveToNext && (
              <Button 
                size="sm" 
                onClick={handleMoveNext}
              >
                Next Stage
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default CampaignDetail;
