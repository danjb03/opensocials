
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, type UserRole } from '@/lib/auth';

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);

  useEffect(() => {
    console.log('🔐 AuthProvider: Initializing with aggressive timeout...');
    
    let mounted = true;
    
    // AGGRESSIVE: Force loading to complete after 3 seconds maximum
    const forceComplete = setTimeout(() => {
      if (mounted) {
        console.warn('⚠️ FORCING auth initialization completion after 3s timeout');
        setIsLoading(false);
      }
    }, 3000);
    
    // Simplified auth state management
    const initializeAuth = async () => {
      try {
        // Get current session immediately
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        if (mounted) {
          console.log('🔍 Current session:', !!currentSession);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setEmailConfirmed(currentSession?.user?.email_confirmed_at ? true : null);
          
          // Simple role resolution - don't let this block the app
          if (currentSession?.user) {
            // Try to get role quickly, but don't block on it
            setTimeout(async () => {
              try {
                const { data } = await supabase
                  .from('user_roles')
                  .select('role')
                  .eq('user_id', currentSession.user.id)
                  .eq('status', 'approved')
                  .limit(1)
                  .single();
                
                if (mounted && data) {
                  setRole(data.role as UserRole);
                }
              } catch (error) {
                console.warn('Role fetch failed, continuing without role:', error);
                // Don't block the app - role can be null
              }
            }, 100);
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (mounted) {
          // Don't let auth errors block the app
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (!mounted) return;
        
        console.log('🔐 Auth state change:', event);
        setSession(session);
        setUser(session?.user ?? null);
        setEmailConfirmed(session?.user?.email_confirmed_at ? true : null);
        
        if (!session) {
          setRole(null);
        }
      }
    );

    // Initialize auth
    initializeAuth();

    return () => {
      mounted = false;
      clearTimeout(forceComplete);
      subscription.unsubscribe();
    };
  }, []);

  const contextValue = {
    session,
    user,
    role,
    isLoading,
    emailConfirmed
  };

  console.log('🔐 AuthProvider rendering with:', {
    isLoading: contextValue.isLoading,
    hasUser: !!contextValue.user,
    role: contextValue.role
  });

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};
