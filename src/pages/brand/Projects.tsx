import { useState } from 'react';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Plus, Filter, Calendar, DollarSign, Copy } from 'lucide-react';
import CreateProjectForm from '@/components/brand/CreateProjectForm';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabaseClient';

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
  const [isDuplicateDialogOpen, setIsDuplicateDialogOpen] = useState(false);
  const [projects, setProjects] = useState(mockProjects);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [newDates, setNewDates] = useState({ start_date: '', end_date: '' });
  const { toast } = useToast();

  const calculateDaysRemaining = (date: Date): number => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const timeDiff = date.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 3600 * 24));
  };

  const handleProjectCreated = (newProject: any) => {
    const projectWithId = {
      ...newProject,
      id: projects.length > 0 ? Math.max(...projects.map(p => typeof p.id === 'number' ? p.id : 0)) + 1,
      executionDate: newProject.start_date ? new Date(newProject.start_date) : new Date(),
    };
    setProjects([...projects, projectWithId]);
    setIsDialogOpen(false);
    toast({ title: "Project created", description: `${newProject.name} has been successfully created.` });
  };

  const handleDuplicateClick = (projectId: number) => {
    setSelectedProjectId(projectId);
    setIsDuplicateDialogOpen(true);
  };

  const handleDuplicateProject = async () => {
    if (!selectedProjectId || !newDates.start_date || !newDates.end_date) {
      toast({ title: 'Missing Info', description: 'Please select both start and end dates.', variant: 'destructive' });
      return;
    }

    const { data, error } = await supabase.rpc('duplicate_project', {
      original_project_id: selectedProjectId,
      new_start_date: newDates.start_date,
      new_end_date: newDates.end_date
    });

    if (error) {
      toast({ title: 'Duplication Failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Project Duplicated', description: 'Your project copy is ready.' });
      // Optionally fetch or append the new project
    }

    setIsDuplicateDialogOpen(false);
    setNewDates({ start_date: '', end_date: '' });
  };

  const mockUserId = "user123";

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
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New Project
              </Button>
              <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle>Create New Project</DialogTitle>
                </DialogHeader>
                <CreateProjectForm onSuccess={handleProjectCreated} userId={mockUserId} />
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
                      <p className="font-medium">{project.executionDate.toLocaleDateString()}</p>
                      <p className="text-sm text-gray-500">{calculateDaysRemaining(project.executionDate)} days remaining</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <DollarSign className="h-5 w-5 text-gray-500 flex-shrink-0" />
                    <p className="font-medium">{project.currency} {project.budget}</p>
                  </div>
                  <p className="text-sm text-gray-600 pt-2">{project.description}</p>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2">
                  <Button variant="outline" className="w-full">Manage</Button>
                  <Button variant="secondary" className="w-full flex items-center justify-center" onClick={() => handleDuplicateClick(project.id)}>
                    <Copy className="h-4 w-4 mr-2" /> Duplicate
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}

        {/* Duplicate Project Modal */}
        <Dialog open={isDuplicateDialogOpen} onOpenChange={setIsDuplicateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Duplicate Project - Set New Dates</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input type="date" value={newDates.start_date} onChange={(e) => setNewDates({ ...newDates, start_date: e.target.value })} />
              <Input type="date" value={newDates.end_date} onChange={(e) => setNewDates({ ...newDates, end_date: e.target.value })} />
              <Button className="w-full" onClick={handleDuplicateProject}>Duplicate Project</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BrandLayout>
  );
};

export default Projects;

