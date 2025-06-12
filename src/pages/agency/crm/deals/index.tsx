
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, DollarSign, Clock } from 'lucide-react';
import { useAgencyDeals } from '@/hooks/agency/useAgencyDeals';
import { Badge } from '@/components/ui/badge';

const AgencyDealsPipeline = () => {
  const { data: deals = [], isLoading, error } = useAgencyDeals();

  if (isLoading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Deals Pipeline</h1>
        </div>
        <div className="text-center py-8">Loading deals...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold">Deals Pipeline</h1>
        </div>
        <div className="text-center py-8 text-red-500">Error loading deals</div>
      </div>
    );
  }

  const totalValue = deals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = deals.filter(d => d.status === 'accepted').length;
  const pendingDeals = deals.filter(d => d.status === 'pending').length;

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="h-8 w-8" />
          <h1 className="text-3xl font-bold">Deals Pipeline</h1>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Deals</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{deals.length}</div>
            <p className="text-xs text-muted-foreground">Agency managed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">Accepted & active</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Combined value</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Deals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingDeals}</div>
            <p className="text-xs text-muted-foreground">Awaiting response</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {deals.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
              <p className="text-muted-foreground">
                Deals between your managed brands and creators will appear here.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {deals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="font-medium">{deal.title}</h4>
                      <Badge variant={deal.status === 'accepted' ? 'default' : deal.status === 'pending' ? 'secondary' : 'destructive'}>
                        {deal.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{deal.brand_name} × {deal.creator_name}</p>
                    <p className="text-xs text-muted-foreground">{new Date(deal.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${deal.value.toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyDealsPipeline;
