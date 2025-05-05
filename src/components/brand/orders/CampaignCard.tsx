
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Calendar } from 'lucide-react';
import { Order, orderStageLabels } from '@/types/orders';
import { Progress } from '@/components/ui/progress';
import { formatCurrency } from '@/utils/project';

interface CampaignCardProps {
  order: Order;
  onClick: (id: string) => void;
}

const CampaignCard: React.FC<CampaignCardProps> = ({ order, onClick }) => {
  const { id, title, stage, progress, budget, currency, creators, platformsList, dueDate } = order;
  
  const acceptedCreators = creators.filter(c => c.status === 'accepted' || c.status === 'completed').length;
  
  return (
    <Card 
      className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-500"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
            <div className="flex items-center mt-1">
              <Badge variant="outline" className="mr-2 bg-blue-50">
                {orderStageLabels[stage]}
              </Badge>
              <div className="flex items-center text-sm text-gray-500">
                <Users className="h-3.5 w-3.5 mr-1" />
                <span>
                  {acceptedCreators}/{creators.length} creators
                </span>
              </div>
              {dueDate && (
                <div className="flex items-center text-sm text-gray-500 ml-3">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>Due {new Date(dueDate).toLocaleDateString()}</span>
                </div>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="font-medium">{formatCurrency(budget, currency)}</div>
            <div className="text-xs text-gray-500">Budget</div>
          </div>
        </div>
        
        <div className="mb-3">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-600">Campaign progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        {platformsList.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {platformsList.map((platform) => (
              <Badge key={platform} variant="outline" className="bg-gray-100 text-gray-700">
                {platform}
              </Badge>
            ))}
          </div>
        )}
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full mt-2 flex justify-between"
          onClick={(e) => {
            e.stopPropagation();
            onClick(id);
          }}
        >
          <span>View Campaign</span>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
