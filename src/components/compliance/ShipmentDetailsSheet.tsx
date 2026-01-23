import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  FileCheck, 
  Users, 
  FileText, 
  AlertTriangle, 
  Clock,
  MapPin,
  ExternalLink,
  CheckCircle2,
  Circle,
  XCircle
} from "lucide-react";
import { 
  useComplianceShipmentDetails,
  PHASE_LABELS,
  PHASE_ORDER,
  PERMIT_STATUS_COLORS,
  JURISDICTION_LABELS,
  type ShipmentPhase,
  type PermitStatus
} from "@/hooks/useComplianceData";
import { format } from "date-fns";

interface ShipmentDetailsSheetProps {
  shipmentId: string | null;
  onClose: () => void;
}

export function ShipmentDetailsSheet({ shipmentId, onClose }: ShipmentDetailsSheetProps) {
  const { data, isLoading } = useComplianceShipmentDetails(shipmentId);

  if (!shipmentId) return null;

  const currentPhaseIndex = data?.shipment 
    ? PHASE_ORDER.indexOf(data.shipment.current_phase) 
    : 0;

  return (
    <Sheet open={!!shipmentId} onOpenChange={() => onClose()}>
      <SheetContent className="w-full sm:max-w-2xl bg-neutral-950 border-neutral-800 p-0">
        <SheetHeader className="p-6 pb-4 border-b border-neutral-800">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-mono text-xs text-neutral-500 mb-1">
                {data?.shipment?.shipment_reference}
              </p>
              <SheetTitle className="text-white text-lg">
                {data?.shipment?.description || "Shipment Details"}
              </SheetTitle>
              <div className="flex items-center gap-2 mt-2 text-sm text-neutral-400">
                <MapPin className="w-3.5 h-3.5" />
                <span>{data?.shipment?.origin_state}, USA → {data?.shipment?.destination_country}</span>
              </div>
            </div>
            {data?.shipment?.estimated_value && (
              <div className="text-right">
                <p className="text-xs text-neutral-500">Est. Value</p>
                <p className="text-lg font-bold text-amber-400">
                  ${(data.shipment.estimated_value / 1000).toFixed(0)}K
                </p>
              </div>
            )}
          </div>
        </SheetHeader>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-6 h-6 border-2 border-cyan-500 border-t-transparent rounded-full" />
          </div>
        ) : (
          <Tabs defaultValue="overview" className="flex-1">
            <TabsList className="w-full justify-start rounded-none border-b border-neutral-800 bg-transparent h-12 px-6">
              <TabsTrigger value="overview" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none">
                Overview
              </TabsTrigger>
              <TabsTrigger value="permits" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none">
                <FileCheck className="w-3.5 h-3.5 mr-1.5" />
                Permits ({data?.permits?.length || 0})
              </TabsTrigger>
              <TabsTrigger value="stakeholders" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none">
                <Users className="w-3.5 h-3.5 mr-1.5" />
                Stakeholders
              </TabsTrigger>
              <TabsTrigger value="documents" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none">
                <FileText className="w-3.5 h-3.5 mr-1.5" />
                Documents
              </TabsTrigger>
              <TabsTrigger value="risks" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5" />
                Risks
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[calc(100vh-220px)]">
              <TabsContent value="overview" className="p-6 m-0">
                {/* Phase Timeline */}
                <div className="mb-6">
                  <h4 className="text-sm font-medium text-white mb-4">Phase Progress</h4>
                  <div className="space-y-3">
                    {PHASE_ORDER.map((phase, index) => {
                      const isComplete = index < currentPhaseIndex;
                      const isCurrent = index === currentPhaseIndex;
                      const isPending = index > currentPhaseIndex;

                      return (
                        <div key={phase} className="flex items-center gap-3">
                          <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                            isComplete ? 'bg-emerald-500/20' : 
                            isCurrent ? 'bg-cyan-500/20 ring-2 ring-cyan-500/50' : 
                            'bg-neutral-800'
                          }`}>
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className={`w-3 h-3 ${isCurrent ? 'text-cyan-400' : 'text-neutral-600'}`} />
                            )}
                          </div>
                          <div className="flex-1">
                            <p className={`text-sm ${isCurrent ? 'text-cyan-400 font-medium' : isComplete ? 'text-neutral-400' : 'text-neutral-600'}`}>
                              {PHASE_LABELS[phase]}
                            </p>
                          </div>
                          {isCurrent && (
                            <Badge className="bg-cyan-500/20 text-cyan-400 text-xs">Current</Badge>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Activity Log */}
                <div>
                  <h4 className="text-sm font-medium text-white mb-4">Recent Activity</h4>
                  <div className="space-y-3">
                    {data?.phaseLogs?.slice(0, 5).map((log) => (
                      <div key={log.id} className="flex gap-3 text-sm">
                        <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                        <div>
                          <p className="text-neutral-300">{log.action}</p>
                          {log.notes && (
                            <p className="text-neutral-500 text-xs mt-0.5">{log.notes}</p>
                          )}
                          <p className="text-neutral-600 text-xs mt-1">
                            {log.performed_by && `${log.performed_by} • `}
                            {format(new Date(log.created_at), "MMM d, h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="permits" className="p-6 m-0">
                <div className="space-y-3">
                  {data?.permits?.map((permit) => (
                    <div 
                      key={permit.id}
                      className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h5 className="text-sm font-medium text-white">{permit.permit_name}</h5>
                            {permit.is_required && (
                              <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30">Required</Badge>
                            )}
                          </div>
                          <p className="text-xs text-neutral-500">{permit.issuing_authority}</p>
                        </div>
                        <Badge className={PERMIT_STATUS_COLORS[permit.status as PermitStatus]}>
                          {permit.status.replace('_', ' ')}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-neutral-400">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          {JURISDICTION_LABELS[permit.jurisdiction]}
                        </span>
                        {permit.reference_number && (
                          <span className="font-mono text-cyan-400">{permit.reference_number}</span>
                        )}
                      </div>
                      {permit.notes && (
                        <p className="text-xs text-neutral-500 mt-2 italic">{permit.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stakeholders" className="p-6 m-0">
                <div className="space-y-3">
                  {data?.stakeholders?.map((stakeholder) => (
                    <div 
                      key={stakeholder.id}
                      className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h5 className="text-sm font-medium text-white">{stakeholder.organization_name}</h5>
                          <p className="text-xs text-neutral-500 capitalize">{stakeholder.stakeholder_type.replace('_', ' ')}</p>
                        </div>
                        <Badge variant="outline" className={
                          stakeholder.status === 'confirmed' ? 'text-emerald-400 border-emerald-500/30' :
                          stakeholder.status === 'engaged' ? 'text-cyan-400 border-cyan-500/30' :
                          'text-neutral-400 border-neutral-500/30'
                        }>
                          {stakeholder.status}
                        </Badge>
                      </div>
                      {stakeholder.contact_name && (
                        <p className="text-sm text-neutral-300">{stakeholder.contact_name}</p>
                      )}
                      {stakeholder.role_description && (
                        <p className="text-xs text-neutral-500 mt-1">{stakeholder.role_description}</p>
                      )}
                      {stakeholder.contact_email && (
                        <a 
                          href={`mailto:${stakeholder.contact_email}`}
                          className="text-xs text-cyan-400 hover:underline mt-2 inline-flex items-center gap-1"
                        >
                          {stakeholder.contact_email}
                          <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="documents" className="p-6 m-0">
                <div className="space-y-2">
                  {data?.documents?.map((doc) => {
                    const statusIcon = doc.status === 'complete' || doc.status === 'verified' 
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      : doc.status === 'draft'
                      ? <Clock className="w-4 h-4 text-amber-400" />
                      : <XCircle className="w-4 h-4 text-red-400" />;

                    return (
                      <div 
                        key={doc.id}
                        className="flex items-center gap-3 p-3 bg-neutral-900/30 rounded-lg"
                      >
                        {statusIcon}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-white truncate">{doc.document_name}</p>
                          <div className="flex items-center gap-2 text-xs text-neutral-500">
                            <span className="capitalize">{doc.category}</span>
                            {doc.due_date && (
                              <>
                                <span>•</span>
                                <span>Due: {format(new Date(doc.due_date), "MMM d")}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {doc.status}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </TabsContent>

              <TabsContent value="risks" className="p-6 m-0">
                <div className="space-y-3">
                  {data?.risks?.map((risk) => {
                    const impactColor = risk.impact === 'high' ? 'text-red-400' : risk.impact === 'medium' ? 'text-amber-400' : 'text-neutral-400';
                    
                    return (
                      <div 
                        key={risk.id}
                        className="bg-neutral-900/50 border border-neutral-800 rounded-lg p-4"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <Badge variant="outline" className="text-xs capitalize mb-2">
                              {risk.risk_category}
                            </Badge>
                            <p className="text-sm text-white">{risk.risk_description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs mt-3">
                          <span className="text-neutral-500">
                            Likelihood: <span className="text-neutral-300 capitalize">{risk.likelihood}</span>
                          </span>
                          <span className="text-neutral-500">
                            Impact: <span className={`capitalize ${impactColor}`}>{risk.impact}</span>
                          </span>
                        </div>
                        {risk.mitigation_strategy && (
                          <div className="mt-3 pt-3 border-t border-neutral-800">
                            <p className="text-xs text-neutral-500 mb-1">Mitigation Strategy</p>
                            <p className="text-xs text-neutral-400">{risk.mitigation_strategy}</p>
                            <Badge variant="outline" className="text-xs mt-2 capitalize">
                              {risk.mitigation_status}
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
}
