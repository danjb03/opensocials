import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import CreatorLayout from '@/components/layouts/CreatorLayout';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle, Circle, Clock, Upload, XCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { toast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';

interface Campaign {
  id: string;
  name: string;
  description: string | null;
  start_date: string;
  end_date: string;
  status: string | null;
  budget: number | null;
  currency: string | null;
  campaign_type: string;
  brand_id: string | null;
}

const CreatorCampaigns = () => {
  const { user } = useUnifiedAuth();
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'completed'>('active');
  const navigate = useNavigate();

  // Fetch campaigns where the creator is assigned
  const { data: campaigns = [], isLoading } = useQuery({
    queryKey: ['creator-campaigns', user?.id],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('campaign_type', 'invite')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        // Format the campaigns to include only necessary data
        const formattedCampaigns = data.map(campaign => ({
          id: campaign.id,
          name: campaign.name,
          description: campaign.description,
          start_date: campaign.start_date,
          end_date: campaign.end_date,
          status: campaign.status,
          budget: campaign.budget,
          currency: campaign.currency,
          campaign_type: campaign.campaign_type,
          brand_id: campaign.brand_id,
        }));
        
        return formattedCampaigns;
      } catch (error) {
        console.error('Error fetching campaigns:', error);
        toast.error('Failed to load campaigns');
        return [];
      }
    },
    enabled: !!user?.id,
  });

  const getCampaignStatusColor = (status: string | null) => {
    switch (status) {
      case 'active':
        return 'text-emerald-500';
      case 'upcoming':
        return 'text-blue-500';
      case 'completed':
        return 'text-gray-500';
      default:
        return 'text-gray-500';
    }
  };

  const filteredCampaigns = campaigns.filter(campaign => {
    const today = new Date();
    const startDate = new Date(campaign.start_date);
    const endDate = new Date(campaign.end_date);

    if (activeTab === 'active') {
      return startDate <= today && endDate >= today && campaign.status === 'active';
    } else if (activeTab === 'upcoming') {
      return startDate > today && campaign.status === 'upcoming';
    } else {
      return endDate < today || campaign.status === 'completed';
    }
  });

  return (
    <CreatorLayout>
      <section className="container space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold">My Campaigns</h2>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            className={cn(
              "py-2 px-4 font-medium",
              activeTab === 'active' ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            )}
            onClick={() => setActiveTab('active')}
          >
            Active
          </button>
          <button
            className={cn(
              "py-2 px-4 font-medium",
              activeTab === 'upcoming' ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            )}
            onClick={() => setActiveTab('upcoming')}
          >
            Upcoming
          </button>
          <button
            className={cn(
              "py-2 px-4 font-medium",
              activeTab === 'completed' ? "border-b-2 border-primary text-primary" : "text-muted-foreground"
            )}
            onClick={() => setActiveTab('completed')}
          >
            Completed
          </button>
        </div>

        {isLoading ? (
          <p>Loading campaigns...</p>
        ) : filteredCampaigns.length > 0 ? (
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {filteredCampaigns.map((campaign) => (
              <Card key={campaign.id} className="bg-white shadow-sm">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">{campaign.name}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {campaign.description || 'No description provided.'}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    <span>{new Date(campaign.start_date).toLocaleDateString()} - {new Date(campaign.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Circle className={`h-4 w-4 ${getCampaignStatusColor(campaign.status)}`} />
                    <span>Status: {campaign.status || 'Unknown'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>Budget: {campaign.currency}{campaign.budget?.toLocaleString()}</span>
                  </div>
                </CardContent>
                <CardFooter className="justify-between">
                  <Button 
                    variant="outline"
                    size="sm"
                    onClick={() => navigate(`/creator/campaigns/${campaign.id}`)}
                  >
                    View Details
                  </Button>
                  <Button 
                    size="sm"
                    onClick={() => navigate(`/creator/campaigns/${campaign.id}/upload`)}
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Content
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-gray-100 p-3 mb-3">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="text-muted-foreground"
                >
                  <path d="M2 12a10 10 0 1 0 20 0a10 10 0 1 0-20 0z" />
                  <line x1="8" x2="16" y1="12" y2="12" />
                </svg>
              </div>
              <h3 className="font-medium text-base mb-1">No campaigns found</h3>
              <p className="text-sm text-muted-foreground">
                Check back later for new collaboration opportunities.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </CreatorLayout>
  );
};

export default CreatorCampaigns;
