
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ChevronRight, Calendar, Users } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Project {
  id: string;
  name: string;
  status: string;
  created_at: string;
  total_budget?: number;
}

interface RecentProjectsProps {
  projects: Project[];
  isLoading: boolean;
}

const RecentProjects: React.FC<RecentProjectsProps> = ({ projects, isLoading }) => {
  const navigate = useNavigate();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-foreground">Recent Campaigns</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const recentProjects = projects.slice(0, 5);

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-foreground">Recent Campaigns</CardTitle>
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate('/brand/orders')}
          className="text-foreground"
        >
          View All
          <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </CardHeader>
      <CardContent>
        {recentProjects.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">No campaigns yet</p>
            <Button 
              onClick={() => navigate('/brand/create-campaign')}
              className="bg-primary text-primary-foreground"
            >
              Create Your First Campaign
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {recentProjects.map((project) => (
              <div 
                key={project.id}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-accent cursor-pointer"
                onClick={() => navigate(`/brand/orders?projectId=${project.id}`)}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground truncate">
                    {project.name}
                  </h4>
                  <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(project.created_at).toLocaleDateString()}
                    </div>
                    {project.total_budget && (
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        ${project.total_budget.toLocaleString()}
                      </div>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentProjects;
