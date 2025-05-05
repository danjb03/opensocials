
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
      className="hover:shadow-md transition-all cursor-pointer border-l-4 border-l-blue-500 overflow-hidden"
      onClick={() => onClick(id)}
    >
      <CardContent className="p-4">
        <div className="flex flex-col gap-3">
          {/* Header section with title and budget */}
          <div className="flex justify-between items-start">
            <h3 className="font-semibold text-lg text-gray-900 truncate max-w-[70%]">{title}</h3>
            <div className="text-right">
              <div className="font-medium text-gray-900">{formatCurrency(budget, currency)}</div>
              <div className="text-xs text-gray-500">Budget</div>
            </div>
          </div>
          
          {/* Status badge */}
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {orderStageLabels[stage]}
            </Badge>
            
            {/* Creator count */}
            <div className="flex items-center text-sm text-gray-600">
              <Users className="h-3.5 w-3.5 mr-1" />
              <span className="whitespace-nowrap">
                {acceptedCreators}/{creators.length} creators
              </span>
            </div>
            
            {/* Due date */}
            {dueDate && (
              <div className="flex items-center text-sm text-gray-600">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                <span className="whitespace-nowrap">Due {new Date(dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {/* Progress section */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-gray-600">Campaign progress</span>
              <span className="font-medium">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Platforms section */}
          {platformsList.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-1">
              {platformsList.map((platform) => (
                <Badge key={platform} variant="outline" className="bg-gray-100 text-gray-700 border-gray-200">
                  {platform}
                </Badge>
              ))}
            </div>
          )}
          
          {/* View campaign button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-1 flex justify-between items-center bg-white hover:bg-gray-50"
            onClick={(e) => {
              e.stopPropagation();
              onClick(id);
            }}
          >
            <span>View Campaign</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
