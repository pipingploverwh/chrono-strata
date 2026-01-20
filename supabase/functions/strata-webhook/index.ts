import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, stripe-signature",
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[STRATA-WEBHOOK] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  
  if (!stripeKey || !webhookSecret) {
    logStep("ERROR: Missing environment variables");
    return new Response(JSON.stringify({ error: "Server configuration error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
  
  // Create Supabase client with service role for database operations
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Get raw body for signature verification
    const body = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      logStep("ERROR: Missing Stripe signature");
      return new Response(JSON.stringify({ error: "Missing signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Verify webhook signature
    let event: Stripe.Event;
    try {
      event = await stripe.webhooks.constructEventAsync(body, signature, webhookSecret);
      logStep("Webhook verified", { type: event.type, id: event.id });
    } catch (err) {
      logStep("ERROR: Signature verification failed", { error: String(err) });
      return new Response(JSON.stringify({ error: "Invalid signature" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    // Handle checkout.session.completed event
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      logStep("Processing checkout session", { 
        sessionId: session.id,
        paymentStatus: session.payment_status,
        email: session.customer_email
      });

      if (session.payment_status === "paid") {
        const email = session.customer_email || session.customer_details?.email;
        
        if (!email) {
          logStep("ERROR: No email in session");
          return new Response(JSON.stringify({ error: "No email found" }), {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Extract location count from metadata
        const locationCount = parseInt(session.metadata?.locationCount || "7");
        
        // Check if access already exists for this session
        const { data: existing } = await supabase
          .from("strata_access")
          .select("id")
          .eq("stripe_session_id", session.id)
          .single();

        if (existing) {
          logStep("Access already granted for this session", { sessionId: session.id });
          return new Response(JSON.stringify({ received: true, status: "already_processed" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Grant access by inserting into database
        const { error: insertError } = await supabase
          .from("strata_access")
          .insert({
            email: email.toLowerCase(),
            location_count: locationCount,
            stripe_session_id: session.id,
            stripe_payment_intent: session.payment_intent as string,
            payment_status: "paid",
            amount_paid: session.amount_total,
            granted_at: new Date().toISOString()
          });

        if (insertError) {
          logStep("ERROR: Failed to insert access record", { error: insertError.message });
          return new Response(JSON.stringify({ error: "Database error" }), {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        logStep("Access granted successfully", { 
          email, 
          locationCount,
          amount: session.amount_total 
        });
      }
    }

    // Handle payment_intent.succeeded for additional verification
    if (event.type === "payment_intent.succeeded") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logStep("Payment intent succeeded", { 
        id: paymentIntent.id,
        amount: paymentIntent.amount 
      });

      // Update any pending records with this payment intent
      const { error: updateError } = await supabase
        .from("strata_access")
        .update({ payment_status: "verified" })
        .eq("stripe_payment_intent", paymentIntent.id)
        .eq("payment_status", "paid");

      if (updateError) {
        logStep("WARN: Could not update payment status", { error: updateError.message });
      }
    }

    // Handle failed payments
    if (event.type === "payment_intent.payment_failed") {
      const paymentIntent = event.data.object as Stripe.PaymentIntent;
      logStep("Payment failed", { 
        id: paymentIntent.id,
        error: paymentIntent.last_payment_error?.message 
      });
    }

    return new Response(JSON.stringify({ received: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (error) {
    logStep("ERROR: Unexpected error", { error: String(error) });
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
