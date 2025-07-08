
import React from 'react';
import { AuthContext } from '@/lib/auth';

// This component is deprecated - using UnifiedAuthProvider instead
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  console.warn('⚠️ AuthProvider is deprecated. Use UnifiedAuthProvider instead.');
  
  // Provide minimal context to prevent errors
  const mockAuthContext = {
    session: null,
    user: null,
    role: null,
    isLoading: false,
    emailConfirmed: null
  };

  return (
    <AuthContext.Provider value={mockAuthContext}>
      {children}
    </AuthContext.Provider>
  );
};
