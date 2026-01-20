import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// STRATA Rain Shell - $3,600
const STRATA_JACKET_PRICE_ID = "price_strata_rain_shell_3600";

const logStep = (step: string, details?: Record<string, unknown>) => {
  const detailsStr = details ? ` - ${JSON.stringify(details)}` : '';
  console.log(`[SHOP-CHECKOUT] ${step}${detailsStr}`);
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

    const { designVariant, productName } = await req.json();
    logStep("Request received", { designVariant, productName });

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
      product: "strata_rain_shell",
      design_variant: designVariant || "temporal-flux",
      product_name: productName || "STRATA Rain Shell",
    };

    const origin = req.headers.get("origin") || "https://chrono-strata.lovable.app";

    // Create checkout session with price_data since we may not have pre-created the price
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'STRATA Rain Shell',
              description: `Time Strata Design: ${designVariant || 'Temporal Flux'} - Charles River Apparel × LAVANDAR`,
              metadata: {
                design_variant: designVariant || 'temporal-flux',
              },
            },
            unit_amount: 360000, // $3,600.00 in cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${origin}/shop?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/shop?canceled=true`,
      metadata,
      payment_intent_data: {
        metadata,
      },
      shipping_address_collection: {
        allowed_countries: ['US', 'CA', 'GB', 'JP', 'DE', 'FR', 'IT', 'AU'],
      },
      shipping_options: [
        {
          shipping_rate_data: {
            type: 'fixed_amount',
            fixed_amount: {
              amount: 0,
              currency: 'usd',
            },
            display_name: 'Complimentary Shipping',
            delivery_estimate: {
              minimum: {
                unit: 'business_day',
                value: 10,
              },
              maximum: {
                unit: 'business_day',
                value: 21,
              },
            },
          },
        },
      ],
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
