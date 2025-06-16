
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function validateSuperAdmin(supabase: any, token: string) {
  try {
    console.log('Validating admin access...');
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('Auth validation failed:', authError?.message);
      return { isValid: false, status: 401, message: "Authentication failed" };
    }

    console.log('User authenticated, checking role for user:', user.id);

    // First try user_roles table (primary source)
    const { data: userRoles, error: userRoleError } = await supabase
      .from("user_roles")
      .select("role, status")
      .eq("user_id", user.id)
      .eq("status", "approved");

    if (!userRoleError && userRoles && userRoles.length > 0) {
      console.log('Found user roles in user_roles table:', userRoles);
      const adminRole = userRoles.find(role => 
        role.role === "super_admin" || role.role === "admin"
      );
      if (adminRole) {
        console.log('Admin validation successful via user_roles for user:', user.id);
        return { isValid: true, userId: user.id };
      }
    }

    // Fallback to profiles table
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id);

    if (profileError) {
      console.error('Profile fetch error:', profileError.message);
      console.log('Trying auth metadata fallback...');
    } else {
      console.log('Profiles found:', profiles);
      const adminProfile = profiles?.find(p => p.role === "super_admin" || p.role === "admin");
      
      if (adminProfile) {
        console.log('Admin validation successful via profiles for user:', user.id, 'role:', adminProfile.role);
        return { isValid: true, userId: user.id };
      }
    }

    // Final fallback: check auth metadata for known super admin
    if (user.user_metadata?.role === "super_admin" || user.user_metadata?.role === "admin") {
      console.log('Admin validation successful via auth metadata for user:', user.id);
      return { isValid: true, userId: user.id };
    }

    // Special case for known super admin user ID
    if (user.id === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
      console.log('Admin validation successful for known super admin user:', user.id);
      return { isValid: true, userId: user.id };
    }

    console.log('User does not have admin role. User ID:', user.id);
    return { isValid: false, status: 403, message: "Unauthorized: Admin access required" };
    
  } catch (err) {
    console.error('Admin validation error:', err);
    return { isValid: false, status: 500, message: `Authentication error: ${err.message}` };
  }
}

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
