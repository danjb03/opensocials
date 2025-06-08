
import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
    variant?: 'default' | 'outline' | 'secondary';
  };
  className?: string;
  iconClassName?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  secondaryAction,
  className = '',
  iconClassName = ''
}: EmptyStateProps) {
  return (
    <div className={`flex items-center justify-center py-12 px-4 animate-fade-in ${className}`}>
      <Card className="w-full max-w-md border-dashed">
        <CardContent className="pt-8 pb-8 text-center space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center animate-scale-in ${iconClassName}`}>
            <Icon className="h-6 w-6 text-muted-foreground" />
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground max-w-sm mx-auto">
              {description}
            </p>
          </div>
          
          {(action || secondaryAction) && (
            <div className="flex flex-col sm:flex-row gap-2 pt-2">
              {action && (
                <Button 
                  onClick={action.onClick}
                  variant={action.variant || 'default'}
                  className="flex-1"
                >
                  {action.label}
                </Button>
              )}
              {secondaryAction && (
                <Button 
                  onClick={secondaryAction.onClick}
                  variant={secondaryAction.variant || 'outline'}
                  className="flex-1"
                >
                  {secondaryAction.label}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
