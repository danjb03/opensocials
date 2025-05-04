
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, ChevronDown, Eye } from 'lucide-react';
import CreateProjectForm from '@/components/brand/CreateProjectForm';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/project';
import { ProjectFilters } from '@/components/brand/ProjectFilters';
import { useAuth } from '@/lib/auth';
import { 
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { statusColors, type ProjectStatus } from '@/types/projects';

type Project = {
  id: string;
  name: string;
  start_date: string;
  end_date: string;
  budget: number;
  currency: string;
  description: string;
  campaign_type: string;
  platforms: string[];
  status: ProjectStatus;
};

const Projects = () => {
  const { user } = useAuth();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  // Define filters state
  const [filters, setFilters] = useState({
    campaignTypes: [] as string[],
    platforms: [] as string[],
    campaignName: '',
    startMonth: null as string | null
  });

  // Fetch projects with filters
  const fetchProjects = async () => {
    if (!user) return;
    
    setIsLoading(true);
    
    try {
      let query = supabase
        .from('projects')
        .select('*')
        .eq('brand_id', user.id);
      
      // Apply campaign type filter
      if (filters.campaignTypes.length > 0) {
        query = query.in('campaign_type', filters.campaignTypes);
      }
      
      // Apply platforms filter
      if (filters.platforms.length > 0) {
        // For each platform in the filter, check if it exists in the platforms array
        filters.platforms.forEach(platform => {
          query = query.contains('platforms', [platform]);
        });
      }
      
      // Apply campaign name filter
      if (filters.campaignName) {
        query = query.ilike('name', `%${filters.campaignName}%`);
      }
      
      // Apply start month filter
      if (filters.startMonth) {
        const [year, month] = filters.startMonth.split('-');
        query = query.gte('start_date', `${year}-${month}-01`)
                    .lt('start_date', month === '12' 
                      ? `${parseInt(year) + 1}-01-01` 
                      : `${year}-${String(parseInt(month) + 1).padStart(2, '0')}-01`);
      }
      
      const { data, error } = await query;
      
      if (error) {
        throw error;
      }
      
      setProjects(data as Project[]);
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to load projects. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch projects when filters change or on component mount
  useEffect(() => {
    fetchProjects();
  }, [filters, user]);
  
  // Handle project creation
  const handleProjectCreated = (newProject: any) => {
    fetchProjects(); // Refresh projects from the database
    setIsDialogOpen(false);
    
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully created.`,
    });
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: any) => {
    setFilters(newFilters);
  };

  // Helper function to render status badge
  const renderStatus = (status: ProjectStatus) => {
    const colorClass = statusColors[status] || "bg-gray-100 text-gray-800";
    
    return (
      <Badge className={colorClass}>
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const handleViewProject = (projectId: string) => {
    // In the future, this would navigate to a detailed project view
    toast({
      title: "Coming Soon",
      description: "Project details view is under development",
    });
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-600">Manage your campaigns and projects</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            <ProjectFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange} 
            />
            
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  New Project
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <CreateProjectForm onSuccess={handleProjectCreated} userId={user?.id} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading projects...</p>
          </div>
        )}
        
        {/* Empty State */}
        {!isLoading && projects.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found. Create your first project!</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        )}
        
        {/* Projects Table */}
        {!isLoading && projects.length > 0 && (
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Campaign</TableHead>
                  <TableHead>Creator(s)</TableHead>
                  <TableHead>Budget</TableHead>
                  <TableHead>Paid</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Performance</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects.map((project) => (
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.name}</TableCell>
                    <TableCell>
                      <span className="text-gray-500">Not assigned</span>
                    </TableCell>
                    <TableCell>{formatCurrency(project.budget, project.currency)}</TableCell>
                    <TableCell>
                      <span className="text-gray-500">—</span>
                    </TableCell>
                    <TableCell>
                      {renderStatus(project.status as ProjectStatus)}
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-500">—</span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleViewProject(project.id)}
                          className="flex items-center gap-1"
                        >
                          <Eye className="h-4 w-4" />
                          View
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </BrandLayout>
  );
};

export default Projects;
