
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Users, Plus, DollarSign } from 'lucide-react';
import { toast } from 'sonner';
import { formatCurrency } from '@/utils/currency';
import CreatorInviteSystem from '@/components/brand/campaign-wizard/CreatorInviteSystem';
import { useProjectPayments } from '@/hooks/useProjectPayments';

const ProjectDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [showInviteSystem, setShowInviteSystem] = useState(false);

  // Fetch project details
  const { data: project, isLoading } = useQuery({
    queryKey: ['project', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!id,
  });

  // Fetch project creators
  const { data: projectCreators = [] } = useQuery({
    queryKey: ['project-creators', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('project_creators')
        .select(`
          *,
          profiles!project_creators_creator_id_fkey(
            first_name,
            last_name,
            email,
            avatar_url
          )
        `)
        .eq('project_id', id);
      
      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  // Fetch payment information
  const { data: payments = [], summary } = useProjectPayments(id || '');

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async ({ dealId, amount }: { dealId: string; amount: number }) => {
      const { data, error } = await supabase.functions.invoke('process-creator-payment', {
        body: {
          deal_id: dealId,
          amount,
          payment_method: 'platform'
        }
      });

      if (error) throw error;
      if (!data?.success) throw new Error(data?.error || 'Payment failed');
      return data;
    },
    onSuccess: () => {
      toast.success('Payment processed successfully');
      queryClient.invalidateQueries({ queryKey: ['project-payments', id] });
      queryClient.invalidateQueries({ queryKey: ['project-creators', id] });
    },
    onError: (error: any) => {
      toast.error(error.message || 'Failed to process payment');
    }
  });

  if (isLoading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  if (!project) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl">
          <Card>
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <h2 className="text-xl font-semibold mb-2">Project not found</h2>
              <p className="text-gray-500 mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
              <Button onClick={() => navigate('/brand/projects')}>
                Back to Projects
              </Button>
            </CardContent>
          </Card>
        </div>
      </BrandLayout>
    );
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_progress':
        return 'default';
      case 'draft':
        return 'secondary';
      case 'completed':
        return 'outline';
      default:
        return 'outline';
    }
  };

  const remainingBudget = (project.budget || 0) - (summary?.totalAmount || 0);
  const canAddCreators = ['active', 'in_progress', 'draft'].includes(project.status);

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/brand/projects')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-3xl font-bold">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status}
                </Badge>
                <span className="text-sm text-gray-500">
                  {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {canAddCreators && (
              <Button 
                variant="outline" 
                onClick={() => setShowInviteSystem(!showInviteSystem)}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Creators
              </Button>
            )}
            <Button onClick={() => navigate(`/brand/projects/${id}/edit`)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Campaign
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Budget:</span>
                  <span className="font-medium">{formatCurrency(project.budget || 0, project.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Allocated:</span>
                  <span className="font-medium">{formatCurrency(summary?.totalAmount || 0, project.currency)}</span>
                </div>
                <div className="flex justify-between border-t pt-2">
                  <span className="text-sm text-gray-600">Remaining:</span>
                  <span className="font-medium text-green-600">{formatCurrency(remainingBudget, project.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Payments:</span>
                  <span className="font-medium">{summary?.totalPayments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed:</span>
                  <span className="font-medium text-green-600">{summary?.completedPayments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="font-medium text-orange-600">
                    {(summary?.totalPayments || 0) - (summary?.completedPayments || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Creator Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Invited:</span>
                  <span className="font-medium">{projectCreators.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Accepted:</span>
                  <span className="font-medium text-green-600">
                    {projectCreators.filter(pc => pc.status === 'accepted').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Pending:</span>
                  <span className="font-medium text-orange-600">
                    {projectCreators.filter(pc => pc.status === 'invited').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Creator Invite System */}
        {showInviteSystem && canAddCreators && (
          <div className="mb-6">
            <CreatorInviteSystem 
              projectId={id!}
              remainingBudget={remainingBudget}
              currency={project.currency || 'USD'}
            />
          </div>
        )}

        {/* Project Creators */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Project Creators
            </CardTitle>
          </CardHeader>
          <CardContent>
            {projectCreators.length > 0 ? (
              <div className="space-y-4">
                {projectCreators.map((pc) => {
                  const creator = pc.profiles;
                  const creatorName = creator ? 
                    `${creator.first_name || ''} ${creator.last_name || ''}`.trim() || 'Unknown Creator' : 
                    'Unknown Creator';
                  
                  const payment = payments.find(p => p.creatorInfo?.id === pc.creator_id);
                  
                  return (
                    <div key={pc.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          {creatorName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium">{creatorName}</h4>
                          <p className="text-sm text-gray-600">{creator?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium">{formatCurrency(pc.agreed_amount || 0, pc.currency)}</p>
                          <Badge variant={pc.status === 'accepted' ? 'default' : 'secondary'}>
                            {pc.status}
                          </Badge>
                        </div>
                        
                        {pc.status === 'accepted' && payment && payment.status === 'pending' && (
                          <Button
                            size="sm"
                            onClick={() => processPaymentMutation.mutate({
                              dealId: payment.id,
                              amount: pc.agreed_amount || 0
                            })}
                            disabled={processPaymentMutation.isPending}
                            className="flex items-center gap-1"
                          >
                            <DollarSign className="h-3 w-3" />
                            {processPaymentMutation.isPending ? 'Processing...' : 'Pay Now'}
                          </Button>
                        )}
                        
                        {payment && payment.status === 'completed' && (
                          <Badge variant="outline" className="text-green-600">
                            Paid
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Users className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No creators assigned yet</p>
                {canAddCreators && (
                  <Button 
                    className="mt-4" 
                    onClick={() => setShowInviteSystem(true)}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Creators
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Project Details */}
        <Card>
          <CardHeader>
            <CardTitle>Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Description</h4>
              <p className="text-gray-600">{project.description || 'No description provided.'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2">Campaign Type</h4>
                <p className="text-gray-600">{project.campaign_type}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2">Platforms</h4>
                <div className="flex flex-wrap gap-1">
                  {project.platforms?.map((platform: string) => (
                    <Badge key={platform} variant="outline">
                      {platform}
                    </Badge>
                  )) || 'No platforms specified'}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
};

export default ProjectDetail;
