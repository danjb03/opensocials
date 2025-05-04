
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, type UserRole } from '@/lib/auth';
import { useToast } from '@/components/ui/use-toast';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
        
        // Fetch user role if authenticated, using setTimeout to prevent recursion
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setRole(null);
          setIsLoading(false);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
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
      
      // Fetch the role directly from profiles table
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
    <AuthContext.Provider value={{ session, user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
