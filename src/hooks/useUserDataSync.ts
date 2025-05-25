
import { useEffect } from 'react';
import { useAuth } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';
import { userDataStore } from '@/lib/userDataStore';

/**
 * Hook to manage user data synchronization
 * Initializes user-scoped data store and cleanup
 */
export const useUserDataSync = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (user?.id) {
      console.log('🔄 Initializing user data sync for:', user.id);
      userDataStore.initialize(user.id, queryClient);
      
      return () => {
        console.log('🧹 Cleaning up user data sync');
        userDataStore.cleanup();
      };
    }
  }, [user?.id, queryClient]);

  const refreshUserData = () => {
    userDataStore.refreshAllUserData();
  };

  return { refreshUserData };
};
