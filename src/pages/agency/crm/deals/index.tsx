
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, TrendingUp, DollarSign, Clock } from 'lucide-react';

const AgencyDealsPipeline = () => {
  // Mock data - in real app this would come from actual deals
  const mockDeals = [
    {
      id: '1',
      title: 'Summer Campaign 2024',
      brand: 'Nike',
      creator: 'Sarah Johnson',
      value: 5000,
      status: 'negotiation',
      stage: 'content',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      title: 'Holiday Collection',
      brand: 'Adidas',
      creator: 'Mike Chen',
      value: 3500,
      status: 'active',
      stage: 'review',
      createdAt: '2024-01-12'
    },
    {
      id: '3',
      title: 'Tech Review Series',
      brand: 'Apple',
      creator: 'Lisa Martinez',
      value: 8000,
      status: 'completed',
      stage: 'launched',
      createdAt: '2024-01-10'
    }
  ];

  const totalValue = mockDeals.reduce((sum, deal) => sum + deal.value, 0);
  const activeDeals = mockDeals.filter(deal => deal.status === 'active').length;
  const completedDeals = mockDeals.filter(deal => deal.status === 'completed').length;

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
            <CardTitle className="text-sm font-medium">Total Pipeline Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">All deals combined</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Deals</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeDeals}</div>
            <p className="text-xs text-muted-foreground">In progress</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Deals</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{completedDeals}</div>
            <p className="text-xs text-muted-foreground">Successfully closed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">75%</div>
            <p className="text-xs text-muted-foreground">Success rate</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Deals</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockDeals.map((deal) => (
              <div key={deal.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex-1">
                  <h3 className="font-semibold">{deal.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {deal.brand} × {deal.creator}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">${deal.value.toLocaleString()}</p>
                  <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                    deal.status === 'completed' ? 'bg-green-100 text-green-800' :
                    deal.status === 'active' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {deal.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AgencyDealsPipeline;
