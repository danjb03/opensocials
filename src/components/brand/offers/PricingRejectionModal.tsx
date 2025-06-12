
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { PricingError } from '@/utils/pricingErrors';

interface PricingRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpdateOffer: () => void;
  pricingError: PricingError | null;
}

export const PricingRejectionModal: React.FC<PricingRejectionModalProps> = ({
  isOpen,
  onClose,
  onUpdateOffer,
  pricingError
}) => {
  const formatPrice = (price: number) => `£${price.toLocaleString()}`;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-foreground">Your offer was too low</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground leading-relaxed">
            {pricingError ? (
              <>
                This creator's pricing tier requires a minimum of{' '}
                <span className="font-medium text-foreground">
                  {formatPrice(pricingError.minPrice)}
                </span>{' '}
                for a{' '}
                <span className="font-medium text-foreground">
                  {pricingError.campaignType}
                </span>{' '}
                campaign. Most brands offer at or above this level to secure top talent.
              </>
            ) : (
              'This creator requires a higher minimum offer for this campaign type. Please adjust your offer to meet their pricing requirements.'
            )}
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
      </DialogContent>
    </Dialog>
  );
};
