
import React from 'react';
import { Creator } from '@/types/orders';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreatorCard from './CreatorCard';
import CreatorEmptyState from './CreatorEmptyState';
import { useCreatorInvitations } from '@/hooks/useCreatorInvitations';

interface CampaignCreatorsProps {
  creators: Creator[];
  orderId: string;
}

const CampaignCreators: React.FC<CampaignCreatorsProps> = ({ creators, orderId }) => {
  const navigate = useNavigate();
  const { handleInviteCreator, isLoading } = useCreatorInvitations();

  const handleFindMoreCreators = () => {
    // Navigate to creator search with the current campaign ID pre-selected
    navigate(`/brand/creator-search?campaign=${orderId}`);
  };

  // Create handlers with the campaign ID included
  const inviteCreatorToCampaign = (creatorId: string, creatorName: string) => {
    handleInviteCreator(creatorId, creatorName, orderId);
  };

  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium text-gray-900">Creators ({creators.length})</h3>
        <Button 
          size="sm" 
          variant="default" 
          className="flex items-center gap-1"
          onClick={handleFindMoreCreators}
        >
          <Search className="h-4 w-4 mr-1" />
          Find creators
        </Button>
      </div>
      
      <div className="space-y-3">
        {creators.length > 0 ? (
          creators.map(creator => (
            <CreatorCard 
              key={creator.id} 
              creator={creator} 
              onInviteCreator={inviteCreatorToCampaign}
              isLoading={isLoading}
            />
          ))
        ) : (
          <CreatorEmptyState onFindCreators={handleFindMoreCreators} />
        )}
      </div>
    </div>
  );
};

export default CampaignCreators;
