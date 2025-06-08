
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader, Search, Eye } from 'lucide-react';

interface Project {
  id: string;
  name: string;
  status: string;
  campaign_type: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  created_at: string;
}

const ProjectManagement = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const { data: projects = [], isLoading, error } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Project[];
    },
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = !searchTerm || 
      project.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = !statusFilter || project.status === statusFilter;
    const matchesType = !typeFilter || project.campaign_type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default';
      case 'draft': return 'secondary';
      case 'completed': return 'outline';
      case 'paused': return 'destructive';
      default: return 'outline';
    }
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">Project Management</h1>
        <p className="text-muted-foreground">Oversee and manage all platform projects and campaigns.</p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-lg">Filter Projects</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search projects..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="paused">Paused</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="invite">Invite</SelectItem>
                <SelectItem value="application">Application</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {isLoading && (
        <div className="flex justify-center py-10">
          <Loader className="animate-spin h-6 w-6" />
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center py-6">
          <p>Failed to load projects. Please try again later.</p>
        </div>
      )}

      {!isLoading && !error && (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Project Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Start Date</TableHead>
                <TableHead>End Date</TableHead>
                <TableHead>Budget</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProjects.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                    No projects found matching your criteria.
                  </TableCell>
                </TableRow>
              ) : (
                filteredProjects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(project.status)}>
                        {project.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{project.campaign_type}</Badge>
                    </TableCell>
                    <TableCell>
                      {project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}
                    </TableCell>
                    <TableCell>
                      {project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}
                    </TableCell>
                    <TableCell>
                      {project.budget ? `${project.currency || '$'}${project.budget.toLocaleString()}` : 'Not set'}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};

export default ProjectManagement;
