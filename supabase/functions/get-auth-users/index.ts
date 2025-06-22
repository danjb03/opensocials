
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.49.4'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function validateAdminAccess(supabase: any, token: string) {
  try {
    console.log('🔍 Validating admin access...');
    
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      console.error('❌ Auth validation failed:', authError?.message);
      return { isValid: false, status: 401, message: "Authentication failed" };
    }

    console.log('✅ User authenticated, checking role for user:', user.id);

    // Check user_roles table first (primary source)
    const { data: userRoles, error: userRoleError } = await supabase
      .from("user_roles")
      .select("role, status")
      .eq("user_id", user.id)
      .eq("status", "approved");

    if (!userRoleError && userRoles && userRoles.length > 0) {
      console.log('✅ Found user roles:', userRoles);
      const adminRole = userRoles.find(role => 
        role.role === "super_admin" || role.role === "admin"
      );
      if (adminRole) {
        console.log('✅ Admin validation successful via user_roles:', adminRole.role);
        return { isValid: true, userId: user.id, role: adminRole.role };
      }
    }

    // Fallback to profiles table
    const { data: profiles, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id);

    if (!profileError && profiles && profiles.length > 0) {
      console.log('📋 Profile found:', profiles[0]);
      const profile = profiles[0];
      if (profile.role === "super_admin" || profile.role === "admin") {
        console.log('✅ Admin validation successful via profiles:', profile.role);
        return { isValid: true, userId: user.id, role: profile.role };
      }
    }

    // Special case for known super admin user ID
    if (user.id === 'af6ad2ce-be6c-4620-a440-867c52d66918') {
      console.log('✅ Admin validation successful for known super admin user:', user.id);
      return { isValid: true, userId: user.id, role: 'super_admin' };
    }

    console.log('❌ User does not have admin role. User ID:', user.id);
    return { isValid: false, status: 403, message: "Unauthorized: Admin access required" };
    
  } catch (err) {
    console.error('❌ Admin validation error:', err);
    return { isValid: false, status: 500, message: `Authentication error: ${err.message}` };
  }
}

Deno.serve(async (req) => {
  console.log('🚀 Edge function get-auth-users called');
  console.log('📨 Request method:', req.method);
  console.log('🌐 Request URL:', req.url);

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log('✅ Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('❌ No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    console.log('🔑 Token extracted, length:', token.length);
    
    // Create admin client with service role key
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // Create user client for validation
    const supabaseUser = createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!);
    
    // Validate admin access
    const validation = await validateAdminAccess(supabaseUser, token);
    if (!validation.isValid) {
      console.error('❌ Admin validation failed:', validation.message);
      return new Response(
        JSON.stringify({ error: validation.message }),
        { status: validation.status, headers: corsHeaders }
      );
    }

    if (req.method !== 'POST') {
      console.error('❌ Invalid method:', req.method);
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: corsHeaders }
      );
    }

    const { page = 1, per_page = 50 } = await req.json();

    console.log(`🔍 Admin ${validation.userId} (${validation.role}) fetching auth users - page: ${page}, per_page: ${per_page}`);

    // Get users from auth.users table using admin client
    const { data, error } = await supabaseAdmin.auth.admin.listUsers({
      page,
      perPage: per_page
    });

    if (error) {
      console.error('❌ Error fetching auth users:', error);
      return new Response(
        JSON.stringify({ error: `Failed to fetch users: ${error.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    console.log(`✅ Successfully fetched ${data.users?.length || 0} users (total: ${data.total || 0})`);

    const response = {
      users: data.users || [],
      total: data.total || 0
    };

    return new Response(
      JSON.stringify(response),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('❌ Error in get-auth-users function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
