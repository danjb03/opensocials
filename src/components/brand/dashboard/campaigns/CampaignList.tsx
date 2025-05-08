
import { CampaignRow, type CampaignRow as CampaignRowType } from './CampaignRow';

interface CampaignListProps {
  campaigns: CampaignRowType[];
  onViewProject: (projectId: string) => void;
}

export function CampaignList({ campaigns, onViewProject }: CampaignListProps) {
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
