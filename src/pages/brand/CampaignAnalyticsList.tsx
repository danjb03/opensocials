
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { BarChart2, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useProjectData } from '@/hooks/useProjectData';
import ErrorBoundary from '@/components/ErrorBoundary';

const CampaignAnalyticsList = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { projects: campaigns, isLoading, error } = useProjectData();

  useEffect(() => {
    if (error) {
      console.error('Error loading campaigns for analytics:', error);
      toast({
        title: 'Error',
        description: 'Could not load campaigns',
        variant: 'destructive',
      });
    }
  }, [error, toast]);

  // Mock analytics data for demonstration
  const getAnalyticsSummary = (campaign: any) => {
    // Simulated data based on campaign id to ensure consistent mock data
    const campaignIdSum = campaign.id.split('-')[0].split('').reduce((sum: number, char: string) => sum + char.charCodeAt(0), 0);
    
    return {
      reach: Math.floor(50000 + (campaignIdSum * 1000)),
      engagementRate: (3 + (campaignIdSum % 5)).toFixed(1),
      clicks: Math.floor(2000 + (campaignIdSum * 100)),
    };
  };

  return (
    <ErrorBoundary>
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Campaign Analytics</h1>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Your Campaigns</CardTitle>
              <CardDescription>View performance metrics for all of your campaigns</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                  <div className="h-12 bg-gray-200 rounded"></div>
                </div>
              ) : campaigns.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Campaign Name</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Reach</TableHead>
                      <TableHead>Engagement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {campaigns.map((campaign) => {
                      const analytics = getAnalyticsSummary(campaign);
                      return (
                        <TableRow key={campaign.id}>
                          <TableCell className="font-medium">{campaign.name}</TableCell>
                          <TableCell>
                            {new Date(campaign.end_date).toLocaleDateString()}
                          </TableCell>
                          <TableCell>{analytics.reach.toLocaleString()}</TableCell>
                          <TableCell>{analytics.engagementRate}%</TableCell>
                          <TableCell>
                            <Button 
                              size="sm" 
                              onClick={() => navigate(`/brand/projects/analytics/${campaign.id}`)}
                              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
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
                  <BarChart2 className="h-12 w-12 mx-auto text-gray-300 mb-2" />
                  <p className="text-gray-500 mb-4">No campaigns found</p>
                  <Button onClick={() => navigate('/brand/projects')}>Go to Projects</Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </BrandLayout>
    </ErrorBoundary>
  );
};

export default CampaignAnalyticsList;
