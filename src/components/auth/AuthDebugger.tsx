
import React, { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { getUserRole } from '@/utils/getUserRole';

export const AuthDebugger = () => {
  const [debugInfo, setDebugInfo] = useState<any>({});
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const checkAuthState = async () => {
      try {
        // Get current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        // Get user role if session exists
        let userRole = null;
        if (session?.user?.id) {
          userRole = await getUserRole(session.user.id);
        }

        // Check profiles table
        let profileData = null;
        if (session?.user?.id) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          profileData = profile;
        }

        // Check user_roles table
        let userRolesData = null;
        if (session?.user?.id) {
          const { data: roles } = await supabase
            .from('user_roles')
            .select('*')
            .eq('user_id', session.user.id);
          userRolesData = roles;
        }

        setDebugInfo({
          timestamp: new Date().toISOString(),
          hasSession: !!session,
          hasUser: !!session?.user,
          userId: session?.user?.id,
          userEmail: session?.user?.email,
          emailConfirmed: !!session?.user?.email_confirmed_at,
          sessionError: sessionError?.message,
          userRole,
          profileData,
          userRolesData,
          currentPath: window.location.pathname,
          userAgent: navigator.userAgent,
        });
      } catch (error) {
        setDebugInfo({
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString(),
        });
      }
    };

    checkAuthState();
  }, []);

  // Show debugger in development or when there's an error
  useEffect(() => {
    const isDev = window.location.hostname === 'localhost' || window.location.hostname.includes('lovable');
    const hasError = !debugInfo.hasSession && !debugInfo.error;
    setIsVisible(isDev || hasError);
  }, [debugInfo]);

  if (!isVisible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      right: '10px',
      background: 'rgba(0,0,0,0.9)',
      color: 'white',
      padding: '15px',
      borderRadius: '8px',
      fontSize: '12px',
      zIndex: 9999,
      maxWidth: '400px',
      maxHeight: '80vh',
      overflow: 'auto',
      fontFamily: 'monospace'
    }}>
      <div style={{ fontWeight: 'bold', marginBottom: '10px' }}>
        🔍 Auth Debug Info
      </div>
      <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
        {JSON.stringify(debugInfo, null, 2)}
      </pre>
      <button
        onClick={() => setIsVisible(false)}
        style={{
          marginTop: '10px',
          padding: '5px 10px',
          background: '#333',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Hide Debug
      </button>
    </div>
  );
};
