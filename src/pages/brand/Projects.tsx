
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateProjectForm from '@/components/brand/CreateProjectForm';
import { useAuth } from '@/lib/auth';
import { ProjectsTable } from '@/components/brand/projects';
import { ProjectsHeader } from '@/components/brand/ProjectsHeader';
import { EmptyProjectsState } from '@/components/brand/EmptyProjectsState';
import { useProjectData } from '@/hooks/useProjectData';
import { Card, CardContent } from '@/components/ui/card';

const Projects = () => {
  const { user } = useAuth();
  const location = useLocation();
  const { 
    projects, 
    isLoading, 
    filters, 
    isDialogOpen,
    setIsDialogOpen,
    handleFiltersChange,
    handleProjectCreated
  } = useProjectData();

  // Check for query parameter to open the dialog automatically
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'create') {
      setIsDialogOpen(true);
      // Clean up the URL after processing the action
      const newUrl = location.pathname;
      window.history.replaceState({}, '', newUrl);
    }
  }, [location, setIsDialogOpen]);

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <ProjectsHeader 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onCreateProject={() => setIsDialogOpen(true)}
        />
        
        {/* Projects Content */}
        <Card className="overflow-hidden border-slate-200">
          <CardContent className="p-0">
            {!isLoading && projects.length === 0 ? (
              <EmptyProjectsState onCreateProject={() => setIsDialogOpen(true)} />
            ) : (
              <ProjectsTable projects={projects} isLoading={isLoading} />
            )}
          </CardContent>
        </Card>
        
        {/* Create Project Dialog */}
        <Dialog 
          open={isDialogOpen} 
          onOpenChange={setIsDialogOpen}
        >
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
            <DialogHeader className="p-6 bg-slate-50 border-b">
              <DialogTitle className="text-2xl font-semibold">Create New Project</DialogTitle>
            </DialogHeader>
            <div className="p-6">
              <CreateProjectForm onSuccess={handleProjectCreated} userId={user?.id} />
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </BrandLayout>
  );
};

export default Projects;
