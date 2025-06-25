// This file now only contains types and utilities, no context
export type UserRole = 'admin' | 'super_admin' | 'brand' | 'creator' | 'agency';

// Remove the old AuthContext export since we're using UnifiedAuthProvider
// Keep only the type definitions that other parts of the app might need
export interface AuthUser {
  id: string;
  email: string;
}
