
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Loader, ArrowLeft, DollarSign, User, Calendar, Percent } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

export default function CreatorDetailPage() {
  const { id: creatorId } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading, isError } = useQuery({
    queryKey: ['creator-details', creatorId],
    queryFn: async () => {
      const { data, error } = await supabase.functions.invoke('get-creator-details-by-id', {
        body: { creator_id: creatorId }
      });
      
      if (error) throw error;
      return data;
    },
    enabled: !!creatorId,
  });

  const profile = data?.profile;
  const deals = data?.deals || [];
  const earnings = data?.totalEarnings || 0;
  const analytics = data?.analytics || {
    totalDeals: 0,
    activeDeals: 0,
    completedDeals: 0
  };

  const handleBack = () => {
    const referrer = document.referrer;
    if (referrer.includes('leaderboard')) {
      navigate('/admin/crm/creators/leaderboard');
    } else {
      navigate('/admin/crm/creators');
    }
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <Button 
        variant="outline" 
        onClick={handleBack}
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin h-6 w-6" />
        </div>
      )}

      {isError || !data?.success ? (
        <p className="text-red-500 text-center mt-6">Failed to load creator details.</p>
      ) : (
        profile && (
          <>
            <h1 className="text-2xl font-bold mb-6">Creator Profile</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <User className="h-5 w-5 mr-2" />
                    Profile Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div>
                    <p className="text-lg font-medium">{profile.first_name} {profile.last_name}</p>
                    <p className="text-sm text-muted-foreground">{profile.email}</p>
                  </div>
                  <div className="flex items-center">
                    <Badge className={profile.primary_platform ? getPlatformBadgeColor(profile.primary_platform) : undefined}>
                      {profile.primary_platform || 'Unknown Platform'}
                    </Badge>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-muted-foreground">Joined</p>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1 text-muted-foreground" />
                      <p>{formatDate(profile.created_at)}</p>
                    </div>
                  </div>
                  {profile.bio && (
                    <div className="mt-4">
                      <p className="text-sm text-muted-foreground">Bio</p>
                      <p className="text-sm">{profile.bio}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <DollarSign className="h-5 w-5 mr-2" />
                    Earnings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-3xl font-bold">${earnings.toLocaleString()}</p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Total Deals</p>
                      <p className="font-medium">{analytics.totalDeals}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Active</p>
                      <p className="font-medium">{analytics.activeDeals}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Completed</p>
                      <p className="font-medium">{analytics.completedDeals}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center text-lg">
                    <Percent className="h-5 w-5 mr-2" />
                    Audience Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Followers</p>
                      <p className="text-lg font-medium">{profile.follower_count || 'No data'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Engagement Rate</p>
                      <p className="text-lg font-medium">{profile.engagement_rate || 'No data'}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="text-lg">Recent Deals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Deal</TableHead>
                        <TableHead>Brand</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="text-right">Value</TableHead>
                        <TableHead>Last Updated</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {deals.length > 0 ? (
                        deals.map((deal: any) => (
                          <TableRow key={deal.id}>
                            <TableCell>{deal.title}</TableCell>
                            <TableCell>{deal.brand_name}</TableCell>
                            <TableCell>
                              <Badge className={getStatusBadgeColor(deal.status)}>
                                {deal.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">${Number(deal.value).toLocaleString()}</TableCell>
                            <TableCell>{formatDate(deal.updated_at)}</TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-4">
                            No deals found for this creator.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </>
        )
      )}
    </div>
  );
}

function formatDate(dateString: string) {
  if (!dateString) return '—';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (e) {
    return dateString;
  }
}

function getPlatformBadgeColor(platform: string) {
  const platforms: Record<string, string> = {
    'instagram': 'bg-pink-500',
    'tiktok': 'bg-black',
    'youtube': 'bg-red-500',
    'twitter': 'bg-blue-400',
    'linkedin': 'bg-blue-600',
  };
  
  return platforms[platform.toLowerCase()] || 'bg-gray-500';
}

function getStatusBadgeColor(status: string) {
  const statusColors: Record<string, string> = {
    'active': 'bg-green-500',
    'pending': 'bg-yellow-500',
    'completed': 'bg-blue-500',
    'cancelled': 'bg-red-500',
    'declined': 'bg-gray-500',
    'accepted': 'bg-purple-500',
  };
  
  return statusColors[status.toLowerCase()] || 'bg-gray-500';
}
