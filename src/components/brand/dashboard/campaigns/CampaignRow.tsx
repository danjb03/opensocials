
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
}

export function CampaignRow({ campaign, onViewProject }: CampaignRowProps) {
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

  return (
    <div className="p-4 hover:bg-gray-50 transition-colors cursor-pointer" onClick={handleViewClick}>
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-lg text-gray-900">{campaign.project_name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(campaign.project_status)}`}>
              {campaign.project_status.replace('_', ' ').toUpperCase()}
            </span>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
            <div>
              <span className="font-medium">Budget:</span> {formatCurrency(campaign.budget, campaign.currency)}
            </div>
            <div>
              <span className="font-medium">Start:</span> {formatDate(campaign.start_date)}
            </div>
            <div>
              <span className="font-medium">End:</span> {formatDate(campaign.end_date)}
            </div>
          </div>
          
          {campaign.creator_name && (
            <div className="mt-2 text-sm text-gray-600">
              <span className="font-medium">Creator:</span> {campaign.creator_name}
            </div>
          )}
        </div>
        
        <div className="flex items-center">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleViewClick();
            }}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
}
