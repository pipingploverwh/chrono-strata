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

// Kids Bundle item details for email
const BUNDLE_ITEMS = [
  { name: "STRATA Shell - Polar Junior", category: "Outerwear", value: "$148" },
  { name: "Cashmere Interior", category: "Base Layer", value: "$89" },
  { name: "Explorer Pants", category: "Bottoms", value: "$125" },
  { name: "Pathfinder Boots", category: "Footwear", value: "$100" },
];

// Send kids bundle confirmation email using fetch
async function sendKidsBundleEmail(
  email: string,
  size: string,
  sessionId: string,
  amountPaid: number
): Promise<void> {
  const resendKey = Deno.env.get("RESEND_API_KEY");
  if (!resendKey) {
    logStep("WARN: RESEND_API_KEY not configured, skipping email");
    return;
  }

  const orderId = `EXP-${Date.now().toString(36).toUpperCase()}`;
  const formattedAmount = `$${(amountPaid / 100).toFixed(2)}`;

  const itemsHtml = BUNDLE_ITEMS.map(item => `
    <tr>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb;">
        <strong>${item.name}</strong><br>
        <span style="color: #6b7280; font-size: 12px;">${item.category}</span>
      </td>
      <td style="padding: 12px 16px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #6b7280; text-decoration: line-through;">
        ${item.value}
      </td>
    </tr>
  `).join('');

  const emailHtml = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb; margin: 0; padding: 40px 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #7c3aed 0%, #a78bfa 100%); padding: 32px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🎉 Order Confirmed!</h1>
          <p style="color: rgba(255,255,255,0.9); margin: 8px 0 0; font-size: 14px;">Complete Explorer Kit</p>
        </div>

        <!-- Order Details -->
        <div style="padding: 32px;">
          <div style="background: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
            <p style="margin: 0; color: #166534; font-weight: 500;">✓ Your Complete Explorer Kit is on its way!</p>
          </div>

          <table style="width: 100%; margin-bottom: 24px;">
            <tr>
              <td>
                <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Order ID</p>
                <p style="margin: 0; font-weight: 600; font-family: monospace;">${orderId}</p>
              </td>
              <td style="text-align: right;">
                <p style="margin: 0 0 4px; color: #6b7280; font-size: 12px; text-transform: uppercase;">Size</p>
                <p style="margin: 0; font-weight: 600;">${size}</p>
              </td>
            </tr>
          </table>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
            <thead>
              <tr style="background: #f9fafb;">
                <th style="padding: 12px 16px; text-align: left; font-size: 12px; text-transform: uppercase; color: #6b7280;">Item</th>
                <th style="padding: 12px 16px; text-align: right; font-size: 12px; text-transform: uppercase; color: #6b7280;">Retail</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
            </tbody>
          </table>

          <!-- Pricing -->
          <div style="border-top: 2px solid #e5e7eb; padding-top: 16px;">
            <table style="width: 100%;">
              <tr>
                <td style="color: #6b7280; padding: 4px 0;">Retail Total</td>
                <td style="text-align: right; text-decoration: line-through; color: #6b7280;">$462</td>
              </tr>
              <tr>
                <td style="color: #059669; font-weight: 500; padding: 4px 0;">Bundle Savings</td>
                <td style="text-align: right; color: #059669; font-weight: 500;">-$63</td>
              </tr>
              <tr style="border-top: 1px solid #e5e7eb;">
                <td style="font-weight: 600; font-size: 18px; padding-top: 12px;">Annual Total</td>
                <td style="text-align: right; font-weight: 600; font-size: 18px; padding-top: 12px;">${formattedAmount}/year</td>
              </tr>
            </table>
          </div>
        </div>

        <!-- Footer -->
        <div style="background: #f9fafb; padding: 24px; text-align: center; border-top: 1px solid #e5e7eb;">
          <p style="margin: 0 0 8px; color: #6b7280; font-size: 14px;">Questions about your order?</p>
          <a href="mailto:support@chrono-strata.com" style="color: #7c3aed; text-decoration: none; font-weight: 500;">support@chrono-strata.com</a>
          <p style="margin: 16px 0 0; color: #9ca3af; font-size: 12px;">
            STRATA Kids Collection • Premium Weather Gear for Young Explorers
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "STRATA <onboarding@resend.dev>",
        to: [email],
        subject: "🎉 Your Complete Explorer Kit Order Confirmed!",
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logStep("ERROR: Failed to send email", { status: response.status, error: errorText });
    } else {
      const result = await response.json();
      logStep("Email sent successfully", { email, orderId, id: result.id });
    }
  } catch (err) {
    logStep("ERROR: Email sending exception", { error: String(err) });
  }
}

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
        email: session.customer_email,
        product: session.metadata?.product
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

        // Check if this is a kids bundle order
        const isKidsBundle = session.metadata?.product === "kids_bundle";
        
        if (isKidsBundle) {
          logStep("Processing kids bundle order", { email, size: session.metadata?.size });
          
          // Send confirmation email for kids bundle
          await sendKidsBundleEmail(
            email,
            session.metadata?.size || "S (6-7)",
            session.id,
            session.amount_total || 39900
          );
        }

        // Extract location count from metadata (for strata access)
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
          amount: session.amount_total,
          isKidsBundle
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
