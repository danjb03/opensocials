
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
    console.log('🔐 AuthProvider: Starting EMERGENCY non-blocking initialization...');
    
    let mounted = true;
    
    // EMERGENCY: Force auth to complete after 1 second maximum
    const emergencyTimeout = setTimeout(() => {
      if (mounted) {
        console.log('⚡ EMERGENCY: Auth forced complete after 1s');
        setIsLoading(false);
      }
    }, 1000);
    
    // Immediate auth check - don't wait for anything
    const quickAuthCheck = async () => {
      try {
        // Get session with timeout
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Auth timeout')), 500)
        );
        
        const { data: { session: currentSession } } = await Promise.race([
          sessionPromise,
          timeoutPromise
        ]) as any;
        
        if (mounted) {
          console.log('🔍 Quick session check:', !!currentSession);
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setEmailConfirmed(currentSession?.user?.email_confirmed_at ? true : null);
          
          // Try to get role quickly - but don't block on it
          if (currentSession?.user) {
            // Async role fetch - doesn't block UI
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
                console.warn('Role fetch failed - continuing without role');
              }
            }, 100);
          }
          
          setIsLoading(false);
        }
      } catch (error) {
        console.warn('Quick auth check failed:', error);
        if (mounted) {
          // Always complete loading, never hang
          setIsLoading(false);
        }
      }
    };

    // Set up auth state listener - but don't let it block
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

    // Start quick auth check
    quickAuthCheck();

    return () => {
      mounted = false;
      clearTimeout(emergencyTimeout);
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

  console.log('🔐 AuthProvider context:', {
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
