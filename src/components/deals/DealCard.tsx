
import React from 'react';
import { CalendarDays, Clock, Target, ListChecks, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { formatDistanceToNow } from 'date-fns';

interface Deal {
  id: string;
  title: string;
  description: string | null;
  value: number;
  status: string;
  feedback: string | null;
  creator_id: string;
  brand_id: string;
  created_at: string | null;
  updated_at: string | null;
  deadline?: string | null;
  project_brief?: string | null;
  campaign_goals?: string | null;
  target_audience?: string | null;
  deliverables?: string[] | null;
  profiles: {
    company_name: string;
    logo_url?: string;
  };
}

interface DealCardProps {
  deal: Deal;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onViewDetails: () => void;
}

const DealCard: React.FC<DealCardProps> = ({ 
  deal, 
  isExpanded,
  onToggleExpand,
  onViewDetails
}) => {
  const deadline = deal.deadline ? new Date(deal.deadline) : null;
  const today = new Date();
  const daysLeft = deadline 
    ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;
  
  const getTimeUrgencyColor = () => {
    if (daysLeft === null) return 'text-muted-foreground';
    if (daysLeft <= 1) return 'text-red-500';
    if (daysLeft <= 3) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const getBorderColor = () => {
    if (daysLeft === null) return 'border-gray-200';
    if (daysLeft <= 1) return 'border-red-200';
    if (daysLeft <= 3) return 'border-amber-200';
    return 'border-gray-200';
  };

  const formatTimeLeft = () => {
    if (daysLeft === null) return 'No deadline';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    if (daysLeft < 0) return 'Expired';
    return `${daysLeft} days left`;
  };

  const createdDate = deal.created_at ? new Date(deal.created_at) : null;
  const formattedCreatedDate = createdDate ? formatDistanceToNow(createdDate, { addSuffix: true }) : 'Unknown date';

  return (
    <Card className={`transition-all duration-300 ${getBorderColor()} hover:shadow-md`}>
      <CardHeader 
        className="py-4 cursor-pointer flex flex-row items-center justify-between"
        onClick={onToggleExpand}
      >
        <div className="flex items-center gap-3 flex-1">
          {deal.profiles.logo_url ? (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
              <img 
                src={deal.profiles.logo_url} 
                alt={deal.profiles.company_name}
                className="w-full h-full object-cover" 
              />
            </div>
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
              <span className="font-medium text-gray-500">
                {deal.profiles.company_name.charAt(0)}
              </span>
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{deal.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{deal.profiles.company_name}</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="text-right mr-4">
            <p className="font-bold">${deal.value.toLocaleString()}</p>
            <p className={`text-sm flex items-center gap-1 ${getTimeUrgencyColor()}`}>
              <Clock className="h-3.5 w-3.5" />
              {formatTimeLeft()}
            </p>
          </div>
          {isExpanded ? (
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          )}
        </div>
      </CardHeader>
      
      {isExpanded && (
        <>
          <CardContent className="pt-0 pb-2">
            <div className="space-y-4 border-t border-gray-100 pt-4">
              {deal.project_brief && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <ListChecks className="h-4 w-4" /> Project Brief
                  </h4>
                  <p className="text-sm text-muted-foreground">{deal.project_brief}</p>
                </div>
              )}
              
              {deal.campaign_goals && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Target className="h-4 w-4" /> Campaign Goals
                  </h4>
                  <p className="text-sm text-muted-foreground">{deal.campaign_goals}</p>
                </div>
              )}
              
              {deal.target_audience && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <Users className="h-4 w-4" /> Target Audience
                  </h4>
                  <p className="text-sm text-muted-foreground">{deal.target_audience}</p>
                </div>
              )}
              
              {deal.deliverables && deal.deliverables.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium flex items-center gap-2 mb-1">
                    <ListChecks className="h-4 w-4" /> Deliverables
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {deal.deliverables.map((item, idx) => (
                      <Badge key={idx} variant="secondary">{item}</Badge>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4 inline mr-1.5" />
                Received {formattedCreatedDate}
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-end gap-2 pt-0 pb-4">
            <button 
              onClick={onViewDetails}
              className="text-sm font-medium text-primary hover:underline"
            >
              View details and respond
            </button>
          </CardFooter>
        </>
      )}
    </Card>
  );
};

export default DealCard;
