
import { useState } from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Filter, Calendar, DollarSign } from 'lucide-react';
import { CreateProjectForm } from '@/components/brand/CreateProjectForm';
import { useToast } from '@/hooks/use-toast';

// Demo data - in a real app this would come from your database
const mockProjects = [
  {
    id: 1,
    name: "Summer Campaign",
    executionDate: new Date('2025-06-01'),
    budget: "5,000",
    currency: "USD",
    description: "A summer themed campaign targeting Gen Z audience."
  },
  {
    id: 2,
    name: "Holiday Special",
    executionDate: new Date('2025-12-10'),
    budget: "7,500",
    currency: "EUR",
    description: "End of year holiday promotion across all platforms."
  }
];

const Projects = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [projects, setProjects] = useState(mockProjects);
  const { toast } = useToast();

  const calculateDaysRemaining = (date: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDiff = date.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };
  
  const handleProjectCreated = (newProject: any) => {
    // Add the new project to the state with a generated ID
    const projectWithId = {
      ...newProject,
      id: projects.length > 0 ? Math.max(...projects.map(p => typeof p.id === 'number' ? p.id : 0)) + 1 : 1,
      executionDate: newProject.start_date,  // Map to our display model
    };
    
    setProjects([...projects, projectWithId]);
    setIsDialogOpen(false);
    
    toast({
      title: "Project created",
      description: `${newProject.name} has been successfully created.`,
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
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
            
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
                <CreateProjectForm onSuccess={handleProjectCreated} />
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        {projects.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No projects found. Create your first project!</p>
            <Button className="mt-4" onClick={() => setIsDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </div>
        ) : (
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
                        {project.executionDate.toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-500">
                        {calculateDaysRemaining(project.executionDate)} days remaining
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <p className="font-medium">
                      {project.currency} {project.budget}
                    </p>
                  </div>
                  
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
