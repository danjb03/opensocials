// Shared utilities for admin CRM edge functions
export const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export async function validateSuperAdmin(supabase: any, token: string) {
  try {
    const { data: { user }, error: authError } = await supabase.auth.getUser(token);
    if (authError || !user) {
      return { isValid: false, status: 401, message: "Authentication failed" };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", user.id)
      .single();

    if (profileError) {
      return { isValid: false, status: 500, message: "Failed to fetch user profile" };
    }

    if (!profile || (profile.role !== "super_admin" && profile.role !== "admin")) {
      return { isValid: false, status: 403, message: "Unauthorized: Admin access required" };
    }

    return { isValid: true, userId: user.id };
  } catch (err) {
    return { isValid: false, status: 500, message: `Authentication error: ${err.message}` };
  }
}
