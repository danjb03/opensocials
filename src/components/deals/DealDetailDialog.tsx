
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { CalendarDays, Clock, Target, ListChecks, Users, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
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

interface DealDetailDialogProps {
  deal: Deal | null;
  isOpen: boolean;
  onClose: () => void;
  onAccept: (dealId: string) => void;
  onDecline: (dealId: string, feedback: string) => void;
  isLoading: boolean;
}

const DealDetailDialog: React.FC<DealDetailDialogProps> = ({
  deal,
  isOpen,
  onClose,
  onAccept,
  onDecline,
  isLoading
}) => {
  const [feedback, setFeedback] = useState('');

  if (!deal) return null;

  const deadline = deal.deadline ? new Date(deal.deadline) : null;
  const today = new Date();
  const daysLeft = deadline 
    ? Math.ceil((deadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    : null;

  const formatTimeLeft = () => {
    if (daysLeft === null) return 'No deadline';
    if (daysLeft === 0) return 'Due today';
    if (daysLeft === 1) return 'Due tomorrow';
    if (daysLeft < 0) return 'Expired';
    return `${daysLeft} days left to decide`;
  };

  const getTimeUrgencyColor = () => {
    if (daysLeft === null) return 'text-muted-foreground';
    if (daysLeft <= 1) return 'text-red-500';
    if (daysLeft <= 3) return 'text-amber-500';
    return 'text-emerald-500';
  };

  const createdDate = deal.created_at ? new Date(deal.created_at) : null;
  const formattedCreatedDate = createdDate ? formatDistanceToNow(createdDate, { addSuffix: true }) : 'Unknown date';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center gap-4">
            {deal.profiles.logo_url ? (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden border border-gray-200">
                <img 
                  src={deal.profiles.logo_url} 
                  alt={deal.profiles.company_name}
                  className="w-full h-full object-cover" 
                />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                <span className="font-medium text-gray-500 text-lg">
                  {deal.profiles.company_name.charAt(0)}
                </span>
              </div>
            )}
            <div>
              <DialogTitle className="text-xl mb-1">{deal.title}</DialogTitle>
              <p className="text-muted-foreground">{deal.profiles.company_name}</p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 my-4">
          <div className="bg-muted/50 rounded-lg p-4 flex gap-3 items-center">
            <div className="bg-primary/10 p-2 rounded-full">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Offer Value</p>
              <p className="text-lg font-semibold">${deal.value.toLocaleString()}</p>
            </div>
          </div>
          
          <div className="bg-muted/50 rounded-lg p-4 flex gap-3 items-center">
            <div className={`p-2 rounded-full ${
              daysLeft !== null && daysLeft <= 1 ? 'bg-red-100' : 
              daysLeft !== null && daysLeft <= 3 ? 'bg-amber-100' : 
              'bg-emerald-100'
            }`}>
              <Clock className={`h-5 w-5 ${
                daysLeft !== null && daysLeft <= 1 ? 'text-red-600' : 
                daysLeft !== null && daysLeft <= 3 ? 'text-amber-600' : 
                'text-emerald-600'
              }`} />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Left</p>
              <p className={`text-base font-medium ${getTimeUrgencyColor()}`}>{formatTimeLeft()}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {deal.description && (
            <div>
              <h3 className="text-base font-medium mb-1">Description</h3>
              <p className="text-sm text-muted-foreground">{deal.description}</p>
            </div>
          )}

          {deal.project_brief && (
            <div>
              <h3 className="text-base font-medium flex items-center gap-2 mb-1">
                <ListChecks className="h-4 w-4" /> Project Brief
              </h3>
              <p className="text-sm text-muted-foreground">{deal.project_brief}</p>
            </div>
          )}
          
          {deal.campaign_goals && (
            <div>
              <h3 className="text-base font-medium flex items-center gap-2 mb-1">
                <Target className="h-4 w-4" /> Campaign Goals
              </h3>
              <p className="text-sm text-muted-foreground">{deal.campaign_goals}</p>
            </div>
          )}
          
          {deal.target_audience && (
            <div>
              <h3 className="text-base font-medium flex items-center gap-2 mb-1">
                <Users className="h-4 w-4" /> Target Audience
              </h3>
              <p className="text-sm text-muted-foreground">{deal.target_audience}</p>
            </div>
          )}
          
          {deal.deliverables && deal.deliverables.length > 0 && (
            <div>
              <h3 className="text-base font-medium flex items-center gap-2 mb-1">
                <ListChecks className="h-4 w-4" /> Deliverables
              </h3>
              <div className="flex flex-wrap gap-2 mt-1">
                {deal.deliverables.map((item, idx) => (
                  <Badge key={idx} variant="secondary">{item}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <h3 className="text-base font-medium mb-2">Your Response</h3>
            <Textarea
              placeholder="Add any feedback or comments (required for declining)"
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              className="min-h-24"
            />
          </div>
        </div>

        <div className="mt-4 border-t pt-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            <CalendarDays className="h-4 w-4 inline mr-1.5" />
            Received {formattedCreatedDate}
          </div>

          <div className="flex items-center space-x-3">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => feedback ? onDecline(deal.id, feedback) : null}
              disabled={isLoading || !feedback}
            >
              <XCircle className="mr-1.5 h-4 w-4" />
              Decline Offer
            </Button>
            
            <Button
              onClick={() => onAccept(deal.id)}
              disabled={isLoading}
              size="sm"
            >
              <CheckCircle className="mr-1.5 h-4 w-4" />
              Accept Offer
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DealDetailDialog;
