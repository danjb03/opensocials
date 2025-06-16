
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Eye } from 'lucide-react';
import { formatCurrency } from '@/utils/project';

interface Campaign {
  id: string;
  name: string;
  brand_id: string;
  campaign_type: string;
  budget: number;
  currency: string;
  status: string;
  review_status: string;
  review_priority: string;
  created_at: string;
  brand_profiles?: {
    company_name: string;
  } | null;
}

interface CampaignReviewTableProps {
  campaigns: Campaign[];
  isLoading: boolean;
  onSelectCampaign: (campaignId: string) => void;
  selectedCampaign: string | null;
}

export function CampaignReviewTable({ 
  campaigns, 
  isLoading, 
  onSelectCampaign, 
  selectedCampaign 
}: CampaignReviewTableProps) {
  const getReviewStatusBadge = (status: string) => {
    switch (status) {
      case 'pending_review':
        return <Badge variant="secondary">Pending Review</Badge>;
      case 'approved':
        return <Badge className="bg-green-100 text-green-800">Approved</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      case 'needs_revision':
        return <Badge className="bg-yellow-100 text-yellow-800">Needs Revision</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return <Badge variant="destructive">Urgent</Badge>;
      case 'high':
        return <Badge className="bg-orange-100 text-orange-800">High</Badge>;
      case 'normal':
        return <Badge variant="outline">Normal</Badge>;
      case 'low':
        return <Badge variant="secondary">Low</Badge>;
      default:
        return <Badge variant="outline">{priority}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Loading campaigns...</div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Campaign</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {campaigns.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No campaigns found for this status
                  </TableCell>
                </TableRow>
              ) : (
                campaigns.map((campaign) => {
                  const isSelected = selectedCampaign === campaign.id;
                  
                  return (
                    <TableRow 
                      key={campaign.id}
                      className={`cursor-pointer hover:bg-muted/50 ${isSelected ? 'bg-muted' : ''}`}
                      onClick={() => onSelectCampaign(campaign.id)}
                    >
                      <TableCell className="font-medium">
                        <div>
                          <div className="font-medium">{campaign.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {campaign.campaign_type}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        {campaign.brand_profiles?.company_name || 'Unknown Brand'}
                      </TableCell>
                      <TableCell>
                        {formatCurrency(campaign.budget, campaign.currency)}
                      </TableCell>
                      <TableCell>
                        {getPriorityBadge(campaign.review_priority)}
                      </TableCell>
                      <TableCell>
                        {getReviewStatusBadge(campaign.review_status)}
                      </TableCell>
                      <TableCell>
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="gap-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectCampaign(campaign.id);
                          }}
                        >
                          <Eye className="h-3 w-3" />
                          Review
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
