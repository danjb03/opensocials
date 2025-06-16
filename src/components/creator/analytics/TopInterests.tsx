
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface TopInterestsProps {
  topInterests: string[];
}

export const TopInterests: React.FC<TopInterestsProps> = ({ topInterests }) => {
  if (!topInterests) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Audience Interests</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {topInterests.slice(0, 15).map((interest: string, index: number) => (
            <Badge key={index} variant="outline" className="text-sm">
              {interest}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
