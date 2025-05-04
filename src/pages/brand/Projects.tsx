
import BrandLayout from '@/components/layouts/BrandLayout';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CreateProjectForm from '@/components/brand/CreateProjectForm';
import { useAuth } from '@/lib/auth';
import { ProjectsTable } from '@/components/brand/ProjectsTable';
import { ProjectsHeader } from '@/components/brand/ProjectsHeader';
import { EmptyProjectsState } from '@/components/brand/EmptyProjectsState';
import { useProjects } from '@/hooks/useProjects';

const Projects = () => {
  const { user } = useAuth();
  const { 
    projects, 
    isLoading, 
    filters, 
    isDialogOpen,
    setIsDialogOpen,
    handleFiltersChange,
    handleProjectCreated
  } = useProjects();

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <ProjectsHeader 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onCreateProject={() => setIsDialogOpen(true)}
        />
        
        {/* Projects Content */}
        {!isLoading && projects.length === 0 ? (
          <EmptyProjectsState onCreateProject={() => setIsDialogOpen(true)} />
        ) : (
          <ProjectsTable projects={projects} isLoading={isLoading} />
        )}
        
        {/* Create Project Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <CreateProjectForm onSuccess={handleProjectCreated} userId={user?.id} />
          </DialogContent>
        </Dialog>
      </div>
    </BrandLayout>
  );
};

export default Projects;
