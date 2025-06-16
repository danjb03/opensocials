
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

    const { user_id } = await req.json();

    if (!user_id) {
      return new Response(
        JSON.stringify({ error: 'user_id is required' }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log(`Admin ${validation.userId} attempting to delete user: ${user_id}`);

    // First, clean up related data to avoid foreign key constraints
    try {
      // Delete audit logs for this user
      await supabaseAdmin.from('security_audit_log').delete().eq('user_id', user_id);
      console.log(`Cleaned up audit logs for user: ${user_id}`);

      // Delete user roles
      await supabaseAdmin.from('user_roles').delete().eq('user_id', user_id);
      console.log(`Cleaned up user roles for user: ${user_id}`);

      // Delete profile
      await supabaseAdmin.from('profiles').delete().eq('id', user_id);
      console.log(`Cleaned up profile for user: ${user_id}`);

      // Delete creator profile if exists
      await supabaseAdmin.from('creator_profiles').delete().eq('user_id', user_id);
      console.log(`Cleaned up creator profile for user: ${user_id}`);

      // Delete brand profile if exists
      await supabaseAdmin.from('brand_profiles').delete().eq('user_id', user_id);
      console.log(`Cleaned up brand profile for user: ${user_id}`);

    } catch (cleanupError) {
      console.warn('Error during cleanup, but continuing with user deletion:', cleanupError);
    }

    // Now delete user from auth
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      return new Response(
        JSON.stringify({ error: `Failed to delete user: ${deleteError.message}` }),
        { status: 500, headers: corsHeaders }
      );
    }

    // Log the deletion for audit (using the admin's user ID since the deleted user no longer exists)
    try {
      await supabaseAdmin.from('security_audit_log').insert({
        user_id: validation.userId,
        action: 'DELETE_USER',
        resource_type: 'auth_user',
        resource_id: user_id,
        details: { deleted_user_id: user_id }
      });
    } catch (auditError) {
      console.warn('Could not log deletion to audit log:', auditError);
      // Don't fail the operation if audit logging fails
    }

    console.log(`User ${user_id} successfully deleted by admin ${validation.userId}`);

    return new Response(
      JSON.stringify({ success: true, message: 'User deleted successfully' }),
      { status: 200, headers: corsHeaders }
    );

  } catch (error) {
    console.error('Error in delete-auth-user function:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
