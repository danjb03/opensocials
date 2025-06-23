
import React, { useEffect, useState } from 'react';
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
    console.log('🔐 Setting up auth state listener...');
    
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('🔐 Auth state change:', event, session?.user?.id);
        
        setSession(session);
        setUser(session?.user ?? null);
        
        // Set email confirmation status
        if (session?.user) {
          setEmailConfirmed(!!session.user.email_confirmed_at);
          
          // Only fetch role if email is confirmed or if email confirmation is disabled
          if (session.user.email_confirmed_at || event === 'SIGNED_IN') {
            console.log('👤 User authenticated, fetching role...');
            // Defer role fetching to prevent potential auth deadlocks
            setTimeout(() => {
              retrieveRole(session.user.id);
            }, 100);
          } else {
            console.log('📧 Email not confirmed yet, skipping role fetch');
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
      console.log('🔍 Initial session check:', session?.user?.id);
      
      setSession(session);
      setUser(session?.user ?? null);
      
      if (session?.user) {
        setEmailConfirmed(!!session.user.email_confirmed_at);
        if (session.user.email_confirmed_at) {
          retrieveRole(session.user.id);
        } else {
          setIsLoading(false);
        }
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
      console.log('🔍 Fetching role for user:', userId);
      
      const resolvedRole = await getUserRole(userId);
      
      if (resolvedRole) {
        console.log('✅ Role resolved successfully:', resolvedRole);
        setRole(resolvedRole);
      } else {
        console.warn('⚠️ No role found for user, defaulting to null');
        setRole(null);
      }
    } catch (error) {
      console.error('❌ Failed to fetch user role:', error);
      
      // Don't show toast for recursion errors - they're system-level issues
      if (!error?.message?.includes('infinite recursion')) {
        toast.error('Failed to fetch user role. Please try refreshing the page.');
      }
      
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
