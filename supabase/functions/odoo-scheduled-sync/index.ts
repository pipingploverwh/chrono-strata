import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface OdooConfig {
  url: string;
  db: string;
  username: string;
  apiKey: string;
}

interface ScheduledSyncConfig {
  config: OdooConfig;
  modules: string[];
  scheduleType: 'hourly' | 'daily';
}

// XML-RPC helpers (same as odoo-sync)
async function callOdooXmlRpc(
  config: OdooConfig,
  service: string,
  method: string,
  params: any[]
): Promise<any> {
  const xmlPayload = buildXmlRpcPayload(method, params);
  
  const response = await fetch(`${config.url}/xmlrpc/2/${service}`, {
    method: "POST",
    headers: { "Content-Type": "text/xml" },
    body: xmlPayload,
  });

  if (!response.ok) {
    throw new Error(`Odoo API error: ${response.status}`);
  }

  const text = await response.text();
  return parseXmlRpcResponse(text);
}

function buildXmlRpcPayload(method: string, params: any[]): string {
  const paramXml = params.map(p => valueToXml(p)).join("");
  return `<?xml version="1.0"?>
<methodCall>
  <methodName>${method}</methodName>
  <params>${paramXml}</params>
</methodCall>`;
}

function valueToXml(value: any): string {
  if (value === null || value === undefined) {
    return "<param><value><boolean>0</boolean></value></param>";
  }
  if (typeof value === "boolean") {
    return `<param><value><boolean>${value ? 1 : 0}</boolean></value></param>`;
  }
  if (typeof value === "number") {
    if (Number.isInteger(value)) {
      return `<param><value><int>${value}</int></value></param>`;
    }
    return `<param><value><double>${value}</double></value></param>`;
  }
  if (typeof value === "string") {
    return `<param><value><string>${escapeXml(value)}</string></value></param>`;
  }
  if (Array.isArray(value)) {
    const items = value.map(v => `<value>${innerValueToXml(v)}</value>`).join("");
    return `<param><value><array><data>${items}</data></array></value></param>`;
  }
  if (typeof value === "object") {
    const members = Object.entries(value)
      .map(([k, v]) => `<member><name>${k}</name><value>${innerValueToXml(v)}</value></member>`)
      .join("");
    return `<param><value><struct>${members}</struct></value></param>`;
  }
  return `<param><value><string>${String(value)}</string></value></param>`;
}

function innerValueToXml(value: any): string {
  if (value === null || value === undefined) return "<boolean>0</boolean>";
  if (typeof value === "boolean") return `<boolean>${value ? 1 : 0}</boolean>`;
  if (typeof value === "number") {
    return Number.isInteger(value) ? `<int>${value}</int>` : `<double>${value}</double>`;
  }
  if (typeof value === "string") return `<string>${escapeXml(value)}</string>`;
  if (Array.isArray(value)) {
    const items = value.map(v => `<value>${innerValueToXml(v)}</value>`).join("");
    return `<array><data>${items}</data></array>`;
  }
  if (typeof value === "object") {
    const members = Object.entries(value)
      .map(([k, v]) => `<member><name>${k}</name><value>${innerValueToXml(v)}</value></member>`)
      .join("");
    return `<struct>${members}</struct>`;
  }
  return `<string>${String(value)}</string>`;
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function parseXmlRpcResponse(xml: string): any {
  const faultMatch = xml.match(/<fault>[\s\S]*?<string>([\s\S]*?)<\/string>/);
  if (faultMatch) {
    throw new Error(`Odoo fault: ${faultMatch[1]}`);
  }

  const intMatch = xml.match(/<int>(\d+)<\/int>/);
  if (intMatch) return parseInt(intMatch[1], 10);

  const boolMatch = xml.match(/<boolean>([01])<\/boolean>/);
  if (boolMatch) return boolMatch[1] === "1";

  const stringMatch = xml.match(/<string>([\s\S]*?)<\/string>/);
  if (stringMatch) return stringMatch[1];

  return xml;
}

async function authenticate(config: OdooConfig): Promise<number> {
  const uid = await callOdooXmlRpc(config, "common", "authenticate", [
    config.db,
    config.username,
    config.apiKey,
    {},
  ]);

  if (!uid || uid === false) {
    throw new Error("Authentication failed");
  }

  return uid as number;
}

async function createRecords(
  config: OdooConfig,
  uid: number,
  model: string,
  records: Record<string, any>[]
): Promise<number[]> {
  const createdIds: number[] = [];

  for (const record of records) {
    const id = await callOdooXmlRpc(config, "object", "execute_kw", [
      config.db,
      uid,
      config.apiKey,
      model,
      "create",
      [record],
    ]);
    createdIds.push(id as number);
  }

  return createdIds;
}

// Model mapping
const moduleToOdooModel: Record<string, string> = {
  leads: 'crm.lead',
  products: 'product.product',
  weather: 'custom.weather',
  marine: 'custom.marine_forecast',
  visaApplications: 'hr.employee.visa',
  visaDocuments: 'hr.document',
  visaMilestones: 'project.task'
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startTime = Date.now();
  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Get scheduled sync configuration from request or use stored config
    let syncConfig: ScheduledSyncConfig;
    
    try {
      const body = await req.json();
      syncConfig = body;
    } catch {
      // If no body, this is a cron trigger - use environment variables
      const odooUrl = Deno.env.get("ODOO_URL");
      const odooDb = Deno.env.get("ODOO_DB");
      const odooUsername = Deno.env.get("ODOO_USERNAME");
      const odooApiKey = Deno.env.get("ODOO_API_KEY");
      const modulesEnv = Deno.env.get("ODOO_SYNC_MODULES") || "leads,products";

      if (!odooUrl || !odooDb || !odooUsername || !odooApiKey) {
        console.log("Scheduled sync skipped: Missing Odoo credentials in environment");
        return new Response(
          JSON.stringify({ 
            success: false, 
            message: "Missing Odoo credentials. Configure ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_API_KEY secrets." 
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      syncConfig = {
        config: {
          url: odooUrl,
          db: odooDb,
          username: odooUsername,
          apiKey: odooApiKey
        },
        modules: modulesEnv.split(",").map(m => m.trim()),
        scheduleType: 'daily'
      };
    }

    console.log(`Scheduled Odoo sync started for modules: ${syncConfig.modules.join(", ")}`);

    // Authenticate with Odoo
    const uid = await authenticate(syncConfig.config);
    console.log(`Authenticated as UID: ${uid}`);

    // Fetch and sync data for each module
    const results: Record<string, any> = {};
    let totalRecords = 0;

    for (const module of syncConfig.modules) {
      const odooModel = moduleToOdooModel[module];
      if (!odooModel) {
        console.log(`Unknown module: ${module}, skipping`);
        continue;
      }

      let records: any[] = [];

      // Fetch data based on module type
      switch (module) {
        case 'leads': {
          const { data } = await supabase.from('investor_contacts').select('*');
          records = (data || []).map(c => ({
            name: c.name,
            email_from: c.email,
            partner_name: c.firm,
            description: c.message,
            type: 'lead',
            source_id: false,
          }));
          break;
        }
        case 'products': {
          const { data } = await supabase.from('sourced_products').select('*');
          records = (data || []).map(p => ({
            name: p.product_name,
            description: p.description,
            list_price: p.suggested_retail_price,
            standard_price: p.cost_price,
            type: 'product',
            sale_ok: true,
            purchase_ok: true
          }));
          break;
        }
        case 'weather': {
          const { data } = await supabase.from('weather_coordinate_logs').select('*').limit(100);
          records = (data || []).map(w => ({
            x_latitude: w.latitude,
            x_longitude: w.longitude,
            x_location_name: w.location_name,
            x_timestamp: w.created_at,
          }));
          break;
        }
        case 'visaApplications': {
          const { data } = await supabase.from('visa_applications').select('*');
          records = (data || []).map(v => ({
            x_visa_type: 'Startup Visa',
            x_application_date: v.application_date,
            x_current_phase: v.current_phase,
            x_status: v.status,
            name: v.notes || 'Visa Application',
          }));
          break;
        }
        case 'visaDocuments': {
          const { data } = await supabase.from('visa_documents').select('*');
          records = (data || []).map(d => ({
            name: d.document_name,
            x_document_type: d.document_type,
            x_status: d.status,
            x_due_date: d.due_date,
          }));
          break;
        }
        case 'visaMilestones': {
          const { data } = await supabase.from('visa_milestones').select('*');
          records = (data || []).map(m => ({
            name: m.title,
            description: m.description,
            date_deadline: m.target_date,
            x_completed_date: m.completed_date,
          }));
          break;
        }
      }

      if (records.length > 0) {
        try {
          const createdIds = await createRecords(syncConfig.config, uid, odooModel, records);
          results[module] = { success: true, count: createdIds.length, ids: createdIds };
          totalRecords += createdIds.length;
          console.log(`Synced ${createdIds.length} ${module} records`);
        } catch (error) {
          const errMsg = error instanceof Error ? error.message : String(error);
          results[module] = { success: false, error: errMsg };
          console.error(`Failed to sync ${module}: ${errMsg}`);
        }
      } else {
        results[module] = { success: true, count: 0, message: 'No records to sync' };
      }
    }

    const duration = Date.now() - startTime;

    console.log(`Scheduled sync completed: ${totalRecords} total records in ${duration}ms`);

    return new Response(
      JSON.stringify({
        success: true,
        timestamp: new Date().toISOString(),
        duration,
        totalRecords,
        results
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Scheduled sync error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      }
    );
  }
});
