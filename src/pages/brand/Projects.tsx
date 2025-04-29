
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Calendar, DollarSign } from 'lucide-react';
import CreateProjectForm from '@/components/brand/CreateProjectForm';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/project';
import { ProjectFilters } from '@/components/brand/ProjectFilters';
import { useAuth } from '@/lib/auth';

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

  // Calculate days remaining from today until a given date
  const calculateDaysRemaining = (dateStr: string): number => {
    const date = new Date(dateStr);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDiff = date.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
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
        // Match start_date where year and month match
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
    // Add the new project to the state with a generated ID
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

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">Projects</h1>
            <p className="text-gray-600">Manage your campaigns and projects</p>
          </div>
          
          <div className="flex items-center mt-4 md:mt-0 space-x-2">
            {/* Project Filters */}
            <ProjectFilters 
              filters={filters} 
              onFiltersChange={handleFiltersChange} 
            />
            
            {/* Create New Project Dialog */}
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
        
        {/* Projects Grid */}
        {!isLoading && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Card key={project.id} className="overflow-hidden">
                <CardHeader>
                  <CardTitle>{project.name}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-start space-x-2">
                    <Calendar className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="font-medium">
                        {new Date(project.start_date).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {calculateDaysRemaining(project.start_date)} days remaining
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <p className="font-medium">
                      {formatCurrency(project.budget, project.currency)}
                    </p>
                  </div>
                  
                  {/* Display platforms */}
                  {project.platforms && project.platforms.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {project.platforms.map((platform) => (
                        <span key={platform} className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                          {platform}
                        </span>
                      ))}
                    </div>
                  )}
                  
                  <p className="text-sm text-gray-600 pt-2">{project.description}</p>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">Manage</Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </BrandLayout>
  );
};

export default Projects;
