
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'
import { corsHeaders, validateSuperAdmin } from '../shared/admin-utils.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Validate admin access using the user's token
    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!);
    const validation = await validateSuperAdmin(supabaseUser, token);
    if (!validation.isValid) {
      console.error('Admin validation failed:', validation.message);
      return new Response(
        JSON.stringify({ error: validation.message }),
        { status: validation.status, headers: corsHeaders }
      );
    }

    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    const { page = 1, per_page = 50 } = await req.json();

    console.log(`Admin ${validation.userId} fetching auth users - page: ${page}, per_page: ${per_page}`);

    // Get users from auth.users table using admin client
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: per_page
    });

    if (error) {
      console.error('Error fetching auth users:', error);
      return new Response(
        JSON.stringify({ error: `Failed to fetch users: ${error.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`Successfully fetched ${data.users?.length || 0} users (total: ${data.total || 0})`);

    const response = {
      users: data.users || [],
      total: data.total || 0
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in get-auth-users function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
