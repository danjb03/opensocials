
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext, type UserRole } from '@/lib/auth';
import { toast } from 'sonner';
import { fetchUserRole } from '@/utils/authHelpers';

export const useSecureAuth = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [user, setUser] = useState(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [emailConfirmed, setEmailConfirmed] = useState<boolean | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);

  // Security: Clean up auth state helper
  const cleanupAuthState = () => {
    Object.keys(localStorage).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        localStorage.removeItem(key);
      }
    });
    Object.keys(sessionStorage || {}).forEach((key) => {
      if (key.startsWith('supabase.auth.') || key.includes('sb-')) {
        sessionStorage.removeItem(key);
      }
    });
  };


  // Security: Enhanced session validation
  const validateSession = async (session: any) => {
    if (!session?.access_token) {
      return false;
    }

    try {
      // Verify token is still valid
      const { data: user, error } = await supabase.auth.getUser(session.access_token);
      
      if (error || !user) {
        console.warn('Session validation failed:', error);
        return false;
      }

      // Check if token is close to expiry (refresh if within 5 minutes)
      const expiresAt = session.expires_at;
      const now = Math.floor(Date.now() / 1000);
      
      if (expiresAt && (expiresAt - now) < 300) {
        console.log('Token near expiry, refreshing...');
        const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession();
        
        if (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return false;
        }
        
        return refreshData.session;
      }
      
      return session;
    } catch (err) {
      console.error('Session validation error:', err);
      return false;
    }
  };

  useEffect(() => {
    let mounted = true;

    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('🔐 Auth state change:', event, session?.user?.id);
        
        // Handle sign out event
        if (event === 'SIGNED_OUT') {
          cleanupAuthState();
          setSession(null);
          setUser(null);
          setRole(null);
          setEmailConfirmed(null);
          setIsLoading(false);
          return;
        }

        // Validate session if present
        if (session) {
          const validatedSession = await validateSession(session);
          
          if (!validatedSession) {
            // Invalid session, sign out
            await supabase.auth.signOut();
            return;
          }

          setSession(validatedSession);
          setUser(validatedSession.user ?? null);
          setEmailConfirmed(!!validatedSession.user?.email_confirmed_at);
          
          // Defer role fetching to prevent deadlocks
          if (validatedSession.user) {
            setTimeout(async () => {
              if (mounted) {
                const r = await fetchUserRole(validatedSession.user.id);
                setRole(r);
                setIsLoading(false);
              }
            }, 0);
          }
        } else {
          setSession(null);
          setUser(null);
          setRole(null);
          setEmailConfirmed(null);
          setIsLoading(false);
        }
      }
    );

    // Check current session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!mounted) return;

      console.log('🔐 Initial session check:', session?.user?.id);
      
      if (session) {
        const validatedSession = await validateSession(session);
        
        if (validatedSession) {
          setSession(validatedSession);
          setUser(validatedSession.user ?? null);
          setEmailConfirmed(!!validatedSession.user?.email_confirmed_at);
          fetchUserRole(validatedSession.user.id).then(r => {
            setRole(r);
            setIsLoading(false);
          });
        } else {
          // Invalid session
          await supabase.auth.signOut();
        }
      } else {
        setIsLoading(false);
      }
    }).catch(err => {
      console.error('Initial session check failed:', err);
      setAuthError('Failed to verify authentication status');
      setIsLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Security: Enhanced sign out with cleanup
  const secureSignOut = async () => {
    try {
      cleanupAuthState();
      await supabase.auth.signOut({ scope: 'global' });
      
      // Force page reload for clean state
      setTimeout(() => {
        window.location.href = '/auth';
      }, 100);
    } catch (error) {
      console.error('Sign out error:', error);
      // Force cleanup even if signOut fails
      cleanupAuthState();
      window.location.href = '/auth';
    }
  };

  return {
    session,
    user,
    role,
    isLoading,
    emailConfirmed,
    authError,
    secureSignOut
  };
};
