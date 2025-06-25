
import { QueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

/**
 * User-scoped data store for managing isolated user data across the application
 * This store ensures that all user data is properly isolated and cleaned up when users switch
 */
class UserDataStore {
  private currentUserId: string | null = null;
  private queryClient: QueryClient | null = null;
  private cleanupCallbacks: (() => void)[] = [];

  /**
   * Initialize the store for a specific user
   */
  initialize(userId: string, queryClient: QueryClient) {
    console.log('🔧 UserDataStore initializing for user:', userId);
    
    // Clean up existing data if switching users
    if (this.currentUserId && this.currentUserId !== userId) {
      console.log('👤 User changed, cleaning up old user data');
      this.cleanup();
    }

    this.currentUserId = userId;
    this.queryClient = queryClient;

    console.log('✅ UserDataStore initialized successfully');
  }

  /**
   * Check if the store is ready for use
   */
  isReady(): boolean {
    const ready = !!(this.currentUserId && this.queryClient);
    console.log('🔍 UserDataStore ready check:', { 
      userId: this.currentUserId, 
      hasQueryClient: !!this.queryClient, 
      ready 
    });
    return ready;
  }

  /**
   * Execute a query that automatically filters by current user
   */
  async executeUserQuery(
    tableName: string, 
    selectColumns: string = '*', 
    additionalFilters: Record<string, any> = {}
  ) {
    if (!this.isReady()) {
      throw new Error('UserDataStore not initialized');
    }

    console.log('🗄️ Executing user query:', { tableName, selectColumns, additionalFilters });

    try {
      // Build query with proper type safety
      const query = supabase
        .from(tableName as any)
        .select(selectColumns)
        .eq('user_id', this.currentUserId!);

      // Apply additional filters
      let finalQuery = query;
      Object.entries(additionalFilters).forEach(([key, value]) => {
        finalQuery = finalQuery.eq(key, value);
      });

      const { data, error } = await finalQuery;

      if (error) {
        console.error('❌ User query error:', error);
        throw error;
      }

      console.log('✅ User query successful:', { count: data?.length || 0 });
      return data;
    } catch (error) {
      console.error('❌ Error in executeUserQuery:', error);
      throw error;
    }
  }

  /**
   * Refresh all user-specific query data
   */
  refreshAllUserData() {
    if (!this.isReady()) {
      console.warn('⚠️ Cannot refresh: UserDataStore not ready');
      return;
    }

    console.log('🔄 Refreshing all user data for:', this.currentUserId);

    // Invalidate all queries that include the current user ID
    this.queryClient!.invalidateQueries({
      predicate: (query) => {
        const queryKey = query.queryKey;
        return Array.isArray(queryKey) && queryKey.some(key => 
          typeof key === 'string' && key.includes(`user-${this.currentUserId}`)
        );
      }
    });

    console.log('✅ User data refresh initiated');
  }

  /**
   * Add a cleanup callback to be executed when the store is cleaned up
   */
  addCleanupCallback(callback: () => void) {
    this.cleanupCallbacks.push(callback);
  }

  /**
   * Clean up all user data and reset the store
   */
  cleanup() {
    console.log('🧹 UserDataStore cleanup initiated');

    // Execute cleanup callbacks
    this.cleanupCallbacks.forEach(callback => {
      try {
        callback();
      } catch (error) {
        console.warn('⚠️ Cleanup callback error:', error);
      }
    });

    // Clear query cache for the current user
    if (this.currentUserId && this.queryClient) {
      console.log('🗑️ Clearing query cache for user:', this.currentUserId);
      this.queryClient.invalidateQueries({
        predicate: (query) => {
          const queryKey = query.queryKey;
          return Array.isArray(queryKey) && queryKey.some(key => 
            typeof key === 'string' && key.includes(`user-${this.currentUserId}`)
          );
        }
      });
    }

    // Reset state
    this.currentUserId = null;
    this.queryClient = null;
    this.cleanupCallbacks = [];

    console.log('✅ UserDataStore cleanup completed');
  }

  /**
   * Get the current user ID
   */
  getCurrentUserId(): string | null {
    return this.currentUserId;
  }
}

// Export singleton instance
export const userDataStore = new UserDataStore();
