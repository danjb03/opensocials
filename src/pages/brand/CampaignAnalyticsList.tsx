
import React, { useEffect, useMemo, memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProjectData } from '@/hooks/useProjectData';
import ErrorBoundary from '@/components/ErrorBoundary';

const CampaignAnalyticsList = memo(() => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects: campaigns, isLoading, error } = useProjectData();

  useEffect(() => {
    if (error) {
      toast({
        title: 'Error',
        description: 'Could not load campaigns',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Memoize analytics calculation to prevent re-calculation on every render
  const getAnalyticsSummary = useCallback((campaign: any) => {
    // Simulated data based on campaign id to ensure consistent mock data
    const campaignIdSum = campaign.id.split('-')[0].split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
    
    return {
      reach: Math.floor(50000 + (campaignIdSum * 1000)),
      engagementRate: (3 + (campaignIdSum % 5)).toFixed(1),
      clicks: Math.floor(2000 + (campaignIdSum * 100)),
    };
  }, []);

  // Memoize navigation handler
  const handleViewAnalytics = useCallback((campaignId: string) => {
    navigate(`/brand/projects/analytics/${campaignId}`);
  }, [navigate]);

  return (
    <ErrorBoundary>
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl bg-background">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-foreground">Campaign Analytics</h1>
          </div>

          <Card className="mb-8 bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Your Campaigns</CardTitle>
              <CardDescription className="text-muted-foreground">View performance metrics for all of your campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              ) : campaigns.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow className="border-border">
                      <TableHead className="text-foreground">Campaign Name</TableHead>
                      <TableHead className="text-foreground">End Date</TableHead>
                      <TableHead className="text-foreground">Reach</TableHead>
                      <TableHead className="text-foreground">Engagement</TableHead>
                      <TableHead className="text-foreground">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => {
                      const analytics = getAnalyticsSummary(campaign);
                      return (
                        <TableRow key={campaign.id} className="border-border">
                          <TableCell className="font-medium text-foreground">{campaign.name}</TableCell>
                          <TableCell className="text-foreground">
                            {new Date(campaign.end_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell className="text-foreground">{analytics.reach.toLocaleString()}</TableCell>
                          <TableCell className="text-foreground">{analytics.engagementRate}%</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => handleViewAnalytics(campaign.id)}
                              className="bg-primary text-primary-foreground hover:bg-primary/90"
                            >
                              <BarChart2 className="mr-1 h-4 w-4" /> 
                              View Analytics
                              <ArrowRight className="ml-1 h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10">
                  <BarChart2 className="h-12 w-12 mx-auto text-muted-foreground mb-2" />
                  <p className="text-muted-foreground mb-4">No campaigns found</p>
                  <Button onClick={() => navigate('/brand/projects')}>Go to Projects</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </BrandLayout>
    </ErrorBoundary>
  );
});

CampaignAnalyticsList.displayName = 'CampaignAnalyticsList';

export default CampaignAnalyticsList;
