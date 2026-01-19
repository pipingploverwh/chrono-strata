import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  ArrowLeft, 
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
  RefreshCw,
  Anchor,
  Ship,
  Wind,
  Waves,
  FileText,
  Briefcase,
  Calendar,
  History,
  Clock,
  Timer,
  Play,
  Pause
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
import { OdooSyncDashboard, SyncLog } from "@/components/odoo/OdooSyncDashboard";

interface TransferStatus {
  status: 'idle' | 'loading' | 'success' | 'error';
  message?: string;
}

interface DataModule {
  id: string;
  name: string;
  icon: any;
  description: string;
  odooModule: string;
  category: 'core' | 'marine' | 'hr';
  count: number;
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
  
  // Data Selection - expanded with new modules
  const [selectedData, setSelectedData] = useState({
    leads: true,
    products: true,
    weather: false,
    marine: false,
    visaApplications: false,
    visaDocuments: false,
    visaMilestones: false
  });
  
  // Transfer Status
  const [transferStatus, setTransferStatus] = useState<TransferStatus>({ status: 'idle' });
  
  // Sync History
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  
  // API Connection Status
  const [apiConnected, setApiConnected] = useState(false);
  const [apiTestLoading, setApiTestLoading] = useState(false);

  // Data counts
  const [dataCounts, setDataCounts] = useState<Record<string, number>>({});

  // Fetch data counts on mount
  useEffect(() => {
    fetchDataCounts();
  }, []);

  const fetchDataCounts = async () => {
    const counts: Record<string, number> = {};
    
    const { count: leadsCount } = await supabase
      .from('investor_contacts')
      .select('*', { count: 'exact', head: true });
    counts.leads = leadsCount || 0;

    const { count: productsCount } = await supabase
      .from('sourced_products')
      .select('*', { count: 'exact', head: true });
    counts.products = productsCount || 0;

    const { count: weatherCount } = await supabase
      .from('weather_coordinate_logs')
      .select('*', { count: 'exact', head: true });
    counts.weather = weatherCount || 0;

    const { count: visaAppsCount } = await supabase
      .from('visa_applications')
      .select('*', { count: 'exact', head: true });
    counts.visaApplications = visaAppsCount || 0;

    const { count: visaDocsCount } = await supabase
      .from('visa_documents')
      .select('*', { count: 'exact', head: true });
    counts.visaDocuments = visaDocsCount || 0;

    const { count: visaMilestonesCount } = await supabase
      .from('visa_milestones')
      .select('*', { count: 'exact', head: true });
    counts.visaMilestones = visaMilestonesCount || 0;

    setDataCounts(counts);
  };

  const dataModules: DataModule[] = [
    // Core Business
    {
      id: 'leads',
      name: 'Leads & Contacts',
      icon: Users,
      description: 'Investor contacts and lead information',
      odooModule: 'crm.lead',
      category: 'core',
      count: dataCounts.leads || 0
    },
    {
      id: 'products',
      name: 'Products & Inventory',
      icon: Package,
      description: 'Sourced products and inventory data',
      odooModule: 'product.product',
      category: 'core',
      count: dataCounts.products || 0
    },
    // Weather & Marine
    {
      id: 'weather',
      name: 'Weather Intelligence',
      icon: Cloud,
      description: 'Weather coordinate logs and forecasts',
      odooModule: 'custom.weather',
      category: 'marine',
      count: dataCounts.weather || 0
    },
    {
      id: 'marine',
      name: 'Marine Forecasts',
      icon: Anchor,
      description: 'NOAA coastal conditions and maritime data',
      odooModule: 'custom.marine_forecast',
      category: 'marine',
      count: 0 // Dynamic from API
    },
    // HR & Visa
    {
      id: 'visaApplications',
      name: 'Visa Applications',
      icon: Briefcase,
      description: 'Startup visa applications and status',
      odooModule: 'hr.employee.visa',
      category: 'hr',
      count: dataCounts.visaApplications || 0
    },
    {
      id: 'visaDocuments',
      name: 'Visa Documents',
      icon: FileText,
      description: 'Document submissions and requirements',
      odooModule: 'hr.document',
      category: 'hr',
      count: dataCounts.visaDocuments || 0
    },
    {
      id: 'visaMilestones',
      name: 'Visa Milestones',
      icon: Calendar,
      description: 'Timeline milestones and deadlines',
      odooModule: 'project.task',
      category: 'hr',
      count: dataCounts.visaMilestones || 0
    }
  ];

  const categoryLabels: Record<string, { label: string; color: string }> = {
    core: { label: 'Core Business', color: 'bg-purple-500' },
    marine: { label: 'Marine & Weather', color: 'bg-cyan-500' },
    hr: { label: 'HR & Visa', color: 'bg-amber-500' }
  };

  // Add sync log helper
  const addSyncLog = (log: Omit<SyncLog, 'id' | 'timestamp'>) => {
    setSyncLogs(prev => [{
      ...log,
      id: crypto.randomUUID(),
      timestamp: new Date()
    }, ...prev].slice(0, 50)); // Keep last 50 logs
  };

  // Fetch data from Supabase for export
  const fetchExportData = async () => {
    const exportData: Record<string, any[]> = {};
    const startTime = Date.now();

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
        source: 'LAVANDAR Tech Portal',
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

    // Marine forecast data (fetch from NOAA edge function)
    if (selectedData.marine) {
      try {
        const { data: marineData } = await supabase.functions.invoke('noaa-marine', {
          body: { zone: 'anz233' } // Vineyard Sound default
        });
        
        exportData.marine = [{
          zone_id: 'anz233',
          zone_name: 'Vineyard Sound',
          forecast_date: new Date().toISOString(),
          wind_conditions: marineData?.wind || '',
          sea_conditions: marineData?.seas || '',
          warnings: marineData?.warnings || [],
          raw_forecast: marineData?.rawForecast || ''
        }];
      } catch (e) {
        exportData.marine = [];
      }
    }

    // Visa Application data
    if (selectedData.visaApplications) {
      const { data: visaApps } = await supabase
        .from('visa_applications')
        .select('*');
      exportData.visaApplications = visaApps?.map(v => ({
        employee_name: v.user_id,
        visa_type: 'Startup Visa',
        application_date: v.application_date,
        current_phase: v.current_phase,
        status: v.status,
        notes: v.notes
      })) || [];
    }

    if (selectedData.visaDocuments) {
      const { data: visaDocs } = await supabase
        .from('visa_documents')
        .select('*');
      exportData.visaDocuments = visaDocs?.map(d => ({
        name: d.document_name,
        document_type: d.document_type,
        status: d.status,
        due_date: d.due_date,
        submitted_date: d.submitted_date,
        file_url: d.file_url
      })) || [];
    }

    if (selectedData.visaMilestones) {
      const { data: milestones } = await supabase
        .from('visa_milestones')
        .select('*');
      exportData.visaMilestones = milestones?.map(m => ({
        name: m.title,
        description: m.description,
        milestone_type: m.milestone_type,
        target_date: m.target_date,
        completed_date: m.completed_date,
        status: m.status
      })) || [];
    }

    return { data: exportData, duration: Date.now() - startTime };
  };

  // Manual Export - Download as JSON
  const handleExportJson = async () => {
    setTransferStatus({ status: 'loading', message: 'Preparing JSON export...' });
    
    try {
      const { data, duration } = await fetchExportData();
      const totalRecords = Object.values(data).flat().length;
      const selectedModules = Object.entries(selectedData)
        .filter(([_, selected]) => selected)
        .map(([key]) => key);

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
      addSyncLog({
        type: 'export',
        modules: selectedModules,
        recordCount: totalRecords,
        status: 'success',
        message: 'JSON export completed',
        duration
      });
      
      toast({
        title: "Export Complete",
        description: `Exported ${totalRecords} records to JSON format.`
      });
    } catch (error) {
      setTransferStatus({ status: 'error', message: 'Failed to export data' });
      addSyncLog({
        type: 'export',
        modules: [],
        recordCount: 0,
        status: 'error',
        message: `Export failed: ${error}`
      });
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
      const { data, duration } = await fetchExportData();
      const selectedModules = Object.entries(selectedData)
        .filter(([_, selected]) => selected)
        .map(([key]) => key);
      let totalRecords = 0;
      
      Object.entries(data).forEach(([key, records]) => {
        if (records.length === 0) return;
        totalRecords += records.length;
        
        const headers = Object.keys(records[0]);
        const csvContent = [
          headers.join(','),
          ...records.map(record => 
            headers.map(h => {
              const value = record[h];
              if (value === null || value === undefined) return '';
              if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
              }
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
      addSyncLog({
        type: 'export',
        modules: selectedModules,
        recordCount: totalRecords,
        status: 'success',
        message: 'CSV export completed',
        duration
      });
      
      toast({
        title: "Export Complete",
        description: `Exported ${totalRecords} records to CSV format.`
      });
    } catch (error) {
      setTransferStatus({ status: 'error', message: 'Failed to export data' });
      addSyncLog({
        type: 'export',
        modules: [],
        recordCount: 0,
        status: 'error',
        message: `CSV export failed: ${error}`
      });
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
      const { data, duration } = await fetchExportData();
      const selectedModules = Object.entries(selectedData)
        .filter(([_, selected]) => selected)
        .map(([key]) => key);
      const totalRecords = Object.values(data).flat().length;
      
      await fetch(webhookUrl, {
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
      addSyncLog({
        type: 'webhook',
        modules: selectedModules,
        recordCount: totalRecords,
        status: 'success',
        message: 'Webhook triggered successfully',
        duration
      });
      
      toast({
        title: "Webhook Triggered",
        description: `Sent ${totalRecords} records to webhook.`
      });
    } catch (error) {
      setTransferStatus({ status: 'error', message: 'Failed to send to webhook' });
      addSyncLog({
        type: 'webhook',
        modules: [],
        recordCount: 0,
        status: 'error',
        message: `Webhook failed: ${error}`
      });
      toast({
        title: "Webhook Failed",
        description: "There was an error sending data to the webhook.",
        variant: "destructive"
      });
    }
  };

  // Test API Connection
  const handleTestConnection = async () => {
    if (!odooUrl || !odooDb || !odooUsername || !odooApiKey) {
      toast({
        title: "Missing Credentials",
        description: "Please fill in all API configuration fields.",
        variant: "destructive"
      });
      return;
    }

    setApiTestLoading(true);
    
    try {
      const { data, error } = await supabase.functions.invoke('odoo-sync', {
        body: {
          config: {
            url: odooUrl,
            db: odooDb,
            username: odooUsername,
            apiKey: odooApiKey
          },
          model: 'res.partner',
          method: 'search_count',
          data: []
        }
      });

      if (error) throw error;
      
      if (data?.success) {
        setApiConnected(true);
        toast({
          title: "Connection Successful",
          description: `Connected to Odoo as UID ${data.uid}`
        });
      } else {
        throw new Error(data?.error || 'Connection failed');
      }
    } catch (error: any) {
      setApiConnected(false);
      toast({
        title: "Connection Failed",
        description: error.message || "Could not connect to Odoo API.",
        variant: "destructive"
      });
    } finally {
      setApiTestLoading(false);
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

    setTransferStatus({ status: 'loading', message: 'Syncing with Odoo API...' });
    
    try {
      const { data, duration } = await fetchExportData();
      const selectedModules = Object.entries(selectedData)
        .filter(([_, selected]) => selected)
        .map(([key]) => key);
      let totalRecords = 0;
      const results: any[] = [];

      // Sync each data type to appropriate Odoo model
      for (const [key, records] of Object.entries(data)) {
        if (records.length === 0) continue;
        
        const module = dataModules.find(m => m.id === key);
        if (!module) continue;

        const { data: syncResult, error } = await supabase.functions.invoke('odoo-sync', {
          body: {
            config: {
              url: odooUrl,
              db: odooDb,
              username: odooUsername,
              apiKey: odooApiKey
            },
            model: module.odooModule,
            method: 'create',
            data: records
          }
        });

        if (error) throw error;
        
        totalRecords += records.length;
        results.push({ module: key, result: syncResult });
      }

      setTransferStatus({ status: 'success', message: 'Data synced with Odoo!' });
      addSyncLog({
        type: 'api',
        modules: selectedModules,
        recordCount: totalRecords,
        status: 'success',
        message: `API sync completed: ${totalRecords} records created`,
        duration
      });
      
      toast({
        title: "Sync Complete",
        description: `Created ${totalRecords} records in Odoo.`
      });
    } catch (error: any) {
      setTransferStatus({ status: 'error', message: 'API sync failed' });
      addSyncLog({
        type: 'api',
        modules: [],
        recordCount: 0,
        status: 'error',
        message: `API sync failed: ${error.message}`
      });
      toast({
        title: "Sync Failed",
        description: error.message || "Failed to sync with Odoo API.",
        variant: "destructive"
      });
    }
  };

  const groupedModules = dataModules.reduce((acc, module) => {
    if (!acc[module.category]) acc[module.category] = [];
    acc[module.category].push(module);
    return acc;
  }, {} as Record<string, DataModule[]>);

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
          <div className="flex items-center gap-2">
            {apiConnected && (
              <Badge className="bg-green-100 text-green-700">
                <CheckCircle2 className="w-3 h-3 mr-1" />
                API Connected
              </Badge>
            )}
            <Badge variant="secondary" className="bg-purple-100 text-purple-700">
              ERP Integration
            </Badge>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-light text-neutral-900 mb-4">
            Odoo Data Transfer Portal
          </h1>
          <p className="text-neutral-600 max-w-2xl mx-auto">
            Export and sync your data with Odoo ERP. Includes marine forecasts, 
            visa applications, and real-time API synchronization.
          </p>
        </div>

        {/* Data Selection - Grouped by Category */}
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
          <CardContent className="space-y-6">
            {Object.entries(groupedModules).map(([category, modules]) => (
              <div key={category}>
                <div className="flex items-center gap-2 mb-3">
                  <div className={`w-2 h-2 rounded-full ${categoryLabels[category].color}`} />
                  <span className="text-sm font-medium text-neutral-700">
                    {categoryLabels[category].label}
                  </span>
                </div>
                <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {modules.map((module) => {
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
                          <Checkbox checked={isSelected} className="mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <Icon className="w-4 h-4 text-purple-600 flex-shrink-0" />
                              <span className="font-medium text-neutral-900 text-sm truncate">
                                {module.name}
                              </span>
                            </div>
                            <p className="text-xs text-neutral-500 line-clamp-2">{module.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <code className="text-xs text-purple-600 truncate">
                                {module.odooModule}
                              </code>
                              {module.count > 0 && (
                                <Badge variant="secondary" className="text-xs">
                                  {module.count}
                                </Badge>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Transfer Methods */}
        <Tabs defaultValue="export" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="export" className="flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </TabsTrigger>
            <TabsTrigger value="webhook" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhook
            </TabsTrigger>
            <TabsTrigger value="api" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              API
            </TabsTrigger>
            <TabsTrigger value="schedule" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Schedule
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              History
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
                <CardTitle className="flex items-center gap-2">
                  Direct API Integration
                  {apiConnected && (
                    <Badge className="bg-green-100 text-green-700 ml-2">
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </CardTitle>
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

                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={handleTestConnection}
                    disabled={apiTestLoading}
                    className="flex-1"
                  >
                    {apiTestLoading ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Database className="w-4 h-4 mr-2" />
                    )}
                    Test Connection
                  </Button>
                  
                  <Button 
                    onClick={handleApiTransfer}
                    className="flex-1"
                    disabled={transferStatus.status === 'loading' || !apiConnected}
                  >
                    {transferStatus.status === 'loading' ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <RefreshCw className="w-4 h-4 mr-2" />
                    )}
                    Sync with Odoo
                  </Button>
                </div>

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

          {/* Schedule Tab */}
          <TabsContent value="schedule">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Timer className="w-5 h-5" />
                  Scheduled Automatic Sync
                </CardTitle>
                <CardDescription>
                  Configure automatic data synchronization with Odoo on a schedule
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="bg-gradient-to-r from-purple-50 to-cyan-50 border border-purple-200 rounded-xl p-6">
                  <h4 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-purple-600" />
                    Cron Schedule Configuration
                  </h4>
                  <p className="text-sm text-neutral-600 mb-4">
                    Automatic syncs run via a backend cron job. Configure the schedule and credentials below.
                  </p>
                  
                  <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                          <Timer className="w-5 h-5 text-amber-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-neutral-900">Hourly Sync</h5>
                          <p className="text-xs text-neutral-500">Runs every hour at :00</p>
                        </div>
                      </div>
                      <code className="text-xs bg-neutral-100 px-2 py-1 rounded text-neutral-600">
                        0 * * * *
                      </code>
                    </div>
                    
                    <div className="bg-white rounded-lg p-4 border">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-10 h-10 bg-cyan-100 rounded-lg flex items-center justify-center">
                          <Calendar className="w-5 h-5 text-cyan-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-neutral-900">Daily Sync</h5>
                          <p className="text-xs text-neutral-500">Runs daily at midnight UTC</p>
                        </div>
                      </div>
                      <code className="text-xs bg-neutral-100 px-2 py-1 rounded text-neutral-600">
                        0 0 * * *
                      </code>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-neutral-900">Required Environment Secrets</h4>
                  <p className="text-sm text-neutral-600">
                    To enable scheduled syncs, configure these secrets in your backend:
                  </p>
                  
                  <div className="grid gap-3">
                    {[
                      { name: 'ODOO_URL', desc: 'Your Odoo instance URL', example: 'https://company.odoo.com' },
                      { name: 'ODOO_DB', desc: 'Odoo database name', example: 'production' },
                      { name: 'ODOO_USERNAME', desc: 'Odoo username/email', example: 'admin@company.com' },
                      { name: 'ODOO_API_KEY', desc: 'Odoo API key', example: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
                      { name: 'ODOO_SYNC_MODULES', desc: 'Comma-separated modules to sync', example: 'leads,products,weather' }
                    ].map(secret => (
                      <div key={secret.name} className="flex items-start gap-3 p-3 bg-neutral-50 rounded-lg border">
                        <code className="text-sm font-mono bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
                          {secret.name}
                        </code>
                        <div className="flex-1">
                          <p className="text-sm text-neutral-700">{secret.desc}</p>
                          <p className="text-xs text-neutral-500 mt-0.5">Example: {secret.example}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Setting Up Scheduled Syncs</h4>
                  <ol className="text-sm text-blue-700 space-y-2 list-decimal list-inside">
                    <li>Configure the required secrets in your Lovable Cloud backend settings</li>
                    <li>The cron job will automatically call the <code className="bg-blue-100 px-1 rounded">odoo-scheduled-sync</code> function</li>
                    <li>Sync results are logged and can be viewed in the History tab</li>
                    <li>Failed syncs will be retried on the next scheduled run</li>
                  </ol>
                </div>

                <div className="flex gap-3">
                  <Button 
                    variant="outline"
                    onClick={async () => {
                      setTransferStatus({ status: 'loading', message: 'Testing scheduled sync...' });
                      try {
                        const { data, error } = await supabase.functions.invoke('odoo-scheduled-sync', {
                          body: {
                            config: {
                              url: odooUrl,
                              db: odooDb,
                              username: odooUsername,
                              apiKey: odooApiKey
                            },
                            modules: Object.entries(selectedData)
                              .filter(([_, selected]) => selected)
                              .map(([key]) => key),
                            scheduleType: 'manual'
                          }
                        });
                        
                        if (error) throw error;
                        
                        if (data?.success) {
                          setTransferStatus({ status: 'success', message: `Manual sync completed: ${data.totalRecords} records synced` });
                          addSyncLog({
                            type: 'scheduled',
                            modules: Object.entries(selectedData).filter(([_, s]) => s).map(([k]) => k),
                            recordCount: data.totalRecords,
                            status: 'success',
                            message: 'Manual scheduled sync test',
                            duration: data.duration
                          });
                          toast({
                            title: "Sync Complete",
                            description: `Synced ${data.totalRecords} records to Odoo.`
                          });
                        } else {
                          throw new Error(data?.error || 'Sync failed');
                        }
                      } catch (error: any) {
                        setTransferStatus({ status: 'error', message: error.message });
                        toast({
                          title: "Sync Failed",
                          description: error.message,
                          variant: "destructive"
                        });
                      }
                    }}
                    disabled={!odooUrl || !odooDb || !odooUsername || !odooApiKey || transferStatus.status === 'loading'}
                    className="flex-1"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run Manual Sync Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* History Tab */}
          <TabsContent value="history">
            <OdooSyncDashboard 
              logs={syncLogs}
              onClearLogs={() => setSyncLogs([])}
              onRefresh={fetchDataCounts}
            />
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
