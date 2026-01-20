import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// STRATA OWNERSHIP - $176/year (post-first-year billing)
const STRATA_OWNERSHIP_PRICE = 17600; // cents

// STRATA BOND - $12,500 one-time (100 years prepaid)
const STRATA_BOND_PRICE = 1250000; // cents
const STRATA_BOND_YEARS = 100;

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

    const { mode, priceType, terrainVariant, strataZone, coordinates, legacyYears } = await req.json();
    logStep("Request received", { mode, priceType, terrainVariant, strataZone, coordinates, legacyYears });

    const isBond = priceType === 'strata_bond';

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

    const origin = req.headers.get("origin") || "https://chrono-strata.lovable.app";

    // Build checkout session metadata
    const metadata: Record<string, string> = {
      product: isBond ? "strata_bond" : "strata_ownership",
      type: isBond ? "century_bond" : "annual_subscription",
      terrain_variant: terrainVariant || "standard",
      strata_zone: strataZone || "Default",
      coordinates_lat: coordinates?.lat?.toString() || "0",
      coordinates_lon: coordinates?.lon?.toString() || "0",
      legacy_years: (legacyYears || STRATA_BOND_YEARS).toString(),
    };

    let sessionParams: Stripe.Checkout.SessionCreateParams;

    if (isBond) {
      // STRATA BOND - One-time payment for 100 years
      sessionParams = {
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'STRATA BOND',
                description: `Century Protocol — ${STRATA_BOND_YEARS} Years of Ownership. Transferable to children & heirs.`,
                metadata: {
                  product_type: 'strata_bond',
                  years_included: STRATA_BOND_YEARS.toString(),
                },
              },
              unit_amount: STRATA_BOND_PRICE,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/shop-success?bond=true&terrain=${terrainVariant || 'standard'}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop?canceled=true`,
        metadata,
        payment_intent_data: {
          metadata,
          description: `STRATA BOND - ${STRATA_BOND_YEARS} Year Generational Access`,
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'JP', 'DE', 'FR', 'IT', 'AU'],
        },
      };
      logStep("Creating STRATA BOND checkout", { price: STRATA_BOND_PRICE, years: STRATA_BOND_YEARS });
    } else {
      // STRATA OWNERSHIP - Annual subscription
      sessionParams = {
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'STRATA OWNERSHIP',
                description: 'Century Protocol — Annual Weather Shell Access. Part of the 100-year ownership lineage.',
                metadata: {
                  product_type: 'strata_ownership',
                },
              },
              unit_amount: STRATA_OWNERSHIP_PRICE,
              recurring: {
                interval: 'year',
              },
            },
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/shop-success?terrain=${terrainVariant || 'standard'}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop?canceled=true`,
        metadata,
        subscription_data: {
          metadata,
          description: 'STRATA OWNERSHIP - Annual Century Protocol Access',
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'JP', 'DE', 'FR', 'IT', 'AU'],
        },
      };
      logStep("Creating STRATA OWNERSHIP checkout", { price: STRATA_OWNERSHIP_PRICE, mode: "subscription" });
    }

    // Add customer info if available
    if (customerId) {
      sessionParams.customer = customerId;
    } else if (userEmail) {
      sessionParams.customer_email = userEmail;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);
    logStep("Checkout session created", { sessionId: session.id, url: session.url, mode: isBond ? "payment" : "subscription" });

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
