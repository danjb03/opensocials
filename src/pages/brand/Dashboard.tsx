
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
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';
import { useBrandProfile } from '@/hooks/useBrandProfile';

const Dashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const { profile } = useBrandProfile();
  
  // Initialize user data synchronization
  const { refreshUserData } = useUserDataSync();
  
  // Brand intro modal logic
  const { showIntro, isLoading: introLoading, dismissIntro } = useBrandIntro();
  
  const { 
    isLoading,
    projectStats,
    todoItems
  } = useBrandDashboard();

  // Check if user has super_admin role directly from the database
  useEffect(() => {
    if (!user) return;
    
    const checkSuperAdminRole = async () => {
      try {
        // First check user_roles table for super_admin role
        const { data: roleData, error: roleError } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'super_admin')
          .eq('status', 'approved')
          .maybeSingle();
          
        if (roleData) {
          console.log('✅ Found super_admin role in user_roles table');
          setIsSuperAdmin(true);
          return;
        }
        
        // Fallback: check user metadata
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.user_metadata?.role === 'super_admin') {
          console.log('✅ Found super_admin role in user metadata');
          setIsSuperAdmin(true);
          return;
        }
        
        // Second fallback: check profiles table
        const { data: profileData } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();
          
        if (profileData?.role === 'super_admin') {
          console.log('✅ Found super_admin role in profiles table');
          setIsSuperAdmin(true);
          return;
        }
        
        console.log('ℹ️ User is not a super_admin');
        setIsSuperAdmin(false);
      } catch (error) {
        console.error('❌ Error checking super admin status:', error);
        setIsSuperAdmin(false);
      }
    };
    
    checkSuperAdminRole();
  }, [user]);

  const handleBackToSuperAdmin = () => {
    navigate('/super-admin');
  };

  // For debugging
  useEffect(() => {
    console.log('🔐 Role from context:', role);
    console.log('👑 Is super admin state:', isSuperAdmin);
  }, [role, isSuperAdmin]);

  // Show intro modal if needed
  if (introLoading) {
    return (
      <BrandLayout>
        <div className="container mx-auto p-6">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </BrandLayout>
    );
  }

  // Get welcome message based on time of day
  const getWelcomeMessage = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const brandName = profile?.company_name || 'there';

  return (
    <>
      <BrandLayout>
        <div className="container mx-auto p-6 space-y-8">
          {/* Header Section */}
          <div className="flex items-center justify-between">
            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-bold tracking-tight">
                  {getWelcomeMessage()}, {brandName}!
                </h1>
                <p className="text-xl text-muted-foreground">
                  Welcome back to your Brand Dashboard
                </p>
              </div>
              
              <div className="max-w-2xl">
                <p className="text-base text-muted-foreground leading-relaxed">
                  Connect with top creators, manage campaigns seamlessly, and grow your brand's reach. 
                  Your dashboard gives you complete control over your influencer marketing campaigns, 
                  from discovery to delivery.
                </p>
              </div>
            </div>
            
            {/* Show the back button if either condition is true */}
            {(isSuperAdmin || role === 'super_admin') && (
              <Button 
                variant="outline" 
                onClick={handleBackToSuperAdmin} 
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Super Admin
              </Button>
            )}
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center h-64">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Quick Actions - Moved here for better placement */}
              <QuickActions />
              
              {/* Stats Section */}
              <BrandDashboardStats 
                totalProjects={projectStats.totalProjects}
                activeProjects={projectStats.activeProjects}
                completedProjects={projectStats.completedProjects}
              />
              
              {/* Main Content Sections */}
              <div className="space-y-8">
                <BrandCampaignTable />
                
                {/* Todo Panel - Now takes full width */}
                <TodoPanel items={todoItems} />
              </div>
            </div>
          )}
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
