
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, DollarSign, BarChart2 } from 'lucide-react';

interface CampaignActionsProps {
  projectId: string;
  currentStep: number;
  onNavigateTo: (path: string) => void;
}

export const CampaignActions: React.FC<CampaignActionsProps> = ({
  projectId,
  currentStep,
  onNavigateTo,
}) => {
  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl">Campaign Actions</CardTitle>
      </CardHeader>
      <CardContent className="py-6">
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start shadow-sm transition-colors hover:bg-blue-50"
            onClick={() => onNavigateTo(`/brand/projects/edit/${projectId}`)}
          >
            <FileText className="mr-2 h-4 w-4 text-blue-600" />
            Edit Campaign
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start shadow-sm transition-colors hover:bg-blue-50"
            onClick={() => onNavigateTo(`/brand/projects/budget/${projectId}`)}
          >
            <DollarSign className="mr-2 h-4 w-4 text-indigo-600" />
            Manage Budget
          </Button>
          <Button 
            variant="outline" 
            className="w-full justify-start shadow-sm transition-colors hover:bg-blue-50"
            onClick={() => onNavigateTo(`/brand/projects/analytics/${projectId}`)}
            disabled={currentStep < 6} // Only active in Performance Reporting stage
          >
            <BarChart2 className="mr-2 h-4 w-4 text-green-600" />
            View Analytics
            {currentStep < 6 && (
              <Badge className="ml-2 bg-gray-100 text-gray-500">Available in final stage</Badge>
            )}
          </Button>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-6 py-3 border-t">
        <p className="text-xs text-gray-500 w-full text-center">
          Additional actions will be available as the campaign progresses
        </p>
      </CardFooter>
    </Card>
  );
};
