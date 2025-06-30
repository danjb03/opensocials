// Shared headers for CORS
export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

/**
 * Validates if the user associated with the provided JWT has 'admin' or 'super_admin' role.
 * It checks multiple sources for the role to ensure robustness.
 * @param supabase The Supabase client instance.
 * @param token The JWT from the Authorization header.
 * @returns An object indicating if the user is a valid admin, their user ID, and error details if any.
 */
export async function validateSuperAdmin(supabase: any, token: string) {
  try {
    if (!token) {
      return { isValid: false, status: 401, message: "Missing authorization token" };
    }

    const { data: { user }, error: authError } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return { isValid: false, status: 401, message: `Authentication failed: ${authError?.message}` };
    }

    // 1. Check the dedicated user_roles table (preferred method)
    const { data: userRole, error: roleError } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .in("role", ["admin", "super_admin"])
      .single();

    if (!roleError && userRole) {
      return { isValid: true, userId: user.id };
    }

    // 2. Fallback to checking the 'role' column in the profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profileError && profile && (profile.role === 'admin' || profile.role === 'super_admin')) {
      return { isValid: true, userId: user.id };
    }

    // 3. Final fallback to user metadata (useful for initial setup)
    if (user.user_metadata?.role === 'admin' || user.user_metadata?.role === 'super_admin') {
      return { isValid: true, userId: user.id };
    }

    return { isValid: false, status: 403, message: "Unauthorized: Admin access required" };

  } catch (err) {
    console.error("Admin validation error:", err);
    return { isValid: false, status: 500, message: `Server error during authentication: ${err.message}` };
  }
}

/**
 * Safely parses a JSON string with a fallback value.
 * @param jsonString The string to parse.
 * @param fallback The value to return on parsing error.
 * @returns The parsed object or the fallback value.
 */
export function safeJsonParse(jsonString: string, fallback: any = null) {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    console.error('JSON parse error:', error);
    return fallback;
  }
}

/**
 * Creates a standardized error response object.
 * @param message The error message.
 * @param status The HTTP status code.
 * @returns A Response object.
 */
export function errorResponse(message: string, status: number = 400) {
  return new Response(
    JSON.stringify({ success: false, error: message }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status }
  );
}

/**
 * Creates a standardized success response object.
 * @param data The data payload to include in the response.
 * @param status The HTTP status code.
 * @returns A Response object.
 */
export function successResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify({ success: true, data }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" }, status }
  );
}
