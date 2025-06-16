
import React from 'react';
import { Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const NextStepsCard: React.FC = () => {
  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2 text-foreground">
          <Target className="h-5 w-5" />What Happens Next?
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30 flex items-center justify-center text-xs font-medium">1</div>
            <p className="text-foreground">Selected creators will receive campaign invitations immediately</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30 flex items-center justify-center text-xs font-medium">2</div>
            <p className="text-foreground">Creators have 48 hours to accept or decline the collaboration</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30 flex items-center justify-center text-xs font-medium">3</div>
            <p className="text-foreground">You'll receive notifications as creators respond to your campaign</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-blue-600/20 text-blue-400 border border-blue-600/30 flex items-center justify-center text-xs font-medium">4</div>
            <p className="text-foreground">Campaign tracking and analytics become available once creators start posting</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
