
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Hardcoded values to ensure they're always available
const supabaseUrl = 'https://pcnrnciwgdrukzciwexi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbnJuY2l3Z2RydWt6Y2l3ZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NDAyMDEsImV4cCI6MjA2MTMxNjIwMX0.3IcY8LAe71hLlYQ7ZzkABWEQUiqiv98Tu-IiCbxGPr4'

// Enhanced validation with detailed error messages
if (!supabaseUrl || supabaseUrl === 'undefined') {
  console.error('🚨 Supabase URL is missing or invalid:', supabaseUrl);
  throw new Error('Supabase URL is required and cannot be undefined.');
}

if (!supabaseAnonKey || supabaseAnonKey === 'undefined') {
  console.error('🚨 Supabase Anon Key is missing or invalid:', supabaseAnonKey);
  throw new Error('Supabase Anon Key is required and cannot be undefined.');
}

console.log('🔧 Supabase client initializing with URL:', supabaseUrl);

// Create client with enhanced error handling
let supabaseClient: ReturnType<typeof createClient<Database>> | null = null;

try {
  supabaseClient = createClient<Database>(
    supabaseUrl,
    supabaseAnonKey,
    {
      auth: {
        storage: typeof window !== 'undefined' ? localStorage : undefined,
        persistSession: true,
        autoRefreshToken: true,
        storageKey: 'sb-auth-token',
        detectSessionInUrl: typeof window !== 'undefined',
      },
      global: {
        headers: {
          'x-client-info': 'os-platform@1.0.0',
        },
        // Set aggressive timeout for all requests with better error handling
        fetch: (url: RequestInfo | URL, init?: RequestInit) => {
          if (typeof window === 'undefined') {
            // During build time, return a promise that never resolves
            return new Promise(() => {});
          }
          
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
          
          return fetch(url, {
            ...init,
            signal: controller.signal,
          }).finally(() => clearTimeout(timeoutId));
        },
      },
      db: {
        schema: 'public',
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    }
  );

  console.log('✅ Supabase client initialized successfully');
} catch (error) {
  console.error('🚨 Failed to initialize Supabase client:', error);
  // During build time or if initialization fails, create a null client
  supabaseClient = null;
}

// Export with additional safety check
export const supabase = supabaseClient;

// Helper function to check if Supabase is ready
export const isSupabaseReady = (): boolean => {
  return supabaseClient !== null && typeof window !== 'undefined';
};

// Safe wrapper for Supabase operations
export const safeSupabaseCall = async <T>(
  operation: () => Promise<T>,
  fallback: T
): Promise<T> => {
  if (!isSupabaseReady()) {
    console.warn('Supabase not ready, returning fallback');
    return fallback;
  }
  
  try {
    return await operation();
  } catch (error) {
    console.error('Supabase operation failed:', error);
    return fallback;
  }
};
