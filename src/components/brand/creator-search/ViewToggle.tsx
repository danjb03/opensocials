
import React from 'react';
import { Button } from '@/components/ui/button';
import { Grid2x2, List } from 'lucide-react';

type ViewToggleProps = {
  viewMode: 'grid' | 'list';
  onViewChange: (mode: 'grid' | 'list') => void;
};

export const ViewToggle = ({ viewMode, onViewChange }: ViewToggleProps) => {
  return (
    <div className="flex items-center">
      <Button
        variant={viewMode === 'grid' ? 'default' : 'outline'}
        size="sm"
        className="mr-2"
        onClick={() => onViewChange('grid')}
      >
        <Grid2x2 className="h-4 w-4" />
      </Button>
      <Button
        variant={viewMode === 'list' ? 'default' : 'outline'}
        size="sm"
        onClick={() => onViewChange('list')}
      >
        <List className="h-4 w-4" />
      </Button>
    </div>
  );
};
