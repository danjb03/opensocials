import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, type UserRole } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
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
      console.log("Fetching role for user:", userId);
      
      // IMPORTANT: Check for super_admin role first and give it highest priority
      // First, check if we can get the role from user metadata
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user?.user_metadata?.role === 'super_admin') {
        console.log("Found super_admin role in user metadata");
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
        console.log("Found super_admin role in user_roles table");
        setRole('super_admin');
        setIsLoading(false);
        return;
      }
      
      // If user is not a super_admin, continue with normal role checks...
      // If not found in user_roles, check profiles table as fallback
      
      if (user?.user_metadata?.role) {
        console.log("Found role in user metadata:", user.user_metadata.role);
        setRole(user.user_metadata.role as UserRole);
      }
      
      // Check other roles in user_roles table
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .eq('status', 'approved')
        .maybeSingle();
      
      if (roleError) {
        console.error('Error fetching user role status:', roleError);
      } else if (roleData) {
        console.log("Role data from user_roles:", roleData);
        setRole(roleData.role as UserRole);
        setIsLoading(false);
        return;
      }
      
      // Finally, check the profiles table if role still not found
      if (!user?.user_metadata?.role && !roleData?.role) {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', userId)
          .maybeSingle();

        if (error) {
          console.error('Error fetching user role from profiles:', error);
          toast({
            title: 'Error',
            description: 'Failed to fetch user role: ' + error.message,
            variant: 'destructive',
          });
          setIsLoading(false);
          return;
        }

        console.log("User role data from profiles:", data);
        
        if (data?.role) {
          console.log("Setting role from profiles table:", data.role);
          setRole(data.role as UserRole);
        }
      }
      
      // If still no role found, show error
      if (!role && !user?.user_metadata?.role && !roleData?.role) {
        console.log("No role found, setting to null");
        
        toast({
          title: 'No Role Assigned',
          description: 'Your account does not have a role assigned. Please contact an administrator.',
          duration: 5000,
        });
      }
      
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user role',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, role, isLoading, emailConfirmed }}>
      {children}
    </AuthContext.Provider>
  );
};
