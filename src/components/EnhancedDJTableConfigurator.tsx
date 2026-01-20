import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Sparkles, Layers, Package, Loader2, Image, FileText, Mail, ChevronRight, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

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

interface RenderCache {
  [key: string]: string;
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

// Precision Corner Accent Component
const CornerAccent = ({ position, color = "rgba(16, 185, 129, 0.4)" }: { position: 'tl' | 'tr' | 'bl' | 'br'; color?: string }) => {
  const positionClasses = {
    tl: "top-0 left-0",
    tr: "top-0 right-0",
    bl: "bottom-0 left-0",
    br: "bottom-0 right-0",
  };
  
  return (
    <div className={`absolute w-6 h-6 pointer-events-none ${positionClasses[position]}`}>
      <svg viewBox="0 0 24 24" className="w-full h-full" style={{ color }}>
        {position === 'tl' && <path d="M0 0h10v1H1v9H0z" fill="currentColor" />}
        {position === 'tr' && <path d="M24 0H14v1h9v9h1z" fill="currentColor" />}
        {position === 'bl' && <path d="M0 24h10v-1H1V14H0z" fill="currentColor" />}
        {position === 'br' && <path d="M24 24H14v-1h9V14h1z" fill="currentColor" />}
      </svg>
    </div>
  );
};

// Kuma Vertical Slats
const VerticalSlats = ({ count = 12, opacity = 0.03 }: { count?: number; opacity?: number }) => (
  <div className="absolute inset-0 flex justify-between pointer-events-none overflow-hidden">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="w-px h-full bg-emerald-500" style={{ opacity }} />
    ))}
  </div>
);

// Glass Panel Component
const GlassPanel = ({ children, className = "", active = false }: { children: React.ReactNode; className?: string; active?: boolean }) => (
  <div
    className={`relative backdrop-blur-sm border rounded-lg overflow-hidden transition-all duration-300 ${
      active 
        ? "border-emerald-500/50 bg-emerald-500/5 shadow-[0_0_30px_rgba(16,185,129,0.15)]" 
        : "border-white/10 bg-white/[0.02] hover:border-white/20 hover:bg-white/[0.04]"
    } ${className}`}
  >
    <VerticalSlats count={8} opacity={active ? 0.05 : 0.02} />
    {active && (
      <>
        <CornerAccent position="tl" />
        <CornerAccent position="tr" />
        <CornerAccent position="bl" />
        <CornerAccent position="br" />
      </>
    )}
    {children}
  </div>
);

interface EnhancedDJTableConfiguratorProps {
  onConfigChange?: (config: ConfigState) => void;
  onCheckout?: (config: ConfigState, totalPrice: number, renderUrls: string[]) => void;
}

const EnhancedDJTableConfigurator = ({ onConfigChange, onCheckout }: EnhancedDJTableConfiguratorProps) => {
  const [config, setConfig] = useState<ConfigState>({
    ledColor: "emerald",
    surfaceFinish: "carbon",
    accessories: [],
  });
  
  const [activeTab, setActiveTab] = useState("led");
  const [renderCache, setRenderCache] = useState<RenderCache>({});
  const [currentRender, setCurrentRender] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [renderProgress, setRenderProgress] = useState(0);

  const getCacheKey = useCallback((stage: string) => {
    return `${stage}-${config.ledColor}-${config.surfaceFinish}-${config.accessories.join(',')}`;
  }, [config]);

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

  const generateRender = useCallback(async (stage: 'led' | 'surface' | 'accessories' | 'final') => {
    const cacheKey = getCacheKey(stage);
    
    // Check cache first
    if (renderCache[cacheKey]) {
      setCurrentRender(renderCache[cacheKey]);
      return renderCache[cacheKey];
    }

    setIsGenerating(true);
    setRenderProgress(0);
    
    // Simulate progress
    const progressInterval = setInterval(() => {
      setRenderProgress(prev => Math.min(prev + 10, 90));
    }, 500);

    try {
      const { data, error } = await supabase.functions.invoke('generate-config-render', {
        body: {
          ledColor: config.ledColor,
          surfaceFinish: config.surfaceFinish,
          accessories: config.accessories,
          stage,
        },
      });

      clearInterval(progressInterval);
      setRenderProgress(100);

      if (error) throw error;

      const imageUrl = data.imageUrl;
      setRenderCache(prev => ({ ...prev, [cacheKey]: imageUrl }));
      setCurrentRender(imageUrl);
      
      toast.success(`${stage.charAt(0).toUpperCase() + stage.slice(1)} render generated`);
      return imageUrl;
    } catch (err) {
      clearInterval(progressInterval);
      console.error('Render generation error:', err);
      toast.error('Failed to generate render');
      return null;
    } finally {
      setIsGenerating(false);
      setRenderProgress(0);
    }
  }, [config, getCacheKey, renderCache]);

  // Auto-generate render when tab changes
  useEffect(() => {
    const stage = activeTab === 'led' ? 'led' : activeTab === 'surface' ? 'surface' : 'accessories';
    const cacheKey = getCacheKey(stage);
    if (renderCache[cacheKey]) {
      setCurrentRender(renderCache[cacheKey]);
    }
  }, [activeTab, getCacheKey, renderCache]);

  const handleCheckout = async () => {
    if (!customerEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate final render
      toast.info('Generating your custom configuration...');
      const finalRender = await generateRender('final');
      const renderUrls = Object.values(renderCache);
      if (finalRender && !renderUrls.includes(finalRender)) {
        renderUrls.push(finalRender);
      }

      // Create order in database
      const { data: order, error: orderError } = await supabase
        .from('configuration_orders')
        .insert({
          customer_email: customerEmail,
          customer_name: customerName,
          led_color: config.ledColor,
          surface_finish: config.surfaceFinish,
          accessories: config.accessories,
          total_price: calculateTotal(),
          render_urls: renderUrls,
          status: 'pending',
        })
        .select()
        .single();

      if (orderError) throw orderError;

      toast.info('Generating PDF summary...');
      
      // Generate PDF
      const { data: pdfData, error: pdfError } = await supabase.functions.invoke('generate-config-pdf', {
        body: {
          orderId: order.id,
          customerEmail,
          customerName,
          ledColor: config.ledColor,
          surfaceFinish: config.surfaceFinish,
          accessories: config.accessories,
          totalPrice: calculateTotal(),
          renderUrls,
        },
      });

      if (pdfError) console.error('PDF generation error:', pdfError);

      toast.info('Sending confirmation emails...');

      // Send emails
      const { error: emailError } = await supabase.functions.invoke('send-config-receipt', {
        body: {
          orderId: order.id,
          customerEmail,
          customerName,
          ledColor: config.ledColor,
          surfaceFinish: config.surfaceFinish,
          accessories: config.accessories,
          totalPrice: calculateTotal(),
          pdfUrl: pdfData?.pdfUrl || '',
          heroRenderUrl: finalRender || '',
        },
      });

      if (emailError) console.error('Email send error:', emailError);

      toast.success('Configuration complete! Check your email.');
      
      // Save to session for checkout
      sessionStorage.setItem('apex1_config', JSON.stringify({
        ...config,
        totalPrice: calculateTotal(),
        orderId: order.id,
        renderUrls,
      }));

      onCheckout?.(config, calculateTotal(), renderUrls);

    } catch (err) {
      console.error('Checkout error:', err);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full">
      {/* Kuma/Precision Header */}
      <GlassPanel className="p-6 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <p className="text-xs tracking-[0.4em] text-emerald-500/70 mb-2 font-mono">CONFIGURATOR</p>
            <h3 className="text-2xl font-light tracking-tight">Design Your APEX-1</h3>
            <p className="text-sm text-muted-foreground mt-1">Each selection generates a unique AI visualization</p>
          </div>
          <div className="text-right">
            <p className="text-xs tracking-[0.3em] text-muted-foreground uppercase mb-1">Live Total</p>
            <motion.p 
              className="text-4xl font-extralight text-emerald-400"
              key={calculateTotal()}
              initial={{ scale: 1.05, opacity: 0.5 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              ${calculateTotal().toLocaleString()}
            </motion.p>
          </div>
        </div>
      </GlassPanel>

      <div className="grid lg:grid-cols-5 gap-8">
        {/* Left: Configuration Options */}
        <div className="lg:col-span-3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-black/40 border border-white/10 rounded-lg mb-6 p-1">
              <TabsTrigger 
                value="led" 
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30 rounded-md transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span className="hidden sm:inline">LED</span>
              </TabsTrigger>
              <TabsTrigger 
                value="surface" 
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30 rounded-md transition-all"
              >
                <Layers className="w-4 h-4" />
                <span className="hidden sm:inline">Surface</span>
              </TabsTrigger>
              <TabsTrigger 
                value="accessories" 
                className="flex items-center gap-2 data-[state=active]:bg-emerald-500/10 data-[state=active]:text-emerald-400 data-[state=active]:border-emerald-500/30 rounded-md transition-all"
              >
                <Package className="w-4 h-4" />
                <span className="hidden sm:inline">Add-ons</span>
              </TabsTrigger>
            </TabsList>

            {/* LED Tab */}
            <TabsContent value="led" className="mt-0 space-y-3">
              {ledColors.map((color) => (
                <motion.button
                  key={color.id}
                  onClick={() => updateConfig({ ledColor: color.id })}
                  className="w-full text-left"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <GlassPanel active={config.ledColor === color.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div 
                        className={`w-10 h-10 rounded-full ${color.colorPreview} transition-all ${
                          config.ledColor === color.id ? "shadow-[0_0_20px_rgba(16,185,129,0.6)]" : ""
                        }`}
                      />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{color.name}</p>
                        <p className="text-xs text-muted-foreground">{color.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-400">
                          {color.price === 0 ? "Included" : `+$${color.price}`}
                        </p>
                      </div>
                      {config.ledColor === color.id && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                  </GlassPanel>
                </motion.button>
              ))}
            </TabsContent>

            {/* Surface Tab */}
            <TabsContent value="surface" className="mt-0 space-y-3">
              {surfaceFinishes.map((finish) => (
                <motion.button
                  key={finish.id}
                  onClick={() => updateConfig({ surfaceFinish: finish.id })}
                  className="w-full text-left"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <GlassPanel active={config.surfaceFinish === finish.id} className="p-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-full max-w-[80px] h-2 rounded-full ${
                        finish.id === "carbon" ? "bg-zinc-900" :
                        finish.id === "aluminum" ? "bg-gradient-to-r from-zinc-400 to-zinc-500" :
                        finish.id === "walnut" ? "bg-gradient-to-r from-amber-900 to-amber-800" :
                        finish.id === "marble" ? "bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" :
                        finish.id === "titanium" ? "bg-gradient-to-r from-slate-400 to-slate-500" :
                        "bg-gradient-to-r from-zinc-700 via-emerald-800 to-zinc-700"
                      }`} />
                      <div className="flex-1">
                        <p className="font-medium text-sm">{finish.name}</p>
                        <p className="text-xs text-muted-foreground">{finish.description}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-emerald-400">
                          {finish.price === 0 ? "Included" : `+$${finish.price.toLocaleString()}`}
                        </p>
                      </div>
                      {config.surfaceFinish === finish.id && (
                        <div className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center">
                          <Check className="w-4 h-4 text-black" />
                        </div>
                      )}
                    </div>
                  </GlassPanel>
                </motion.button>
              ))}
            </TabsContent>

            {/* Accessories Tab */}
            <TabsContent value="accessories" className="mt-0 space-y-3">
              {accessories.map((accessory) => {
                const isSelected = config.accessories.includes(accessory.id);
                return (
                  <motion.button
                    key={accessory.id}
                    onClick={() => toggleAccessory(accessory.id)}
                    className="w-full text-left"
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <GlassPanel active={isSelected} className="p-4">
                      <div className="flex items-center gap-4">
                        <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isSelected 
                            ? "border-emerald-500 bg-emerald-500" 
                            : "border-muted-foreground/40"
                        }`}>
                          {isSelected && <Check className="w-3 h-3 text-black" />}
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-sm">{accessory.name}</p>
                          <p className="text-xs text-muted-foreground">{accessory.description}</p>
                        </div>
                        <p className="text-sm font-medium text-emerald-400">+${accessory.price.toLocaleString()}</p>
                      </div>
                    </GlassPanel>
                  </motion.button>
                );
              })}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right: AI Render Preview */}
        <div className="lg:col-span-2 space-y-4">
          <GlassPanel className="aspect-[4/3] relative overflow-hidden">
            <CornerAccent position="tl" />
            <CornerAccent position="tr" />
            <CornerAccent position="bl" />
            <CornerAccent position="br" />
            
            <AnimatePresence mode="wait">
              {isGenerating ? (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-4"
                >
                  <Loader2 className="w-10 h-10 text-emerald-500 animate-spin" />
                  <div className="w-32 h-1 bg-white/10 rounded-full overflow-hidden">
                    <motion.div 
                      className="h-full bg-emerald-500 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${renderProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground tracking-wider">GENERATING AI RENDER...</p>
                </motion.div>
              ) : currentRender ? (
                <motion.img
                  key={currentRender}
                  src={currentRender}
                  alt="Configuration Preview"
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5 }}
                />
              ) : (
                <motion.div
                  key="placeholder"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                >
                  <Image className="w-12 h-12 text-muted-foreground/30" />
                  <p className="text-sm text-muted-foreground">Click below to generate preview</p>
                </motion.div>
              )}
            </AnimatePresence>
          </GlassPanel>

          <Button
            onClick={() => generateRender(activeTab as 'led' | 'surface' | 'accessories')}
            disabled={isGenerating}
            variant="outline"
            className="w-full border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/10"
          >
            {isGenerating ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4 mr-2" />
            )}
            Generate {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Preview
          </Button>

          {/* Render Cache Indicators */}
          <div className="flex justify-center gap-2">
            {['led', 'surface', 'accessories'].map((stage) => {
              const hasCached = !!renderCache[getCacheKey(stage)];
              return (
                <div 
                  key={stage}
                  className={`w-2 h-2 rounded-full transition-all ${
                    hasCached ? 'bg-emerald-500' : 'bg-white/20'
                  }`}
                  title={`${stage} render ${hasCached ? 'cached' : 'not generated'}`}
                />
              );
            })}
          </div>
        </div>
      </div>

      {/* Checkout Section */}
      <GlassPanel className="mt-10 p-6">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Customer Info */}
          <div className="flex-1 space-y-4">
            <p className="text-xs tracking-[0.3em] text-emerald-500/70 font-mono">CUSTOMER DETAILS</p>
            <div className="grid sm:grid-cols-2 gap-4">
              <Input
                type="text"
                placeholder="Your Name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                className="bg-white/5 border-white/20 focus:border-emerald-500/50"
              />
              <Input
                type="email"
                placeholder="Email Address *"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="bg-white/5 border-white/20 focus:border-emerald-500/50"
                required
              />
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-2">
              <FileText className="w-3 h-3" /> PDF summary generated
              <Mail className="w-3 h-3 ml-2" /> Email receipt sent
            </p>
          </div>

          {/* CTA */}
          <div className="flex flex-col items-end justify-center gap-2">
            <Button 
              onClick={handleCheckout}
              disabled={isSubmitting || !customerEmail.trim()}
              className="px-10 py-6 text-sm tracking-widest uppercase bg-emerald-500 text-black hover:bg-emerald-400 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  Reserve with $1,800 Deposit
                  <ChevronRight className="w-4 h-4 ml-2" />
                </>
              )}
            </Button>
            <p className="text-xs text-muted-foreground">Secure payment via Stripe</p>
          </div>
        </div>
      </GlassPanel>
    </div>
  );
};

export default EnhancedDJTableConfigurator;
