import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Rocket } from "lucide-react";
import LavenderSourcingAgent from "@/components/LavenderSourcingAgent";
import LavenderPipelineRunner from "@/components/LavenderPipelineRunner";

const LavenderAgent = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="max-w-7xl mx-auto p-6">
        <Tabs defaultValue="pipeline" className="space-y-6">
          <TabsList className="bg-gray-800/50 border border-gray-700">
            <TabsTrigger value="pipeline" className="gap-2 data-[state=active]:bg-purple-600">
              <Rocket className="h-4 w-4" />
              Automated Pipeline
            </TabsTrigger>
            <TabsTrigger value="manual" className="gap-2 data-[state=active]:bg-purple-600">
              <Search className="h-4 w-4" />
              Single URL Scanner
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pipeline" className="mt-0">
            <LavenderPipelineRunner />
          </TabsContent>

          <TabsContent value="manual" className="mt-0">
            <LavenderSourcingAgent />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default LavenderAgent;
