
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/components/ui/sonner';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

type Project = {
  id: string;
  name: string;
  campaign_type: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  platforms: string[];
  status: string;
  is_priority: boolean;
};

type ProjectStatus = 'new' | 'under_review' | 'awaiting_approval' | 'creators_assigned' | 'in_progress' | 'completed';

const statusOptions: { value: ProjectStatus; label: string }[] = [
  { value: 'new', label: 'New' },
  { value: 'under_review', label: 'Under Review' },
  { value: 'awaiting_approval', label: 'Awaiting Approval' },
  { value: 'creators_assigned', label: 'Creators Assigned' },
  { value: 'in_progress', label: 'In Progress' },
  { value: 'completed', label: 'Completed' }
];

const statusColors: Record<ProjectStatus, string> = {
  new: 'bg-blue-100 text-blue-800',
  under_review: 'bg-purple-100 text-purple-800',
  awaiting_approval: 'bg-yellow-100 text-yellow-800',
  creators_assigned: 'bg-green-100 text-green-800',
  in_progress: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-gray-100 text-gray-800'
};

const formatCurrency = (amount: number, currency: string = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const ProjectManagement = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    fetchProjects();
  
    // Set up a subscription to project changes
    const channel = supabase
      .channel('public:projects')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'projects' }, (payload) => {
        fetchProjects();
      })
      .subscribe();
      
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        throw error;
      }

      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const updateProjectStatus = async (projectId: string, newStatus: ProjectStatus) => {
    try {
      const { error } = await supabase
        .from('projects')
        .update({ status: newStatus })
        .eq('id', projectId);

      if (error) {
        throw error;
      }

      toast.success('Project status updated successfully');
      
      // Update local state for immediate UI update
      setProjects(projects.map(project => 
        project.id === projectId ? { ...project, status: newStatus } : project
      ));
    } catch (error) {
      console.error('Error updating project status:', error);
      toast.error('Failed to update project status');
    }
  };

  const handleStatusChange = (projectId: string, newStatus: ProjectStatus) => {
    updateProjectStatus(projectId, newStatus);
  };

  const handleSuggestCreators = (projectId: string) => {
    toast.info('Creator suggestion functionality coming soon!');
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Projects Dashboard</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg text-gray-500">Loading projects...</div>
        </div>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="container mx-auto py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Projects Dashboard</h1>
        <Card className="w-full h-64 flex items-center justify-center">
          <CardContent className="text-center p-6">
            <h3 className="text-xl font-medium mb-2">No Projects Found</h3>
            <p className="text-muted-foreground mb-4">
              There are no projects in the system yet. Once brands create projects, they will appear here.
            </p>
            <Button variant="outline" onClick={fetchProjects}>
              Refresh
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Admin Projects Dashboard</h1>
      
      {isMobile ? (
        // Mobile view - cards
        <div className="grid grid-cols-1 gap-6">
          {projects.map(project => (
            <Card key={project.id} className="w-full">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle className="text-xl">{project.name}</CardTitle>
                  {project.is_priority && (
                    <Badge variant="destructive" className="ml-2">
                      Priority
                    </Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{project.campaign_type}</div>
              </CardHeader>
              <CardContent className="pb-2">
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Budget</span>
                    <span>{formatCurrency(project.budget, project.currency)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Dates</span>
                    <span>{new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm font-medium">Platforms</span>
                    <span>{project.platforms?.join(', ') || 'None'}</span>
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm font-medium">Status</span>
                    <Select
                      defaultValue={project.status || 'new'}
                      onValueChange={(value) => handleStatusChange(project.id, value as ProjectStatus)}
                    >
                      <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="secondary" 
                  className="w-full"
                  onClick={() => handleSuggestCreators(project.id)}
                >
                  Suggest Creators
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        // Desktop view - table
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Campaign Type</TableHead>
                <TableHead>Date Range</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead>Platforms</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {projects.map(project => (
                <TableRow key={project.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {project.name}
                      {project.is_priority && (
                        <Badge variant="destructive" className="ml-2">
                          Priority
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{project.campaign_type}</TableCell>
                  <TableCell>
                    {new Date(project.start_date).toLocaleDateString()} - {new Date(project.end_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{formatCurrency(project.budget, project.currency)}</TableCell>
                  <TableCell>{project.platforms?.join(', ') || 'None'}</TableCell>
                  <TableCell>
                    <Select
                      defaultValue={project.status || 'new'}
                      onValueChange={(value) => handleStatusChange(project.id, value as ProjectStatus)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="secondary" 
                      size="sm"
                      onClick={() => handleSuggestCreators(project.id)}
                    >
                      Suggest Creators
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
