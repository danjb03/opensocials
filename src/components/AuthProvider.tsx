
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
      
      // First check the user_roles table for the status
      const { data: roleData, error: roleError } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .maybeSingle();
      
      if (roleError) {
        console.error('Error fetching user role status:', roleError);
      }
      
      // Fetch the role from profiles table
      const { data, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch user role: ' + error.message,
          variant: 'destructive',
        });
        setIsLoading(false);
        return;
      }

      console.log("User role data:", data);
      
      // Check if we have role data from profiles
      if (data && data.role) {
        console.log("Setting role to:", data.role);
        setRole(data.role as UserRole);
      } else {
        console.log("No role found, setting to null");
        setRole(null);
        
        toast({
          title: 'No Role Assigned',
          description: 'Your account does not have a role assigned. Please contact an administrator.',
          duration: 5000,
        });
      }
      
      // Log the role status if available
      if (roleData) {
        console.log("Role status:", roleData.status);
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
