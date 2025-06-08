
import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { ProjectsTable } from '@/components/brand/projects';
import { ProjectsHeader } from '@/components/brand/ProjectsHeader';
import { EmptyProjectsState } from '@/components/brand/EmptyProjectsState';
import { useProjectData, ProjectFilters } from '@/hooks/useProjectData';
import { Card, CardContent } from '@/components/ui/card';
import { SearchInput } from '@/components/ui/search-input';
import { ToastManager } from '@/components/ui/toast-manager';
import { AccessibleButton } from '@/components/ui/accessible-button';
import { Plus, Filter } from 'lucide-react';

const Projects = () => {
  const { user } = useUnifiedAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const { 
    projects, 
    isLoading, 
    error,
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

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    const updatedFilters: ProjectFilters = { 
      ...filters, 
      campaignName: value 
    };
    handleFiltersChange(updatedFilters);
  };

  const filteredProjects = projects.filter(project => {
    if (!searchQuery) return true;
    return project.name.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const errorMessage = error instanceof Error ? error.message : typeof error === 'string' ? error : 'An error occurred';

  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl animate-fade-in">
        {/* Enhanced Header */}
        <div className="flex flex-col gap-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Projects</h1>
              <p className="text-muted-foreground mt-1">
                Manage your marketing campaigns and creator collaborations
              </p>
            </div>
            <AccessibleButton 
              onClick={handleCreateProject}
              className="gap-2"
              aria-label="Create a new project"
            >
              <Plus className="h-4 w-4" />
              Create Project
            </AccessibleButton>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <SearchInput
                value={searchQuery}
                onChange={handleSearch}
                placeholder="Search projects..."
                className="w-full"
              />
            </div>
            <AccessibleButton
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="gap-2"
              aria-label="Toggle filters"
              aria-expanded={showFilters}
            >
              <Filter className="h-4 w-4" />
              Filters
            </AccessibleButton>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <Card className="animate-slide-up">
              <CardContent className="p-4">
                <ProjectsHeader 
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                  onCreateProject={handleCreateProject}
                />
              </CardContent>
            </Card>
          )}
        </div>
        
        {/* Projects Content */}
        <Card className="overflow-hidden border-slate-200 transition-all duration-300 hover:shadow-lg">
          <CardContent className="p-0">
            {!isLoading && filteredProjects.length === 0 && !searchQuery ? (
              <div className="animate-scale-in">
                <EmptyProjectsState onCreateProject={handleCreateProject} />
              </div>
            ) : !isLoading && filteredProjects.length === 0 && searchQuery ? (
              <div className="p-8 text-center">
                <p className="text-muted-foreground">
                  No projects found matching "{searchQuery}"
                </p>
                <AccessibleButton
                  variant="outline"
                  onClick={() => setSearchQuery('')}
                  className="mt-4"
                >
                  Clear search
                </AccessibleButton>
              </div>
            ) : (
              <div className="animate-slide-up">
                <ProjectsTable 
                  projects={filteredProjects} 
                  isLoading={isLoading} 
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Toast notifications */}
        <ToastManager 
          error={errorMessage}
          onErrorDismiss={() => {}}
        />
      </div>
    </BrandLayout>
  );
};

export default Projects;
