
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
        
        // Fetch user role if authenticated
        if (session?.user) {
          setTimeout(() => {
            fetchUserRole(session.user.id);
          }, 0);
        } else {
          setRole(null);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserRole(session.user.id);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserRole = async (userId: string) => {
    try {
      console.log("Fetching role for user:", userId);
      
      // Direct query to the user_roles table to get role information
      const { data, error } = await supabase
        .from('user_roles')
        .select('role, status')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) {
        console.error('Error fetching user role:', error);
        toast({
          title: 'Error',
          description: 'Failed to fetch user role: ' + error.message,
          variant: 'destructive',
        });
        return;
      }

      console.log("User role data:", data);

      if (data && data.status === 'approved') {
        console.log("Setting role to:", data.role);
        setRole(data.role as UserRole);
      } else {
        console.log("No approved role found, setting to null");
        setRole(null);
        if (data && data.status === 'pending') {
          toast({
            title: 'Account Pending',
            description: 'Your account is pending approval.',
            duration: 5000,
          });
        }
      }
    } catch (error) {
      console.error('Failed to fetch user role:', error);
      toast({
        title: 'Error',
        description: 'Failed to fetch user role',
        variant: 'destructive',
      });
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, role, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};
