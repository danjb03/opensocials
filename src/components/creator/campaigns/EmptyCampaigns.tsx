
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, CheckCircle, Clock, Search, Users } from 'lucide-react';

interface EmptyCampaignsProps {
  type: 'active' | 'upcoming' | 'completed';
}

const EmptyCampaigns: React.FC<EmptyCampaignsProps> = ({ type }) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'active':
        return {
          icon: Clock,
          title: "No Active Campaigns",
          description: "You don't have any active campaigns at the moment. Check your invitations or browse available opportunities.",
          action: "Browse Opportunities",
          color: "text-green-400",
          bgColor: "bg-green-500/10"
        };
      case 'upcoming':
        return {
          icon: CalendarDays,
          title: "No Upcoming Campaigns",
          description: "No campaigns are scheduled to start soon. Keep an eye on your invitations for new opportunities.",
          action: "View Invitations",
          color: "text-blue-400",
          bgColor: "bg-blue-500/10"
        };
      case 'completed':
        return {
          icon: CheckCircle,
          title: "No Completed Campaigns",
          description: "You haven't completed any campaigns yet. Once you finish your first campaign, it will appear here.",
          action: "View Active Campaigns",
          color: "text-purple-400",
          bgColor: "bg-purple-500/10"
        };
      default:
        return {
          icon: Search,
          title: "No Campaigns Found",
          description: "No campaigns match your current filters.",
          action: "Clear Filters",
          color: "text-muted-foreground",
          bgColor: "bg-muted/10"
        };
    }
  };

  const config = getEmptyStateConfig();
  const IconComponent = config.icon;

  return (
    <Card className="border-dashed border-2 border-border bg-muted/5">
      <CardContent className="flex flex-col items-center justify-center py-16 px-8 text-center">
        <div className={`w-16 h-16 rounded-full ${config.bgColor} flex items-center justify-center mb-6`}>
          <IconComponent className={`h-8 w-8 ${config.color}`} />
        </div>
        
        <h3 className="text-xl font-semibold text-foreground mb-3">
          {config.title}
        </h3>
        
        <p className="text-muted-foreground mb-6 max-w-md leading-relaxed">
          {config.description}
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Button variant="outline" className="gap-2">
            <Users className="h-4 w-4" />
            {config.action}
          </Button>
          
          <Button variant="ghost" className="gap-2">
            <Search className="h-4 w-4" />
            Browse All Campaigns
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default EmptyCampaigns;
