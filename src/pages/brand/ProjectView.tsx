
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import BrandLayout from '@/components/layouts/BrandLayout';
import { Card, CardContent } from '@/components/ui/card';
import { useProjectDetails } from '@/hooks/useProjectDetails';

const ProjectView = () => {
  const {
    id,
    project,
    loading,
  } = useProjectDetails();
  
  const navigate = useNavigate();

  // Redirect to campaigns view showing this specific project
  useEffect(() => {
    if (id && !loading) {
      navigate(`/brand/orders?projectId=${id}`);
    }
  }, [id, loading, navigate]);

  // Show loading state while redirecting
  return (
    <BrandLayout>
      <div className="container mx-auto p-6 max-w-7xl bg-background">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-muted rounded w-1/3"></div>
          <div className="h-64 bg-muted rounded"></div>
          <div className="h-24 bg-muted rounded"></div>
        </div>
      </div>
    </BrandLayout>
  );
};

export default ProjectView;
