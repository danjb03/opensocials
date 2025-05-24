
import { CampaignRow, type CampaignRow as CampaignRowType } from './CampaignRow';

interface CampaignListProps {
  campaigns: CampaignRowType[];
  onViewProject: (projectId: string) => void;
}

export function CampaignList({ campaigns, onViewProject }: CampaignListProps) {
  console.log('CampaignList rendering with campaigns:', campaigns);
  
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No campaigns found</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {campaigns.map((campaign) => (
        <CampaignRow 
          key={campaign.project_id}
          campaign={campaign}
          onViewProject={onViewProject}
        />
      ))}
    </div>
  );
}
