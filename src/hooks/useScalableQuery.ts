
import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { userDataStore } from '@/lib/userDataStore';

/**
 * Scalable query hook with automatic user isolation
 */
interface ScalableQueryOptions<T> extends Omit<UseQueryOptions<T>, 'queryKey' | 'queryFn'> {
  baseKey: string[];
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
    queryKey: user?.id ? userDataStore.getUserQueryKey(baseKey) : ['no-user'],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error('User not authenticated');
      }

      if (customQueryFn) {
        return customQueryFn();
      }

      if (!tableName) {
        throw new Error('Either tableName or customQueryFn must be provided');
      }

      return userDataStore.executeUserQuery(tableName, selectColumns, additionalFilters);
    },
    enabled: !!user?.id && (options.enabled !== false),
    staleTime: 30000, // 30 seconds
    refetchOnWindowFocus: true,
    ...options
  });
}
