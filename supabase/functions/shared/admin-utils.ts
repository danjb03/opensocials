
export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function validateSuperAdmin(supabase: any, token: string) {
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
    const { data: userRole, error: userRoleError } = await supabase
      .from("user_roles")
      .select("role, status")
      .eq("user_id", user.id)
      .eq("status", "approved")
      .maybeSingle();

    if (!userRoleError && userRole) {
      console.log('Found user role in user_roles table:', userRole.role);
      if (userRole.role === "super_admin" || userRole.role === "admin") {
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
      return { isValid: false, status: 500, message: "Failed to fetch user profile" };
    }

    console.log('Profiles found:', profiles);

    // Check if any profile has admin role
    const adminProfile = profiles?.find(p => p.role === "super_admin" || p.role === "admin");
    
    if (adminProfile) {
      console.log('Admin validation successful via profiles for user:', user.id, 'role:', adminProfile.role);
      return { isValid: true, userId: user.id };
    }

    console.log('User does not have admin role. User ID:', user.id);
    return { isValid: false, status: 403, message: "Unauthorized: Admin access required" };
    
  } catch (err) {
    console.error('Admin validation error:', err);
    return { isValid: false, status: 500, message: `Authentication error: ${err.message}` };
  }
}
