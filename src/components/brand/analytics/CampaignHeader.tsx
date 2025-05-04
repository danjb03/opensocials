
import { ArrowLeft, Download, Share2, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface CampaignHeaderProps {
  projectName: string;
  projectId: string;
}

export const CampaignHeader = ({ projectName, projectId }: CampaignHeaderProps) => {
  const navigate = useNavigate();
  
  const handleBackClick = () => {
    // Navigate back to analytics list page instead of project page
    navigate('/brand/analytics');
  };
  
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={handleBackClick}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Analytics
        </Button>
        <h1 className="text-3xl font-bold">{projectName} Analytics</h1>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
        <Button variant="outline">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
        <Button variant="outline">
          <CalendarDays className="h-4 w-4 mr-2" />
          Last 7 Days
        </Button>
      </div>
    </div>
  );
};
