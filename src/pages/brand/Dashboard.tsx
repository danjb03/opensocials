
import BrandLayout from '@/components/layouts/BrandLayout';
import BrandDashboardStats from '@/components/brand/dashboard/BrandDashboardStats';
import TodoPanel from '@/components/brand/dashboard/TodoPanel';
import CreatorList from '@/components/brand/dashboard/CreatorList';
import QuickActions from '@/components/brand/dashboard/QuickActions';
import BrandCampaignTable from '@/components/brand/dashboard/BrandCampaignTable';
import { useBrandDashboard } from '@/hooks/useBrandDashboard';
import { useUserDataSync } from '@/hooks/useUserDataSync';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const Dashboard = () => {
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  
  // Initialize user data synchronization
  const { refreshUserData } = useUserDataSync();
  
  const { 
    isLoading,
    projectStats,
    todoItems,
    creators
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

  return (
    <BrandLayout>
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Brand Dashboard</h1>
          
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
          <>
            <QuickActions />
            
            <BrandDashboardStats 
              totalProjects={projectStats.totalProjects}
              activeProjects={projectStats.activeProjects}
              completedProjects={projectStats.completedProjects}
            />
            
            <div className="space-y-6">
              <BrandCampaignTable />
              
              <TodoPanel items={todoItems} />
              
              <CreatorList creators={creators} />
            </div>
          </>
        )}
      </div>
    </BrandLayout>
  );
};

export default Dashboard;
