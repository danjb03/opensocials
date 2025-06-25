
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, CheckCircle, Clock, DollarSign, Mail, MessageSquare } from 'lucide-react';
import { useCreatorUpdates } from '@/hooks/creator/useCreatorUpdates';

const UpdatesSection: React.FC = () => {
  const { data: updates = [], isLoading } = useCreatorUpdates();

  const getUpdateIcon = (type: string) => {
    switch (type) {
      case 'payment':
        return DollarSign;
      case 'approval':
        return CheckCircle;
      case 'deadline':
        return Clock;
      case 'invitation':
        return Mail;
      case 'content_feedback':
        return MessageSquare;
      default:
        return Bell;
    }
  };

  const getUpdateIconColor = (type: string) => {
    switch (type) {
      case 'payment':
        return 'text-green-500';
      case 'approval':
        return 'text-blue-500';
      case 'deadline':
        return 'text-orange-500';
      case 'invitation':
        return 'text-purple-500';
      case 'content_feedback':
        return 'text-yellow-500';
      default:
        return 'text-muted-foreground';
    }
  };

  if (isLoading) {
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
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Recent Updates
        </CardTitle>
      </CardHeader>
      <CardContent>
        {updates.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No recent updates</p>
            <p className="text-sm text-muted-foreground mt-1">
              Your campaign activities will appear here
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {updates.map((update) => {
              const Icon = getUpdateIcon(update.type);
              const iconColor = getUpdateIconColor(update.type);

              return (
                <div key={update.id} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                  <Icon className={`h-5 w-5 mt-0.5 ${iconColor}`} />
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
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UpdatesSection;
