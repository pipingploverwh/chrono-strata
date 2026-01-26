import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Package, 
  Map, 
  Search,
  Filter,
  Download,
  RefreshCw,
  Plus,
  Scan
} from "lucide-react";
import { ComplianceStats } from "./ComplianceStats";
import { ShipmentCard } from "./ShipmentCard";
import { ShipmentDetailsSheet } from "./ShipmentDetailsSheet";
import { JurisdictionGuide } from "./JurisdictionGuide";
import { CreateShipmentWizard } from "./CreateShipmentWizard";
import { DocumentScanner } from "./DocumentScanner";
import { useComplianceShipments } from "@/hooks/useComplianceData";
import { toast } from "sonner";

export function ComplianceDashboard() {
  const [selectedShipmentId, setSelectedShipmentId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [destinationFilter, setDestinationFilter] = useState<string>("all");
  const [createWizardOpen, setCreateWizardOpen] = useState(false);
  const [scannerOpen, setScannerOpen] = useState(false);

  const handleExtractedText = (text: string) => {
    toast.success('Document text extracted', {
      description: 'Text copied to clipboard for use in shipment details',
    });
    navigator.clipboard.writeText(text);
  };

  const { data: shipments, isLoading, refetch } = useComplianceShipments(
    statusFilter !== "all" || destinationFilter !== "all"
      ? {
          status: statusFilter !== "all" ? statusFilter : undefined,
          destination_country: destinationFilter !== "all" ? destinationFilter : undefined,
        }
      : undefined
  );

  const filteredShipments = shipments?.filter(s => 
    !searchQuery || 
    s.shipment_reference.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.destination_entity?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const exportToCSV = () => {
    if (!filteredShipments?.length) return;
    
    const headers = ["Reference", "Origin", "Destination", "Entity", "Product", "Use Case", "Phase", "Status", "Target Date", "Value"];
    const rows = filteredShipments.map(s => [
      s.shipment_reference,
      s.origin_state,
      s.destination_country,
      s.destination_entity || "",
      s.product_type,
      s.use_case,
      s.current_phase,
      s.status,
      s.target_ship_date || "",
      s.estimated_value?.toString() || ""
    ]);

    const csv = [headers, ...rows].map(r => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `compliance-shipments-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      {/* Header */}
      <div className="border-b border-neutral-800 bg-neutral-900/50">
        <div className="container mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                Regulatory Compliance Operations
              </h1>
              <p className="text-sm text-neutral-500 mt-1">
                Cross-Border Medical Cannabis Transport Intelligence
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => refetch()}
                className="border-neutral-700 hover:bg-neutral-800"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={exportToCSV}
                className="border-neutral-700 hover:bg-neutral-800"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setScannerOpen(true)}
                className="border-neutral-700 hover:bg-neutral-800"
              >
                <Scan className="w-4 h-4 mr-2" />
                Scan Document
              </Button>
              <Button 
                size="sm"
                onClick={() => setCreateWizardOpen(true)}
                className="bg-cyan-600 hover:bg-cyan-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                New Shipment
              </Button>
            </div>
          </div>

          <ComplianceStats />
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-6">
        <Tabs defaultValue="shipments" className="w-full">
          <TabsList className="bg-neutral-900/50 border border-neutral-800 mb-6">
            <TabsTrigger value="shipments" className="data-[state=active]:bg-neutral-800">
              <Package className="w-4 h-4 mr-2" />
              Active Shipments
            </TabsTrigger>
            <TabsTrigger value="playbook" className="data-[state=active]:bg-neutral-800">
              <Map className="w-4 h-4 mr-2" />
              Jurisdiction Playbook
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shipments" className="m-0">
            {/* Filters */}
            <div className="flex items-center gap-4 mb-6">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
                <Input
                  placeholder="Search shipments..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-neutral-900 border-neutral-800 focus:border-cyan-500"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40 bg-neutral-900 border-neutral-800">
                  <Filter className="w-4 h-4 mr-2 text-neutral-500" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="planning">Planning</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="blocked">Blocked</SelectItem>
                </SelectContent>
              </Select>
              <Select value={destinationFilter} onValueChange={setDestinationFilter}>
                <SelectTrigger className="w-40 bg-neutral-900 border-neutral-800">
                  <SelectValue placeholder="Destination" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Destinations</SelectItem>
                  <SelectItem value="Israel">Israel</SelectItem>
                  <SelectItem value="UAE">UAE</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Shipments Grid */}
            {isLoading ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full" />
              </div>
            ) : filteredShipments?.length === 0 ? (
              <div className="text-center py-12 text-neutral-500">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No shipments found</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShipments?.map((shipment) => (
                  <ShipmentCard
                    key={shipment.id}
                    shipment={shipment}
                    onClick={() => setSelectedShipmentId(shipment.id)}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="playbook" className="m-0">
            <JurisdictionGuide />
          </TabsContent>
        </Tabs>
      </div>

      {/* Details Sheet */}
      <ShipmentDetailsSheet
        shipmentId={selectedShipmentId}
        onClose={() => setSelectedShipmentId(null)}
      />

      {/* Create Shipment Wizard */}
      <CreateShipmentWizard
        open={createWizardOpen}
        onOpenChange={setCreateWizardOpen}
      />

      {/* Document Scanner */}
      <DocumentScanner
        open={scannerOpen}
        onOpenChange={setScannerOpen}
        onExtractedText={handleExtractedText}
      />
    </div>
  );
}
