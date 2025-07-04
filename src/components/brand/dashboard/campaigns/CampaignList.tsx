
import React, { memo } from 'react';
import { CampaignRow, type Campaign } from './CampaignRow';
import { useIsMobile } from '@/hooks/use-mobile';
import { VirtualList } from '@/components/ui/virtual-list';
import { EmptyState } from '@/components/ui/empty-state';
import { Package } from 'lucide-react';

interface CampaignListProps {
  campaigns: Campaign[];
  onViewProject: (projectId: string) => void;
}

const CampaignListMemo = memo(({ campaigns, onViewProject }: CampaignListProps) => {
  const isMobile = useIsMobile();
  console.log('CampaignList rendering with campaigns:', campaigns);
  
  if (!campaigns || campaigns.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No campaigns found"
        description="You haven't created any campaigns yet. Start by creating your first campaign to connect with creators."
        action={{
          label: "Create Campaign",
          onClick: () => window.location.href = '/brand/create-campaign'
        }}
      />
    );
  }

  const renderCampaignItem = (campaign: Campaign, index: number) => (
    <div 
      className="animate-fade-in border-b border-border last:border-b-0"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <CampaignRow 
        campaign={campaign}
      />
    </div>
  );

  // Use virtual scrolling for large lists
  if (campaigns.length > 20 && !isMobile) {
    return (
      <VirtualList
        items={campaigns}
        itemHeight={isMobile ? 180 : 120}
        containerHeight={600}
        renderItem={renderCampaignItem}
        className="border border-border rounded-lg"
      />
    );
  }

  return (
    <div className={`${isMobile ? 'space-y-4 p-4' : 'divide-y divide-border'} border border-border rounded-lg overflow-hidden`}>
      {campaigns.map((campaign, index) => (
        <div key={campaign.id}>
          {renderCampaignItem(campaign, index)}
        </div>
      ))}
    </div>
  );
});

CampaignListMemo.displayName = 'CampaignList';

export { CampaignListMemo as CampaignList };
