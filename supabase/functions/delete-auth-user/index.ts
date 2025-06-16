
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

      // 17. Security audit logs for this user
      await supabaseAdmin.from('security_audit_log').delete().eq('user_id', user_id);
      console.log(`Cleaned up security_audit_log for user: ${user_id}`);

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

    } catch (cleanupError) {
      console.warn('Error during cleanup, but continuing with user deletion:', cleanupError);
      // Continue with deletion attempt even if some cleanup fails
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
