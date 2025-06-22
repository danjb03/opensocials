
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
  draft: { color: 'bg-muted text-muted-foreground', label: 'Draft' },
  active: { color: 'bg-green-600 text-white', label: 'Active' },
  completed: { color: 'bg-blue-600 text-white', label: 'Completed' },
  paused: { color: 'bg-yellow-600 text-white', label: 'Paused' }
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
    <tr className="hover:bg-muted/30 transition-colors">
      <td className="px-4 py-3">
        <div>
          <div className="font-semibold text-foreground">{campaign.name}</div>
          <div className="text-muted-foreground text-sm">{campaign.platform}</div>
        </div>
      </td>
      <td className="px-4 py-3">
        <Badge className={statusInfo.color}>
          {statusInfo.label}
        </Badge>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-foreground font-medium">
          <DollarSign className="h-4 w-4" />
          {formatCurrency(campaign.budget)}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Calendar className="h-4 w-4" />
          {new Date(campaign.startDate).toLocaleDateString()}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="flex items-center gap-1 text-muted-foreground">
          <Users className="h-4 w-4" />
          {campaign.creators}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-foreground font-medium">
          {formatNumber(campaign.reach)}
        </div>
      </td>
      <td className="px-4 py-3">
        <div className="text-foreground font-medium">
          {campaign.engagement.toFixed(1)}%
        </div>
      </td>
      <td className="px-4 py-3">
        <Button
          variant="outline"
          size="sm"
          onClick={handleViewCampaign}
          className="flex items-center gap-1 bg-blue-600 text-white border-blue-600 hover:bg-blue-700"
        >
          <Eye className="h-4 w-4" />
          View
        </Button>
      </td>
    </tr>
  );
});

CampaignRow.displayName = 'CampaignRow';
