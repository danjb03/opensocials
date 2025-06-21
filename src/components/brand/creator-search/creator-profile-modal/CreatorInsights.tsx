
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, AlertTriangle, Star, Target } from 'lucide-react';
import { Creator } from '@/types/creator';

interface CreatorInsightsProps {
  creator: Creator;
}

export const CreatorInsights = ({ creator }: CreatorInsightsProps) => {
  // Mock insights data - in a real app, this would come from API analysis
  const insights = {
    strengths: [
      'High engagement rate compared to follower count',
      'Consistent posting schedule',
      'Strong audience authenticity',
      'Good brand collaboration history'
    ],
    considerations: [
      'Recent slight dip in engagement',
      'Limited experience with your industry'
    ],
    brandFit: 85,
    campaignRecommendation: 'Highly Recommended',
    bestContentTypes: ['Product Reviews', 'Lifestyle Posts', 'Stories'],
    audienceAlignment: 92
  };

  const getRecommendationColor = (recommendation: string) => {
    switch (recommendation) {
      case 'Highly Recommended': return 'text-green-600 bg-green-50';
      case 'Recommended': return 'text-blue-600 bg-blue-50';
      case 'Consider': return 'text-yellow-600 bg-yellow-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Campaign Fit Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Campaign Fit Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-4">
            <div className="text-4xl font-bold text-green-600 mb-2">{insights.brandFit}%</div>
            <div className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getRecommendationColor(insights.campaignRecommendation)}`}>
              {insights.campaignRecommendation}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 mt-6">
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{insights.audienceAlignment}%</div>
              <div className="text-sm text-muted-foreground">Audience Alignment</div>
            </div>
            <div className="text-center p-3 bg-muted rounded-lg">
              <div className="text-2xl font-bold text-purple-600">A+</div>
              <div className="text-sm text-muted-foreground">Content Quality</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-600">
            <CheckCircle className="h-5 w-5" />
            Key Strengths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.strengths.map((strength, index) => (
              <div key={index} className="flex items-start gap-3">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{strength}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Considerations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Considerations
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.considerations.map((consideration, index) => (
              <div key={index} className="flex items-start gap-3">
                <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{consideration}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Content Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star className="h-5 w-5" />
            Recommended Content Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {insights.bestContentTypes.map((type, index) => (
              <Badge key={index} variant="secondary" className="flex items-center gap-1">
                <Star className="h-3 w-3" />
                {type}
              </Badge>
            ))}
          </div>
          <p className="text-sm text-muted-foreground mt-3">
            Based on this creator's past performance and audience engagement patterns.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
