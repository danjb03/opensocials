
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { AlertCircle, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CampaignNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="container mx-auto p-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/creator/campaigns')} 
        className="mb-6"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back to Campaigns
      </Button>
      
      <Card>
        <CardContent className="p-12 flex flex-col items-center justify-center text-center">
          <AlertCircle className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-2xl font-bold mb-2">Campaign Not Found</h2>
          <p className="text-muted-foreground mb-6">
            The campaign you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate('/creator/campaigns')}>View All Campaigns</Button>
        </CardContent>
      </Card>
    </div>
  );
};
