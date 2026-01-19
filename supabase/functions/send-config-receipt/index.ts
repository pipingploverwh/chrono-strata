import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  ledColor: string;
  surfaceFinish: string;
  accessories: string[];
  totalPrice: number;
  pdfUrl: string;
  heroRenderUrl?: string;
}

const LED_NAMES: Record<string, string> = {
  emerald: "Emerald Lume",
  amber: "Amber Pulse",
  arctic: "Arctic Blue",
  royal: "Royal Purple",
  white: "Pure White",
  rgb: "Full RGB Spectrum",
};

const SURFACE_NAMES: Record<string, string> = {
  carbon: "Carbon Fiber Weave",
  aluminum: "Brushed Aluminum",
  walnut: "Black Walnut Veneer",
  marble: "Italian Marble Inlay",
  titanium: "Titanium Composite",
  rubber: "Recycled Rubber Terrazzo",
};

const ACCESSORY_NAMES: Record<string, string> = {
  'strata-pro': "STRATA Pro Displays",
  'vinyl-rack': "Integrated Vinyl Storage",
  'cable-management': "Premium Cable System",
  'road-case': "Flight Case Package",
  'brass-accents': "Brass Detail Package",
  'rgb-underglow': "Underglow LED System",
};

const ADMIN_EMAIL = "admin@lavandar.dev"; // Replace with actual admin email

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: EmailRequest = await req.json();
    const { orderId, customerEmail, customerName, ledColor, surfaceFinish, accessories, totalPrice, pdfUrl, heroRenderUrl } = data;

    const ledName = LED_NAMES[ledColor] || ledColor;
    const surfaceName = SURFACE_NAMES[surfaceFinish] || surfaceFinish;
    const accessoryList = accessories.map(a => ACCESSORY_NAMES[a] || a).join(', ') || 'None';

    const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <!-- Header -->
    <div style="text-align:center;padding-bottom:30px;border-bottom:1px solid #333;">
      <h1 style="color:#10b981;font-size:28px;font-weight:200;letter-spacing:0.3em;margin:0;">APEX-1</h1>
      <p style="color:#666;font-size:12px;letter-spacing:0.2em;margin-top:8px;">CONFIGURATION RECEIPT</p>
    </div>

    ${heroRenderUrl ? `
    <!-- Hero Render -->
    <div style="margin:30px 0;">
      <img src="${heroRenderUrl}" alt="Your APEX-1" style="width:100%;border-radius:8px;border:1px solid #333;" />
    </div>
    ` : ''}

    <!-- Greeting -->
    <div style="padding:30px 0;">
      <h2 style="color:#e5e5e5;font-size:20px;font-weight:300;margin:0 0 15px 0;">
        ${customerName ? `Thank you, ${customerName}!` : 'Thank you!'}
      </h2>
      <p style="color:#999;font-size:14px;line-height:1.8;margin:0;">
        Your APEX-1 configuration has been received. Below is a summary of your custom console.
      </p>
    </div>

    <!-- Configuration Summary -->
    <div style="background:#111;border-radius:8px;padding:25px;margin:20px 0;">
      <p style="color:#10b981;font-size:10px;letter-spacing:0.3em;margin:0 0 20px 0;">CONFIGURATION SUMMARY</p>
      
      <table style="width:100%;border-collapse:collapse;">
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#e5e5e5;font-size:14px;">LED Lighting</td>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#10b981;font-size:14px;text-align:right;">${ledName}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#e5e5e5;font-size:14px;">Surface Finish</td>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#10b981;font-size:14px;text-align:right;">${surfaceName}</td>
        </tr>
        <tr>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#e5e5e5;font-size:14px;">Accessories</td>
          <td style="padding:12px 0;border-bottom:1px solid #222;color:#999;font-size:13px;text-align:right;">${accessoryList}</td>
        </tr>
      </table>
      
      <div style="margin-top:25px;padding-top:20px;border-top:2px solid #10b981;">
        <p style="color:#666;font-size:10px;letter-spacing:0.2em;margin:0;">TOTAL VALUE</p>
        <p style="color:#10b981;font-size:28px;font-weight:300;margin:5px 0 0 0;">$${totalPrice.toLocaleString()}</p>
      </div>
    </div>

    <!-- Order Info -->
    <div style="background:#0d1117;border:1px solid #222;border-radius:8px;padding:20px;margin:20px 0;">
      <p style="color:#666;font-size:10px;letter-spacing:0.1em;margin:0;">ORDER REFERENCE</p>
      <p style="color:#e5e5e5;font-size:14px;font-family:monospace;margin:5px 0 0 0;">${orderId.slice(0, 8).toUpperCase()}</p>
    </div>

    <!-- PDF Link -->
    ${pdfUrl ? `
    <div style="text-align:center;margin:30px 0;">
      <a href="${pdfUrl}" style="display:inline-block;background:#10b981;color:#000;padding:15px 40px;text-decoration:none;font-size:12px;letter-spacing:0.2em;border-radius:4px;font-weight:500;">VIEW FULL SUMMARY</a>
    </div>
    ` : ''}

    <!-- Next Steps -->
    <div style="padding:30px 0;border-top:1px solid #333;">
      <p style="color:#10b981;font-size:10px;letter-spacing:0.3em;margin:0 0 15px 0;">NEXT STEPS</p>
      <p style="color:#999;font-size:13px;line-height:1.8;margin:0;">
        Our team will review your configuration and contact you within 48 hours to confirm specifications. 
        Your $1,800 deposit secures your production slot. Expected build time is 12-16 weeks.
      </p>
    </div>

    <!-- Footer -->
    <div style="text-align:center;padding-top:30px;border-top:1px solid #333;">
      <p style="color:#666;font-size:11px;margin:0;">APEX-1 Professional DJ Console • Patent Pending</p>
      <p style="color:#444;font-size:10px;margin-top:8px;">© ${new Date().getFullYear()} LAVANDAR Industries</p>
    </div>
  </div>
</body>
</html>`;

    // Send to customer
    const customerResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "APEX-1 <onboarding@resend.dev>",
        to: [customerEmail],
        subject: `Your APEX-1 Configuration #${orderId.slice(0, 8).toUpperCase()}`,
        html: emailHtml,
      }),
    });

    const customerResult = await customerResponse.json();
    console.log("Customer email sent:", customerResult);

    // Send admin notification
    const adminHtml = `
<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:40px;background:#0a0a0a;font-family:monospace;color:#e5e5e5;">
  <h1 style="color:#10b981;font-size:18px;">New APEX-1 Configuration Received</h1>
  <p><strong>Order ID:</strong> ${orderId}</p>
  <p><strong>Customer:</strong> ${customerName || 'N/A'} (${customerEmail})</p>
  <p><strong>LED:</strong> ${ledName}</p>
  <p><strong>Surface:</strong> ${surfaceName}</p>
  <p><strong>Accessories:</strong> ${accessoryList}</p>
  <p><strong>Total:</strong> $${totalPrice.toLocaleString()}</p>
  ${pdfUrl ? `<p><a href="${pdfUrl}" style="color:#10b981;">View PDF Summary</a></p>` : ''}
  ${heroRenderUrl ? `<p><a href="${heroRenderUrl}" style="color:#10b981;">View AI Render</a></p>` : ''}
</body>
</html>`;

    const adminResponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "APEX-1 System <onboarding@resend.dev>",
        to: [ADMIN_EMAIL],
        subject: `[NEW ORDER] APEX-1 #${orderId.slice(0, 8).toUpperCase()} - $${totalPrice.toLocaleString()}`,
        html: adminHtml,
      }),
    });

    const adminResult = await adminResponse.json();
    console.log("Admin email sent:", adminResult);

    return new Response(JSON.stringify({ 
      success: true,
      customerEmailId: customerResult.id,
      adminEmailId: adminResult.id,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("Email send error:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
