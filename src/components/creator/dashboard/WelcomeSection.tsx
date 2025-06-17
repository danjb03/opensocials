
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface WelcomeSectionProps {
  firstName?: string | null;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ firstName }) => {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const name = firstName || 'Creator';

  return (
    <Card className="mb-6">
      <CardContent className="p-6">
        <div className="flex items-center gap-3">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <h1 className="text-2xl font-bold">
              {getGreeting()}, {name}!
            </h1>
            <p className="text-muted-foreground">
              Ready to create amazing content today? Let's see what's happening with your campaigns.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default WelcomeSection;
