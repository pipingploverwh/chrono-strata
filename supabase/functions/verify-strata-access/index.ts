import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, sessionId } = await req.json();

    if (!email && !sessionId) {
      return new Response(
        JSON.stringify({ error: "Email or session ID required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    let query = supabase
      .from("strata_access")
      .select("email, location_count, payment_status, granted_at");

    if (sessionId) {
      query = query.eq("stripe_session_id", sessionId);
    } else if (email) {
      query = query.eq("email", email.toLowerCase());
    }

    const { data, error } = await query.single();

    if (error || !data) {
      return new Response(
        JSON.stringify({ hasAccess: false, error: "No access record found" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const hasAccess = data.payment_status === "paid" || data.payment_status === "verified";

    return new Response(
      JSON.stringify({
        hasAccess,
        locationCount: data.location_count,
        grantedAt: data.granted_at,
        paymentStatus: data.payment_status
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error) {
    console.error("[VERIFY-STRATA] Error:", error);
    return new Response(
      JSON.stringify({ error: "Verification failed" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
