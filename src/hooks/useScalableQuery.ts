
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

  console.log('🔍 useScalableQuery initialized:', {
    baseKey,
    tableName,
    userId: user?.id,
    authLoading,
    enabled: !authLoading && !!user?.id && (options.enabled !== false)
  });

  return useQuery({
    queryKey,
    queryFn: async () => {
      console.log('📡 useScalableQuery executing queryFn:', {
        authLoading,
        userId: user?.id,
        tableName,
        customQueryFn: !!customQueryFn
      });

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

      try {
        if (customQueryFn) {
          console.log('🔧 Executing custom query function');
          const result = await customQueryFn();
          console.log('✅ Custom query function result:', result);
          return result;
        }

        if (!tableName) {
          throw new Error('Either tableName or customQueryFn must be provided');
        }

        console.log('🗄️ Executing database query:', { tableName, selectColumns, additionalFilters });
        const result = await userDataStore.executeUserQuery(tableName, selectColumns, additionalFilters);
        console.log('✅ Database query result:', { count: Array.isArray(result) ? result.length : 'not array', result });
        return result as T;
      } catch (error) {
        console.error('❌ Error in useScalableQuery:', error);
        throw error;
      }
    },
    enabled: !authLoading && !!user?.id && (options.enabled !== false),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    retry: (failureCount, error) => {
      console.log('🔄 Retry logic:', { failureCount, errorMessage: error?.message });
      // Don't retry auth-related errors
      if (error?.message === 'Auth loading' || error?.message?.includes('User not authenticated')) {
        return false;
      }
      return failureCount < 3;
    },
    meta: {
      onError: (error) => {
        console.error('❌ useScalableQuery error:', error);
      },
      onSuccess: (data) => {
        console.log('✅ useScalableQuery success:', { 
          dataType: typeof data, 
          isArray: Array.isArray(data), 
          count: Array.isArray(data) ? data.length : 'not array' 
        });
      }
    },
    ...options
  });
}
