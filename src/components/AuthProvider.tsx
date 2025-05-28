
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, type UserRole } from '@/lib/auth';
import { toast } from 'sonner';
import { useUserDataSync } from '@/hooks/useUserDataSync';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);

  // Initialize user data synchronization
  useUserDataSync();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Set email confirmation status
        if (session?.user) {
          setEmailConfirmed(!!session.user.email_confirmed_at);
          
          // Fetch user role if authenticated, using setTimeout to prevent recursion
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setRole(null);
          setEmailConfirmed(null);
          setIsLoading(false);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('🔐 Initial session check:', session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setEmailConfirmed(!!session.user.email_confirmed_at);
        fetchUserRole(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("🔍 Fetching role for user:", userId);
      let resolvedRole: UserRole | null = null;
      
      // IMPORTANT: Check for super_admin role first and give it highest priority
      // First, check if we can get the role from user metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.user_metadata?.role === 'super_admin') {
        console.log("✅ Found super_admin role in user metadata");
        setRole('super_admin');
        setIsLoading(false);
        return;
      }
      
      // Next check the user_roles table specifically for super_admin role
      const { data: superAdminRole, error: superAdminError } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .eq('role', 'super_admin')
        .eq('status', 'approved')
        .maybeSingle();
      
      if (superAdminRole) {
        console.log("✅ Found super_admin role in user_roles table");
        setRole('super_admin');
        setIsLoading(false);
        return;
      }
      
      // Check other roles in user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .maybeSingle();
      
      if (roleError) {
        console.error('❌ Error fetching user role status:', roleError);
      } else if (roleData) {
        console.log("✅ Role data from user_roles:", roleData);
        resolvedRole = roleData.role as UserRole;
        setRole(resolvedRole);
        setIsLoading(false);
        return;
      }
      
      // Fallback to user metadata if no role found in user_roles
      if (user?.user_metadata?.role) {
        console.log("✅ Found role in user metadata:", user.user_metadata.role);
        resolvedRole = user.user_metadata.role as UserRole;
        setRole(resolvedRole);
        setIsLoading(false);
        return;
      }
      
      // Finally, check the profiles table if role still not found
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (profileError) {
        console.error('❌ Error fetching user role from profiles:', profileError);
        // Don't show error toast for missing profiles as they should be created automatically
        if (!profileError.message?.includes('PGRST116')) {
          toast.error('Failed to fetch user role: ' + profileError.message);
        }
        setIsLoading(false);
        return;
      }

      console.log("📋 User role data from profiles:", profileData);
      
      if (profileData?.role) {
        console.log("✅ Setting role from profiles table:", profileData.role);
        resolvedRole = profileData.role as UserRole;
        setRole(resolvedRole);
      } else {
        console.log("❌ No role found anywhere, setting to null");
        toast.error('Your account does not have a role assigned. Please contact support if this persists.');
        setRole(null);
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('❌ Failed to fetch user role:', error);
      toast.error('Failed to fetch user role. Please try refreshing the page.');
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, role, isLoading, emailConfirmed }}>
      {children}
    </AuthContext.Provider>
  );
};
