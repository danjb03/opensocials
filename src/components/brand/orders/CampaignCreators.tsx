
import React, { useState } from 'react';
import { Creator } from '@/types/orders';
import { Button } from '@/components/ui/button';
import { Search, Plus, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CreatorCard from './CreatorCard';
import CreatorEmptyState from './CreatorEmptyState';
import CreatorInviteSystem from '../campaign-wizard/CreatorInviteSystem';
import { useCreatorInvitationActions } from '@/hooks/useCreatorInvitationActions';
import { Separator } from '@/components/ui/separator';

interface CampaignCreatorsProps {
  creators: Creator[];
  orderId: string;
}

const CampaignCreators: React.FC<CampaignCreatorsProps> = ({ creators, orderId }) => {
  const navigate = useNavigate();
  const [showInviteSystem, setShowInviteSystem] = useState(false);
  const { handleInviteCreator, isLoading } = useCreatorInvitationActions();

  const handleFindMoreCreators = () => {
    // Navigate to creator search with the current campaign ID pre-selected
    navigate(`/brand/creator-search?campaign=${orderId}`);
  };

  // Create handlers with the campaign ID included
  const inviteCreatorToCampaign = (creatorId: string, creatorName: string) => {
    handleInviteCreator(creatorId, creatorName, orderId);
  };

  return (
    <div className="space-y-6">
      {/* Current Creators Section */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Current Creators ({creators.length})</h3>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant="outline" 
              className="flex items-center gap-1"
              onClick={handleFindMoreCreators}
            >
              <Search className="h-4 w-4" />
              Browse All
            </Button>
            <Button 
              size="sm" 
              variant="default" 
              className="flex items-center gap-1"
              onClick={() => setShowInviteSystem(!showInviteSystem)}
            >
              <Plus className="h-4 w-4" />
              Invite More
            </Button>
          </div>
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

      {/* Creator Invite System */}
      {showInviteSystem && (
        <>
          <Separator />
          <CreatorInviteSystem 
            projectId={orderId}
            remainingBudget={5000} // TODO: Calculate actual remaining budget
            currency="USD"
          />
        </>
      )}
    </div>
  );
};

export default CampaignCreators;
