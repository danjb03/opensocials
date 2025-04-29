
import React from 'react';
import { Button } from '@/components/ui/button';

type SelectedCreatorsBarProps = {
  selectedCreators: number[];
  onAddToCart: () => void;
};

export const SelectedCreatorsBar = ({ selectedCreators, onAddToCart }: SelectedCreatorsBarProps) => {
  if (selectedCreators.length === 0) {
    return null;
  }
  
  return (
    <div className="bg-white mb-6 p-4 rounded-lg border shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <span className="font-medium">
            {selectedCreators.length} creator{selectedCreators.length !== 1 ? 's' : ''} selected
          </span>
        </div>
        <Button onClick={onAddToCart}>
          Work with Creators
        </Button>
      </div>
    </div>
  );
};
