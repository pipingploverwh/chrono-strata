import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// STRATA OWNERSHIP - $176/year (post-first-year billing) — Level 1
const STRATA_OWNERSHIP_PRICE = 17600; // cents

// STRATA BOND - $12,500 one-time (100 years prepaid) — Level 2
const STRATA_BOND_PRICE = 1250000; // cents
const STRATA_BOND_YEARS = 100;

// TACTICAL PROVISION - $18,000 physical pre-order (10% deposit = $1,800) — Level 3
const TACTICAL_PROVISION_FULL_PRICE = 1800000; // cents ($18,000)
const TACTICAL_PROVISION_DEPOSIT = 180000; // cents ($1,800 = 10% deposit)

// KIDS SHELL - $148/year - Polar Junior
const KIDS_SHELL_PRICE_ID = "price_1SriqHPxsKYUGDko5fyfF7re";
const KIDS_SHELL_PRICE = 14800; // cents ($148)

// KIDS BUNDLE - $399/year - Complete Explorer Kit
const KIDS_BUNDLE_PRICE_ID = "price_1Ss7BlPxsKYUGDko9zUm0ZJs";
const KIDS_BUNDLE_PRICE = 39900; // cents ($399)

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

    const { mode, priceType, terrainVariant, strataZone, coordinates, legacyYears, size } = await req.json();
    logStep("Request received", { mode, priceType, terrainVariant, strataZone, coordinates, legacyYears, size });

    const isBond = priceType === 'strata_bond';
    const isTactical = priceType === 'tactical_provision';
    const isKidsShell = priceType === 'kids_shell';
    const isKidsBundle = priceType === 'kids_bundle';

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
      product: isKidsBundle ? "kids_bundle" : isKidsShell ? "kids_shell" : isTactical ? "tactical_provision" : isBond ? "strata_bond" : "strata_ownership",
      type: isKidsBundle ? "kids_annual_bundle" : isKidsShell ? "kids_annual_subscription" : isTactical ? "physical_deposit" : isBond ? "century_bond" : "annual_subscription",
      terrain_variant: terrainVariant || "standard",
      strata_zone: strataZone || "Default",
      coordinates_lat: coordinates?.lat?.toString() || "0",
      coordinates_lon: coordinates?.lon?.toString() || "0",
      legacy_years: (legacyYears || STRATA_BOND_YEARS).toString(),
      ...(isKidsBundle && {
        size: size || "S (6-7)",
        collection: "junior",
        bundle_items: "shell,cashmere,pants,boots",
        savings: "63",
      }),
      ...(isKidsShell && {
        size: size || "S (6-7)",
        collection: "junior",
      }),
      ...(isTactical && {
        full_price: (TACTICAL_PROVISION_FULL_PRICE / 100).toString(),
        deposit_amount: (TACTICAL_PROVISION_DEPOSIT / 100).toString(),
        status: "allocated_manufacturing_pending",
      }),
    };

    let sessionParams: Stripe.Checkout.SessionCreateParams;

    if (isKidsBundle) {
      // KIDS BUNDLE - $399/year subscription (Complete Explorer Kit)
      sessionParams = {
        line_items: [
          {
            price: KIDS_BUNDLE_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/shop-success?bundle=true&kids=true&size=${encodeURIComponent(size || 'S')}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/kids-collection?canceled=true`,
        metadata,
        subscription_data: {
          metadata,
          description: `Complete Explorer Kit - Kids Bundle (${size || 'S (6-7)'})`,
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'JP', 'DE', 'FR', 'IT', 'AU'],
        },
      };
      logStep("Creating KIDS BUNDLE checkout", { price: KIDS_BUNDLE_PRICE, size, mode: "subscription" });
    } else if (isKidsShell) {
      // KIDS SHELL - $148/year subscription
      sessionParams = {
        line_items: [
          {
            price: KIDS_SHELL_PRICE_ID,
            quantity: 1,
          },
        ],
        mode: "subscription",
        success_url: `${origin}/shop-success?kids=true&size=${encodeURIComponent(size || 'S')}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/kids-collection?canceled=true`,
        metadata,
        subscription_data: {
          metadata,
          description: `STRATA Shell - Polar Junior (${size || 'S (6-7)'})`,
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'JP', 'DE', 'FR', 'IT', 'AU'],
        },
      };
      logStep("Creating KIDS SHELL checkout", { price: KIDS_SHELL_PRICE, size, mode: "subscription" });
    } else if (isTactical) {
      // TACTICAL PROVISION - $1,800 deposit for $18,000 physical jacket
      sessionParams = {
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'TACTICAL PROVISION — Deposit',
                description: `Physical STRATA Shell Pre-Order. 10% deposit ($1,800) to secure manufacturing slot. Full price: $18,000. Balance due upon fabrication completion.`,
                metadata: {
                  product_type: 'tactical_provision',
                  deposit_percent: '10',
                  full_price_cents: TACTICAL_PROVISION_FULL_PRICE.toString(),
                },
              },
              unit_amount: TACTICAL_PROVISION_DEPOSIT,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `${origin}/shop-success?tactical=true&terrain=${terrainVariant || 'standard'}&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${origin}/shop?canceled=true`,
        metadata,
        payment_intent_data: {
          metadata,
          description: `TACTICAL PROVISION - $1,800 Deposit (10% of $18,000)`,
        },
        shipping_address_collection: {
          allowed_countries: ['US', 'CA', 'GB', 'JP', 'DE', 'FR', 'IT', 'AU'],
        },
      };
      logStep("Creating TACTICAL PROVISION checkout", { deposit: TACTICAL_PROVISION_DEPOSIT, fullPrice: TACTICAL_PROVISION_FULL_PRICE });
    } else if (isBond) {
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
