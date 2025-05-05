
import React from 'react';
import { Button } from '@/components/ui/button';
import { UserPlus, Search } from 'lucide-react';

interface CreatorEmptyStateProps {
  onFindCreators: () => void;
}

const CreatorEmptyState: React.FC<CreatorEmptyStateProps> = ({ onFindCreators }) => {
  return (
    <div className="text-center py-6 bg-gray-50 rounded-lg border border-dashed">
      <UserPlus className="h-12 w-12 mx-auto text-gray-300 mb-2" />
      <p className="text-gray-500 mb-4">No creators assigned to this campaign yet</p>
      <Button 
        variant="default" 
        size="sm" 
        className="mx-auto"
        onClick={onFindCreators}
      >
        <Search className="h-4 w-4 mr-1" />
        Search for creators
      </Button>
    </div>
  );
};

export default CreatorEmptyState;
