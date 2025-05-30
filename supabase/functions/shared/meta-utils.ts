export const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
export const SUPABASE_URL = "https://pcnrnciwgdrukzciwexi.supabase.co";

export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

export async function deleteSocialAccount(accountId: string) {
  return fetch(`${SUPABASE_URL}/rest/v1/social_accounts?account_id=eq.${accountId}`, {
    method: "DELETE",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "return=representation",
    },
  });
}

export async function logDeauth(platform: string, accountId: string, status: string, errorMessage?: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/deauth_logs`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ platform, account_id: accountId, status, error_message: errorMessage }),
  });
}
