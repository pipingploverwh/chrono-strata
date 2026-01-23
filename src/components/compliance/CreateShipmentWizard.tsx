import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  Loader2,
  MapPin,
  Package,
  Building2,
  Calendar,
  AlertTriangle,
  FileCheck,
  Users
} from "lucide-react";
import { useCreateShipment, CreateShipmentInput } from "@/hooks/useCreateShipment";
import { ALL_JURISDICTION_PAIRS, getJurisdictionPair } from "@/data/jurisdictionTemplates";

interface CreateShipmentWizardProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const STEPS = [
  { id: 1, title: "Route", icon: MapPin },
  { id: 2, title: "Product", icon: Package },
  { id: 3, title: "Use Case", icon: Building2 },
  { id: 4, title: "Timeline", icon: Calendar },
  { id: 5, title: "Review", icon: Check }
];

const ORIGIN_STATES = ["Massachusetts", "California"];
const DESTINATION_COUNTRIES = ["Israel", "UAE"];
const PRODUCT_TYPES = [
  { value: "flower", label: "Dried Flower" },
  { value: "oil", label: "Oil / Tincture" },
  { value: "isolate", label: "Cannabinoid Isolate" },
  { value: "extract", label: "Full-Spectrum Extract" },
  { value: "hemp_cbd", label: "Hemp-Derived CBD (<0.3% THC)" }
];

const USE_CASES = [
  { 
    value: "clinical_trial", 
    label: "Clinical Trial / Research",
    description: "IRB-approved research protocol with academic or medical institution"
  },
  { 
    value: "named_patient", 
    label: "Named Patient Program",
    description: "Compassionate use for specific identified patients via licensed physician"
  },
  { 
    value: "commercial", 
    label: "Commercial Supply",
    description: "Licensed commercial import for dispensary/pharmacy distribution"
  }
];

const DIFFICULTY_COLORS: Record<string, string> = {
  low: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  medium: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  high: "bg-orange-500/20 text-orange-400 border-orange-500/30",
  very_high: "bg-red-500/20 text-red-400 border-red-500/30"
};

export function CreateShipmentWizard({ open, onOpenChange }: CreateShipmentWizardProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<Partial<CreateShipmentInput>>({
    originState: "",
    destinationCountry: "",
    productType: "",
    useCase: undefined
  });

  const createShipment = useCreateShipment();
  const selectedTemplate = formData.originState && formData.destinationCountry
    ? getJurisdictionPair(formData.originState, formData.destinationCountry)
    : undefined;

  const handleNext = () => {
    if (currentStep < 5) setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const handleSubmit = async () => {
    if (!formData.originState || !formData.destinationCountry || !formData.productType || !formData.useCase) {
      return;
    }

    await createShipment.mutateAsync({
      originState: formData.originState,
      destinationCountry: formData.destinationCountry,
      productType: formData.productType,
      thcConcentration: formData.thcConcentration,
      quantity: formData.quantity,
      batchId: formData.batchId,
      description: formData.description,
      useCase: formData.useCase,
      destinationEntity: formData.destinationEntity,
      targetShipDate: formData.targetShipDate,
      estimatedValue: formData.estimatedValue
    });

    onOpenChange(false);
    setCurrentStep(1);
    setFormData({
      originState: "",
      destinationCountry: "",
      productType: "",
      useCase: undefined
    });
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.originState && formData.destinationCountry;
      case 2:
        return formData.productType;
      case 3:
        return formData.useCase;
      case 4:
        return true;
      case 5:
        return true;
      default:
        return false;
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <RouteStep formData={formData} setFormData={setFormData} selectedTemplate={selectedTemplate} />;
      case 2:
        return <ProductStep formData={formData} setFormData={setFormData} />;
      case 3:
        return <UseCaseStep formData={formData} setFormData={setFormData} />;
      case 4:
        return <TimelineStep formData={formData} setFormData={setFormData} selectedTemplate={selectedTemplate} />;
      case 5:
        return <ReviewStep formData={formData} selectedTemplate={selectedTemplate} />;
      default:
        return null;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-neutral-900 border-neutral-800 text-white max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">Create New Shipment</DialogTitle>
        </DialogHeader>

        {/* Progress Steps */}
        <div className="flex items-center justify-between px-2 py-4 border-b border-neutral-800">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <div className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                currentStep >= step.id 
                  ? "bg-cyan-500 border-cyan-500 text-white" 
                  : "border-neutral-600 text-neutral-500"
              }`}>
                {currentStep > step.id ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <step.icon className="w-4 h-4" />
                )}
              </div>
              <span className={`ml-2 text-sm hidden sm:inline ${
                currentStep >= step.id ? "text-white" : "text-neutral-500"
              }`}>
                {step.title}
              </span>
              {index < STEPS.length - 1 && (
                <div className={`w-8 sm:w-12 h-0.5 mx-2 ${
                  currentStep > step.id ? "bg-cyan-500" : "bg-neutral-700"
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <ScrollArea className="flex-1 px-1">
          <div className="py-4">
            {renderStepContent()}
          </div>
        </ScrollArea>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-4 border-t border-neutral-800">
          <Button
            variant="outline"
            onClick={handleBack}
            disabled={currentStep === 1}
            className="border-neutral-700"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          {currentStep < 5 ? (
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className="bg-cyan-600 hover:bg-cyan-700"
            >
              Next
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleSubmit}
              disabled={createShipment.isPending}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              {createShipment.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Check className="w-4 h-4 mr-2" />
                  Create Shipment
                </>
              )}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Step 1: Route Selection
function RouteStep({ 
  formData, 
  setFormData, 
  selectedTemplate 
}: { 
  formData: Partial<CreateShipmentInput>;
  setFormData: (data: Partial<CreateShipmentInput>) => void;
  selectedTemplate: ReturnType<typeof getJurisdictionPair>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Select Transport Route</h3>
        <p className="text-sm text-neutral-400">
          Choose the origin state and destination country for regulatory template matching.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Origin State (USA)</Label>
          <Select
            value={formData.originState}
            onValueChange={(value) => setFormData({ ...formData, originState: value })}
          >
            <SelectTrigger className="bg-neutral-800 border-neutral-700">
              <SelectValue placeholder="Select state..." />
            </SelectTrigger>
            <SelectContent>
              {ORIGIN_STATES.map(state => (
                <SelectItem key={state} value={state}>{state}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Destination Country</Label>
          <Select
            value={formData.destinationCountry}
            onValueChange={(value) => setFormData({ ...formData, destinationCountry: value })}
          >
            <SelectTrigger className="bg-neutral-800 border-neutral-700">
              <SelectValue placeholder="Select country..." />
            </SelectTrigger>
            <SelectContent>
              {DESTINATION_COUNTRIES.map(country => (
                <SelectItem key={country} value={country}>{country}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Template Preview */}
      {selectedTemplate && (
        <Card className="bg-neutral-800/50 border-neutral-700 p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-cyan-400">{selectedTemplate.route} Template Matched</h4>
              <p className="text-sm text-neutral-400">Auto-populating regulatory requirements</p>
            </div>
            <div className="flex gap-2">
              <Badge className={DIFFICULTY_COLORS[selectedTemplate.difficulty]}>
                {selectedTemplate.difficulty.replace('_', ' ')} difficulty
              </Badge>
              <Badge variant="outline" className="border-neutral-600">
                {selectedTemplate.legalStatus}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-cyan-400" />
              <span>{selectedTemplate.requiredPermits.length} permits</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-4 h-4 text-cyan-400" />
              <span>{selectedTemplate.keyStakeholders.length} stakeholders</span>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-cyan-400" />
              <span>{selectedTemplate.estimatedTimeline}</span>
            </div>
          </div>

          {selectedTemplate.notes.length > 0 && (
            <div className="mt-3 pt-3 border-t border-neutral-700">
              <p className="text-xs text-neutral-400">{selectedTemplate.notes[0]}</p>
            </div>
          )}
        </Card>
      )}

      {formData.originState && formData.destinationCountry && !selectedTemplate && (
        <Card className="bg-amber-500/10 border-amber-500/30 p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0" />
            <div>
              <h4 className="font-semibold text-amber-400">No Template Available</h4>
              <p className="text-sm text-neutral-400">
                This route doesn't have a pre-configured template. You'll need to manually add permits and stakeholders after creation.
              </p>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}

// Step 2: Product Details
function ProductStep({ 
  formData, 
  setFormData 
}: { 
  formData: Partial<CreateShipmentInput>;
  setFormData: (data: Partial<CreateShipmentInput>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Product Details</h3>
        <p className="text-sm text-neutral-400">
          Specify the product type and batch information for this shipment.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Product Type *</Label>
          <RadioGroup
            value={formData.productType}
            onValueChange={(value) => setFormData({ ...formData, productType: value })}
            className="grid grid-cols-2 gap-3"
          >
            {PRODUCT_TYPES.map(type => (
              <div key={type.value}>
                <RadioGroupItem
                  value={type.value}
                  id={type.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={type.value}
                  className="flex items-center justify-center rounded-md border-2 border-neutral-700 bg-neutral-800/50 p-3 hover:bg-neutral-800 hover:border-neutral-600 peer-data-[state=checked]:border-cyan-500 peer-data-[state=checked]:bg-cyan-500/10 cursor-pointer transition-colors"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>THC Concentration (%)</Label>
            <Input
              type="number"
              min="0"
              max="100"
              step="0.1"
              placeholder="e.g., 18.5"
              value={formData.thcConcentration || ""}
              onChange={(e) => setFormData({ 
                ...formData, 
                thcConcentration: e.target.value ? parseFloat(e.target.value) : undefined 
              })}
              className="bg-neutral-800 border-neutral-700"
            />
          </div>
          <div className="space-y-2">
            <Label>Quantity</Label>
            <Input
              placeholder="e.g., 500g, 1000 units"
              value={formData.quantity || ""}
              onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              className="bg-neutral-800 border-neutral-700"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label>Batch ID</Label>
          <Input
            placeholder="e.g., BATCH-2026-001"
            value={formData.batchId || ""}
            onChange={(e) => setFormData({ ...formData, batchId: e.target.value })}
            className="bg-neutral-800 border-neutral-700"
          />
        </div>

        <div className="space-y-2">
          <Label>Description</Label>
          <Textarea
            placeholder="Additional product details or notes..."
            value={formData.description || ""}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className="bg-neutral-800 border-neutral-700 min-h-[80px]"
          />
        </div>
      </div>
    </div>
  );
}

// Step 3: Use Case
function UseCaseStep({ 
  formData, 
  setFormData 
}: { 
  formData: Partial<CreateShipmentInput>;
  setFormData: (data: Partial<CreateShipmentInput>) => void;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Use Case & Destination</h3>
        <p className="text-sm text-neutral-400">
          Select the regulatory pathway and destination entity for this shipment.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-3">
          <Label>Use Case *</Label>
          <RadioGroup
            value={formData.useCase}
            onValueChange={(value) => setFormData({ 
              ...formData, 
              useCase: value as CreateShipmentInput['useCase'] 
            })}
            className="space-y-3"
          >
            {USE_CASES.map(uc => (
              <div key={uc.value}>
                <RadioGroupItem
                  value={uc.value}
                  id={uc.value}
                  className="peer sr-only"
                />
                <Label
                  htmlFor={uc.value}
                  className="flex flex-col rounded-md border-2 border-neutral-700 bg-neutral-800/50 p-4 hover:bg-neutral-800 hover:border-neutral-600 peer-data-[state=checked]:border-cyan-500 peer-data-[state=checked]:bg-cyan-500/10 cursor-pointer transition-colors"
                >
                  <span className="font-semibold">{uc.label}</span>
                  <span className="text-sm text-neutral-400 mt-1">{uc.description}</span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-2">
          <Label>Destination Entity</Label>
          <Input
            placeholder="e.g., Sheba Medical Center, American Hospital Dubai"
            value={formData.destinationEntity || ""}
            onChange={(e) => setFormData({ ...formData, destinationEntity: e.target.value })}
            className="bg-neutral-800 border-neutral-700"
          />
          <p className="text-xs text-neutral-500">
            The clinic, research institution, or licensed importer receiving the shipment.
          </p>
        </div>
      </div>
    </div>
  );
}

// Step 4: Timeline & Value
function TimelineStep({ 
  formData, 
  setFormData,
  selectedTemplate
}: { 
  formData: Partial<CreateShipmentInput>;
  setFormData: (data: Partial<CreateShipmentInput>) => void;
  selectedTemplate: ReturnType<typeof getJurisdictionPair>;
}) {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Timeline & Estimated Value</h3>
        <p className="text-sm text-neutral-400">
          Set target dates and shipment value for tracking and reporting.
        </p>
      </div>

      {selectedTemplate && (
        <Card className="bg-neutral-800/50 border-neutral-700 p-4">
          <div className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4 text-cyan-400" />
            <span>
              Estimated regulatory timeline: <strong className="text-cyan-400">{selectedTemplate.estimatedTimeline}</strong>
            </span>
          </div>
          <p className="text-xs text-neutral-400 mt-2">
            This is an estimate based on typical permit processing times. Actual timelines may vary.
          </p>
        </Card>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>Target Ship Date</Label>
          <Input
            type="date"
            value={formData.targetShipDate || ""}
            onChange={(e) => setFormData({ ...formData, targetShipDate: e.target.value })}
            className="bg-neutral-800 border-neutral-700"
          />
        </div>
        <div className="space-y-2">
          <Label>Estimated Value (USD)</Label>
          <Input
            type="number"
            min="0"
            step="100"
            placeholder="e.g., 50000"
            value={formData.estimatedValue || ""}
            onChange={(e) => setFormData({ 
              ...formData, 
              estimatedValue: e.target.value ? parseFloat(e.target.value) : undefined 
            })}
            className="bg-neutral-800 border-neutral-700"
          />
        </div>
      </div>
    </div>
  );
}

// Step 5: Review
function ReviewStep({ 
  formData,
  selectedTemplate
}: { 
  formData: Partial<CreateShipmentInput>;
  selectedTemplate: ReturnType<typeof getJurisdictionPair>;
}) {
  const productLabel = PRODUCT_TYPES.find(p => p.value === formData.productType)?.label || formData.productType;
  const useCaseLabel = USE_CASES.find(u => u.value === formData.useCase)?.label || formData.useCase;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-2">Review & Confirm</h3>
        <p className="text-sm text-neutral-400">
          Review shipment details before creation. Related records will be auto-populated.
        </p>
      </div>

      <Card className="bg-neutral-800/50 border-neutral-700 divide-y divide-neutral-700">
        <div className="p-4">
          <h4 className="text-sm font-medium text-neutral-400 mb-2">Route</h4>
          <p className="font-semibold">{formData.originState} → {formData.destinationCountry}</p>
          {selectedTemplate && (
            <Badge className={`mt-2 ${DIFFICULTY_COLORS[selectedTemplate.difficulty]}`}>
              {selectedTemplate.difficulty.replace('_', ' ')} difficulty
            </Badge>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-sm font-medium text-neutral-400 mb-2">Product</h4>
          <p className="font-semibold">{productLabel}</p>
          {formData.thcConcentration && (
            <p className="text-sm text-neutral-400">THC: {formData.thcConcentration}%</p>
          )}
          {formData.quantity && (
            <p className="text-sm text-neutral-400">Quantity: {formData.quantity}</p>
          )}
        </div>

        <div className="p-4">
          <h4 className="text-sm font-medium text-neutral-400 mb-2">Use Case</h4>
          <p className="font-semibold">{useCaseLabel}</p>
          {formData.destinationEntity && (
            <p className="text-sm text-neutral-400">Entity: {formData.destinationEntity}</p>
          )}
        </div>

        {(formData.targetShipDate || formData.estimatedValue) && (
          <div className="p-4">
            <h4 className="text-sm font-medium text-neutral-400 mb-2">Timeline & Value</h4>
            {formData.targetShipDate && (
              <p className="text-sm">Target: {new Date(formData.targetShipDate).toLocaleDateString()}</p>
            )}
            {formData.estimatedValue && (
              <p className="text-sm">Value: ${formData.estimatedValue.toLocaleString()}</p>
            )}
          </div>
        )}
      </Card>

      {selectedTemplate && (
        <Card className="bg-emerald-500/10 border-emerald-500/30 p-4">
          <h4 className="font-semibold text-emerald-400 mb-2">Auto-Population Summary</h4>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{selectedTemplate.requiredPermits.length} permits will be created</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{selectedTemplate.keyStakeholders.length} stakeholders added</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>8+ required documents tracked</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>7 risk categories monitored</span>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
}
