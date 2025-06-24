
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ChevronRight, Users, Calendar, DollarSign } from 'lucide-react';
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
      className="hover:shadow-lg transition-all duration-200 cursor-pointer overflow-hidden border-border hover:border-primary/20 bg-card group"
      onClick={() => onClick(id)}
    >
      <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary/60" />
      <CardContent className="p-6 pl-8">
        <div className="space-y-4">
          {/* Header section */}
          <div className="space-y-2">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-lg text-foreground truncate flex-1 pr-2">{title}</h3>
              <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20 font-medium px-2 py-1 text-xs">
                {orderStageLabels[stage]}
              </Badge>
            </div>
            
            {/* Budget display */}
            <div className="flex items-center text-muted-foreground">
              <DollarSign className="h-4 w-4 mr-1" />
              <span className="font-semibold text-foreground">{formatCurrency(budget, currency)}</span>
              <span className="ml-1 text-sm">budget</span>
            </div>
          </div>
          
          {/* Stats section */}
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center">
              <Users className="h-4 w-4 mr-1.5" />
              <span>{acceptedCreators}/{creators.length} creators</span>
            </div>
            
            {dueDate && (
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" />
                <span>Due {new Date(dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {/* Progress section */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>
          
          {/* Platforms section */}
          {platformsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {platformsList.slice(0, 3).map((platform) => (
                <Badge key={platform} variant="secondary" className="text-xs py-1 px-2 rounded-full">
                  {platform}
                </Badge>
              ))}
              {platformsList.length > 3 && (
                <Badge variant="secondary" className="text-xs py-1 px-2 rounded-full">
                  +{platformsList.length - 3} more
                </Badge>
              )}
            </div>
          )}
          
          {/* Action button */}
          <Button 
            variant="ghost" 
            size="sm" 
            className="w-full justify-between mt-4 group-hover:bg-muted/50 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onClick(id);
            }}
          >
            <span className="font-medium">View Details</span>
            <ChevronRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
