import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders, validateSuperAdmin } from "../shared/admin-utils.ts";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders, status: 204 });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    const validation = await validateSuperAdmin(supabase, token);
    if (!validation.isValid) {
      return new Response(
        JSON.stringify({ success: false, error: validation.message }),
        { headers: corsHeaders, status: validation.status }
      );
    }

    let params: Record<string, string> = {};
    if (req.method === "POST" && req.headers.get("content-type")?.includes("application/json")) {
      try {
        params = await req.json();
      } catch {
        params = {};
      }
    } else {
      const url = new URL(req.url);
      url.searchParams.forEach((value, key) => {
        params[key] = value;
      });
    }

    const type = params.type || "brand";
    const page = parseInt(params.page || "1");
    const pageSize = parseInt(params.pageSize || "10");
    const orderBy = params.orderBy || "last_active_at";
    const orderDirection = params.orderDirection === "asc" ? true : false;
    const statusFilter = params.status || null;
    const searchTerm = params.search || null;
    const platformFilter = params.platform || null;

    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;

    let table = "";
    let searchClause = "";

    if (type === "brand") {
      table = "admin_crm_brands_view";
      if (searchTerm) {
        searchClause = `company_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
      }
    } else if (type === "creator") {
      table = "admin_crm_creators_view";
      if (searchTerm) {
        searchClause = `first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,email.ilike.%${searchTerm}%`;
      }
    } else {
      return new Response(
        JSON.stringify({ success: false, error: "Invalid type parameter" }),
        { headers: corsHeaders, status: 400 }
      );
    }

    let query = supabase.from(table).select("*", { count: "exact" });

    if (searchClause) {
      query = query.or(searchClause);
    }

    if (statusFilter && statusFilter !== "all") {
      query = query.eq("status", statusFilter);
    }

    if (type === "creator" && platformFilter && platformFilter !== "all") {
      query = query.eq("primary_platform", platformFilter);
    }

    query = query.order(orderBy, { ascending: orderDirection }).range(from, to);

    const { data, error, count } = await query;

    if (error) {
      return new Response(
        JSON.stringify({ success: false, error: `Failed to fetch ${type} data: ${error.message}` }),
        { headers: corsHeaders, status: 500 }
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        data: data || [],
        pagination: {
          total: count || 0,
          page,
          pageSize,
          pageCount: count ? Math.ceil(count / pageSize) : 0,
        },
      }),
      { headers: corsHeaders }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ success: false, error: `Server error: ${err.message}` }),
      { headers: corsHeaders, status: 500 }
    );
  }
});
