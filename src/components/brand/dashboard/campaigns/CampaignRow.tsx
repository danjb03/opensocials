
import { format } from 'date-fns';
import { CalendarRange, Wallet, ChevronRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CampaignRowProps {
  campaign: CampaignRow;
  onViewProject: (projectId: string) => void;
}

export type CampaignRow = {
  project_id: string;
  project_name: string;
  project_status: string;
  start_date: string | null;
  end_date: string | null;
  budget: number;
  currency: string;
  deal_id: string | null;
  deal_status: string | null;
  deal_value: number | null;
  creator_name: string | null;
  avatar_url: string | null;
  engagement_rate: string | null;
  primary_platform: string | null;
};

export function CampaignRow({ campaign, onViewProject }: CampaignRowProps) {
  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'live':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'active':
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'paused':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCurrencySymbol = (currency: string) => {
    return currency === 'GBP' ? '£' : '$';
  };

  return (
    <div key={campaign.project_id} className="p-4 hover:bg-slate-50 transition-colors">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <div className="flex items-center mb-1">
            <h3 className="font-semibold text-lg text-slate-800">{campaign.project_name}</h3>
            <Badge 
              variant="outline" 
              className={`ml-2 capitalize text-xs font-medium ${getStatusColor(campaign.project_status)}`}
            >
              {campaign.project_status.replace(/_/g, ' ')}
            </Badge>
          </div>
          
          <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
            <div className="flex items-center text-sm text-slate-500">
              <CalendarRange className="h-4 w-4 mr-1.5 text-slate-400" />
              <span>
                {campaign.start_date ? format(new Date(campaign.start_date), 'MMM d') : '—'} → {campaign.end_date ? format(new Date(campaign.end_date), 'MMM d, yyyy') : '—'}
              </span>
            </div>
            
            <div className="flex items-center text-sm text-slate-500">
              <Wallet className="h-4 w-4 mr-1.5 text-slate-400" />
              <span>{getCurrencySymbol(campaign.currency)}{campaign.budget.toLocaleString()}</span>
            </div>
            
            {campaign.creator_name && (
              <div className="flex items-center text-sm text-slate-500">
                <span className="flex items-center">
                  {campaign.avatar_url ? (
                    <img 
                      src={campaign.avatar_url} 
                      alt={campaign.creator_name} 
                      className="h-5 w-5 rounded-full mr-1.5"
                    />
                  ) : (
                    <div className="h-5 w-5 rounded-full bg-slate-200 mr-1.5"></div>
                  )}
                  {campaign.creator_name}
                  {campaign.engagement_rate && <span className="ml-1 text-xs text-slate-400">({campaign.engagement_rate} ER)</span>}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2 self-start md:self-center">
          <Button 
            onClick={() => onViewProject(campaign.project_id)}
            size="sm"
            className="text-xs"
          >
            View
            <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
