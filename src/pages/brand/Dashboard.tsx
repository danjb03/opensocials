
import BrandLayout from '@/components/layouts/BrandLayout';
import BrandDashboardStats from '@/components/brand/dashboard/BrandDashboardStats';
import TodoPanel from '@/components/brand/dashboard/TodoPanel';
import QuickActions from '@/components/brand/dashboard/QuickActions';
import BrandCampaignTable from '@/components/brand/dashboard/BrandCampaignTable';
import { BrandIntroModal } from '@/components/brand/BrandIntroModal';
import { useBrandDashboard } from '@/hooks/useBrandDashboard';
import { useUserDataSync } from '@/hooks/useUserDataSync';
import { useBrandIntro } from '@/hooks/brand/useBrandIntro';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';

const Dashboard = () => {
  const { user, role, brandProfile: profile } = useUnifiedAuth();
  const navigate = useNavigate();
  
  // Initialize user data synchronization
  const { refreshUserData } = useUserDataSync();
  
  // Brand intro modal logic
  const { showIntro, isLoading: introLoading, dismissIntro } = useBrandIntro();
  
  const { 
    isLoading,
    projectStats,
    todoItems
  } = useBrandDashboard();

  const handleBackToSuperAdmin = () => {
    navigate('/super-admin');
  };

  // Show intro modal if needed
  if (introLoading) {
    return (
      <BrandLayout>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  return (
    <>
      <BrandLayout>
        <div className="min-h-screen bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header Section */}
            <div className="flex items-start justify-between mb-8">
              <div className="flex-1">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-foreground mb-2">
                    Welcome Back!
                  </h1>
                  <p className="text-lg text-muted-foreground mb-4">
                    Welcome back to your Brand Dashboard
                  </p>
                  
                  <div className="max-w-3xl">
                    <p className="text-base text-muted-foreground leading-relaxed">
                      Connect with top creators, manage campaigns seamlessly, and grow your brand's reach. 
                      Your dashboard gives you complete control over your influencer marketing campaigns, 
                      from discovery to delivery.
                    </p>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <QuickActions />
              </div>
              
              {/* Show the back button if user is super admin */}
              {role === 'super_admin' && (
                <div className="ml-6">
                  <Button 
                    variant="outline" 
                    onClick={handleBackToSuperAdmin} 
                    className="flex items-center gap-2 bg-card shadow-sm hover:shadow-md transition-shadow border-border text-foreground"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to Super Admin
                  </Button>
                </div>
              )}
            </div>

            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : (
              <div className="space-y-8">
                {/* Stats Section */}
                <BrandDashboardStats 
                  totalProjects={projectStats.totalProjects}
                  activeProjects={projectStats.activeProjects}
                  completedProjects={projectStats.completedProjects}
                />
                
                {/* Main Content Sections */}
                <div className="space-y-8">
                  <BrandCampaignTable />
                  
                  {/* Todo Panel */}
                  <TodoPanel items={todoItems} />
                </div>
              </div>
            )}
          </div>
        </div>
      </BrandLayout>

      {/* Brand Intro Modal */}
      <BrandIntroModal 
        isOpen={showIntro} 
        onClose={dismissIntro} 
      />
    </>
  );
};

export default Dashboard;
