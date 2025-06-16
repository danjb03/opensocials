
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

// Helper function to verify cleanup completion
async function verifyCleanupComplete(supabaseAdmin: any, userId: string, table: string, column: string = 'user_id') {
  try {
    const { data, error } = await supabaseAdmin
      .from(table)
      .select('id')
      .eq(column, userId)
      .limit(1);
    
    if (error) {
      console.warn(`Error checking ${table}:`, error.message);
      return false;
    }
    
    const hasRemaining = data && data.length > 0;
    if (hasRemaining) {
      console.warn(`Warning: ${table} still has ${data.length} records for user ${userId}`);
    }
    return !hasRemaining;
  } catch (err) {
    console.warn(`Error verifying cleanup for ${table}:`, err);
    return false;
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

    // First, get existing audit logs count before cleanup
    const { data: initialAuditLogs } = await supabaseAdmin
      .from('security_audit_log')
      .select('id')
      .eq('user_id', user_id);
    
    console.log(`Found ${initialAuditLogs?.length || 0} initial audit log entries for user ${user_id}`);

    // Comprehensive cleanup of all related data to avoid foreign key constraints
    try {
      console.log(`Starting comprehensive cleanup for user: ${user_id}`);

      // 1. Agency users (both as agency and as managed user)
      await supabaseAdmin.from('agency_users').delete().eq('agency_id', user_id);
      await supabaseAdmin.from('agency_users').delete().eq('user_id', user_id);
      console.log(`Cleaned up agency_users for user: ${user_id}`);

      // 2. Connected accounts
      await supabaseAdmin.from('connected_accounts').delete().eq('user_id', user_id);
      console.log(`Cleaned up connected_accounts for user: ${user_id}`);

      // 3. Creator public analytics
      await supabaseAdmin.from('creator_public_analytics').delete().eq('creator_id', user_id);
      console.log(`Cleaned up creator_public_analytics for user: ${user_id}`);

      // 4. Brand creator connections (both as brand and as creator)
      await supabaseAdmin.from('brand_creator_connections').delete().eq('brand_id', user_id);
      await supabaseAdmin.from('brand_creator_connections').delete().eq('creator_id', user_id);
      console.log(`Cleaned up brand_creator_connections for user: ${user_id}`);

      // 5. Brand creator favorites (both as brand and as creator)
      await supabaseAdmin.from('brand_creator_favorites').delete().eq('brand_id', user_id);
      await supabaseAdmin.from('brand_creator_favorites').delete().eq('creator_id', user_id);
      console.log(`Cleaned up brand_creator_favorites for user: ${user_id}`);

      // 6. Campaign content
      await supabaseAdmin.from('campaign_content').delete().eq('creator_id', user_id);
      console.log(`Cleaned up campaign_content for user: ${user_id}`);

      // 7. Creator deals
      await supabaseAdmin.from('creator_deals').delete().eq('creator_id', user_id);
      console.log(`Cleaned up creator_deals for user: ${user_id}`);

      // 8. Project creators
      await supabaseAdmin.from('project_creators').delete().eq('creator_id', user_id);
      console.log(`Cleaned up project_creators for user: ${user_id}`);

      // 9. Deals (both as creator and brand)
      await supabaseAdmin.from('deals').delete().eq('creator_id', user_id);
      await supabaseAdmin.from('deals').delete().eq('brand_id', user_id);
      console.log(`Cleaned up deals for user: ${user_id}`);

      // 10. Deal earnings
      await supabaseAdmin.from('deal_earnings').delete().eq('creator_id', user_id);
      console.log(`Cleaned up deal_earnings for user: ${user_id}`);

      // 11. Projects (as brand)
      await supabaseAdmin.from('projects').delete().eq('brand_id', user_id);
      await supabaseAdmin.from('projects_new').delete().eq('brand_id', user_id);
      console.log(`Cleaned up projects for user: ${user_id}`);

      // 12. Project drafts
      await supabaseAdmin.from('project_drafts').delete().eq('brand_id', user_id);
      console.log(`Cleaned up project_drafts for user: ${user_id}`);

      // 13. Campaign reviews (as reviewer)
      await supabaseAdmin.from('campaign_reviews').delete().eq('reviewer_id', user_id);
      console.log(`Cleaned up campaign_reviews for user: ${user_id}`);

      // 14. Invite logs (as triggered_by)
      await supabaseAdmin.from('invite_logs').delete().eq('triggered_by', user_id);
      console.log(`Cleaned up invite_logs for user: ${user_id}`);

      // 15. Social profiles
      await supabaseAdmin.from('social_profiles').delete().eq('creator_id', user_id);
      console.log(`Cleaned up social_profiles for user: ${user_id}`);

      // 16. Creator industry tags
      await supabaseAdmin.from('creator_industry_tags').delete().eq('creator_id', user_id);
      console.log(`Cleaned up creator_industry_tags for user: ${user_id}`);

      // 17. Multiple passes on security audit logs to ensure complete cleanup
      console.log(`Starting thorough security_audit_log cleanup for user: ${user_id}`);
      
      // First pass - direct user_id match
      const { data: deletedLogs1 } = await supabaseAdmin
        .from('security_audit_log')
        .delete()
        .eq('user_id', user_id)
        .select('id');
      console.log(`First pass deleted ${deletedLogs1?.length || 0} audit logs`);

      // Second pass - check for any remaining entries
      const { data: remainingLogs } = await supabaseAdmin
        .from('security_audit_log')
        .select('id, action, resource_type')
        .eq('user_id', user_id);
      
      if (remainingLogs && remainingLogs.length > 0) {
        console.log(`Found ${remainingLogs.length} remaining audit logs, attempting force delete`);
        for (const log of remainingLogs) {
          try {
            await supabaseAdmin
              .from('security_audit_log')
              .delete()
              .eq('id', log.id);
            console.log(`Force deleted audit log: ${log.id}`);
          } catch (logError) {
            console.warn(`Failed to delete audit log ${log.id}:`, logError);
          }
        }
      }

      // Final verification
      const auditCleanupComplete = await verifyCleanupComplete(supabaseAdmin, user_id, 'security_audit_log');
      console.log(`Audit log cleanup complete: ${auditCleanupComplete}`);

      // 18. User roles
      await supabaseAdmin.from('user_roles').delete().eq('user_id', user_id);
      console.log(`Cleaned up user_roles for user: ${user_id}`);

      // 19. Creator profile
      await supabaseAdmin.from('creator_profiles').delete().eq('user_id', user_id);
      console.log(`Cleaned up creator_profiles for user: ${user_id}`);

      // 20. Brand profile
      await supabaseAdmin.from('brand_profiles').delete().eq('user_id', user_id);
      console.log(`Cleaned up brand_profiles for user: ${user_id}`);

      // 21. Profile (should be last as other cleanups might reference it)
      await supabaseAdmin.from('profiles').delete().eq('id', user_id);
      console.log(`Cleaned up profiles for user: ${user_id}`);

      console.log(`Completed comprehensive cleanup for user: ${user_id}`);

      // Verify all key foreign key constraints are resolved
      const verifications = [
        await verifyCleanupComplete(supabaseAdmin, user_id, 'security_audit_log'),
        await verifyCleanupComplete(supabaseAdmin, user_id, 'user_roles'),
        await verifyCleanupComplete(supabaseAdmin, user_id, 'profiles', 'id'),
      ];

      const allCleanupComplete = verifications.every(v => v);
      console.log(`All cleanup verifications passed: ${allCleanupComplete}`);

      if (!allCleanupComplete) {
        console.warn('Some cleanup verifications failed, but proceeding with deletion attempt');
      }

    } catch (cleanupError) {
      console.warn('Error during cleanup, but continuing with user deletion:', cleanupError);
      // Continue with deletion attempt even if some cleanup fails
    }

    // Now delete user from auth
    console.log(`Attempting to delete auth user: ${user_id}`);
    const { error: deleteError } = await supabaseAdmin.auth.admin.deleteUser(user_id);

    if (deleteError) {
      console.error('Error deleting user:', deleteError);
      
      // If deletion fails, check what's still referencing the user
      const remainingRefs = await Promise.all([
        supabaseAdmin.from('security_audit_log').select('id').eq('user_id', user_id).limit(5),
        supabaseAdmin.from('user_roles').select('id').eq('user_id', user_id).limit(5),
        supabaseAdmin.from('profiles').select('id').eq('id', user_id).limit(5),
      ]);

      const debugInfo = {
        audit_logs: remainingRefs[0].data?.length || 0,
        user_roles: remainingRefs[1].data?.length || 0,
        profiles: remainingRefs[2].data?.length || 0,
      };

      console.error('Remaining references after cleanup:', debugInfo);

      return new Response(
        JSON.stringify({ 
          error: `Failed to delete user: ${deleteError.message}`,
          details: deleteError,
          remainingReferences: debugInfo
        }),
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
      JSON.stringify({ 
        error: 'Internal server error', 
        details: error.message,
        stack: error.stack 
      }),
      { status: 500, headers: corsHeaders }
    );
  }
});
