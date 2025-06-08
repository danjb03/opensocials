
export interface CampaignRow {
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
}

interface CampaignRowProps {
  campaign: CampaignRow;
  onViewProject: (projectId: string) => void;
  isMobile?: boolean;
}

export function CampaignRow({ campaign, onViewProject, isMobile = false }: CampaignRowProps) {
  console.log('Rendering campaign row:', campaign);
  
  const handleViewClick = () => {
    console.log('Viewing project:', campaign.project_id);
    onViewProject(campaign.project_id);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Not set';
    return new Date(dateString).toLocaleDateString();
  };

  if (isMobile) {
    return (
      <div className="bg-card border rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02]">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg text-foreground truncate">{campaign.project_name}</h3>
            <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full mt-1 ${getStatusColor(campaign.project_status)}`}>
              {campaign.project_status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
        </div>
        
        <div className="space-y-2 text-sm text-muted-foreground mb-4">
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Budget:</span>
            <span className="font-semibold text-foreground">{formatCurrency(campaign.budget, campaign.currency)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">Start:</span>
            <span>{formatDate(campaign.start_date)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="font-medium text-foreground">End:</span>
            <span>{formatDate(campaign.end_date)}</span>
          </div>
          {campaign.creator_name && (
            <div className="flex items-center justify-between">
              <span className="font-medium text-foreground">Creator:</span>
              <span className="truncate ml-2">{campaign.creator_name}</span>
            </div>
          )}
        </div>
        
        <button
          onClick={handleViewClick}
          className="w-full bg-primary text-primary-foreground py-3 rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
        >
          View Details
        </button>
      </div>
    );
  }

  return (
    <div className="p-4 hover:bg-muted/50 transition-colors cursor-pointer" onClick={handleViewClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-foreground">{campaign.project_name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.project_status)}`}>
              {campaign.project_status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-muted-foreground">
            <div>
              <span className="font-medium text-foreground">Budget:</span> {formatCurrency(campaign.budget, campaign.currency)}
            </div>
            <div>
              <span className="font-medium text-foreground">Start:</span> {formatDate(campaign.start_date)}
            </div>
            <div>
              <span className="font-medium text-foreground">End:</span> {formatDate(campaign.end_date)}
            </div>
          </div>
          
          {campaign.creator_name && (
            <div className="mt-2 text-sm text-muted-foreground">
              <span className="font-medium text-foreground">Creator:</span> {campaign.creator_name}
            </div>
          )}
        </div>
        
        <div className="flex items-center ml-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewClick();
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
