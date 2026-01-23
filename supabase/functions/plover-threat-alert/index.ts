import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.90.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ThreatAlertPayload {
  site_id: string;
  name: string;
  latitude: number;
  longitude: number;
  eggs: number;
  chicks: number;
  observer_notes: string | null;
  last_check: string;
  updated_at: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: ThreatAlertPayload = await req.json();
    console.log("Received threat alert for site:", payload.site_id);

    // Create Supabase client with service role for logging
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log the threat to threat_logs table
    const { error: logError } = await supabase.from("threat_logs").insert({
      site_id: payload.site_id,
      site_name: payload.name,
      threat_level: "high",
      latitude: payload.latitude,
      longitude: payload.longitude,
      eggs: payload.eggs,
      chicks: payload.chicks,
      observer_notes: payload.observer_notes,
      alert_sent: false,
    });

    if (logError) {
      console.error("Error logging threat:", logError);
    }

    // Format the alert email
    const formattedTime = new Date(payload.updated_at).toLocaleString("en-US", {
      timeZone: "America/New_York",
      dateStyle: "full",
      timeStyle: "short",
    });

    const googleMapsLink = `https://www.google.com/maps?q=${payload.latitude},${payload.longitude}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background: #0a0a0a; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; border-radius: 12px 12px 0 0; }
          .header h1 { color: #fff; margin: 0; font-size: 24px; display: flex; align-items: center; gap: 12px; }
          .alert-badge { background: #fff; color: #dc2626; padding: 4px 12px; border-radius: 999px; font-size: 12px; font-weight: 700; text-transform: uppercase; }
          .content { background: #1a1a1a; padding: 30px; border-radius: 0 0 12px 12px; color: #e5e5e5; }
          .site-name { font-size: 28px; font-weight: 700; color: #fff; margin-bottom: 8px; }
          .site-id { color: #737373; font-family: monospace; font-size: 14px; margin-bottom: 24px; }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 24px; }
          .stat { background: #262626; padding: 16px; border-radius: 8px; border-left: 3px solid #dc2626; }
          .stat-label { color: #737373; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
          .stat-value { color: #fff; font-size: 20px; font-weight: 600; }
          .coordinates { background: #262626; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
          .coord-label { color: #737373; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
          .coord-value { font-family: monospace; color: #22d3ee; font-size: 14px; }
          .notes { background: #262626; padding: 16px; border-radius: 8px; margin-bottom: 24px; }
          .notes-label { color: #737373; font-size: 12px; text-transform: uppercase; margin-bottom: 8px; }
          .notes-content { color: #e5e5e5; line-height: 1.6; }
          .action-btn { display: inline-block; background: #dc2626; color: #fff !important; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; margin-top: 16px; }
          .footer { text-align: center; margin-top: 24px; color: #525252; font-size: 12px; }
          .timestamp { color: #737373; font-size: 13px; margin-top: 8px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>
              🚨 HIGH THREAT ALERT
              <span class="alert-badge">Immediate Action Required</span>
            </h1>
          </div>
          <div class="content">
            <div class="site-name">${payload.name}</div>
            <div class="site-id">Site ID: ${payload.site_id}</div>
            
            <div class="grid">
              <div class="stat">
                <div class="stat-label">Eggs at Risk</div>
                <div class="stat-value">${payload.eggs || 0}</div>
              </div>
              <div class="stat">
                <div class="stat-label">Chicks at Risk</div>
                <div class="stat-value">${payload.chicks || 0}</div>
              </div>
            </div>
            
            <div class="coordinates">
              <div class="coord-label">GPS Coordinates (NAD83)</div>
              <div class="coord-value">${payload.latitude.toFixed(6)}°N, ${Math.abs(payload.longitude).toFixed(6)}°W</div>
            </div>
            
            ${payload.observer_notes ? `
            <div class="notes">
              <div class="notes-label">Observer Notes</div>
              <div class="notes-content">${payload.observer_notes}</div>
            </div>
            ` : ''}
            
            <a href="${googleMapsLink}" class="action-btn">📍 View Location on Map</a>
            
            <div class="timestamp">
              Alert triggered: ${formattedTime} ET
            </div>
          </div>
          <div class="footer">
            Piping Plover Conservation | Wellfleet Harbor Authority<br>
            Automated threat detection system powered by Chrono Strata
          </div>
        </div>
      </body>
      </html>
    `;

    // Send the email alert using fetch (same pattern as other edge functions)
    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Plover Alert <onboarding@resend.dev>",
        to: ["hello@lavandar.ai"],
        subject: `🚨 HIGH THREAT: ${payload.name} (${payload.site_id}) - Immediate Action Required`,
        html: emailHtml,
      }),
    });

    const emailResult = await emailResponse.json();
    console.log("Email sent successfully:", emailResult);

    // Update the threat log to mark alert as sent
    if (!logError) {
      await supabase
        .from("threat_logs")
        .update({
          alert_sent: true,
          alert_sent_at: new Date().toISOString(),
        })
        .eq("site_id", payload.site_id)
        .order("created_at", { ascending: false })
        .limit(1);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: "Threat alert sent successfully",
        emailId: emailResult.id 
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error("Error in plover-threat-alert function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
