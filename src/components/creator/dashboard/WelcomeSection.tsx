
import React from 'react';

interface WelcomeSectionProps {
  firstName?: string;
}

const WelcomeSection: React.FC<WelcomeSectionProps> = ({ firstName }) => {
  return (
    <div className="bg-card rounded-lg p-6 border border-border">
      <h1 className="text-2xl font-bold text-foreground mb-2">
        Welcome back{firstName ? `, ${firstName}` : ''}!
      </h1>
      <p className="text-muted-foreground">
        Here's your creator dashboard overview. Track your campaigns, earnings, and performance metrics.
      </p>
    </div>
  );
};

export default WelcomeSection;
