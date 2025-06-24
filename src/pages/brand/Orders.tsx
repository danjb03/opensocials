
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Package, Clock, CheckCircle, AlertCircle } from 'lucide-react';

const BrandOrders = () => {
  const navigate = useNavigate();

  // Mock order data - this would come from your actual orders API
  const orders = [
    {
      id: '1',
      orderNumber: 'ORD-001',
      campaign: 'Summer Collection 2024',
      creator: 'Sarah Johnson',
      status: 'in_progress',
      amount: 2500,
      deliverables: 3,
      completed: 1,
      dueDate: '2024-07-15'
    },
    {
      id: '2',
      orderNumber: 'ORD-002',
      campaign: 'Brand Awareness Push',
      creator: 'Mike Chen',
      status: 'completed',
      amount: 1800,
      deliverables: 2,
      completed: 2,
      dueDate: '2024-06-30'
    },
    {
      id: '3',
      orderNumber: 'ORD-003',
      campaign: 'Product Launch',
      creator: 'Emma Davis',
      status: 'pending',
      amount: 3200,
      deliverables: 4,
      completed: 0,
      dueDate: '2024-08-01'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'pending':
        return <Package className="h-4 w-4" />;
      case 'overdue':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Package className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'pending':
        return 'Pending';
      case 'overdue':
        return 'Overdue';
      default:
        return status;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Orders</h1>
          <p className="text-muted-foreground">Track and manage your creator orders and deliverables</p>
        </div>
        <Button onClick={() => navigate('/brand/campaigns')}>
          <Plus className="h-4 w-4 mr-2" />
          View Campaigns
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Orders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">In Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'in_progress').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'completed').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${orders.reduce((sum, order) => sum + order.amount, 0).toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Recent Orders</h2>
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                    <p className="text-sm text-muted-foreground">{order.campaign}</p>
                  </div>
                  <Badge className={getStatusColor(order.status)}>
                    {getStatusIcon(order.status)}
                    <span className="ml-1">{getStatusText(order.status)}</span>
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Creator</p>
                    <p className="font-medium">{order.creator}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Amount</p>
                    <p className="font-medium">${order.amount.toLocaleString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Progress</p>
                    <p className="font-medium">{order.completed}/{order.deliverables} deliverables</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Due Date</p>
                    <p className="font-medium">{new Date(order.dueDate).toLocaleDateString()}</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>{Math.round((order.completed / order.deliverables) * 100)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${(order.completed / order.deliverables) * 100}%` }}
                    ></div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View Details
                  </Button>
                  {order.status === 'in_progress' && (
                    <Button size="sm" className="flex-1">
                      Review Content
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
        <Card>
          <CardContent className="pt-6 text-center">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2 text-slate-50">No Orders Yet</h3>
            <p className="text-gray-500 mb-4">Your creator orders and deliverables will appear here</p>
            <Button onClick={() => navigate('/brand/campaigns')}>
              View Campaigns
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default BrandOrders;
