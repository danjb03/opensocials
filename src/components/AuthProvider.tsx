
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, type UserRole } from '@/lib/auth';
import { getUserRole } from '@/utils/getUserRole';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('🔐 AuthProvider: Setting up auth state listener...');
    
    let mounted = true;
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        
        console.log('🔐 Auth state change:', { 
          event, 
          userId: session?.user?.id, 
          hasSession: !!session 
        });
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Set email confirmation status
        if (session?.user) {
          const confirmed = !!session.user.email_confirmed_at;
          setEmailConfirmed(confirmed);
          
          // Only fetch role if email is confirmed
          if (confirmed) {
            // Use setTimeout to prevent auth deadlocks
            setTimeout(() => {
              if (mounted) {
                retrieveRole(session.user.id);
              }
            }, 100);
          } else {
            setRole(null);
            setIsLoading(false);
          }
        } else {
          setRole(null);
          setEmailConfirmed(null);
          setIsLoading(false);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      
      console.log('🔍 Initial session check:', { 
        hasSession: !!session, 
        userId: session?.user?.id 
      });
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        const confirmed = !!session.user.email_confirmed_at;
        setEmailConfirmed(confirmed);
        if (confirmed) {
          retrieveRole(session.user.id);
        } else {
          setIsLoading(false);
        }
      } else {
        setIsLoading(false);
      }
    });

    return () => {
      mounted = false;
      console.log('🔐 Cleaning up auth subscription');
      subscription.unsubscribe();
    };
  }, []);

  const retrieveRole = async (userId: string) => {
    try {
      setIsLoading(true);
      console.log('🔍 Fetching role for user:', userId);
      
      const resolvedRole = await getUserRole(userId);
      
      if (resolvedRole) {
        console.log('✅ Role resolved:', resolvedRole);
        setRole(resolvedRole);
      } else {
        console.warn('⚠️ No role found for user');
        setRole(null);
      }
    } catch (error) {
      console.error('❌ Failed to fetch user role:', error);
      setRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const contextValue = {
    session,
    user,
    role,
    isLoading,
    emailConfirmed
  };

  console.log('🔐 AuthProvider final state:', {
    isLoading: contextValue.isLoading,
    hasSession: !!contextValue.session,
    hasUser: !!contextValue.user,
    role: contextValue.role,
    emailConfirmed: contextValue.emailConfirmed
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
