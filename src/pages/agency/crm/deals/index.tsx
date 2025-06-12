
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, DollarSign, Clock } from 'lucide-react';

const AgencyDealsPipeline = () => {
  // Mock deals data - in real app this would come from API
  const mockDeals = [
    {
      id: '1',
      brand: 'TechCorp',
      creator: 'John Doe',
      value: 5000,
      status: 'negotiating',
      stage: 'Proposal Sent'
    },
    {
      id: '2',
      brand: 'FashionBrand',
      creator: 'Jane Smith',
      value: 3500,
      status: 'active',
      stage: 'Content Creation'
    }
  ];

  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = mockDeals.filter(d => d.status === 'active').length;

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
            <div className="text-2xl font-bold">{mockDeals.length}</div>
            <p className="text-xs text-muted-foreground">All time</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
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
            <CardTitle className="text-sm font-medium">Avg. Deal Size</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${mockDeals.length > 0 ? Math.round(totalValue / mockDeals.length).toLocaleString() : 0}
            </div>
            <p className="text-xs text-muted-foreground">Per deal</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          {mockDeals.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">No deals yet</h3>
              <p className="text-muted-foreground">
                Deal data will appear here as your managed brands and creators start collaborating.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {mockDeals.map((deal) => (
                <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">{deal.brand} × {deal.creator}</h4>
                    <p className="text-sm text-muted-foreground">{deal.stage}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">${deal.value.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground capitalize">{deal.status}</p>
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
