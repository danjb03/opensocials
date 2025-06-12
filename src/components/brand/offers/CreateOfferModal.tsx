
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { PricingValidationInput } from '@/components/brand/pricing/PricingValidationInput';
import { useCreatorTier } from '@/hooks/useCreatorTier';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { validateOfferAmount } from '@/utils/tierPricing';
import { toast } from 'sonner';

interface CreateOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  creatorId: string;
  onOfferCreated?: () => void;
}

const CAMPAIGN_TYPES = ['Single', 'Weekly', 'Monthly', '12-Month Retainer', 'Evergreen'];

export const CreateOfferModal: React.FC<CreateOfferModalProps> = ({
  isOpen,
  onClose,
  creatorId,
  onOfferCreated
}) => {
  const [campaignType, setCampaignType] = useState<string>('Single');
  const [offerAmount, setOfferAmount] = useState<number>(0);
  const [description, setDescription] = useState<string>('');
  const [isAdminOverride, setIsAdminOverride] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const { user, role } = useUnifiedAuth();
  const { data: creatorTier, isLoading: isTierLoading } = useCreatorTier(creatorId);
  
  const isAdmin = role === 'admin' || role === 'super_admin';

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setCampaignType('Single');
      setOfferAmount(0);
      setDescription('');
      setIsAdminOverride(false);
    }
  }, [isOpen]);

  // Recalculate validation when campaign type or tier changes
  const validation = creatorTier ? 
    validateOfferAmount(offerAmount, creatorTier, campaignType, isAdminOverride) : 
    { isValid: true };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!creatorTier) {
      toast.error('Creator tier information is not available');
      return;
    }

    if (!validation.isValid) {
      toast.error('Please correct the offer amount before submitting');
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Here you would implement the actual offer creation API call
      // For now, just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Offer created successfully');
      onOfferCreated?.();
      onClose();
    } catch (error) {
      console.error('Error creating offer:', error);
      toast.error('Failed to create offer');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdminOverrideChange = (checked: boolean | 'indeterminate') => {
    setIsAdminOverride(checked === true);
  };

  const canSubmit = validation.isValid && offerAmount > 0 && campaignType && !isSubmitting && !isTierLoading;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Offer</DialogTitle>
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
              {isSubmitting ? 'Creating...' : 'Create Offer'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
