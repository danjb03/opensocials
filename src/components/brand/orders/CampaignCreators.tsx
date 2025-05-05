
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
  const { handleNotifyCreator, handleInviteCreator, isLoading } = useCreatorInvitations();

  const handleFindMoreCreators = () => {
    // Navigate to creator search with the current campaign ID pre-selected
    navigate(`/brand/creator-search?campaign=${orderId}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h3 className="font-medium text-gray-900">Creators ({creators.length})</h3>
        <Button 
          size="sm" 
          variant="default" 
          className="flex items-center gap-1"
          onClick={handleFindMoreCreators}
        >
          <Search className="h-4 w-4 mr-1" />
          Search for more creators
        </Button>
      </div>
      
      <div className="space-y-3">
        {creators.length > 0 ? (
          creators.map(creator => (
            <CreatorCard 
              key={creator.id} 
              creator={creator} 
              onNotifyInterest={handleNotifyCreator}
              onInviteCreator={handleInviteCreator}
              showInviteButton={creator.status !== 'accepted' && creator.status !== 'declined' && creator.status !== 'completed'}
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
