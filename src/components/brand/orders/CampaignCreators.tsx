
import React from 'react';
import { Creator } from '@/types/orders';
import CreatorCard from './CreatorCard';

interface CampaignCreatorsProps {
  creators: Creator[];
}

const CampaignCreators: React.FC<CampaignCreatorsProps> = ({ creators }) => {
  return (
    <div>
      <h3 className="font-medium text-gray-900 mb-3">Creators ({creators.length})</h3>
      <div className="space-y-3">
        {creators.length > 0 ? (
          creators.map(creator => (
            <CreatorCard key={creator.id} creator={creator} />
          ))
        ) : (
          <p className="text-gray-500 text-center py-6 bg-gray-50 rounded-md">
            No creators assigned to this campaign yet
          </p>
        )}
      </div>
    </div>
  );
};

export default CampaignCreators;
