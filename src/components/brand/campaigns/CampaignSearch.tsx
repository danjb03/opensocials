
import React, { useState } from 'react';
import { Search, Database, AlertCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useCampaignSearch } from '@/hooks/brand/useCampaignSearch';

interface CampaignSearchProps {
  onClose: () => void;
}

export const CampaignSearch: React.FC<CampaignSearchProps> = ({ onClose }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const { allCampaigns, isLoading } = useCampaignSearch(searchTerm);

  const getStatusColor = (status: string, reviewStatus?: string) => {
    if (reviewStatus === 'pending_review') return 'bg-yellow-100 text-yellow-800';
    if (reviewStatus === 'approved') return 'bg-green-100 text-green-800';
    if (reviewStatus === 'rejected') return 'bg-red-100 text-red-800';
    if (status === 'draft') return 'bg-gray-100 text-gray-800';
    if (status === 'active') return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  const getTableSourceColor = (source: string) => {
    switch (source) {
      case 'projects_new': return 'bg-green-100 text-green-800';
      case 'projects': return 'bg-blue-100 text-blue-800';
      case 'project_drafts': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <CardHeader className="border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-6 w-6" />
              <CardTitle>Campaign Search & Recovery</CardTitle>
            </div>
            <Button variant="outline" size="sm" onClick={onClose}>
              Close
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search campaigns by name, description, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-900">Campaign Recovery</h4>
                <p className="text-yellow-700 text-sm mt-1">
                  This tool searches across all campaign tables to help you find missing campaigns. 
                  Look for campaigns with "trading" in the name or description.
                </p>
              </div>
            </div>
          </div>

          <div className="overflow-auto max-h-96 space-y-3">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Searching campaigns...
              </div>
            ) : allCampaigns.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No campaigns found matching your search.' : 'No campaigns found.'}
              </div>
            ) : (
              allCampaigns.map((campaign) => (
                <Card key={`${campaign.table_source}-${campaign.id}`} className="border-l-4 border-l-blue-500">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-semibold">{campaign.name}</h4>
                          <Badge className={getStatusColor(campaign.status, campaign.review_status)}>
                            {campaign.review_status || campaign.status}
                          </Badge>
                          <Badge variant="outline" className={getTableSourceColor(campaign.table_source)}>
                            {campaign.table_source}
                          </Badge>
                        </div>
                        {campaign.description && (
                          <p className="text-sm text-muted-foreground mb-2">{campaign.description}</p>
                        )}
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>ID: {campaign.id}</span>
                          <span>Created: {new Date(campaign.created_at).toLocaleDateString()}</span>
                          {campaign.budget && (
                            <span>Budget: {campaign.currency} {campaign.budget.toLocaleString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
