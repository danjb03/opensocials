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
import { useProjectPayments, useProjectPaymentSummary } from '@/hooks/useProjectPayments';

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
  const { data: payments = [] } = useProjectPayments(id || '');
  const { summary } = useProjectPaymentSummary(id || '');

  // Process payment mutation
  const processPaymentMutation = useMutation({
    mutationFn: async ({ dealId, amount }: { dealId: string; amount: number }) => {
      const { data, error } = await supabase.functions.invoke('process-creator-payment', {
        body: {
          deal_id: dealId,
          amount
        }
      });

      if (error) throw error;
      if (!data?.success) {
        // Handle case where creator needs to complete Stripe onboarding
        if (data?.requires_onboarding && data?.account_link) {
          window.open(data.account_link, '_blank');
          throw new Error(`Creator needs to complete payment setup first. Setup link opened in new tab.`);
        }
        throw new Error(data?.error || 'Payment failed');
      }
      return data;
    },
    onSuccess: (data) => {
      toast.success('Payment processed successfully', {
        description: data.message
      });
      queryClient.invalidateQueries({ queryKey: ['project-payments', id] });
      queryClient.invalidateQueries({ queryKey: ['project-creators', id] });
    },
    onError: (error: any) => {
      toast.error('Payment failed', {
        description: error.message
      });
    }
  });

  if (isLoading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl bg-background">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  if (!project) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6 max-w-7xl bg-background">
          <Card className="bg-card border-border">
            <CardContent className="flex flex-col items-center justify-center pt-6 pb-6">
              <h2 className="text-xl font-semibold mb-2 text-foreground">Project not found</h2>
              <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
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
      <div className="container mx-auto p-6 max-w-7xl bg-background">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={() => navigate('/brand/projects')} className="border-border text-foreground">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{project.name}</h1>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getStatusBadgeVariant(project.status)}>
                  {project.status}
                </Badge>
                <span className="text-sm text-muted-foreground">
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
                className="flex items-center gap-2 border-border text-foreground"
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
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Budget Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Budget:</span>
                  <span className="font-medium text-foreground">{formatCurrency(project.budget || 0, project.currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Allocated:</span>
                  <span className="font-medium text-foreground">{formatCurrency(summary?.totalAmount || 0, project.currency)}</span>
                </div>
                <div className="flex justify-between border-t border-border pt-2">
                  <span className="text-sm text-muted-foreground">Remaining:</span>
                  <span className="font-medium text-primary">{formatCurrency(remainingBudget, project.currency)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Payment Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Payments:</span>
                  <span className="font-medium text-foreground">{summary?.totalPayments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Completed:</span>
                  <span className="font-medium text-green-600">{summary?.completedPayments || 0}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending:</span>
                  <span className="font-medium text-orange-600">
                    {(summary?.totalPayments || 0) - (summary?.completedPayments || 0)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-lg text-foreground">Creator Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Total Invited:</span>
                  <span className="font-medium text-foreground">{projectCreators.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Accepted:</span>
                  <span className="font-medium text-green-600">
                    {projectCreators.filter(pc => pc.status === 'accepted').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Pending:</span>
                  <span className="font-medium text-orange-600">
                    {projectCreators.filter(pc => pc.status === 'invited').length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {showInviteSystem && canAddCreators && (
          <div className="mb-6">
            <CreatorInviteSystem 
              projectId={id!}
              remainingBudget={remainingBudget}
              currency={project.currency || 'USD'}
            />
          </div>
        )}

        <Card className="mb-6 bg-card border-border">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
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
                    <div key={pc.id} className="flex items-center justify-between p-4 border border-border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center text-foreground">
                          {creatorName.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h4 className="font-medium text-foreground">{creatorName}</h4>
                          <p className="text-sm text-muted-foreground">{creator?.email}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="font-medium text-foreground">{formatCurrency(pc.agreed_amount || 0, pc.currency)}</p>
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
                            className="flex items-center gap-1 bg-primary text-primary-foreground hover:bg-primary/90"
                          >
                            <DollarSign className="h-3 w-3" />
                            {processPaymentMutation.isPending ? 'Processing...' : 'Pay via Stripe'}
                          </Button>
                        )}
                        
                        {payment && payment.status === 'completed' && (
                          <Badge variant="outline" className="text-green-600 border-border text-foreground">
                            Paid via Stripe
                          </Badge>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
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

        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Campaign Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h4 className="font-medium mb-2 text-foreground">Description</h4>
              <p className="text-muted-foreground">{project.description || 'No description provided.'}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-medium mb-2 text-foreground">Campaign Type</h4>
                <p className="text-muted-foreground">{project.campaign_type}</p>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-foreground">Platforms</h4>
                <div className="flex flex-wrap gap-1">
                  {project.platforms?.map((platform: string) => (
                    <Badge key={platform} variant="outline" className="border-border text-foreground">
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
