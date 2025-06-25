
import { useEffect } from 'react';
import { useUnifiedAuth } from '@/hooks/useUnifiedAuth';
import { useQueryClient } from '@tanstack/react-query';
import { userDataStore } from '@/lib/userDataStore';

/**
 * Hook to manage user data synchronization
 * Initializes user-scoped data store and cleanup
 */
export const useUserDataSync = () => {
  const { user } = useUnifiedAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.id) {
      console.log('🔄 Initializing user data sync for:', user.id);
      try {
        userDataStore.initialize(user.id, queryClient);
      } catch (error) {
        console.warn('⚠️ Failed to initialize user data store:', error);
      }
      
      return () => {
        console.log('🧹 Cleaning up user data sync');
        userDataStore.cleanup();
      };
    } else {
      // Clean up when user logs out
      console.log('🧹 No user, cleaning up data store');
      userDataStore.cleanup();
    }
  }, [user?.id, queryClient]);

  const refreshUserData = () => {
    if (user?.id) {
      userDataStore.refreshAllUserData();
    } else {
      console.warn('⚠️ Cannot refresh data: no authenticated user');
    }
  };

  return { refreshUserData };
};
