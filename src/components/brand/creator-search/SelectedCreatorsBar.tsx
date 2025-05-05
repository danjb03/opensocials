
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type SelectedCreatorsBarProps = {
  selectedCreators: number[];
  availableCampaigns: {id: string, title: string}[];
  selectedCampaignId: string | null;
  onSelectCampaign: (campaignId: string) => void;
  onAddToCart: () => void;
};

export const SelectedCreatorsBar = ({ 
  selectedCreators, 
  availableCampaigns, 
  selectedCampaignId, 
  onSelectCampaign, 
  onAddToCart 
}: SelectedCreatorsBarProps) => {
  const { toast } = useToast();
  
  if (selectedCreators.length === 0) return null;

  // Find the selected campaign title if a campaign is selected
  const selectedCampaign = availableCampaigns.find(campaign => campaign.id === selectedCampaignId);

  const handleAddToCart = () => {
    onAddToCart();
    toast({
      title: "Creators added",
      description: `${selectedCreators.length} creators added to campaign: ${selectedCampaign?.title}`,
    });
  };

  return (
    <Card className="mb-6 sticky bottom-4 shadow-lg border-primary/20">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-medium text-lg">
              {selectedCreators.length} {selectedCreators.length === 1 ? 'Creator' : 'Creators'} Selected
            </p>
            {selectedCampaignId ? (
              <p className="text-sm text-muted-foreground">
                Adding to campaign: <span className="font-medium">{selectedCampaign?.title}</span>
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Choose a campaign to add these creators to
              </p>
            )}
          </div>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full md:w-auto">
            <Select
              value={selectedCampaignId || ''}
              onValueChange={onSelectCampaign}
            >
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Select campaign" />
              </SelectTrigger>
              <SelectContent>
                {availableCampaigns.length > 0 ? (
                  availableCampaigns.map(campaign => (
                    <SelectItem key={campaign.id} value={campaign.id}>
                      {campaign.title}
                    </SelectItem>
                  ))
                ) : (
                  <SelectItem value="none" disabled>
                    No campaigns available
                  </SelectItem>
                )}
              </SelectContent>
            </Select>

            <Button
              className="flex-shrink-0"
              disabled={selectedCreators.length === 0 || !selectedCampaignId}
              onClick={handleAddToCart}
            >
              <PlusCircle className="h-4 w-4 mr-2" />
              Add to Campaign
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
