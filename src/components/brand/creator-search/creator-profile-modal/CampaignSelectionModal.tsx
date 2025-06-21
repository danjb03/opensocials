
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, DollarSign, Target } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Campaign {
  id: string;
  name: string;
  status: string;
  budget: number;
  currency: string;
  start_date: string;
  end_date: string;
  platforms: string[];
}

interface CampaignSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectCampaign: (campaignId: string, campaignName: string) => void;
  creatorName: string;
}

export const CampaignSelectionModal = ({
  isOpen,
  onClose,
  onSelectCampaign,
  creatorName
}: CampaignSelectionModalProps) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string | null>(null);

  // Fetch available campaigns (draft, live, or ready for invitations)
  const { data: campaigns, isLoading } = useQuery({
    queryKey: ['available-campaigns'],
    queryFn: async (): Promise<Campaign[]> => {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('projects_new')
        .select('id, name, status, budget, currency, start_date, end_date, platforms')
        .eq('brand_id', user.user.id)
        .in('status', ['draft', 'live', 'active', 'creators_assigned'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    },
    enabled: isOpen
  });

  const handleInvite = () => {
    if (selectedCampaign) {
      const campaign = campaigns?.find(c => c.id === selectedCampaign);
      if (campaign) {
        onSelectCampaign(selectedCampaign, campaign.name);
        onClose();
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'live':
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'creators_assigned':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto bg-background">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            Invite {creatorName} to Campaign
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {isLoading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : campaigns && campaigns.length > 0 ? (
            <>
              <p className="text-muted-foreground text-sm">
                Select a campaign to invite this creator to:
              </p>
              
              <div className="space-y-3">
                {campaigns.map((campaign) => (
                  <Card
                    key={campaign.id}
                    className={`cursor-pointer transition-all border ${
                      selectedCampaign === campaign.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                    onClick={() => setSelectedCampaign(campaign.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <CardTitle className="text-base text-foreground">
                          {campaign.name}
                        </CardTitle>
                        <Badge className={getStatusColor(campaign.status)}>
                          {campaign.status}
                        </Badge>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0">
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <DollarSign className="h-4 w-4" />
                          {campaign.budget?.toLocaleString()} {campaign.currency}
                        </div>
                        
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}
                        </div>
                        
                        {campaign.platforms && campaign.platforms.length > 0 && (
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            {campaign.platforms.join(', ')}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose}>
                  Cancel
                </Button>
                <Button 
                  onClick={handleInvite}
                  disabled={!selectedCampaign}
                  className="bg-primary hover:bg-primary/90"
                >
                  Send Invitation
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground mb-4">
                No available campaigns found. Create a campaign first to invite creators.
              </p>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
