
import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, CheckCircle, Clock } from 'lucide-react';
import { EmptyState } from '@/components/ui/empty-state';

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
          description: 'You don\'t have any active campaigns right now. Check your deals to see if there are any opportunities waiting for you.',
          actionLabel: 'View Deals'
        };
      case 'upcoming':
        return {
          icon: Calendar,
          title: 'No Upcoming Campaigns',
          description: 'You don\'t have any upcoming campaigns scheduled. New partnership opportunities will appear here after you accept a deal.',
          actionLabel: 'Check Available Deals'
        };
      case 'completed':
        return {
          icon: CheckCircle,
          title: 'No Completed Campaigns',
          description: 'You haven\'t completed any campaigns yet. Once you finish an active campaign, it will appear here.',
          actionLabel: 'Go to Active Campaigns'
        };
      default:
        return {
          icon: Clock,
          title: 'No Campaigns Found',
          description: 'No campaigns match your current filter.',
          actionLabel: 'View All Campaigns'
        };
    }
  };

  const config = getEmptyStateConfig();

  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      action={{
        label: config.actionLabel,
        onClick: () => {},
        variant: 'outline'
      }}
    />
  );
};

export default EmptyCampaigns;
