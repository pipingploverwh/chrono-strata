import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Ruler, 
  User, 
  Sparkles, 
  ChevronRight,
  Check,
  AlertCircle,
  Loader2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SizingToolProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSizeSelected?: (size: string) => void;
}

type FitPreference = 'slim' | 'regular' | 'relaxed';

const SIZE_CHART = {
  XS: { chest: [32, 34], waist: [26, 28], height: [60, 64] },
  S: { chest: [34, 36], waist: [28, 30], height: [64, 67] },
  M: { chest: [36, 39], waist: [30, 33], height: [67, 70] },
  L: { chest: [39, 42], waist: [33, 36], height: [70, 73] },
  XL: { chest: [42, 45], waist: [36, 40], height: [73, 76] },
  XXL: { chest: [45, 48], waist: [40, 44], height: [76, 80] },
};

export function SizingTool({ open, onOpenChange, onSizeSelected }: SizingToolProps) {
  const [step, setStep] = useState(1);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [measurements, setMeasurements] = useState({
    height: '',
    weight: '',
    chest: '',
    waist: '',
  });
  const [fitPreference, setFitPreference] = useState<FitPreference>('regular');
  const [recommendedSize, setRecommendedSize] = useState<string | null>(null);
  const [aiInsight, setAiInsight] = useState<string | null>(null);

  const calculateSize = () => {
    const height = parseFloat(measurements.height);
    const chest = parseFloat(measurements.chest);
    const waist = parseFloat(measurements.waist);

    // Score each size based on measurements
    let bestSize = 'M';
    let bestScore = Infinity;

    for (const [size, ranges] of Object.entries(SIZE_CHART)) {
      let score = 0;
      
      if (height) {
        const heightMid = (ranges.height[0] + ranges.height[1]) / 2;
        score += Math.abs(height - heightMid);
      }
      
      if (chest) {
        const chestMid = (ranges.chest[0] + ranges.chest[1]) / 2;
        score += Math.abs(chest - chestMid) * 2; // Weight chest more
      }
      
      if (waist) {
        const waistMid = (ranges.waist[0] + ranges.waist[1]) / 2;
        score += Math.abs(waist - waistMid) * 1.5;
      }

      if (score < bestScore) {
        bestScore = score;
        bestSize = size;
      }
    }

    // Adjust for fit preference
    const sizes = Object.keys(SIZE_CHART);
    const currentIndex = sizes.indexOf(bestSize);
    
    if (fitPreference === 'slim' && currentIndex > 0) {
      bestSize = sizes[currentIndex - 1];
    } else if (fitPreference === 'relaxed' && currentIndex < sizes.length - 1) {
      bestSize = sizes[currentIndex + 1];
    }

    return bestSize;
  };

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    
    try {
      const size = calculateSize();
      setRecommendedSize(size);

      // Get AI insight
      const { data, error } = await supabase.functions.invoke('briefing-cards', {
        body: {
          action: 'generate_single',
          context: `User measurements: Height ${measurements.height}in, Chest ${measurements.chest}in, Waist ${measurements.waist}in, Weight ${measurements.weight}lbs. Fit preference: ${fitPreference}. Recommended size: ${size}. Generate a brief, helpful sizing tip for a technical outdoor shell jacket.`
        }
      });

      if (!error && data?.summary) {
        setAiInsight(data.summary);
      } else {
        // Fallback insight
        setAiInsight(`Based on your measurements, size ${size} should provide optimal coverage with ${fitPreference === 'regular' ? 'room for layering' : fitPreference === 'slim' ? 'a closer fit' : 'extra room for movement'}.`);
      }

      setStep(3);
      toast.success('Size recommendation ready');
    } catch (err) {
      console.error('Sizing error:', err);
      // Still show basic recommendation
      const size = calculateSize();
      setRecommendedSize(size);
      setAiInsight(`Size ${size} is recommended based on your measurements with a ${fitPreference} fit preference.`);
      setStep(3);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectSize = () => {
    if (recommendedSize && onSizeSelected) {
      onSizeSelected(recommendedSize);
      onOpenChange(false);
      toast.success(`Size ${recommendedSize} selected`);
    }
  };

  const resetTool = () => {
    setStep(1);
    setMeasurements({ height: '', weight: '', chest: '', waist: '' });
    setFitPreference('regular');
    setRecommendedSize(null);
    setAiInsight(null);
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { onOpenChange(v); if (!v) resetTool(); }}>
      <DialogContent className="sm:max-w-lg bg-strata-black border-strata-steel/30 text-strata-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-lg font-mono">
            <Ruler className="w-5 h-5 text-strata-cyan" />
            AI Sizing Assistant
            <Badge className="ml-2 bg-strata-cyan/20 text-strata-cyan border-0 text-[10px]">
              <Sparkles className="w-3 h-3 mr-1" />
              SMART FIT
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-2">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 w-12 rounded-full transition-colors ${
                  s <= step ? 'bg-strata-cyan' : 'bg-strata-steel/30'
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Measurements */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-strata-silver/80 text-center">
                  Enter your measurements for a personalized size recommendation
                </p>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-strata-silver/60 uppercase tracking-wider">
                      Height (inches)
                    </Label>
                    <Input
                      type="number"
                      value={measurements.height}
                      onChange={(e) => setMeasurements({ ...measurements, height: e.target.value })}
                      placeholder="68"
                      className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-strata-silver/60 uppercase tracking-wider">
                      Weight (lbs)
                    </Label>
                    <Input
                      type="number"
                      value={measurements.weight}
                      onChange={(e) => setMeasurements({ ...measurements, weight: e.target.value })}
                      placeholder="170"
                      className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-strata-silver/60 uppercase tracking-wider">
                      Chest (inches)
                    </Label>
                    <Input
                      type="number"
                      value={measurements.chest}
                      onChange={(e) => setMeasurements({ ...measurements, chest: e.target.value })}
                      placeholder="38"
                      className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-strata-silver/60 uppercase tracking-wider">
                      Waist (inches)
                    </Label>
                    <Input
                      type="number"
                      value={measurements.waist}
                      onChange={(e) => setMeasurements({ ...measurements, waist: e.target.value })}
                      placeholder="32"
                      className="bg-strata-steel/20 border-strata-steel/30 text-strata-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setStep(2)}
                  disabled={!measurements.height || !measurements.chest}
                  className="w-full bg-strata-cyan hover:bg-strata-cyan/90 text-strata-black font-mono"
                >
                  Continue
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              </motion.div>
            )}

            {/* Step 2: Fit Preference */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                <p className="text-sm text-strata-silver/80 text-center">
                  How do you prefer your technical shells to fit?
                </p>

                <RadioGroup
                  value={fitPreference}
                  onValueChange={(v) => setFitPreference(v as FitPreference)}
                  className="space-y-3"
                >
                  {[
                    { value: 'slim', label: 'Slim Fit', desc: 'Close to body, minimal layering' },
                    { value: 'regular', label: 'Regular Fit', desc: 'Room for midweight layers' },
                    { value: 'relaxed', label: 'Relaxed Fit', desc: 'Maximum layering capacity' },
                  ].map((option) => (
                    <label
                      key={option.value}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                        fitPreference === option.value
                          ? 'border-strata-cyan bg-strata-cyan/10'
                          : 'border-strata-steel/30 hover:border-strata-steel/50'
                      }`}
                    >
                      <RadioGroupItem value={option.value} className="border-strata-steel/50" />
                      <div>
                        <div className="font-medium text-sm">{option.label}</div>
                        <div className="text-xs text-strata-silver/60">{option.desc}</div>
                      </div>
                    </label>
                  ))}
                </RadioGroup>

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-strata-steel/30"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={handleAnalyze}
                    disabled={isAnalyzing}
                    className="flex-1 bg-strata-cyan hover:bg-strata-cyan/90 text-strata-black font-mono"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        Get Recommendation
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Results */}
            {step === 3 && recommendedSize && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-4"
              >
                <div className="text-center py-4">
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-strata-cyan/20 border-2 border-strata-cyan mb-4">
                    <span className="text-3xl font-bold text-strata-cyan">{recommendedSize}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-1">Recommended Size</h3>
                  <p className="text-sm text-strata-silver/60">
                    Based on {fitPreference} fit preference
                  </p>
                </div>

                {aiInsight && (
                  <div className="p-4 rounded-lg bg-strata-steel/10 border border-strata-steel/20">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-strata-cyan mt-0.5 flex-shrink-0" />
                      <p className="text-sm text-strata-silver/80">{aiInsight}</p>
                    </div>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setStep(1)}
                    className="flex-1 border-strata-steel/30"
                  >
                    Recalculate
                  </Button>
                  <Button
                    onClick={handleSelectSize}
                    className="flex-1 bg-strata-lume hover:bg-strata-lume/90 text-strata-black font-mono"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    Select Size {recommendedSize}
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </DialogContent>
    </Dialog>
  );
}
