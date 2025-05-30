import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/lib/auth';
import { useQueryClient } from '@tanstack/react-query';

/**
 * User Data Store - Centralized user data management with strict isolation
 * Ensures data is always scoped to the authenticated user
 */

export class UserDataStore {
  private static instance: UserDataStore;
  private userId: string | null = null;
  private queryClient: any = null;
  private activeChannels: Map<string, any> = new Map();
  private isInitialized: boolean = false;

  private constructor() {}

  static getInstance(): UserDataStore {
    if (!UserDataStore.instance) {
      UserDataStore.instance = new UserDataStore();
    }
    return UserDataStore.instance;
  }

  initialize(userId: string, queryClient: any) {
    this.userId = userId;
    this.queryClient = queryClient;
    this.isInitialized = true;
    this.setupRealtimeSubscriptions();
  }

  cleanup() {
    this.cleanupChannels();
    this.userId = null;
    this.queryClient = null;
    this.isInitialized = false;
  }

  /**
   * Check if the store is ready for use
   */
  isReady(): boolean {
    return this.isInitialized && !!this.userId;
  }

  /**
   * Get user-scoped query key - ensures cache isolation
   */
  getUserQueryKey(baseKey: (string | any)[]): string[] {
    if (!this.userId) throw new Error('User not authenticated');
    return ['user', this.userId, ...baseKey.map(k => typeof k === 'object' ? JSON.stringify(k) : String(k))];
  }

  /**
   * Execute user-scoped database query with automatic filtering
   */
  async executeUserQuery(tableName: string, selectColumns = '*', additionalFilters = {}) {
    if (!this.isReady()) {
      throw new Error('User not authenticated or store not initialized');
    }

    let query = supabase
      .from(tableName as any)
      .select(selectColumns);

    // Apply user filter based on table structure
    if (tableName === 'projects') {
      query = query.eq('brand_id', this.userId);
    } else if (tableName === 'profiles') {
      query = query.eq('id', this.userId);
    } else if (tableName === 'user_roles') {
      query = query.eq('user_id', this.userId);
    } else {
      // Default user_id filtering for other tables
      query = query.eq('user_id', this.userId);
    }

    // Apply additional filters
    Object.entries(additionalFilters).forEach(([key, value]) => {
      query = query.eq(key, value);
    });

    const { data, error } = await query;
    
    if (error) {
      console.error(`Error fetching ${tableName}:`, error);
      throw error;
    }

    return data || [];
  }

  /**
   * Setup real-time subscriptions with user isolation
   */
  private setupRealtimeSubscriptions() {
    if (!this.userId) return;

    // Projects subscription
    this.subscribeToTable('projects', `brand_id=eq.${this.userId}`, ['projects']);
    
    // Profile subscription
    this.subscribeToTable('profiles', `id=eq.${this.userId}`, ['profile']);
    
    // User roles subscription
    this.subscribeToTable('user_roles', `user_id=eq.${this.userId}`, ['user-roles']);
  }

  /**
   * Subscribe to table changes with user isolation
   */
  private subscribeToTable(tableName: string, filter: string, queryKeys: string[]) {
    const channelName = `${tableName}-${this.userId}`;
    
    if (this.activeChannels.has(channelName)) {
      supabase.removeChannel(this.activeChannels.get(channelName));
    }

    const channel = supabase
      .channel(channelName)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: tableName,
        filter: filter
      }, (payload) => {
        this.invalidateUserQueries(queryKeys);
      })
      .subscribe();

    this.activeChannels.set(channelName, channel);
  }

  /**
   * Invalidate user-specific queries
   */
  private invalidateUserQueries(queryKeys: string[]) {
    if (!this.queryClient || !this.userId) return;

    queryKeys.forEach(key => {
      this.queryClient.invalidateQueries({ 
        queryKey: this.getUserQueryKey([key])
      });
    });
  }

  /**
   * Clean up all active channels
   */
  private cleanupChannels() {
    this.activeChannels.forEach(channel => {
      supabase.removeChannel(channel);
    });
    this.activeChannels.clear();
  }

  /**
   * Force refresh all user data
   */
  refreshAllUserData() {
    if (!this.queryClient || !this.userId) return;

    this.queryClient.invalidateQueries({ 
      queryKey: ['user', this.userId]
    });
  }
}

export const userDataStore = UserDataStore.getInstance();
