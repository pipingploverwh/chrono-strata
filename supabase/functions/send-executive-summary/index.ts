import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ExecutiveSummaryRequest {
  recipientEmail: string;
  recipientName?: string;
  accuracy: number;
  matchedDrives: number;
  totalDrives: number;
  missedDrives: Array<{
    drive: number;
    quarter: string;
    predictedCall: string;
    actualCall: string;
    varianceReason: string;
  }>;
  gameInfo: {
    teams: string;
    date: string;
    venue: string;
  };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { 
      recipientEmail, 
      recipientName,
      accuracy, 
      matchedDrives, 
      totalDrives, 
      missedDrives,
      gameInfo 
    }: ExecutiveSummaryRequest = await req.json();

    if (!recipientEmail) {
      return new Response(
        JSON.stringify({ error: "Recipient email is required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const missedDrivesRows = missedDrives.map(d => `
      <tr>
        <td style="padding: 12px 16px; border-bottom: 1px solid #334155; color: #e2e8f0;">Drive ${d.drive} (${d.quarter})</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #334155; color: #22d3ee;">${d.predictedCall}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #334155; color: #fb923c;">${d.actualCall}</td>
        <td style="padding: 12px 16px; border-bottom: 1px solid #334155; color: #94a3b8;">${d.varianceReason}</td>
      </tr>
    `).join('');

    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #0a1628;">
          <div style="max-width: 680px; margin: 0 auto; padding: 40px 20px;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1a1f2e 0%, #0f172a 100%); border-radius: 16px 16px 0 0; padding: 32px; border-bottom: 2px solid #b91c1c;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td>
                    <h1 style="margin: 0; font-size: 28px; font-weight: 700; color: #ffffff; letter-spacing: 0.05em;">CHRONO-STRATA</h1>
                    <p style="margin: 8px 0 0 0; font-size: 12px; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.15em;">Executive Summary Report</p>
                  </td>
                  <td style="text-align: right;">
                    <span style="background: rgba(185, 28, 28, 0.2); border: 1px solid rgba(185, 28, 28, 0.5); padding: 8px 16px; border-radius: 6px; font-size: 12px; color: #fca5a5;">${currentDate}</span>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Main Content -->
            <div style="background: linear-gradient(180deg, #0f172a 0%, #1e293b 100%); padding: 40px 32px;">
              ${recipientName ? `<p style="color: #94a3b8; margin: 0 0 24px 0;">Dear ${recipientName},</p>` : ''}
              
              <p style="color: #cbd5e1; margin: 0 0 32px 0; line-height: 1.6;">
                Please find below the executive summary for the weather-adjusted prediction analysis.
              </p>

              <!-- Hero Stat -->
              <div style="background: linear-gradient(135deg, rgba(15, 23, 42, 0.8), rgba(30, 41, 59, 0.6)); border: 1px solid #334155; border-radius: 16px; padding: 40px; text-align: center; margin-bottom: 32px;">
                <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 0.2em; color: #94a3b8; margin-bottom: 8px;">Prediction Accuracy</div>
                <div style="font-size: 72px; font-weight: 800; color: #4ade80; line-height: 1;">${accuracy}%</div>
                <div style="font-size: 14px; color: #64748b; margin-top: 12px;">${gameInfo.teams} • ${gameInfo.date} • ${gameInfo.venue}</div>
              </div>

              <!-- Metrics Grid -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom: 32px;">
                <tr>
                  <td style="width: 33%; padding: 8px;">
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; margin-bottom: 8px;">Drives Matched</div>
                      <div style="font-size: 28px; font-weight: 700; color: #4ade80;">${matchedDrives}/${totalDrives}</div>
                    </div>
                  </td>
                  <td style="width: 33%; padding: 8px;">
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; margin-bottom: 8px;">Seam Route Efficiency</div>
                      <div style="font-size: 28px; font-weight: 700; color: #f87171;">-14%</div>
                    </div>
                  </td>
                  <td style="width: 33%; padding: 8px;">
                    <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 12px; padding: 20px; text-align: center;">
                      <div style="font-size: 10px; text-transform: uppercase; letter-spacing: 0.15em; color: #64748b; margin-bottom: 8px;">Wind Range</div>
                      <div style="font-size: 28px; font-weight: 700; color: #22d3ee;">12-23 mph</div>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Variance Analysis -->
              ${missedDrives.length > 0 ? `
                <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                  <h2 style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 16px 0; padding-left: 12px; border-left: 4px solid #b91c1c;">
                    Variance Analysis (${missedDrives.length} Events)
                  </h2>
                  <table width="100%" cellpadding="0" cellspacing="0" style="font-size: 13px;">
                    <thead>
                      <tr>
                        <th style="text-align: left; padding: 12px 16px; background: rgba(51, 65, 85, 0.5); color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; border-radius: 8px 0 0 0;">Drive</th>
                        <th style="text-align: left; padding: 12px 16px; background: rgba(51, 65, 85, 0.5); color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Predicted</th>
                        <th style="text-align: left; padding: 12px 16px; background: rgba(51, 65, 85, 0.5); color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600;">Actual</th>
                        <th style="text-align: left; padding: 12px 16px; background: rgba(51, 65, 85, 0.5); color: #94a3b8; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 600; border-radius: 0 8px 0 0;">Reason</th>
                      </tr>
                    </thead>
                    <tbody>
                      ${missedDrivesRows}
                    </tbody>
                  </table>
                </div>
              ` : ''}

              <!-- Key Findings -->
              <div style="background: rgba(15, 23, 42, 0.6); border: 1px solid #334155; border-radius: 12px; padding: 24px;">
                <h2 style="font-size: 16px; font-weight: 600; color: #ffffff; margin: 0 0 16px 0; padding-left: 12px; border-left: 4px solid #b91c1c;">
                  Key Findings
                </h2>
                <ul style="list-style: none; padding: 0; margin: 0;">
                  <li style="padding: 12px 0; border-bottom: 1px solid #334155; color: #cbd5e1;">
                    • <strong style="color: #4ade80;">94% correlation</strong> between weather-adjusted predictions and actual play calls
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid #334155; color: #cbd5e1;">
                    • <strong style="color: #f87171;">14% efficiency drop</strong> in seam routes during high-wind conditions (>18 mph)
                  </li>
                  <li style="padding: 12px 0; border-bottom: 1px solid #334155; color: #cbd5e1;">
                    • <strong style="color: #22d3ee;">Wind direction shifts</strong> account for 33% of prediction variance
                  </li>
                  <li style="padding: 12px 0; color: #cbd5e1;">
                    • <strong style="color: #fbbf24;">Coaching overrides</strong> most common in red zone situations
                  </li>
                </ul>
              </div>
            </div>

            <!-- Footer -->
            <div style="background: #0f172a; border-radius: 0 0 16px 16px; padding: 24px 32px; border-top: 1px solid #334155;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td style="font-size: 11px; color: #64748b;">
                    Generated by LAVANDAR TECH • Chrono-Strata Platform v2.4.1
                  </td>
                  <td style="text-align: right; font-size: 11px; color: #f87171; text-transform: uppercase; letter-spacing: 0.1em;">
                    Confidential
                  </td>
                </tr>
              </table>
            </div>
          </div>
        </body>
      </html>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Chrono-Strata <onboarding@resend.dev>",
        to: [recipientEmail],
        subject: `Executive Summary: ${gameInfo.teams} - ${accuracy}% Prediction Accuracy`,
        html: emailHtml,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("Executive summary email sent successfully:", result);

    return new Response(JSON.stringify({ success: true, ...result }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-executive-summary function:", error);
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
