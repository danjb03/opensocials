
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bot, Clock, CheckCircle, XCircle, AlertTriangle, TrendingUp } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface ReviewStats {
  pending: number;
  under_review: number;
  approved: number;
  rejected: number;
  needs_revision: number;
  ai_approved: number;
  ai_flagged: number;
  avg_review_time: number;
}

export function ReviewStats() {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['review-stats'],
    queryFn: async (): Promise<ReviewStats> => {
      try {
        const { data: projects } = await supabase
          .from('projects_new')
          .select(`
            review_status,
            created_at,
            campaign_reviews (
              ai_decision,
              reviewed_at,
              created_at
            )
          `);

        if (!projects) return {
          pending: 0,
          under_review: 0,
          approved: 0,
          rejected: 0,
          needs_revision: 0,
          ai_approved: 0,
          ai_flagged: 0,
          avg_review_time: 0
        };

        const stats = {
          pending: projects.filter(p => p.review_status === 'pending_review').length,
          under_review: projects.filter(p => p.review_status === 'under_review').length,
          approved: projects.filter(p => p.review_status === 'approved').length,
          rejected: projects.filter(p => p.review_status === 'rejected').length,
          needs_revision: projects.filter(p => p.review_status === 'needs_revision').length,
          ai_approved: 0,
          ai_flagged: 0,
          avg_review_time: 0
        };

        // Count AI decisions
        projects.forEach(project => {
          project.campaign_reviews?.forEach(review => {
            if (review.ai_decision === 'approved') stats.ai_approved++;
            if (review.ai_decision === 'flagged') stats.ai_flagged++;
          });
        });

        return stats;
      } catch (error) {
        console.error('Error fetching review stats:', error);
        return {
          pending: 0,
          under_review: 0,
          approved: 0,
          rejected: 0,
          needs_revision: 0,
          ai_approved: 0,
          ai_flagged: 0,
          avg_review_time: 0
        };
      }
    },
  });

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Loading...</CardTitle>
              <div className="h-4 w-4 bg-muted rounded animate-pulse" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">-</div>
              <p className="text-xs text-muted-foreground">Loading...</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const reviewCards = [
    {
      title: 'Pending Review',
      value: stats?.pending || 0,
      description: 'Awaiting initial review',
      icon: Clock,
      color: 'text-yellow-600',
      alert: (stats?.pending || 0) > 10,
    },
    {
      title: 'Under Review',
      value: stats?.under_review || 0,
      description: 'Currently being analyzed',
      icon: TrendingUp,
      color: 'text-blue-600',
    },
    {
      title: 'AI Approved',
      value: stats?.ai_approved || 0,
      description: 'Passed AI validation',
      icon: Bot,
      color: 'text-green-600',
    },
    {
      title: 'Flagged by AI',
      value: stats?.ai_flagged || 0,
      description: 'Requires manual review',
      icon: AlertTriangle,
      color: 'text-orange-600',
      alert: (stats?.ai_flagged || 0) > 0,
    },
    {
      title: 'Approved',
      value: stats?.approved || 0,
      description: 'Ready to go live',
      icon: CheckCircle,
      color: 'text-green-600',
    },
    {
      title: 'Rejected',
      value: stats?.rejected || 0,
      description: 'Did not meet criteria',
      icon: XCircle,
      color: 'text-red-600',
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {reviewCards.map((card) => (
        <Card key={card.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
            <div className="flex items-center gap-2">
              {card.alert && (
                <Badge variant="destructive" className="text-xs">
                  Alert
                </Badge>
              )}
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-muted-foreground">{card.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
