
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, X } from 'lucide-react';

interface SelectedCreatorsBarProps {
  selectedCreators: string[]; // Changed from number[] to string[]
  availableCampaigns: Array<{id: string, title: string}>;
  selectedCampaignId: string | null;
  onSelectCampaign: (campaignId: string) => void;
  onAddToCart: () => void;
}

export const SelectedCreatorsBar = ({
  selectedCreators,
  availableCampaigns,
  selectedCampaignId,
  onSelectCampaign,
  onAddToCart
}: SelectedCreatorsBarProps) => {
  if (selectedCreators.length === 0) return null;

  return (
    <div className="sticky top-0 z-10 bg-card border border-border rounded-lg p-4 shadow-lg">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Badge variant="secondary" className="bg-primary text-primary-foreground">
            {selectedCreators.length} Selected
          </Badge>
          
          <Select value={selectedCampaignId || ""} onValueChange={onSelectCampaign}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Select Campaign" />
            </SelectTrigger>
            <SelectContent>
              {availableCampaigns.map(campaign => (
                <SelectItem key={campaign.id} value={campaign.id}>
                  {campaign.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <Button 
          onClick={onAddToCart}
          disabled={!selectedCampaignId}
          className="flex items-center gap-2"
        >
          <ShoppingCart className="h-4 w-4" />
          Add to Campaign
        </Button>
      </div>
    </div>
  );
};
