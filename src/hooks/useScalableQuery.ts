
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { userDataStore } from '@/lib/userDataStore';

/**
 * Scalable query hook with automatic user isolation
 */
interface ScalableQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  baseKey: (string | any)[];
  tableName?: string;
  selectColumns?: string;
  additionalFilters?: Record<string, any>;
  customQueryFn?: () => Promise<T>;
}

export function useScalableQuery<T = any>({
  baseKey,
  tableName,
  selectColumns = '*',
  additionalFilters = {},
  customQueryFn,
  ...options
}: ScalableQueryOptions<T>) {
  const { user, isLoading: authLoading } = useAuth();

  // Create a safe query key that includes auth loading state
  const queryKey = user?.id 
    ? [`user-${user.id}`, ...baseKey]
    : ['no-user', ...baseKey];

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Wait for auth to be ready and user to be available
      if (authLoading) {
        console.log('⏳ Auth still loading, waiting...');
        throw new Error('Auth loading');
      }

      if (!user?.id) {
        console.log('🚫 No authenticated user, returning empty result');
        return [] as T;
      }

      console.log('✅ User authenticated, proceeding with query:', user.id);

      if (customQueryFn) {
        return customQueryFn();
      }

      if (!tableName) {
        throw new Error('Either tableName or customQueryFn must be provided');
      }

      const result = await userDataStore.executeUserQuery(tableName, selectColumns, additionalFilters);
      return result as T;
    },
    enabled: !authLoading && !!user?.id && (options.enabled !== false),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      // Don't retry auth-related errors
      if (error?.message === 'Auth loading' || error?.message?.includes('User not authenticated')) {
        return false;
      }
      return failureCount < 3;
    },
    ...options
  });
}
