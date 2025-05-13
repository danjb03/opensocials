
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyCampaignsProps {
  type: 'active' | 'upcoming' | 'completed';
}

const EmptyCampaigns: React.FC<EmptyCampaignsProps> = ({ type }) => {
  const renderContent = () => {
    switch (type) {
      case 'active':
        return {
          icon: <Clock className="h-12 w-12 text-muted-foreground/60" />,
          title: 'No Active Campaigns',
          description: 'You don\'t have any active campaigns right now. Check your deals to see if there are any opportunities waiting for you.',
          actionText: 'View Deals'
        };
      case 'upcoming':
        return {
          icon: <Calendar className="h-12 w-12 text-muted-foreground/60" />,
          title: 'No Upcoming Campaigns',
          description: 'You don\'t have any upcoming campaigns scheduled. New partnership opportunities will appear here after you accept a deal.',
          actionText: 'Check Available Deals'
        };
      case 'completed':
        return {
          icon: <CheckCircle className="h-12 w-12 text-muted-foreground/60" />,
          title: 'No Completed Campaigns',
          description: 'You haven\'t completed any campaigns yet. Once you finish an active campaign, it will appear here.',
          actionText: 'Go to Active Campaigns'
        };
      default:
        return {
          icon: <Clock className="h-12 w-12 text-muted-foreground/60" />,
          title: 'No Campaigns Found',
          description: 'No campaigns match your current filter.',
          actionText: 'View All Campaigns'
        };
    }
  };

  const content = renderContent();

  return (
    <Card className="border-dashed">
      <CardContent className="p-6 flex flex-col items-center justify-center text-center space-y-4">
        <div className="p-3 bg-muted rounded-full">
          {content.icon}
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-medium">{content.title}</h3>
          <p className="text-muted-foreground max-w-md">
            {content.description}
          </p>
        </div>
        <Button asChild>
          <Link to="/creator/deals">
            {content.actionText}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyCampaigns;
