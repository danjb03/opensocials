
import React from 'react';
import { Order } from '@/types/orders';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface CampaignContentProps {
  order: Order;
}

const CampaignContent: React.FC<CampaignContentProps> = ({ order }) => {
  const navigate = useNavigate();

  const handleViewAnalytics = () => {
    navigate(`/brand/analytics/${order.id}`);
  };

  return (
    <div className="space-y-6">
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader className="text-center pb-6">
          <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <BarChart3 className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900">
            {order.title}
          </CardTitle>
          <p className="text-gray-600 max-w-md mx-auto">
            Campaign completed! View comprehensive analytics and performance metrics for your campaign.
          </p>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{order.creators.length}</div>
              <div className="text-sm text-gray-600">Creators</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <Eye className="w-5 h-5 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{order.contentItems?.length || 0}</div>
              <div className="text-sm text-gray-600">Content Pieces</div>
            </div>
            <div className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">{order.currency} {order.budget.toLocaleString()}</div>
              <div className="text-sm text-gray-600">Budget</div>
            </div>
          </div>

          {/* Analytics Button */}
          <Button 
            onClick={handleViewAnalytics}
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
          >
            <BarChart3 className="mr-2 h-5 w-5" />
            Analytics & Results
          </Button>

          <p className="text-sm text-gray-500 max-w-sm mx-auto">
            Get detailed insights into reach, engagement, conversions, and ROI metrics for this campaign.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default CampaignContent;
