
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
import { Trash2 } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'

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
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const navigate = useNavigate();

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get the session
      const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        throw new Error(`Session error: ${sessionError.message}`);
      }
      
      const accessToken = sessionData.session?.access_token;

      if (!accessToken) {
        toast.error("Authentication error. Please sign in again.");
        return;
      }

      // Using direct Supabase query instead of Edge Function
      const { data: projectsData, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('brand_id', sessionData.session?.user.id)
        .order('created_at', { ascending: false });

      if (projectsError) {
        console.error("Projects query error:", projectsError);
        throw new Error(`Failed to fetch projects: ${projectsError.message}`);
      }

      // Transform the data to match the expected format
      const campaignRows: CampaignRow[] = projectsData.map(project => ({
        project_id: project.id,
        project_name: project.name,
        project_status: project.status || 'draft',
        start_date: project.start_date,
        end_date: project.end_date,
        budget: project.budget || 0,
        currency: project.currency || 'USD',
        deal_id: null,
        deal_status: null,
        deal_value: null,
        creator_name: null,
        avatar_url: null,
        engagement_rate: null,
        primary_platform: null
      }));

      console.log("Campaigns fetched successfully:", campaignRows);
      setData(campaignRows);
    } catch (error) {
      console.error("Error fetching campaign data:", error);
      setError(error.message);
      toast.error("Failed to load campaigns");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleViewProject = (projectId: string) => {
    navigate(`/brand/orders?projectId=${projectId}`);
  };

  const handleDeleteProject = async (projectId: string) => {
    setDeletingId(projectId);
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      
      toast.success("Campaign successfully deleted");
      
      // Remove the deleted item from the state
      setData(data => data ? data.filter(item => item.project_id !== projectId) : null);
    } catch (error) {
      console.error("Error deleting campaign:", error);
      toast.error("Failed to delete campaign");
    } finally {
      setDeletingId(null);
    }
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

  if (error) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Your Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 border border-red-200 bg-red-50 rounded-md text-red-700">
            <h3 className="font-medium">Error loading campaigns</h3>
            <p className="text-sm mt-1">{error}</p>
            <Button variant="outline" className="mt-2" onClick={fetchData}>
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
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
              <div className="flex self-center gap-2">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-red-200 text-red-600 hover:bg-red-50"
                      size="sm"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete "{item.project_name}"? This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction 
                        onClick={() => handleDeleteProject(item.project_id)} 
                        className="bg-red-600 hover:bg-red-700 text-white"
                        disabled={deletingId === item.project_id}
                      >
                        {deletingId === item.project_id ? "Deleting..." : "Delete Campaign"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
                
                <Button 
                  variant="secondary" 
                  onClick={() => handleViewProject(item.project_id)}
                >
                  View
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
