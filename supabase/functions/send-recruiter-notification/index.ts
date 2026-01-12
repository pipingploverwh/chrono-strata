import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface NotificationRequest {
  recipientEmail: string;
  recruiterName: string;
  companyName: string;
  roleName: string;
  emailContent: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY is not configured");
    }

    const { recipientEmail, recruiterName, companyName, roleName, emailContent }: NotificationRequest = await req.json();

    if (!recipientEmail || !emailContent) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }

    const emailHtml = `
        <div style="font-family: system-ui, -apple-system, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 30px; border-radius: 12px; color: white;">
            <h1 style="margin: 0 0 10px 0; font-size: 24px;">🔔 Recruiter Outreach Reminder</h1>
            <p style="margin: 0; opacity: 0.8; font-size: 14px;">Lavandar AI • Operations Platform</p>
          </div>
          
          <div style="padding: 30px 0;">
            <h2 style="color: #333; margin: 0 0 20px 0;">Draft Ready to Send</h2>
            
            ${recruiterName ? `<p style="margin: 10px 0;"><strong>Recruiter:</strong> ${recruiterName}</p>` : ''}
            ${companyName ? `<p style="margin: 10px 0;"><strong>Company:</strong> ${companyName}</p>` : ''}
            ${roleName ? `<p style="margin: 10px 0;"><strong>Role:</strong> ${roleName}</p>` : ''}
            
            <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #f97316;">
              <h3 style="margin: 0 0 15px 0; color: #333;">Your Email Draft:</h3>
              <div style="white-space: pre-wrap; color: #555; line-height: 1.6;">${emailContent}</div>
            </div>
            
            <p style="color: #666; font-size: 14px; margin-top: 30px;">
              This is your 5-minute reminder to review and send your recruiter outreach email.
            </p>
          </div>
          
          <div style="border-top: 1px solid #eee; padding-top: 20px; text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Sent by Lavandar AI Operations Platform<br>
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
        to: [recipientEmail],
        subject: `Recruiter Outreach Reminder: ${companyName || 'Follow Up'}`,
        html: emailHtml,
      }),
    });

    const result = await emailResponse.json();

    if (!emailResponse.ok) {
      console.error("Resend API error:", result);
      throw new Error(result.message || "Failed to send email");
    }

    console.log("Notification email sent successfully:", result);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-recruiter-notification function:", error);
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
