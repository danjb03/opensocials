
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, AlertTriangle, CheckCircle, Clock, Users } from 'lucide-react';
import { useAgencyProjects } from '@/hooks/agency/useAgencyProjects';
import { useAgencyDeals } from '@/hooks/agency/useAgencyDeals';

const AgencyOrderManagement = () => {
  const { data: projects = [], isLoading: projectsLoading } = useAgencyProjects();
  const { data: deals = [], isLoading: dealsLoading } = useAgencyDeals();
  const [activeTab, setActiveTab] = useState('overview');

  const isLoading = projectsLoading || dealsLoading;

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Campaign Oversight</h1>
        </div>
        <div className="text-center py-8">Loading campaign data...</div>
      </div>
    );
  }

  // Identify campaigns that need attention
  const campaignsNeedingAttention = projects.filter(project => {
    const projectDeals = deals.filter(deal => deal.project_id === project.id);
    const hasStuckDeals = projectDeals.some(deal => 
      deal.status === 'pending' && 
      new Date(deal.created_at) < new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days old
    );
    return hasStuckDeals || project.status === 'paused';
  });

  const activeCampaigns = projects.filter(p => p.status === 'active' || p.status === 'in_progress');
  const totalDeals = deals.length;
  const completedDeals = deals.filter(d => d.status === 'completed').length;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
      case 'in_progress':
      case 'completed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'paused':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  const getUrgencyLevel = (project: any) => {
    const projectDeals = deals.filter(deal => deal.project_id === project.id);
    const pendingDeals = projectDeals.filter(deal => deal.status === 'pending');
    
    if (pendingDeals.length > 0) {
      const oldestPending = new Date(Math.min(...pendingDeals.map(d => new Date(d.created_at).getTime())));
      const daysPending = Math.floor((Date.now() - oldestPending.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysPending > 7) return 'high';
      if (daysPending > 3) return 'medium';
    }
    
    return 'low';
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Eye className="h-8 w-8" />
          <div>
            <h1 className="text-3xl font-bold">Campaign Oversight</h1>
            <p className="text-muted-foreground">Monitor campaign progress and deal status</p>
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Campaigns</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCampaigns.length}</div>
            <p className="text-xs text-muted-foreground">Currently running</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Need Attention</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{campaignsNeedingAttention.length}</div>
            <p className="text-xs text-muted-foreground">Require intervention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals}</div>
            <p className="text-xs text-muted-foreground">Brand-creator agreements</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalDeals > 0 ? Math.round((completedDeals / totalDeals) * 100) : 0}%</div>
            <p className="text-xs text-muted-foreground">Deals completed</p>
          </CardContent>
        </Card>
      </div>

      {/* Campaigns Needing Attention */}
      {campaignsNeedingAttention.length > 0 && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="h-5 w-5" />
              Campaigns Requiring Attention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {campaignsNeedingAttention.map((project) => {
                const urgency = getUrgencyLevel(project);
                const projectDeals = deals.filter(deal => deal.project_id === project.id);
                const pendingDeals = projectDeals.filter(deal => deal.status === 'pending');
                
                return (
                  <div key={project.id} className="flex items-center justify-between p-3 bg-white rounded-lg border">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant={urgency === 'high' ? 'destructive' : 'secondary'}>
                          {urgency} priority
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {pendingDeals.length} pending deal{pendingDeals.length !== 1 ? 's' : ''} • {project.brand_name}
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Eye className="h-4 w-4 mr-2" />
                      Review
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Campaigns */}
      <Card>
        <CardHeader>
          <CardTitle>All Campaigns</CardTitle>
          <p className="text-sm text-muted-foreground">
            Monitor all campaigns across your managed brands. Click to view detailed progress.
          </p>
        </CardHeader>
        <CardContent>
          {projects.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No campaigns to monitor</h3>
              <p className="text-muted-foreground">
                Your managed brands haven't created any campaigns yet.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {projects.map((project) => {
                const projectDeals = deals.filter(deal => deal.project_id === project.id);
                const completedProjectDeals = projectDeals.filter(deal => deal.status === 'completed');
                const urgency = getUrgencyLevel(project);
                
                return (
                  <div key={project.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="font-medium">{project.name}</h4>
                        <Badge variant={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                        {urgency === 'high' && (
                          <Badge variant="destructive" className="text-xs">
                            <AlertTriangle className="h-3 w-3 mr-1" />
                            Urgent
                          </Badge>
                        )}
                      </div>
                      
                      <div className="grid grid-cols-4 gap-4 text-sm text-muted-foreground">
                        <div>
                          <span className="font-medium">Brand:</span> {project.brand_name}
                        </div>
                        <div>
                          <span className="font-medium">Budget:</span> ${project.budget?.toLocaleString() || 0} {project.currency}
                        </div>
                        <div>
                          <span className="font-medium">Deals:</span> {completedProjectDeals.length}/{projectDeals.length} completed
                        </div>
                        <div>
                          <span className="font-medium">Started:</span> {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {urgency === 'high' && (
                        <Button variant="outline" size="sm" className="text-orange-600 border-orange-200">
                          <AlertTriangle className="h-4 w-4 mr-2" />
                          Intervene
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-2" />
                        Monitor
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyOrderManagement;
