
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router-dom'
import { toast } from '@/components/ui/sonner'

type CampaignRow = {
  project_id: string
  project_name: string
  project_status: string
  start_date: string | null
  end_date: string | null
  budget: number
  currency: string
  deal_id: string | null
  deal_status: string | null
  deal_value: number | null
  creator_name: string | null
  avatar_url: string | null
  engagement_rate: string | null
  primary_platform: string | null
}

export default function BrandCampaignTable() {
  const [data, setData] = useState<CampaignRow[] | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get the session
        const { data: sessionData } = await supabase.auth.getSession();
        const accessToken = sessionData.session?.access_token;

        if (!accessToken) {
          toast.error("Authentication error. Please sign in again.");
          return;
        }

        const res = await fetch('/functions/v1/get-brand-projects', {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch campaign data');
        }

        const json = await res.json();
        setData(json);
      } catch (error) {
        console.error("Error fetching campaign data:", error);
        toast.error("Failed to load campaigns");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleViewProject = (projectId: string) => {
    navigate(`/brand/orders?projectId=${projectId}`);
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-md" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Your Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-muted-foreground">
            No active campaigns found.
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Your Campaigns</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 divide-y">
          {data.map((item) => (
            <div key={item.project_id} className="py-4 flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{item.project_name}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.start_date ? format(new Date(item.start_date), 'MMM d') : '—'} → {item.end_date ? format(new Date(item.end_date), 'MMM d') : '—'}
                </p>
              </div>
              <div className="text-sm flex flex-col items-start md:items-end">
                <Badge variant={item.project_status === 'live' ? 'default' : 'outline'} className="mb-1 capitalize">
                  {item.project_status}
                </Badge>
                {item.creator_name ? (
                  <p>
                    <span className="font-medium">{item.creator_name}</span> — {item.engagement_rate ?? '—'} ER
                  </p>
                ) : (
                  <span className="text-muted-foreground">No creator yet</span>
                )}
                <p className="text-muted-foreground">{item.currency === 'GBP' ? '£' : '$'}{item.budget} total</p>
                {item.deal_status && <p className="text-xs mt-1 text-muted-foreground">Deal: {item.deal_status}</p>}
              </div>
              <Button 
                variant="secondary" 
                className="self-center"
                onClick={() => handleViewProject(item.project_id)}
              >
                View
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
