import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Safe Supabase client that prevents build-time initialization errors
 * Implements the pattern from loveable.dev to avoid "supabaseUrl is required" errors
 */

// Check if we're in a browser environment
const isBrowser = typeof window !== 'undefined';

// Safely get environment variables
const getSupabaseUrl = () => {
  return isBrowser ? import.meta.env.VITE_SUPABASE_URL : process.env.VITE_SUPABASE_URL;
};

const getSupabaseAnonKey = () => {
  return isBrowser ? import.meta.env.VITE_SUPABASE_ANON_KEY : process.env.VITE_SUPABASE_ANON_KEY;
};

// Check if Supabase is ready to be initialized
export const isSupabaseReady = () => {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();
  return isBrowser && !!supabaseUrl && !!supabaseAnonKey;
};

// Create a lazy-initialized client
let supabaseInstance: SupabaseClient | null = null;

// Safe initialization function
export const getSupabaseClient = (): SupabaseClient | null => {
  if (!isSupabaseReady()) {
    console.warn('Supabase is not ready to initialize. Check environment variables.');
    return null;
  }

  if (!supabaseInstance) {
    try {
      const supabaseUrl = getSupabaseUrl() as string;
      const supabaseAnonKey = getSupabaseAnonKey() as string;
      
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
        },
      });
      
      console.log('Supabase client initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Supabase client:', error);
      return null;
    }
  }

  return supabaseInstance;
};

// Safe Supabase client with fallbacks
export const safeSupabase = {
  auth: {
    getUser: async () => {
      const client = getSupabaseClient();
      if (!client) return { data: { user: null }, error: new Error('Supabase client not available') };
      return await client.auth.getUser();
    },
    signIn: async (params: any) => {
      const client = getSupabaseClient();
      if (!client) return { data: null, error: new Error('Supabase client not available') };
      return await client.auth.signInWithPassword(params);
    },
    signOut: async () => {
      const client = getSupabaseClient();
      if (!client) return { error: new Error('Supabase client not available') };
      return await client.auth.signOut();
    },
    onAuthStateChange: (callback: any) => {
      const client = getSupabaseClient();
      if (!client) return { data: { subscription: null }, error: new Error('Supabase client not available') };
      return client.auth.onAuthStateChange(callback);
    }
  },
  from: (table: string) => {
    const client = getSupabaseClient();
    if (!client) {
      console.warn(`Attempted to query ${table} but Supabase client is not available`);
      // Return a mock query builder with methods that return empty results
      return {
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: new Error('Supabase client not available') }),
            maybeSingle: async () => ({ data: null, error: new Error('Supabase client not available') }),
            order: () => ({
              limit: () => ({
                range: async () => ({ data: [], error: new Error('Supabase client not available') }),
              }),
            }),
          }),
          order: () => ({
            limit: async () => ({ data: [], error: new Error('Supabase client not available') }),
          }),
        }),
        insert: () => ({
          select: async () => ({ data: null, error: new Error('Supabase client not available') }),
        }),
        update: () => ({
          eq: async () => ({ data: null, error: new Error('Supabase client not available') }),
          match: async () => ({ data: null, error: new Error('Supabase client not available') }),
        }),
        delete: () => ({
          eq: async () => ({ data: null, error: new Error('Supabase client not available') }),
        }),
      };
    }
    return client.from(table);
  },
  storage: {
    from: (bucket: string) => {
      const client = getSupabaseClient();
      if (!client) {
        console.warn(`Attempted to access storage bucket ${bucket} but Supabase client is not available`);
        // Return a mock storage interface
        return {
          upload: async () => ({ data: null, error: new Error('Supabase client not available') }),
          getPublicUrl: () => ({ data: { publicUrl: '' } }),
          list: async () => ({ data: [], error: new Error('Supabase client not available') }),
          remove: async () => ({ data: null, error: new Error('Supabase client not available') }),
        };
      }
      return client.storage.from(bucket);
    }
  },
  functions: {
    invoke: async (functionName: string, options?: { body?: any }) => {
      const client = getSupabaseClient();
      if (!client) {
        console.warn(`Attempted to invoke function ${functionName} but Supabase client is not available`);
        return { data: null, error: new Error('Supabase client not available') };
      }
      return await client.functions.invoke(functionName, options);
    }
  }
};

// Export a dummy client for SSR/build-time that won't throw errors
export const supabase = safeSupabase;

// For components that need to check if Supabase is available
export const useSupabaseStatus = () => {
  return {
    isReady: isSupabaseReady(),
    client: getSupabaseClient(),
  };
};
