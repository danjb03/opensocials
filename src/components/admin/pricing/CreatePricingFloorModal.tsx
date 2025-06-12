
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useCreatePricingFloor } from '@/hooks/admin/usePricingFloors';

interface CreatePricingFloorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CREATOR_TIERS = ['Nano', 'Micro', 'Mid', 'Macro', 'Large', 'Celebrity'];
const CAMPAIGN_TYPES = ['Single', 'Weekly', 'Monthly', '12-Month Retainer', 'Evergreen'];

export const CreatePricingFloorModal: React.FC<CreatePricingFloorModalProps> = ({
  isOpen,
  onClose
}) => {
  const [tier, setTier] = useState<string>('');
  const [campaignType, setCampaignType] = useState<string>('');
  const [minPrice, setMinPrice] = useState<string>('');

  const createMutation = useCreatePricingFloor();

  // Reset form when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setTier('');
      setCampaignType('');
      setMinPrice('');
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const numericPrice = parseFloat(minPrice);
    if (!tier || !campaignType || isNaN(numericPrice) || numericPrice < 0) {
      return;
    }

    try {
      await createMutation.mutateAsync({
        tier,
        campaign_type: campaignType,
        min_price: numericPrice
      });
      onClose();
    } catch (error) {
      console.error('Failed to create pricing floor:', error);
    }
  };

  const canSubmit = tier && campaignType && minPrice && !isNaN(parseFloat(minPrice)) && parseFloat(minPrice) >= 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Add Pricing Floor</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tier" className="text-sm font-medium">
              Creator Tier *
            </Label>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger>
                <SelectValue placeholder="Select creator tier" />
              </SelectTrigger>
              <SelectContent>
                {CREATOR_TIERS.map((tierOption) => (
                  <SelectItem key={tierOption} value={tierOption}>
                    {tierOption}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="campaign-type" className="text-sm font-medium">
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

          <div className="space-y-2">
            <Label htmlFor="min-price" className="text-sm font-medium">
              Minimum Price (£) *
            </Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">£</span>
              <Input
                id="min-price"
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="0"
                className="pl-8"
                min="0"
                step="1"
              />
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={!canSubmit || createMutation.isPending}
              className="flex-1"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
