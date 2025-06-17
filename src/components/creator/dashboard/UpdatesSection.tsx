
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Clock, DollarSign } from 'lucide-react';

const UpdatesSection: React.FC = () => {
  const updates = [
    {
      id: 1,
      type: 'payment',
      title: 'Payment processed',
      description: 'Your payment for "Summer Fashion Campaign" has been processed.',
      time: '2 hours ago',
      icon: DollarSign,
      badge: 'Payment'
    },
    {
      id: 2,
      type: 'approval',
      title: 'Content approved',
      description: 'Your Instagram post for "Tech Product Launch" was approved by the brand.',
      time: '5 hours ago',
      icon: CheckCircle,
      badge: 'Approved'
    },
    {
      id: 3,
      type: 'deadline',
      title: 'Upcoming deadline',
      description: 'Content for "Holiday Collection" campaign is due in 2 days.',
      time: '1 day ago',
      icon: Clock,
      badge: 'Reminder'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {updates.map((update) => (
            <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
              <update.icon className="h-5 w-5 mt-0.5 text-muted-foreground" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-sm">{update.title}</h4>
                  <Badge variant="outline" className="text-xs">
                    {update.badge}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-1">
                  {update.description}
                </p>
                <p className="text-xs text-muted-foreground">
                  {update.time}
                </p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpdatesSection;
