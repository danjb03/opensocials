
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
      return new Response(
        JSON.stringify({ error: 'Authorization header required' }),
        { status: 401, headers: corsHeaders }
      );
    }

    const token = authHeader.replace('Bearer ', '');
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Validate admin access
    const validation = await validateSuperAdmin(supabase, token);
    if (!validation.isValid) {
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

    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`Admin ${validation.userId} attempting to delete user: ${user_id}`);

    // Delete user from auth
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user_id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return new Response(
        JSON.stringify({ error: `Failed to delete user: ${deleteError.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Log the deletion for audit
    await supabase.from('security_audit_log').insert({
      user_id: validation.userId,
      action: 'DELETE_USER',
      resource_type: 'auth_user',
      resource_id: user_id,
      details: { deleted_user_id: user_id }
    });

    console.log(`User ${user_id} successfully deleted by admin ${validation.userId}`);

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in delete-auth-user function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: corsHeaders }
    );
  }
});
