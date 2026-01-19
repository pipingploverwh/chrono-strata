import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface PDFRequest {
  orderId: string;
  customerEmail: string;
  customerName: string;
  ledColor: string;
  surfaceFinish: string;
  accessories: string[];
  totalPrice: number;
  renderUrls: string[];
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

const ACCESSORY_NAMES: Record<string, { name: string; price: number }> = {
  'strata-pro': { name: "STRATA Pro Displays", price: 2500 },
  'vinyl-rack': { name: "Integrated Vinyl Storage", price: 1800 },
  'cable-management': { name: "Premium Cable System", price: 800 },
  'road-case': { name: "Flight Case Package", price: 5000 },
  'brass-accents': { name: "Brass Detail Package", price: 1500 },
  'rgb-underglow': { name: "Underglow LED System", price: 950 },
};

const LED_PRICES: Record<string, number> = {
  emerald: 0, amber: 200, arctic: 200, royal: 300, white: 150, rgb: 500,
};

const SURFACE_PRICES: Record<string, number> = {
  carbon: 0, aluminum: 800, walnut: 1500, marble: 3500, titanium: 2800, rubber: 1200,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const data: PDFRequest = await req.json();
    const { orderId, customerEmail, customerName, ledColor, surfaceFinish, accessories, totalPrice, renderUrls } = data;

    // Generate HTML for PDF (using headless rendering service or simple HTML)
    const ledName = LED_NAMES[ledColor] || ledColor;
    const surfaceName = SURFACE_NAMES[surfaceFinish] || surfaceFinish;
    const ledPrice = LED_PRICES[ledColor] || 0;
    const surfacePrice = SURFACE_PRICES[surfaceFinish] || 0;

    const accessoryItems = accessories.map(a => {
      const item = ACCESSORY_NAMES[a];
      return item ? `<tr><td>${item.name}</td><td style="text-align:right">$${item.price.toLocaleString()}</td></tr>` : '';
    }).join('');

    const heroImage = renderUrls.length > 0 ? renderUrls[renderUrls.length - 1] : '';

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: #0a0a0a; 
      color: #e5e5e5;
      padding: 40px;
    }
    .container { max-width: 800px; margin: 0 auto; }
    .header { 
      border-bottom: 1px solid #333;
      padding-bottom: 30px;
      margin-bottom: 30px;
    }
    .logo { 
      font-size: 32px; 
      font-weight: 200; 
      letter-spacing: 0.3em;
      color: #10b981;
    }
    .order-id { 
      font-size: 12px; 
      color: #666;
      margin-top: 8px;
      letter-spacing: 0.1em;
    }
    .hero-image { 
      width: 100%; 
      height: 300px; 
      object-fit: cover;
      border-radius: 8px;
      margin: 30px 0;
      border: 1px solid #333;
    }
    .section { margin: 30px 0; }
    .section-title { 
      font-size: 11px; 
      letter-spacing: 0.3em; 
      color: #10b981;
      margin-bottom: 15px;
      text-transform: uppercase;
    }
    .config-table { width: 100%; border-collapse: collapse; }
    .config-table td { 
      padding: 12px 0; 
      border-bottom: 1px solid #222;
      font-size: 14px;
    }
    .total-row { 
      font-size: 24px; 
      font-weight: 300;
      border-top: 2px solid #10b981;
      padding-top: 20px;
      margin-top: 20px;
    }
    .total-label { color: #666; font-size: 12px; letter-spacing: 0.2em; }
    .total-amount { color: #10b981; }
    .footer { 
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid #333;
      font-size: 11px;
      color: #666;
      text-align: center;
    }
    .customer-info { 
      background: #111;
      padding: 20px;
      border-radius: 8px;
      margin: 20px 0;
    }
    .customer-label { font-size: 10px; color: #666; letter-spacing: 0.1em; }
    .customer-value { font-size: 14px; margin-top: 4px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="logo">APEX-1</div>
      <div class="order-id">Configuration Summary • Order #${orderId.slice(0, 8).toUpperCase()}</div>
    </div>

    ${heroImage ? `<img src="${heroImage}" class="hero-image" alt="Your APEX-1 Configuration" />` : ''}

    <div class="customer-info">
      <div class="customer-label">CONFIGURED FOR</div>
      <div class="customer-value">${customerName || 'Valued Customer'}</div>
      <div class="customer-value" style="color:#666">${customerEmail}</div>
    </div>

    <div class="section">
      <div class="section-title">Configuration Details</div>
      <table class="config-table">
        <tr>
          <td>Base APEX-1 Console</td>
          <td style="text-align:right">$47,500</td>
        </tr>
        <tr>
          <td>LED: ${ledName}</td>
          <td style="text-align:right">${ledPrice === 0 ? 'Included' : '$' + ledPrice.toLocaleString()}</td>
        </tr>
        <tr>
          <td>Surface: ${surfaceName}</td>
          <td style="text-align:right">${surfacePrice === 0 ? 'Included' : '$' + surfacePrice.toLocaleString()}</td>
        </tr>
        ${accessoryItems}
      </table>
    </div>

    <div class="total-row">
      <div class="total-label">TOTAL CONFIGURATION VALUE</div>
      <div class="total-amount">$${totalPrice.toLocaleString()} USD</div>
    </div>

    <div class="section" style="margin-top:40px">
      <div class="section-title">Next Steps</div>
      <p style="font-size:13px;line-height:1.8;color:#999">
        Your $1,800 deposit secures your build slot. Our team will contact you within 48 hours 
        to confirm specifications and discuss delivery timeline. Expected production time is 12-16 weeks.
      </p>
    </div>

    <div class="footer">
      <p>APEX-1 Professional DJ Console • Patent Pending</p>
      <p style="margin-top:8px">© ${new Date().getFullYear()} LAVANDAR Industries. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;

    // Upload HTML as PDF placeholder (in production, use a PDF generation service)
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const fileName = `pdfs/${orderId}-summary.html`;
    const encoder = new TextEncoder();
    const htmlBytes = encoder.encode(htmlContent);

    const { error: uploadError } = await supabase.storage
      .from('configuration-assets')
      .upload(fileName, htmlBytes, {
        contentType: 'text/html',
        upsert: true,
      });

    if (uploadError) {
      console.error("PDF upload error:", uploadError);
      throw uploadError;
    }

    const { data: { publicUrl } } = supabase.storage
      .from('configuration-assets')
      .getPublicUrl(fileName);

    // Update order with PDF URL
    await supabase
      .from('configuration_orders')
      .update({ pdf_url: publicUrl })
      .eq('id', orderId);

    return new Response(JSON.stringify({ 
      pdfUrl: publicUrl,
      success: true
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error: unknown) {
    console.error("PDF generation error:", error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
