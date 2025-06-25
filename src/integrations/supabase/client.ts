
import { createClient } from '@supabase/supabase-js'
import type { Database } from './types'

// Hardcoded values to ensure they're always available
const supabaseUrl = 'https://pcnrnciwgdrukzciwexi.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjbnJuY2l3Z2RydWt6Y2l3ZXhpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDU3NDAyMDEsImV4cCI6MjA2MTMxNjIwMX0.3IcY8LAe71hLlYQ7ZzkABWEQUiqiv98Tu-IiCbxGPr4'

// Validate that we have the required values
if (!supabaseUrl) {
  throw new Error('supabaseUrl is required.')
}

if (!supabaseAnonKey) {
  throw new Error('supabaseAnonKey is required.')
}

console.log('🔧 Supabase client initializing with URL:', supabaseUrl);

export const supabase = createClient<Database>(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      storage: localStorage,
      persistSession: true,
      autoRefreshToken: true,
      storageKey: 'sb-auth-token',
      detectSessionInUrl: true,
    },
    global: {
      headers: {
        'x-client-info': 'os-platform@1.0.0',
      },
      // Set aggressive timeout for all requests
      fetch: (url: RequestInfo | URL, init?: RequestInit) => {
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
)

console.log('✅ Supabase client initialized successfully');
