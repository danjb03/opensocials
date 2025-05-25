
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
  const { user } = useAuth();

  return useQuery({
    queryKey: user?.id ? userDataStore.getUserQueryKey(baseKey) : ['no-user', ...baseKey],
    queryFn: async () => {
      if (!user?.id) {
        console.log('🚫 No authenticated user, returning empty result');
        return [] as T;
      }

      if (customQueryFn) {
        return customQueryFn();
      }

      if (!tableName) {
        throw new Error('Either tableName or customQueryFn must be provided');
      }

      const result = await userDataStore.executeUserQuery(tableName, selectColumns, additionalFilters);
      return result as T;
    },
    enabled: !!user?.id && (options.enabled !== false),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    ...options
  });
}
