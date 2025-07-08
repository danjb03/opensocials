import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PricingValidationInput } from '@/components/brand/pricing/PricingValidationInput';
import { PricingRejectionModal } from './PricingRejectionModal';
import { useCreatorTier } from '@/hooks/useCreatorTier';
import { useUnifiedAuth } from '@/lib/auth/useUnifiedAuth';
import { validateOfferAmount } from '@/utils/tierPricing';
import { parsePricingError, isPricingError, PricingError } from '@/utils/pricingErrors';
import { toast } from 'sonner';

interface OfferData {
  id: string;
  campaignType: string;
  amount: number;
  description: string;
  creatorId: string;
}

interface EditOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  offer: OfferData | null;
  onOfferUpdated?: () => void;
}

const CAMPAIGN_TYPES = ['Single', 'Weekly', 'Monthly', '12-Month Retainer', 'Evergreen'];

export const EditOfferModal: React.FC<EditOfferModalProps> = ({
  isOpen,
  onClose,
  offer,
  onOfferUpdated
}) => {
  const [campaignType, setCampaignType] = useState<string>('Single');
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [isAdminOverride, setIsAdminOverride] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPricingRejection, setShowPricingRejection] = useState<boolean>(false);
  const [pricingError, setPricingError] = useState<PricingError | null>(null);

  const { user, role } = useUnifiedAuth();
  const { data: creatorTier, isLoading: isTierLoading } = useCreatorTier(offer?.creatorId || null);
  
  const isAdmin = role === 'admin' || role === 'super_admin';

  // Load offer data when modal opens
  useEffect(() => {
    if (isOpen && offer) {
      setCampaignType(offer.campaignType);
      setOfferAmount(offer.amount);
      setDescription(offer.description || '');
      setIsAdminOverride(false);
      setShowPricingRejection(false);
      setPricingError(null);
    } else if (!isOpen) {
      // Reset form when modal closes
      setCampaignType('Single');
      setOfferAmount(0);
      setDescription('');
      setIsAdminOverride(false);
      setShowPricingRejection(false);
      setPricingError(null);
    }
  }, [isOpen, offer]);

  // Recalculate validation when campaign type or tier changes
  const validation = creatorTier ? 
    validateOfferAmount(offerAmount, creatorTier, campaignType, isAdminOverride) : 
    { isValid: true };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!offer || !creatorTier) {
      toast.error('Offer or creator tier information is not available');
      return;
    }

    if (!validation.isValid) {
      toast.error('Please correct the offer amount before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual offer update API call
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Offer updated successfully');
      onOfferUpdated?.();
      onClose();
    } catch (error: any) {
      console.error('Error updating offer:', error);
      
      const errorMessage = error?.message || error?.toString() || '';
      
      if (isPricingError(errorMessage)) {
        const parsedError = parsePricingError(errorMessage);
        setPricingError(parsedError);
        setShowPricingRejection(true);
      } else {
        toast.error('Failed to update offer');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminOverrideChange = (checked: boolean | 'indeterminate') => {
    setIsAdminOverride(checked === true);
  };

  const handleUpdateOffer = () => {
    setShowPricingRejection(false);
    // Pre-fill with minimum price if available
    if (pricingError?.minPrice) {
      setOfferAmount(pricingError.minPrice);
    }
  };

  const handleClosePricingRejection = () => {
    setShowPricingRejection(false);
    setPricingError(null);
  };

  const canSubmit = validation.isValid && offerAmount > 0 && campaignType && !isSubmitting && !isTierLoading;

  if (!offer) return null;

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Offer</DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="campaign-type" className="text-sm font-medium text-foreground">
                Campaign Type *
              </Label>
              <Select value={campaignType} onValueChange={setCampaignType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select campaign type" />
                </SelectTrigger>
                <SelectContent>
                  {CAMPAIGN_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {creatorTier && (
              <PricingValidationInput
                value={offerAmount}
                onChange={setOfferAmount}
                creatorTier={creatorTier}
                campaignType={campaignType}
                isAdminOverride={isAdminOverride}
              />
            )}

            {isTierLoading && (
              <div className="text-sm text-muted-foreground">Loading creator tier information...</div>
            )}

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-foreground">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the campaign requirements..."
                rows={3}
              />
            </div>

            {isAdmin && (
              <div className="flex items-center space-x-2 p-3 bg-muted rounded-lg">
                <Checkbox 
                  id="admin-override"
                  checked={isAdminOverride}
                  onCheckedChange={handleAdminOverrideChange}
                />
                <Label htmlFor="admin-override" className="text-sm text-muted-foreground">
                  Admin Override (bypass minimum pricing)
                </Label>
              </div>
            )}

            <div className="flex gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={!canSubmit}
                className="flex-1"
              >
                {isSubmitting ? 'Updating...' : 'Update Offer'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <PricingRejectionModal
        isOpen={showPricingRejection}
        onClose={handleClosePricingRejection}
        onUpdateOffer={handleUpdateOffer}
        pricingError={pricingError}
      />
    </>
  );
};
