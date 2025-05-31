
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { ProjectsTable } from '@/components/brand/projects';
import { ProjectsHeader } from '@/components/brand/ProjectsHeader';
import { EmptyProjectsState } from '@/components/brand/EmptyProjectsState';
import { useProjectData } from '@/hooks/useProjectData';
import { Card, CardContent } from '@/components/ui/card';

const Projects = () => {
  const { user } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const { 
    projects, 
    isLoading, 
    filters, 
    handleFiltersChange
  } = useProjectData();

  // Check for query parameter to redirect to campaign wizard
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get('action') === 'create') {
      navigate('/brand/create-campaign');
    }
  }, [location, navigate]);

  const handleCreateProject = () => {
    navigate('/brand/create-campaign');
  };

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl">
        <ProjectsHeader 
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onCreateProject={handleCreateProject}
        />
        
        {/* Projects Content */}
        <Card className="overflow-hidden border-slate-200">
          <CardContent className="p-0">
            {!isLoading && projects.length === 0 ? (
              <EmptyProjectsState onCreateProject={handleCreateProject} />
            ) : (
              <ProjectsTable projects={projects} isLoading={isLoading} />
            )}
          </CardContent>
        </Card>
      </div>
    </BrandLayout>
  );
};

export default Projects;
