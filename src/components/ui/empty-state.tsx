
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
    <Card className={`border-dashed border-2 border-border ${className}`}>
      <CardContent className="flex flex-col items-center justify-center text-center space-y-6 py-16 px-8">
        <div className={`w-16 h-16 rounded-full bg-muted flex items-center justify-center ${iconClassName}`}>
          <Icon className="h-8 w-8 text-muted-foreground" />
        </div>
        
        <div className="space-y-3 max-w-md">
          <h3 className="text-xl font-medium text-foreground">{title}</h3>
          <p className="text-foreground text-base leading-relaxed">
            {description}
          </p>
        </div>
        
        {(action || secondaryAction) && (
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {action && (
              <Button 
                onClick={action.onClick}
                variant={action.variant || 'outline'}
                className="min-w-[140px]"
              >
                {action.label}
              </Button>
            )}
            {secondaryAction && (
              <Button 
                onClick={secondaryAction.onClick}
                variant={secondaryAction.variant || 'outline'}
                className="min-w-[140px]"
              >
                {secondaryAction.label}
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
