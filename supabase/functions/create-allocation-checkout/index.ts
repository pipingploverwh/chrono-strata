import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// LAVANDAR Allocation Products
const ALLOCATION_PRODUCTS = {
  standard: {
    priceId: "price_1Sr9DFPxsKYUGDko0Fzh40uO",
    name: "Standard Allocation",
    amount: 25000, // $250.00
  },
  deposit: {
    priceId: "price_1Sr9lgPxsKYUGDkoR2zFdOhe",
    name: "APEX-1 DJ Table Deposit",
    amount: 180000, // $1,800.00
  },
};

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[ALLOCATION-CHECKOUT] ${step}${detailsStr}`);
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    logStep("Function started");

    const { allocationTier = "standard", applicationId } = await req.json();
    logStep("Request received", { allocationTier, applicationId });

    // Get the price for this allocation tier
    const product = ALLOCATION_PRODUCTS[allocationTier as keyof typeof ALLOCATION_PRODUCTS];
    if (!product) {
      throw new Error(`Invalid allocation tier: ${allocationTier}`);
    }

    // Initialize Stripe
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY is not configured");

    const stripe = new Stripe(stripeKey, {
      apiVersion: "2025-08-27.basil",
    });

    // Check for authenticated user (optional for guest checkout)
    let userEmail: string | undefined;
    let customerId: string | undefined;

    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      if (data.user?.email) {
        userEmail = data.user.email;
        logStep("User authenticated", { email: userEmail });

        // Check if customer exists in Stripe
        const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
          logStep("Existing Stripe customer found", { customerId });
        }
      }
    }

    // Build checkout session metadata
    const metadata: Record<string, string> = {
      allocation_tier: allocationTier,
      product_name: product.name,
    };
    if (applicationId) {
      metadata.application_id = applicationId;
    }

    const origin = req.headers.get("origin") || "https://chrono-strata.lovable.app";

    // Create checkout session
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price: product.priceId,
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/allocation-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/allocation-canceled`,
      metadata,
      payment_intent_data: {
        metadata,
      },
    };

    // Add customer info if available
    if (customerId) {
      sessionParams.customer = customerId;
    } else if (userEmail) {
      sessionParams.customer_email = userEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url });

    return new Response(
      JSON.stringify({ 
        url: session.url,
        sessionId: session.id,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    logStep("ERROR", { message: errorMessage });
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
