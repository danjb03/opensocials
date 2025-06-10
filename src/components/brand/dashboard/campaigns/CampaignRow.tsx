
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, DollarSign, Users, Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export interface Campaign {
  id: string;
  name: string;
  status: 'draft' | 'active' | 'completed' | 'paused';
  budget: number;
  startDate: string;
  endDate: string;
  creators: number;
  reach: number;
  engagement: number;
  platform: string;
}

interface CampaignRowProps {
  campaign: Campaign;
}

const statusConfig = {
  draft: { color: 'bg-gray-100 text-gray-800', label: 'Draft' },
  active: { color: 'bg-green-100 text-green-800', label: 'Active' },
  completed: { color: 'bg-blue-100 text-blue-800', label: 'Completed' },
  paused: { color: 'bg-yellow-100 text-yellow-800', label: 'Paused' }
};

export const CampaignRow: React.FC<CampaignRowProps> = React.memo(({ campaign }) => {
  const navigate = useNavigate();

  const handleViewCampaign = () => {
    navigate(`/brand/orders/${campaign.id}`);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-GB', {
      style: 'currency',
      currency: 'GBP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  const statusInfo = statusConfig[campaign.status];

  return (
    <tr className="hover:bg-accent/50 transition-colors">
      <td className="px-4 py-3">
        <div>
          <div className="font-medium text-foreground">{campaign.name}</div>
          <div className="text-foreground text-sm">{campaign.platform}</div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge className={statusInfo.color}>
          {statusInfo.label}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-foreground">
          <DollarSign className="h-4 w-4" />
          {formatCurrency(campaign.budget)}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(campaign.startDate).toLocaleDateString()}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-foreground">
          <Users className="h-4 w-4" />
          {campaign.creators}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-foreground">
          {formatNumber(campaign.reach)}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-foreground">
          {campaign.engagement.toFixed(1)}%
        </div>
      </td>
      <td className="px-4 py-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleViewCampaign}
          className="flex items-center gap-1"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      </td>
    </tr>
  );
});

CampaignRow.displayName = 'CampaignRow';
