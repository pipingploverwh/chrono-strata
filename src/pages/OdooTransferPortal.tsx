import { useState } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
  Upload, 
  Download, 
  Webhook, 
  Database, 
  Users, 
  Package, 
  Cloud,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Settings,
  FileJson,
  FileSpreadsheet,
  Send,
  RefreshCw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface TransferStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

const OdooTransferPortal = () => {
  const { toast } = useToast();
  
  // API Configuration
  const [odooUrl, setOdooUrl] = useState("");
  const [odooDb, setOdooDb] = useState("");
  const [odooUsername, setOdooUsername] = useState("");
  const [odooApiKey, setOdooApiKey] = useState("");
  
  // Webhook Configuration
  const [webhookUrl, setWebhookUrl] = useState("");
  
  // Data Selection
  const [selectedData, setSelectedData] = useState({
    leads: true,
    products: true,
    weather: false
  });
  
  // Transfer Status
  const [transferStatus, setTransferStatus] = useState<TransferStatus>({ status: 'idle' });

  const dataModules = [
    {
      id: 'leads',
      name: 'Leads & Contacts',
      icon: Users,
      description: 'Investor contacts and lead information',
      odooModule: 'crm.lead',
      count: 0
    },
    {
      id: 'products',
      name: 'Products & Inventory',
      icon: Package,
      description: 'Sourced products and inventory data',
      odooModule: 'product.product',
      count: 0
    },
    {
      id: 'weather',
      name: 'Weather Intelligence',
      icon: Cloud,
      description: 'Weather coordinate logs and forecasts',
      odooModule: 'custom.weather',
      count: 0
    }
  ];

  // Fetch data from Supabase for export
  const fetchExportData = async () => {
    const exportData: Record<string, any[]> = {};

    if (selectedData.leads) {
      const { data: contacts } = await supabase
        .from('investor_contacts')
        .select('*');
      exportData.leads = contacts?.map(c => ({
        name: c.name,
        email: c.email,
        company: c.firm,
        description: c.message,
        type: 'lead',
        source: 'Lovable Portal',
        investment_interest: c.investment_interest
      })) || [];
    }

    if (selectedData.products) {
      const { data: products } = await supabase
        .from('sourced_products')
        .select('*');
      exportData.products = products?.map(p => ({
        name: p.product_name,
        description: p.description,
        list_price: p.suggested_retail_price,
        standard_price: p.cost_price,
        categ_id: p.category,
        default_code: p.id,
        type: 'product',
        sale_ok: true,
        purchase_ok: true
      })) || [];
    }

    if (selectedData.weather) {
      const { data: weather } = await supabase
        .from('weather_coordinate_logs')
        .select('*')
        .limit(100);
      exportData.weather = weather?.map(w => ({
        latitude: w.latitude,
        longitude: w.longitude,
        location_name: w.location_name,
        timestamp: w.created_at,
        source: w.page_source
      })) || [];
    }

    return exportData;
  };

  // Manual Export - Download as JSON
  const handleExportJson = async () => {
    setTransferStatus({ status: 'loading', message: 'Preparing JSON export...' });
    
    try {
      const data = await fetchExportData();
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `odoo-import-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setTransferStatus({ status: 'success', message: 'JSON file downloaded successfully!' });
      toast({
        title: "Export Complete",
        description: "Your data has been exported to JSON format for Odoo import."
      });
    } catch (error) {
      setTransferStatus({ status: 'error', message: 'Failed to export data' });
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  // Manual Export - Download as CSV
  const handleExportCsv = async () => {
    setTransferStatus({ status: 'loading', message: 'Preparing CSV export...' });
    
    try {
      const data = await fetchExportData();
      
      // Create separate CSV files for each data type
      Object.entries(data).forEach(([key, records]) => {
        if (records.length === 0) return;
        
        const headers = Object.keys(records[0]);
        const csvContent = [
          headers.join(','),
          ...records.map(record => 
            headers.map(h => {
              const value = record[h];
              if (value === null || value === undefined) return '';
              if (typeof value === 'string' && value.includes(',')) return `"${value}"`;
              return value;
            }).join(',')
          )
        ].join('\n');
        
        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `odoo-${key}-${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      });
      
      setTransferStatus({ status: 'success', message: 'CSV files downloaded successfully!' });
      toast({
        title: "Export Complete",
        description: "Your data has been exported to CSV format for Odoo import."
      });
    } catch (error) {
      setTransferStatus({ status: 'error', message: 'Failed to export data' });
      toast({
        title: "Export Failed",
        description: "There was an error exporting your data.",
        variant: "destructive"
      });
    }
  };

  // Webhook Transfer
  const handleWebhookTransfer = async () => {
    if (!webhookUrl) {
      toast({
        title: "Missing Webhook URL",
        description: "Please enter your Odoo webhook URL.",
        variant: "destructive"
      });
      return;
    }

    setTransferStatus({ status: 'loading', message: 'Sending data to webhook...' });
    
    try {
      const data = await fetchExportData();
      
      const response = await fetch(webhookUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        mode: "no-cors",
        body: JSON.stringify({
          timestamp: new Date().toISOString(),
          source: "LAVANDAR Tech Portal",
          data: data
        }),
      });
      
      setTransferStatus({ status: 'success', message: 'Data sent to webhook successfully!' });
      toast({
        title: "Webhook Triggered",
        description: "Data has been sent to your Odoo webhook. Check your Odoo instance for incoming data."
      });
    } catch (error) {
      setTransferStatus({ status: 'error', message: 'Failed to send to webhook' });
      toast({
        title: "Webhook Failed",
        description: "There was an error sending data to the webhook.",
        variant: "destructive"
      });
    }
  };

  // API Transfer
  const handleApiTransfer = async () => {
    if (!odooUrl || !odooDb || !odooUsername || !odooApiKey) {
      toast({
        title: "Missing API Credentials",
        description: "Please fill in all Odoo API configuration fields.",
        variant: "destructive"
      });
      return;
    }

    setTransferStatus({ status: 'loading', message: 'Connecting to Odoo API...' });
    
    try {
      const data = await fetchExportData();
      
      // Note: Direct Odoo XML-RPC calls require a backend proxy
      // This would typically call an edge function
      toast({
        title: "API Integration",
        description: "Direct API integration requires server-side processing. Use the webhook method or export files for now.",
        variant: "default"
      });
      
      setTransferStatus({ status: 'idle' });
    } catch (error) {
      setTransferStatus({ status: 'error', message: 'API connection failed' });
      toast({
        title: "API Error",
        description: "Failed to connect to Odoo API.",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-neutral-200" />
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <Database className="w-4 h-4 text-white" />
              </div>
              <span className="font-semibold text-neutral-900">Odoo Transfer Portal</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            ERP Integration
          </Badge>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-neutral-900 mb-4">
            Odoo Data Transfer Portal
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Export and sync your data with Odoo ERP. Choose from manual exports, 
            webhook triggers, or direct API integration.
          </p>
        </div>

        {/* Data Selection */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5" />
              Select Data to Transfer
            </CardTitle>
            <CardDescription>
              Choose which data modules you want to export to Odoo
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              {dataModules.map((module) => {
                const Icon = module.icon;
                const isSelected = selectedData[module.id as keyof typeof selectedData];
                
                return (
                  <div
                    key={module.id}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                      isSelected 
                        ? 'border-purple-500 bg-purple-50' 
                        : 'border-neutral-200 hover:border-neutral-300'
                    }`}
                    onClick={() => setSelectedData(prev => ({
                      ...prev,
                      [module.id]: !prev[module.id as keyof typeof prev]
                    }))}
                  >
                    <div className="flex items-start gap-3">
                      <Checkbox checked={isSelected} />
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Icon className="w-4 h-4 text-purple-600" />
                          <span className="font-medium text-neutral-900">{module.name}</span>
                        </div>
                        <p className="text-sm text-neutral-500">{module.description}</p>
                        <code className="text-xs text-purple-600 mt-2 block">
                          → {module.odooModule}
                        </code>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Transfer Methods */}
        <Tabs defaultValue="export" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Manual Export
            </TabsTrigger>
            <TabsTrigger value="webhook" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhook
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              API Integration
            </TabsTrigger>
          </TabsList>

          {/* Manual Export Tab */}
          <TabsContent value="export">
            <Card>
              <CardHeader>
                <CardTitle>Export Data Files</CardTitle>
                <CardDescription>
                  Download your data in Odoo-compatible formats for manual import
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <Button 
                    onClick={handleExportJson}
                    className="h-auto p-6 flex flex-col items-center gap-3 bg-blue-600 hover:bg-blue-700"
                    disabled={transferStatus.status === 'loading'}
                  >
                    <FileJson className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-medium">Export as JSON</div>
                      <div className="text-xs opacity-80">For Odoo Data Import module</div>
                    </div>
                  </Button>
                  
                  <Button 
                    onClick={handleExportCsv}
                    className="h-auto p-6 flex flex-col items-center gap-3 bg-green-600 hover:bg-green-700"
                    disabled={transferStatus.status === 'loading'}
                  >
                    <FileSpreadsheet className="w-8 h-8" />
                    <div className="text-center">
                      <div className="font-medium">Export as CSV</div>
                      <div className="text-xs opacity-80">For spreadsheet import</div>
                    </div>
                  </Button>
                </div>

                <div className="bg-neutral-100 rounded-lg p-4">
                  <h4 className="font-medium text-neutral-900 mb-2">Import Instructions</h4>
                  <ol className="text-sm text-neutral-600 space-y-1 list-decimal list-inside">
                    <li>Download the export file in your preferred format</li>
                    <li>In Odoo, go to Settings → Technical → Database Structure → Import Data</li>
                    <li>Select the appropriate model (CRM Lead, Product, etc.)</li>
                    <li>Upload the file and map fields as needed</li>
                    <li>Validate and import the data</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Webhook Tab */}
          <TabsContent value="webhook">
            <Card>
              <CardHeader>
                <CardTitle>Webhook Integration</CardTitle>
                <CardDescription>
                  Send data directly to an Odoo webhook endpoint or automation workflow
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="webhook">Webhook URL</Label>
                    <Input
                      id="webhook"
                      placeholder="https://your-odoo-instance.com/webhook/endpoint"
                      value={webhookUrl}
                      onChange={(e) => setWebhookUrl(e.target.value)}
                    />
                    <p className="text-xs text-neutral-500">
                      Create a webhook endpoint in Odoo using the Webhooks module or n8n/Zapier integration
                    </p>
                  </div>
                  
                  <Button 
                    onClick={handleWebhookTransfer}
                    className="w-full bg-purple-600 hover:bg-purple-700"
                    disabled={transferStatus.status === 'loading' || !webhookUrl}
                  >
                    {transferStatus.status === 'loading' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    Send Data to Webhook
                  </Button>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <h4 className="font-medium text-amber-800 mb-2">Webhook Setup Tips</h4>
                  <ul className="text-sm text-amber-700 space-y-1 list-disc list-inside">
                    <li>Use Odoo's Automation module to create incoming webhooks</li>
                    <li>Alternatively, use n8n or Zapier to receive and route data</li>
                    <li>Ensure your webhook endpoint accepts POST requests with JSON</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* API Tab */}
          <TabsContent value="api">
            <Card>
              <CardHeader>
                <CardTitle>Direct API Integration</CardTitle>
                <CardDescription>
                  Connect directly to Odoo's XML-RPC API for real-time synchronization
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="odoo-url">Odoo URL</Label>
                    <Input
                      id="odoo-url"
                      placeholder="https://your-company.odoo.com"
                      value={odooUrl}
                      onChange={(e) => setOdooUrl(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odoo-db">Database Name</Label>
                    <Input
                      id="odoo-db"
                      placeholder="your-database"
                      value={odooDb}
                      onChange={(e) => setOdooDb(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odoo-user">Username / Email</Label>
                    <Input
                      id="odoo-user"
                      placeholder="admin@yourcompany.com"
                      value={odooUsername}
                      onChange={(e) => setOdooUsername(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="odoo-key">API Key</Label>
                    <Input
                      id="odoo-key"
                      type="password"
                      placeholder="Your Odoo API key"
                      value={odooApiKey}
                      onChange={(e) => setOdooApiKey(e.target.value)}
                    />
                  </div>
                </div>

                <Button 
                  onClick={handleApiTransfer}
                  className="w-full"
                  disabled={transferStatus.status === 'loading'}
                >
                  {transferStatus.status === 'loading' ? (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Sync with Odoo
                </Button>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Getting Your API Key</h4>
                  <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                    <li>Log into your Odoo instance</li>
                    <li>Go to Settings → Users & Companies → Users</li>
                    <li>Select your user and go to the "Account Security" tab</li>
                    <li>Under "API Keys", create a new key</li>
                    <li>Copy and paste the key above</li>
                  </ol>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Status Display */}
        {transferStatus.status !== 'idle' && (
          <div className={`mt-6 p-4 rounded-lg flex items-center gap-3 ${
            transferStatus.status === 'loading' ? 'bg-blue-50 text-blue-700' :
            transferStatus.status === 'success' ? 'bg-green-50 text-green-700' :
            'bg-red-50 text-red-700'
          }`}>
            {transferStatus.status === 'loading' && <Loader2 className="w-5 h-5 animate-spin" />}
            {transferStatus.status === 'success' && <CheckCircle2 className="w-5 h-5" />}
            {transferStatus.status === 'error' && <AlertCircle className="w-5 h-5" />}
            <span>{transferStatus.message}</span>
          </div>
        )}
      </main>
    </div>
  );
};

export default OdooTransferPortal;
