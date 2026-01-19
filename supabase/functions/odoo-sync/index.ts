import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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

interface SyncRequest {
  config: OdooConfig;
  model: string;
  method: string;
  data: Record<string, any>[];
}

// Odoo XML-RPC helper
async function callOdooXmlRpc(
  config: OdooConfig,
  service: string,
  method: string,
  params: any[]
): Promise<any> {
  const xmlPayload = buildXmlRpcPayload(method, params);
  
  const response = await fetch(`${config.url}/xmlrpc/2/${service}`, {
    method: "POST",
    headers: {
      "Content-Type": "text/xml",
    },
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
  // Simple parsing for common Odoo responses
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

  // Return raw for complex structures
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
    throw new Error("Authentication failed. Check credentials.");
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

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { config, model, method, data }: SyncRequest = await req.json();

    console.log(`Odoo sync: ${method} on ${model} with ${data.length} records`);

    // Authenticate
    const uid = await authenticate(config);
    console.log(`Authenticated as UID: ${uid}`);

    let result: any;

    if (method === "create") {
      result = await createRecords(config, uid, model, data);
    } else {
      // For other methods, just return success for now
      result = { success: true, message: `Method ${method} not fully implemented` };
    }

    return new Response(
      JSON.stringify({
        success: true,
        uid,
        result,
        recordsProcessed: data.length,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Odoo sync error:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
