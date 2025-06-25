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
      // Don't fail completely, try checking auth metadata
      console.log('Trying auth metadata fallback...');
    } else {
      console.log('Profiles found:', profiles);
      // Check if any profile has admin role
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

// Helper function to safely parse JSON with fallback
export function safeJsonParse(jsonString: string, fallback: any = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

// Helper function for standardized error responses
export function errorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: message 
    }),
    { 
      headers: corsHeaders, 
      status: status 
    }
  );
}

// Helper function for standardized success responses
export function successResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify({
      success: true,
      data
    }),
    {
      headers: corsHeaders,
      status: status
    }
  );
}
