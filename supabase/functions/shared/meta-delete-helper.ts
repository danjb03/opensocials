// Shared helper to delete a social account and log the result to Supabase

const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const SUPABASE_URL = "https://pcnrnciwgdrukzciwexi.supabase.co";

interface DeleteResult {
  success: boolean;
  error?: string;
}

async function logDeauth(accountId: string, status: string, error?: string) {
  await fetch(`${SUPABASE_URL}/rest/v1/deauth_logs`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      platform: "meta",
      account_id: accountId,
      status,
      error_message: error ?? null,
    }),
  });
}

export async function deleteSocialAccount(
  id: string,
  field: "account_id" | "profile_id" = "account_id",
): Promise<DeleteResult> {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/social_accounts?${field}=eq.${id}`,
    {
      method: "DELETE",
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
    },
  );

  if (!res.ok) {
    const error = await res.text();
    await logDeauth(id, "failed", error);
    return { success: false, error };
  }

  await logDeauth(id, "success");
  return { success: true };
}
