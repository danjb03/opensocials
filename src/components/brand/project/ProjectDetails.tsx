
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/utils/project';
import { ContentRequirements } from '@/types/project';
import { FileText, CheckCircle } from 'lucide-react';

interface ProjectDetailsProps {
  project: any;
}

export const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project }) => {
  // Format dates for display
  const startDate = project.start_date ? new Date(project.start_date) : null;
  const endDate = project.end_date ? new Date(project.end_date) : null;
  
  const formattedStartDate = startDate ? startDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : 'Not set';
  
  const formattedEndDate = endDate ? endDate.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }) : 'Not set';
  
  // Calculate campaign duration in days if both dates are available
  let campaignDuration = null;
  if (startDate && endDate) {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    campaignDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }

  // Extract content requirements with proper type handling
  const contentRequirements = project.content_requirements as ContentRequirements | null;
  const isBriefUploaded = contentRequirements?.brief_uploaded || false;
  const briefFilesList = contentRequirements?.brief_files || [];

  return (
    <Card className="shadow-sm">
      <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
        <CardTitle className="text-xl">Campaign Details</CardTitle>
        <CardDescription>Complete information about this campaign</CardDescription>
      </CardHeader>
      <CardContent className="divide-y">
        <div className="py-4 grid grid-cols-2">
          <div className="font-medium text-gray-700">Campaign Type</div>
          <div className="capitalize font-medium">{project.campaign_type.replace('_', ' ')}</div>
        </div>
        
        <div className="py-4 grid grid-cols-2">
          <div className="font-medium text-gray-700">Timeline</div>
          <div>
            <div className="font-medium">{formattedStartDate} - {formattedEndDate}</div>
            {campaignDuration && <div className="text-sm text-blue-600 mt-1">{campaignDuration} days duration</div>}
          </div>
        </div>
        
        <div className="py-4 grid grid-cols-2">
          <div className="font-medium text-gray-700">Budget</div>
          <div className="font-medium">{formatCurrency(project.budget, project.currency)}</div>
        </div>
        
        <div className="py-4 grid grid-cols-2">
          <div className="font-medium text-gray-700">Platforms</div>
          <div>
            <div className="flex flex-wrap gap-2">
              {project.platforms?.map((platform: string) => (
                <Badge key={platform} variant="outline" className="capitalize shadow-sm bg-blue-50">{platform}</Badge>
              )) || "None specified"}
            </div>
          </div>
        </div>
        
        {contentRequirements && (
          <div className="py-4 grid grid-cols-2">
            <div className="font-medium text-gray-700">Content Requirements</div>
            <div className="space-y-2">
              {Object.entries(contentRequirements).map(([type, data]: [string, any]) => {
                if (type === 'brief_uploaded' || type === 'brief_files') return null;
                return (
                  <div key={type} className="flex items-center gap-2">
                    <Badge className="bg-indigo-100 text-indigo-800 hover:bg-indigo-200">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </Badge>
                    <span>{data.quantity} {data.quantity === 1 ? 'item' : 'items'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        
        {project.whitelisting !== undefined && (
          <div className="py-4 grid grid-cols-2">
            <div className="font-medium text-gray-700">Whitelisting</div>
            <div>{project.whitelisting ? 
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Required</Badge> : 
              <Badge variant="outline" className="bg-gray-50">Not required</Badge>}
            </div>
          </div>
        )}
        
        {project.description && (
          <div className="py-4">
            <div className="font-medium text-gray-700 mb-2">Description</div>
            <div className="text-gray-700 bg-gray-50 p-4 rounded-md border">
              {project.description}
            </div>
          </div>
        )}
        
        {/* Show uploaded brief files if already uploaded */}
        {isBriefUploaded && briefFilesList.length > 0 && (
          <div className="py-4">
            <div className="font-medium text-gray-700 mb-2">Uploaded Campaign Materials</div>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-green-700">Brief and contract uploaded</span>
              </div>
              
              <div className="mt-2">
                <p className="text-sm font-medium text-gray-700 mb-1">Files:</p>
                <div className="space-y-1 bg-white p-3 rounded-md border">
                  {briefFilesList.map((fileName: string, index: number) => (
                    <div key={index} className="flex items-center">
                      <FileText className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-sm text-gray-600">{fileName}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
