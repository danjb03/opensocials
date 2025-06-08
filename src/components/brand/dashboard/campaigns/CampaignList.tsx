
import { CampaignRow, type CampaignRow as CampaignRowType } from './CampaignRow';
import { useIsMobile } from '@/hooks/use-mobile';

interface CampaignListProps {
  campaigns: CampaignRowType[];
  onViewProject: (projectId: string) => void;
}

export function CampaignList({ campaigns, onViewProject }: CampaignListProps) {
  const isMobile = useIsMobile();
  console.log('CampaignList rendering with campaigns:', campaigns);
  
  if (!campaigns || campaigns.length === 0) {
    return (
      <div className="p-6 text-center text-gray-500">
        <p>No campaigns found</p>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? 'space-y-4 p-4' : 'divide-y divide-slate-100'}`}>
      {campaigns.map((campaign, index) => (
        <div 
          key={campaign.project_id}
          className="animate-fade-in"
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <CampaignRow 
            campaign={campaign}
            onViewProject={onViewProject}
            isMobile={isMobile}
          />
        </div>
      ))}
    </div>
  );
}
