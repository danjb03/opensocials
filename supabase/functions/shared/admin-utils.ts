
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

    // Check user role in profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError.message);
      return { isValid: false, status: 500, message: "Failed to fetch user profile" };
    }

    console.log('User profile found, role:', profile?.role);

    if (!profile || (profile.role !== "super_admin" && profile.role !== "admin")) {
      return { isValid: false, status: 403, message: "Unauthorized: Admin access required" };
    }

    console.log('Admin validation successful for user:', user.id);
    return { isValid: true, userId: user.id };
  } catch (err) {
    console.error('Admin validation error:', err);
    return { isValid: false, status: 500, message: `Authentication error: ${err.message}` };
  }
}
