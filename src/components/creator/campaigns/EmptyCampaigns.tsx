
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock, ArrowRight, Sparkles } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

interface EmptyCampaignsProps {
  type: 'active' | 'upcoming' | 'completed';
}

const EmptyCampaigns: React.FC<EmptyCampaignsProps> = ({ type }) => {
  const getEmptyStateConfig = () => {
    switch (type) {
      case 'active':
        return {
          icon: Clock,
          title: 'No Active Campaigns',
          description: 'You don\'t have any campaigns currently running. Check your invitations to see if there are new opportunities waiting for you to accept.',
          actionLabel: 'View Invitations',
          actionPath: '/creator/invitations',
          gradient: 'from-green-500/10 to-blue-500/10',
          iconColor: 'text-green-400'
        };
      case 'upcoming':
        return {
          icon: Calendar,
          title: 'No Upcoming Campaigns',
          description: 'You don\'t have any campaigns scheduled to start soon. Once you accept invitations, they\'ll appear here when they\'re ready to begin.',
          actionLabel: 'Browse Invitations',
          actionPath: '/creator/invitations',
          gradient: 'from-blue-500/10 to-purple-500/10',
          iconColor: 'text-blue-400'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          title: 'No Completed Campaigns',
          description: 'You haven\'t finished any campaigns yet. Once you complete your active campaigns, they\'ll appear here with your performance results.',
          actionLabel: 'View Active Campaigns',
          actionPath: '/creator/campaigns',
          gradient: 'from-purple-500/10 to-pink-500/10',
          iconColor: 'text-purple-400'
        };
      default:
        return {
          icon: Clock,
          title: 'No Campaigns Found',
          description: 'No campaigns match your current filter.',
          actionLabel: 'View All Campaigns',
          actionPath: '/creator/campaigns',
          gradient: 'from-gray-500/10 to-gray-500/10',
          iconColor: 'text-gray-400'
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <div className="flex flex-col items-center justify-center py-16 px-6">
      <div className={`w-24 h-24 rounded-2xl bg-gradient-to-r ${config.gradient} backdrop-blur flex items-center justify-center mb-8`}>
        <config.icon className={`h-12 w-12 ${config.iconColor}`} />
      </div>
      
      <div className="text-center max-w-md mb-8">
        <h3 className="text-2xl font-light text-foreground mb-3">{config.title}</h3>
        <p className="text-muted-foreground leading-relaxed">{config.description}</p>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Button
          asChild
          variant="outline"
          size="lg"
          className="border-border hover:bg-muted/50 hover:border-blue-500/20 hover:text-blue-400 transition-all group"
        >
          <Link to={config.actionPath} className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 group-hover:scale-110 transition-transform" />
            {config.actionLabel}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
        
        <Button
          asChild
          variant="ghost"
          size="lg"
          className="text-muted-foreground hover:text-foreground"
        >
          <Link to="/creator/dashboard">
            Back to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default EmptyCampaigns;
