import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  FileCheck,
  Users,
  Info
} from "lucide-react";
import { ALL_JURISDICTION_PAIRS, type JurisdictionPair } from "@/data/jurisdictionTemplates";

const DIFFICULTY_COLORS: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-400",
  medium: "bg-amber-500/20 text-amber-400",
  high: "bg-orange-500/20 text-orange-400",
  very_high: "bg-red-500/20 text-red-400"
};

const STATUS_COLORS: Record<string, string> = {
  permitted: "bg-emerald-500/20 text-emerald-400",
  conditional: "bg-amber-500/20 text-amber-400",
  restricted: "bg-orange-500/20 text-orange-400",
  prohibited: "bg-red-500/20 text-red-400"
};

export function JurisdictionGuide() {
  const [selectedPair, setSelectedPair] = useState<JurisdictionPair>(ALL_JURISDICTION_PAIRS[0]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Route Selector */}
      <div className="space-y-3">
        <h3 className="text-sm font-medium text-neutral-400 uppercase tracking-wider">
          Select Route
        </h3>
        {ALL_JURISDICTION_PAIRS.map((pair) => (
          <Card
            key={pair.route}
            onClick={() => setSelectedPair(pair)}
            className={`p-4 cursor-pointer transition-all ${
              selectedPair.route === pair.route
                ? "bg-cyan-500/10 border-cyan-500/50"
                : "bg-neutral-900/50 border-neutral-800 hover:border-neutral-700"
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-sm text-white">{pair.route}</span>
              </div>
              <Badge className={DIFFICULTY_COLORS[pair.difficulty]}>
                {pair.difficulty.replace('_', ' ')}
              </Badge>
            </div>
            <p className="text-xs text-neutral-500">
              {pair.originState} → {pair.destinationCountry}
            </p>
            <div className="flex items-center gap-2 mt-2">
              <Badge className={STATUS_COLORS[pair.legalStatus]} variant="outline">
                {pair.legalStatus}
              </Badge>
              <span className="text-xs text-neutral-600">
                <Clock className="w-3 h-3 inline mr-1" />
                {pair.estimatedTimeline}
              </span>
            </div>
          </Card>
        ))}
      </div>

      {/* Route Details */}
      <div className="lg:col-span-2">
        <Card className="bg-neutral-900/50 border-neutral-800 overflow-hidden">
          <div className="p-6 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-white">
                  {selectedPair.originState} → {selectedPair.destinationCountry}
                </h2>
                <p className="text-sm text-neutral-400 mt-1">
                  Regulatory Compliance Playbook
                </p>
              </div>
              <div className="text-right">
                <Badge className={DIFFICULTY_COLORS[selectedPair.difficulty]}>
                  {selectedPair.difficulty.replace('_', ' ')} difficulty
                </Badge>
                <p className="text-xs text-neutral-500 mt-1">
                  Est. Timeline: {selectedPair.estimatedTimeline}
                </p>
              </div>
            </div>
          </div>

          <Tabs defaultValue="permits" className="w-full">
            <TabsList className="w-full justify-start rounded-none border-b border-neutral-800 bg-transparent h-12 px-6">
              <TabsTrigger value="permits" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none">
                <FileCheck className="w-4 h-4 mr-2" />
                Required Permits
              </TabsTrigger>
              <TabsTrigger value="stakeholders" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none">
                <Users className="w-4 h-4 mr-2" />
                Key Stakeholders
              </TabsTrigger>
              <TabsTrigger value="notes" className="data-[state=active]:bg-transparent data-[state=active]:border-b-2 data-[state=active]:border-cyan-500 rounded-none">
                <Info className="w-4 h-4 mr-2" />
                Key Considerations
              </TabsTrigger>
            </TabsList>

            <ScrollArea className="h-[400px]">
              <TabsContent value="permits" className="p-6 m-0">
                <div className="space-y-4">
                  {selectedPair.requiredPermits.map((permit, index) => (
                    <div 
                      key={index}
                      className="flex gap-4 p-4 bg-neutral-950/50 rounded-lg border border-neutral-800/50"
                    >
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        permit.required ? 'bg-red-500/10' : 'bg-neutral-800'
                      }`}>
                        {permit.required ? (
                          <AlertTriangle className="w-5 h-5 text-red-400" />
                        ) : (
                          <CheckCircle2 className="w-5 h-5 text-neutral-500" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm font-medium text-white">{permit.name}</h4>
                          {permit.required && (
                            <Badge variant="outline" className="text-[10px] text-red-400 border-red-500/30">
                              Required
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-neutral-500 mb-2">{permit.issuingAuthority}</p>
                        <div className="flex items-center gap-3 text-xs">
                          <span className="text-neutral-400 capitalize">
                            {permit.jurisdiction.replace('_', ' ')}
                          </span>
                          <span className="text-cyan-400">
                            ~{permit.estimatedDays} days
                          </span>
                        </div>
                        {permit.notes && (
                          <p className="text-xs text-neutral-600 mt-2 italic">{permit.notes}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="stakeholders" className="p-6 m-0">
                <div className="space-y-3">
                  {selectedPair.keyStakeholders.map((stakeholder, index) => (
                    <div 
                      key={index}
                      className="flex items-center gap-4 p-3 bg-neutral-950/50 rounded-lg border border-neutral-800/50"
                    >
                      <Badge variant="outline" className="capitalize text-xs">
                        {stakeholder.type.replace('_', ' ')}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm text-white">{stakeholder.role}</p>
                        <p className="text-xs text-neutral-500">{stakeholder.jurisdiction}</p>
                      </div>
                      {stakeholder.recommended && (
                        <span className="text-xs text-cyan-400">{stakeholder.recommended}</span>
                      )}
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="notes" className="p-6 m-0">
                <div className="space-y-3">
                  {selectedPair.notes.map((note, index) => (
                    <div 
                      key={index}
                      className="flex gap-3 p-3 bg-neutral-950/50 rounded-lg border border-neutral-800/50"
                    >
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 mt-2 flex-shrink-0" />
                      <p className="text-sm text-neutral-300">{note}</p>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </ScrollArea>
          </Tabs>
        </Card>
      </div>
    </div>
  );
}
