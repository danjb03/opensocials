
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
      className="hover:shadow-lg transition-all cursor-pointer overflow-hidden rounded-xl border border-border hover:border-primary/20"
      onClick={() => onClick(id)}
    >
      <div className="absolute top-0 left-0 w-2 h-full bg-primary" />
      <CardContent className="p-5">
        <div className="flex flex-col gap-4">
          {/* Header section with title and budget */}
          <div className="flex justify-between items-start">
            <h3 className="font-bold text-xl text-foreground truncate max-w-[70%]">{title}</h3>
            <div className="text-right">
              <div className="font-bold text-xl text-foreground">{formatCurrency(budget, currency)}</div>
              <div className="text-xs text-foreground/60 mt-1">Budget</div>
            </div>
          </div>
          
          {/* Status and info section */}
          <div className="flex flex-wrap items-center gap-3">
            <Badge variant="outline" className="bg-primary/10 text-foreground border-primary/20 font-medium px-3 py-1">
              {orderStageLabels[stage]}
            </Badge>
            
            {/* Creator count */}
            <div className="flex items-center text-sm text-foreground/80">
              <Users className="h-4 w-4 mr-1.5 text-foreground/60" />
              <span className="whitespace-nowrap">
                {acceptedCreators}/{creators.length} creators
              </span>
            </div>
            
            {/* Due date */}
            {dueDate && (
              <div className="flex items-center text-sm text-foreground/80">
                <Calendar className="h-4 w-4 mr-1.5 text-foreground/60" />
                <span className="whitespace-nowrap">Due {new Date(dueDate).toLocaleDateString()}</span>
              </div>
            )}
          </div>
          
          {/* Progress section */}
          <div className="mt-1">
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-foreground/80">Campaign progress</span>
              <span className="font-medium text-foreground">{progress}%</span>
            </div>
            <Progress value={progress} className="h-2.5" />
          </div>
          
          {/* Platforms section */}
          {platformsList.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-1">
              {platformsList.map((platform) => (
                <Badge key={platform} variant="outline" className="bg-muted text-foreground border-border rounded-full">
                  {platform}
                </Badge>
              ))}
            </div>
          )}
          
          {/* View campaign button */}
          <Button 
            variant="outline" 
            size="sm" 
            className="w-full mt-2 flex justify-between items-center bg-card hover:bg-muted rounded-lg border-border hover:border-primary/30 shadow-sm text-foreground"
            onClick={(e) => {
              e.stopPropagation();
              onClick(id);
            }}
          >
            <span className="font-medium">View Campaign</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignCard;
