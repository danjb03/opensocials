
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
import { Trash2, CalendarRange, Wallet, FileEdit, Clock, ChevronRight, PlusCircle } from 'lucide-react'
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

  const handleCreateProject = () => {
    navigate('/brand/projects?newProject=true');
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

  const getStatusColor = (status: string) => {
    switch(status.toLowerCase()) {
      case 'live':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'draft':
        return 'bg-slate-100 text-slate-700 border-slate-200';
      case 'active':
      case 'in_progress':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'completed':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'paused':
        return 'bg-amber-100 text-amber-700 border-amber-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getCurrencySymbol = (currency: string) => {
    return currency === 'GBP' ? '£' : '$';
  };

  if (loading) {
    return (
      <Card className="shadow-md rounded-xl overflow-hidden">
        <CardHeader className="pb-0">
          <CardTitle className="text-xl font-bold flex justify-between items-center">
            <span>Your Campaigns</span>
            <Skeleton className="h-9 w-28 rounded-md" />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 pt-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex flex-col md:flex-row justify-between gap-4 p-4 border border-slate-100 rounded-lg">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-32" />
                </div>
                <div className="flex flex-col md:flex-row gap-2">
                  <Skeleton className="h-9 w-24 rounded-md" />
                  <Skeleton className="h-9 w-20 rounded-md" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="shadow-md rounded-xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Your Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-6 border border-red-200 bg-red-50 rounded-lg text-red-700">
            <h3 className="font-medium text-lg">Error loading campaigns</h3>
            <p className="text-sm mt-2">{error}</p>
            <Button variant="outline" className="mt-4 border-red-300" onClick={fetchData}>
              <Clock className="mr-2 h-4 w-4" /> Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-md rounded-xl overflow-hidden">
      <CardHeader className="pb-2 border-b border-slate-100">
        <CardTitle className="text-xl font-bold flex justify-between items-center">
          <span>Your Campaigns</span>
          <Button 
            onClick={handleCreateProject}
            size="sm"
            className="text-xs"
          >
            <PlusCircle className="h-4 w-4 mr-1" /> New Campaign
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {!data || data.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4">
            <div className="rounded-full bg-slate-100 p-4 mb-4">
              <FileEdit className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-800 mb-2">No campaigns yet</h3>
            <p className="text-center text-slate-500 mb-6 max-w-md">
              Create your first marketing campaign to start working with creators
            </p>
            <Button 
              onClick={handleCreateProject}
              size="sm"
            >
              <PlusCircle className="h-4 w-4 mr-1" /> Create First Campaign
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {data.map((item) => (
              <div key={item.project_id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <div className="flex items-center mb-1">
                      <h3 className="font-semibold text-lg text-slate-800">{item.project_name}</h3>
                      <Badge 
                        variant="outline" 
                        className={`ml-2 capitalize text-xs font-medium ${getStatusColor(item.project_status)}`}
                      >
                        {item.project_status.replace(/_/g, ' ')}
                      </Badge>
                    </div>
                    
                    <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                      <div className="flex items-center text-sm text-slate-500">
                        <CalendarRange className="h-4 w-4 mr-1.5 text-slate-400" />
                        <span>
                          {item.start_date ? format(new Date(item.start_date), 'MMM d') : '—'} → {item.end_date ? format(new Date(item.end_date), 'MMM d, yyyy') : '—'}
                        </span>
                      </div>
                      
                      <div className="flex items-center text-sm text-slate-500">
                        <Wallet className="h-4 w-4 mr-1.5 text-slate-400" />
                        <span>{getCurrencySymbol(item.currency)}{item.budget.toLocaleString()}</span>
                      </div>
                      
                      {item.creator_name && (
                        <div className="flex items-center text-sm text-slate-500">
                          <span className="flex items-center">
                            {item.avatar_url ? (
                              <img 
                                src={item.avatar_url} 
                                alt={item.creator_name} 
                                className="h-5 w-5 rounded-full mr-1.5"
                              />
                            ) : (
                              <div className="h-5 w-5 rounded-full bg-slate-200 mr-1.5"></div>
                            )}
                            {item.creator_name}
                            {item.engagement_rate && <span className="ml-1 text-xs text-slate-400">({item.engagement_rate} ER)</span>}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 self-start md:self-center">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="outline" 
                          className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                          size="sm"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="border-0 shadow-lg">
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
                      onClick={() => handleViewProject(item.project_id)}
                      size="sm"
                      className="text-xs"
                    >
                      View
                      <ChevronRight className="h-3.5 w-3.5 ml-0.5" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
