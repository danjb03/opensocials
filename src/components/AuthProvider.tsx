
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, type UserRole } from '@/lib/auth';
import { getUserRole } from '@/utils/getUserRole';
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
            retrieveRole(session.user.id);
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
        retrieveRole(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const retrieveRole = async (userId: string) => {
    try {
      setIsLoading(true);
      const resolvedRole = await getUserRole(userId);
      setRole(resolvedRole);
    } catch (error) {
      console.error('❌ Failed to fetch user role:', error);
      toast.error('Failed to fetch user role. Please try refreshing the page.');
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ session, user, role, isLoading, emailConfirmed }}>
      {children}
    </AuthContext.Provider>
  );
};
