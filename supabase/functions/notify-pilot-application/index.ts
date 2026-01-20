import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface PilotApplicationNotification {
  company_name: string;
  company_size: string;
  industry: string;
  contact_name: string;
  contact_email: string;
  contact_title?: string;
  use_case: string;
  use_case_details?: string;
  desired_timeline: string;
  budget_range?: string;
  current_solution?: string;
}

const ADMIN_EMAILS = ["hello@lavandar.ai"];

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const application: PilotApplicationNotification = await req.json();

    console.log("Received pilot application notification request:", application.company_name);

    const emailHtml = `
      <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 700px; margin: 0 auto; padding: 20px;">
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px 12px 0 0; color: white;">
          <h1 style="margin: 0 0 10px 0; font-size: 24px;">🚀 New Pilot Application</h1>
          <p style="margin: 0; opacity: 0.8; font-size: 14px;">Lavandar AI • Enterprise Pilot Program</p>
        </div>
        
        <div style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px; padding: 30px; background: #ffffff;">
          <div style="margin-bottom: 24px;">
            <h2 style="color: #111; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #f97316; padding-bottom: 8px; display: inline-block;">Company Information</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 140px;">Company:</td>
                <td style="padding: 8px 0; color: #111; font-weight: 600;">${application.company_name}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Size:</td>
                <td style="padding: 8px 0; color: #111;">${application.company_size}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Industry:</td>
                <td style="padding: 8px 0; color: #111;">${application.industry}</td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 24px;">
            <h2 style="color: #111; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #f97316; padding-bottom: 8px; display: inline-block;">Contact Details</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 140px;">Name:</td>
                <td style="padding: 8px 0; color: #111; font-weight: 600;">${application.contact_name}</td>
              </tr>
              ${application.contact_title ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Title:</td>
                <td style="padding: 8px 0; color: #111;">${application.contact_title}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Email:</td>
                <td style="padding: 8px 0;">
                  <a href="mailto:${application.contact_email}" style="color: #f97316; text-decoration: none;">${application.contact_email}</a>
                </td>
              </tr>
            </table>
          </div>

          <div style="margin-bottom: 24px;">
            <h2 style="color: #111; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #f97316; padding-bottom: 8px; display: inline-block;">Use Case</h2>
            <div style="background: #f9fafb; padding: 16px; border-radius: 8px; border-left: 4px solid #f97316;">
              <p style="margin: 0 0 8px 0; font-weight: 600; color: #111;">${application.use_case}</p>
              ${application.use_case_details ? `
              <p style="margin: 0; color: #4b5563; line-height: 1.6;">${application.use_case_details}</p>
              ` : '<p style="margin: 0; color: #9ca3af; font-style: italic;">No additional details provided</p>'}
            </div>
            ${application.current_solution ? `
            <p style="margin: 16px 0 0 0; color: #6b7280; font-size: 14px;">
              <strong>Current Solution:</strong> ${application.current_solution}
            </p>
            ` : ''}
          </div>

          <div style="margin-bottom: 24px;">
            <h2 style="color: #111; margin: 0 0 16px 0; font-size: 18px; border-bottom: 2px solid #f97316; padding-bottom: 8px; display: inline-block;">Timeline & Budget</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #6b7280; width: 140px;">Timeline:</td>
                <td style="padding: 8px 0; color: #111; font-weight: 600;">${application.desired_timeline}</td>
              </tr>
              ${application.budget_range ? `
              <tr>
                <td style="padding: 8px 0; color: #6b7280;">Budget:</td>
                <td style="padding: 8px 0; color: #111;">${application.budget_range}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="background: #fef3c7; padding: 16px; border-radius: 8px; margin-top: 24px;">
            <p style="margin: 0; color: #92400e; font-size: 14px;">
              <strong>Action Required:</strong> Review this application in the Admin Dashboard and follow up within 2-3 business days.
            </p>
          </div>
        </div>
        
        <div style="text-align: center; padding-top: 20px;">
          <p style="color: #9ca3af; font-size: 12px; margin: 0;">
            Lavandar AI • Enterprise Operations Platform<br>
            Built in Woods Hole by Piping Plover
          </p>
        </div>
      </div>
    `;

    const emailResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Lavandar AI <onboarding@resend.dev>",
        to: ADMIN_EMAILS,
        subject: `🚀 New Pilot Application: ${application.company_name} (${application.industry})`,
        html: emailHtml,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      throw new Error(result.message || "Failed to send notification email");
    }

    console.log("Pilot application notification sent successfully:", result);

    return new Response(JSON.stringify({ success: true, id: result?.id }), {
      status: 200,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  } catch (error: any) {
    console.error("Error in notify-pilot-application function:", error);
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
