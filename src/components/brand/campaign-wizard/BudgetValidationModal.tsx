
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface BudgetValidationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateOffer: () => void;
  creatorName?: string;
  tier: string;
  campaignType: string;
  minPrice: number;
  currentOffer: number;
}

export const BudgetValidationModal: React.FC<BudgetValidationModalProps> = ({
  isOpen,
  onClose,
  onUpdateOffer,
  creatorName,
  tier,
  campaignType,
  minPrice,
  currentOffer
}) => {
  const formatPrice = (price: number) => `£${price.toLocaleString()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <div>
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Offer too low for this creator
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {creatorName ? `${creatorName}'s` : 'This creator\'s'} tier ({tier}) requires a minimum of{' '}
              <span className="font-medium text-foreground">
                {formatPrice(minPrice)}
              </span>{' '}
              for a{' '}
              <span className="font-medium text-foreground">
                {campaignType}
              </span>{' '}
              campaign. Your offer is{' '}
              <span className="font-medium text-foreground">
                {formatPrice(currentOffer)}
              </span>.
            </p>

            <div className="flex gap-2 pt-2">
              <Button 
                type="button" 
                variant="outline" 
                onClick={onClose} 
                className="flex-1"
              >
                Cancel
              </Button>
              <Button 
                onClick={onUpdateOffer}
                className="flex-1"
              >
                Update Offer
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
