
import { createContext, useContext } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { type Session, type User } from '@supabase/supabase-js';

export type UserRole = 'creator' | 'brand' | 'admin' | 'agency' | 'super_admin';

export interface AuthState {
  session: Session | null;
  user: User | null;
  role: UserRole | null;
  isLoading: boolean;
  emailConfirmed: boolean | null;
}

export const AuthContext = createContext<AuthState>({
  session: null,
  user: null,
  role: null,
  isLoading: true,
  emailConfirmed: null,
});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
