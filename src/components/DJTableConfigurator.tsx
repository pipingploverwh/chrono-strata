import { useState } from "react";
import { Check, Sparkles, Layers, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface ConfigState {
  ledColor: string;
  surfaceFinish: string;
  accessories: string[];
}

interface ConfigOption {
  id: string;
  name: string;
  price: number;
  description: string;
  colorPreview?: string;
}

const ledColors: ConfigOption[] = [
  { id: "emerald", name: "Emerald Lume", price: 0, description: "Signature STRATA glow", colorPreview: "bg-emerald-500" },
  { id: "amber", name: "Amber Pulse", price: 200, description: "Warm vintage tone", colorPreview: "bg-amber-500" },
  { id: "arctic", name: "Arctic Blue", price: 200, description: "Cool precision aesthetic", colorPreview: "bg-cyan-400" },
  { id: "royal", name: "Royal Purple", price: 300, description: "Luxury statement", colorPreview: "bg-purple-500" },
  { id: "white", name: "Pure White", price: 150, description: "Clinical clarity", colorPreview: "bg-white" },
  { id: "rgb", name: "Full RGB Spectrum", price: 500, description: "Dynamic color control", colorPreview: "bg-gradient-to-r from-red-500 via-green-500 to-blue-500" },
];

const surfaceFinishes: ConfigOption[] = [
  { id: "carbon", name: "Carbon Fiber Weave", price: 0, description: "Matte black composite, aerospace-grade" },
  { id: "aluminum", name: "Brushed Aluminum", price: 800, description: "Industrial titanium finish" },
  { id: "walnut", name: "Black Walnut Veneer", price: 1500, description: "Hand-selected grain pattern" },
  { id: "marble", name: "Italian Marble Inlay", price: 3500, description: "Calacatta with emerald veining" },
  { id: "titanium", name: "Titanium Composite", price: 2800, description: "Grade 5 Ti alloy surface" },
  { id: "rubber", name: "Recycled Rubber Terrazzo", price: 1200, description: "Sustainable luxury composite" },
];

const accessories: ConfigOption[] = [
  { id: "strata-pro", name: "STRATA Pro Displays", price: 2500, description: "Upgraded 4.2\" OLED with weather radar" },
  { id: "vinyl-rack", name: "Integrated Vinyl Storage", price: 1800, description: "Climate-controlled 200+ record capacity" },
  { id: "cable-management", name: "Premium Cable System", price: 800, description: "Gold-plated connections, hidden routing" },
  { id: "road-case", name: "Flight Case Package", price: 5000, description: "ATA-rated touring protection" },
  { id: "brass-accents", name: "Brass Detail Package", price: 1500, description: "Polished brass edge trim and controls" },
  { id: "rgb-underglow", name: "Underglow LED System", price: 950, description: "360° ambient base lighting" },
];

const BASE_PRICE = 47500;

interface DJTableConfiguratorProps {
  onConfigChange?: (config: ConfigState) => void;
  onCheckout?: (config: ConfigState, totalPrice: number) => void;
}

const DJTableConfigurator = ({ onConfigChange, onCheckout }: DJTableConfiguratorProps) => {
  const [config, setConfig] = useState<ConfigState>({
    ledColor: "emerald",
    surfaceFinish: "carbon",
    accessories: [],
  });

  const calculateTotal = () => {
    const ledPrice = ledColors.find(c => c.id === config.ledColor)?.price || 0;
    const surfacePrice = surfaceFinishes.find(s => s.id === config.surfaceFinish)?.price || 0;
    const accessoryPrice = config.accessories.reduce((sum, id) => {
      return sum + (accessories.find(a => a.id === id)?.price || 0);
    }, 0);
    return BASE_PRICE + ledPrice + surfacePrice + accessoryPrice;
  };

  const updateConfig = (updates: Partial<ConfigState>) => {
    const newConfig = { ...config, ...updates };
    setConfig(newConfig);
    onConfigChange?.(newConfig);
  };

  const toggleAccessory = (id: string) => {
    const newAccessories = config.accessories.includes(id)
      ? config.accessories.filter(a => a !== id)
      : [...config.accessories, id];
    updateConfig({ accessories: newAccessories });
  };

  const handleCheckout = () => {
    onCheckout?.(config, calculateTotal());
  };

  return (
    <div className="w-full">
      {/* Header with Live Price */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8 pb-6 border-b border-border/30">
        <div>
          <h3 className="text-2xl font-light tracking-tight">Configure Your APEX-1</h3>
          <p className="text-sm text-muted-foreground mt-1">Personalize every detail</p>
        </div>
        <div className="text-right">
          <p className="text-xs tracking-widest text-muted-foreground uppercase mb-1">Configured Total</p>
          <p className="text-3xl font-light">
            ${calculateTotal().toLocaleString()}
            <span className="text-sm text-muted-foreground ml-2">USD</span>
          </p>
        </div>
      </div>

      {/* Configuration Tabs */}
      <Tabs defaultValue="led" className="w-full">
        <TabsList className="w-full grid grid-cols-3 bg-muted/30 mb-8">
          <TabsTrigger value="led" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Sparkles className="w-4 h-4" />
            <span className="hidden sm:inline">LED Colors</span>
          </TabsTrigger>
          <TabsTrigger value="surface" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Layers className="w-4 h-4" />
            <span className="hidden sm:inline">Surface Finishes</span>
          </TabsTrigger>
          <TabsTrigger value="accessories" className="flex items-center gap-2 data-[state=active]:bg-background data-[state=active]:shadow-sm">
            <Package className="w-4 h-4" />
            <span className="hidden sm:inline">Accessories</span>
          </TabsTrigger>
        </TabsList>

        {/* LED Colors Tab */}
        <TabsContent value="led" className="mt-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ledColors.map((color) => (
              <button
                key={color.id}
                onClick={() => updateConfig({ ledColor: color.id })}
                className={`relative p-5 text-left rounded-sm border transition-all duration-300 group ${
                  config.ledColor === color.id
                    ? "border-apex-glow bg-apex-glow-subtle/30"
                    : "border-border/30 hover:border-border/60 bg-muted/20 hover:bg-muted/40"
                }`}
              >
                {/* Selection indicator */}
                {config.ledColor === color.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-apex-glow flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
                
                {/* Color preview */}
                <div className="flex items-center gap-4 mb-3">
                  <div 
                    className={`w-8 h-8 rounded-full ${color.colorPreview} transition-all ${
                      config.ledColor === color.id ? "shadow-[0_0_20px_rgba(16,185,129,0.6)]" : ""
                    }`}
                    style={config.ledColor === color.id ? { 
                      boxShadow: color.id === "emerald" ? "0 0 20px rgba(16,185,129,0.6)" : "0 0 12px rgba(255,255,255,0.3)"
                    } : undefined}
                  />
                  <div>
                    <p className="font-medium text-sm">{color.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {color.price === 0 ? "Included" : `+$${color.price}`}
                    </p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground">{color.description}</p>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Surface Finishes Tab */}
        <TabsContent value="surface" className="mt-0">
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {surfaceFinishes.map((finish) => (
              <button
                key={finish.id}
                onClick={() => updateConfig({ surfaceFinish: finish.id })}
                className={`relative p-5 text-left rounded-sm border transition-all duration-300 ${
                  config.surfaceFinish === finish.id
                    ? "border-apex-glow bg-apex-glow-subtle/30"
                    : "border-border/30 hover:border-border/60 bg-muted/20 hover:bg-muted/40"
                }`}
              >
                {/* Selection indicator */}
                {config.surfaceFinish === finish.id && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-apex-glow flex items-center justify-center">
                    <Check className="w-3 h-3 text-black" />
                  </div>
                )}
                
                {/* Material preview bar */}
                <div className={`w-full h-2 rounded-full mb-4 ${
                  finish.id === "carbon" ? "bg-zinc-900" :
                  finish.id === "aluminum" ? "bg-gradient-to-r from-zinc-400 to-zinc-500" :
                  finish.id === "walnut" ? "bg-gradient-to-r from-amber-900 to-amber-800" :
                  finish.id === "marble" ? "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" :
                  finish.id === "titanium" ? "bg-gradient-to-r from-slate-400 to-slate-500" :
                  "bg-gradient-to-r from-zinc-700 via-emerald-800 to-zinc-700"
                }`} />
                
                <p className="font-medium text-sm mb-1">{finish.name}</p>
                <p className="text-xs text-muted-foreground mb-2">{finish.description}</p>
                <p className="text-xs font-medium text-apex-glow">
                  {finish.price === 0 ? "Included" : `+$${finish.price.toLocaleString()}`}
                </p>
              </button>
            ))}
          </div>
        </TabsContent>

        {/* Accessories Tab */}
        <TabsContent value="accessories" className="mt-0">
          <div className="grid sm:grid-cols-2 gap-4">
            {accessories.map((accessory) => {
              const isSelected = config.accessories.includes(accessory.id);
              return (
                <button
                  key={accessory.id}
                  onClick={() => toggleAccessory(accessory.id)}
                  className={`relative p-5 text-left rounded-sm border transition-all duration-300 ${
                    isSelected
                      ? "border-apex-glow bg-apex-glow-subtle/30"
                      : "border-border/30 hover:border-border/60 bg-muted/20 hover:bg-muted/40"
                  }`}
                >
                  {/* Checkbox */}
                  <div className={`absolute top-4 right-4 w-5 h-5 rounded-sm border-2 flex items-center justify-center transition-all ${
                    isSelected 
                      ? "border-apex-glow bg-apex-glow" 
                      : "border-muted-foreground/40"
                  }`}>
                    {isSelected && <Check className="w-3 h-3 text-black" />}
                  </div>
                  
                  <p className="font-medium text-sm mb-1 pr-8">{accessory.name}</p>
                  <p className="text-xs text-muted-foreground mb-3">{accessory.description}</p>
                  <p className="text-sm font-medium text-apex-glow">+${accessory.price.toLocaleString()}</p>
                </button>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>

      {/* Checkout Button */}
      <div className="mt-10 pt-8 border-t border-border/30">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="text-sm text-muted-foreground">
              Configuration saved automatically • $1,800 deposit to reserve
            </p>
          </div>
          <Button 
            onClick={handleCheckout}
            className="w-full sm:w-auto px-10 py-6 text-sm tracking-widest uppercase bg-foreground text-background hover:bg-foreground/90"
          >
            Proceed to Deposit
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DJTableConfigurator;