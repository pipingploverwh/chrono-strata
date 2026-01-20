import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, 
  Check, 
  ArrowRight, 
  Download, 
  Clock, 
  Map, 
  Zap,
  Fingerprint,
  Globe,
  Radio,
  ChevronRight,
  Infinity as InfinityIcon,
  Star,
  Heart,
  Sparkles,
  CloudRain,
  Sun
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/hooks/useLanguage";

// Import terrain images for certificate preview
import strataShellHUD from "@/assets/strata-shell-hud-jacket.jpg";
import strataShellMarine from "@/assets/strata-shell-marine.jpg";
import strataShellPolar from "@/assets/strata-shell-polar.jpg";
import strataShellDesert from "@/assets/strata-shell-desert.jpg";
import strataShellUrban from "@/assets/strata-shell-urban.jpg";
import kidsStrataShellWhite from "@/assets/kids-strata-shell-white.jpg";

const TERRAIN_IMAGES: Record<string, string> = {
  standard: strataShellHUD,
  marine: strataShellMarine,
  polar: strataShellPolar,
  desert: strataShellDesert,
  urban: strataShellUrban,
  polar_junior: kidsStrataShellWhite,
};

// Onboarding steps
type OnboardingStep = 'certificate' | 'activation' | 'calibration' | 'complete';

const ShopSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useLanguage();
  
  const sessionId = searchParams.get('session_id');
  const isBond = searchParams.get('bond') === 'true';
  const isTactical = searchParams.get('tactical') === 'true';
  const isKidsShell = searchParams.get('kids') === 'true';
  const selectedSize = searchParams.get('size') || 'M';
  const terrainId = searchParams.get('terrain') || (isKidsShell ? 'polar_junior' : 'standard');
  
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('certificate');
  const [progress, setProgress] = useState(0);
  const [serialNumber] = useState(() => 
    `STR-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );
  const [activationCode] = useState(() => 
    `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`
  );

  // Simulate loading progress
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 200);
    return () => clearInterval(timer);
  }, []);

  const steps: { id: OnboardingStep; label: string; icon: typeof Shield }[] = [
    { id: 'certificate', label: t('success.step.certificate'), icon: Shield },
    { id: 'activation', label: t('success.step.activation'), icon: Fingerprint },
    { id: 'calibration', label: t('success.step.calibration'), icon: Radio },
    { id: 'complete', label: t('success.step.complete'), icon: Check },
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  const handleNextStep = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < steps.length) {
      setCurrentStep(steps[nextIndex].id);
    }
  };

  const terrainImage = TERRAIN_IMAGES[terrainId] || TERRAIN_IMAGES.standard;

  // Kids Shell specific flow
  if (isKidsShell) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-lavender-50 to-white relative overflow-hidden">
        {/* Floating sparkles background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{ 
                x: Math.random() * 100 + '%', 
                y: '100%',
                opacity: 0.3,
                scale: 0.5
              }}
              animate={{ 
                y: '-10%',
                opacity: [0.3, 0.7, 0.3],
                scale: [0.5, 1, 0.5],
                rotate: 360
              }}
              transition={{ 
                duration: 8 + Math.random() * 4,
                repeat: Infinity,
                delay: Math.random() * 5,
                ease: "linear"
              }}
            >
              <Sparkles className="w-4 h-4 text-lavender-300" />
            </motion.div>
          ))}
        </div>

        {/* Cloud decorations */}
        <motion.div 
          className="absolute top-20 left-10 text-lavender-200"
          animate={{ x: [0, 20, 0], y: [0, -5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          <CloudRain className="w-16 h-16 opacity-30" />
        </motion.div>
        <motion.div 
          className="absolute top-40 right-16 text-lavender-200"
          animate={{ x: [0, -15, 0], y: [0, 5, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        >
          <Sun className="w-12 h-12 opacity-40" />
        </motion.div>

        <div className="relative z-10 max-w-2xl mx-auto px-4 py-12">
          {/* Success Header */}
          <motion.div 
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            className="text-center mb-8"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", bounce: 0.6, delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-lavender-400 to-lavender-500 flex items-center justify-center mx-auto mb-6 shadow-lg shadow-lavender-300/50"
            >
              <Star className="w-12 h-12 text-white fill-white" />
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl md:text-4xl font-bold text-lavender-600 mb-3"
            >
              🎉 Adventure Awaits! 🎉
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-lavender-500 text-lg"
            >
              Your Polar Junior shell is on its way!
            </motion.p>
          </motion.div>

          {/* Product Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="bg-white rounded-2xl shadow-xl shadow-lavender-200/50 border-2 border-lavender-200 overflow-hidden mb-8"
          >
            <div className="p-6 md:p-8">
              <div className="flex flex-col md:flex-row gap-6 items-center">
                {/* Product Image */}
                <div className="w-40 h-40 rounded-xl bg-gradient-to-br from-lavender-50 to-lavender-100 p-3 flex-shrink-0">
                  <img 
                    src={kidsStrataShellWhite} 
                    alt="Polar Junior Shell" 
                    className="w-full h-full object-contain"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 text-center md:text-left">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-lavender-100 rounded-full text-lavender-600 text-sm font-medium mb-3">
                    <Heart className="w-3.5 h-3.5 fill-lavender-400 text-lavender-400" />
                    Junior Explorer
                  </div>
                  <h2 className="text-2xl font-bold text-lavender-700 mb-2">
                    STRATA Shell — Polar Junior
                  </h2>
                  <p className="text-lavender-500 text-sm mb-4">
                    Ready for rain, shine, and everything in between!
                  </p>
                  
                  <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                    <div className="px-3 py-2 bg-lavender-50 rounded-lg border border-lavender-100">
                      <div className="text-xs text-lavender-400 uppercase tracking-wide">Size</div>
                      <div className="text-sm font-semibold text-lavender-600">{selectedSize}</div>
                    </div>
                    <div className="px-3 py-2 bg-lavender-50 rounded-lg border border-lavender-100">
                      <div className="text-xs text-lavender-400 uppercase tracking-wide">Plan</div>
                      <div className="text-sm font-semibold text-lavender-600">Annual</div>
                    </div>
                    <div className="px-3 py-2 bg-lavender-50 rounded-lg border border-lavender-100">
                      <div className="text-xs text-lavender-400 uppercase tracking-wide">Status</div>
                      <div className="text-sm font-semibold text-emerald-500">Confirmed ✓</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Fun Facts Strip */}
            <div className="bg-gradient-to-r from-lavender-100 to-lavender-50 px-6 py-4 border-t border-lavender-200">
              <div className="flex items-center justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-lavender-600">
                  <CloudRain className="w-4 h-4" />
                  <span>Waterproof</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-lavender-300" />
                <div className="flex items-center gap-2 text-lavender-600">
                  <Sun className="w-4 h-4" />
                  <span>UV Protected</span>
                </div>
                <div className="w-1 h-1 rounded-full bg-lavender-300" />
                <div className="flex items-center gap-2 text-lavender-600">
                  <Sparkles className="w-4 h-4" />
                  <span>Adventure Ready</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Next Steps */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="bg-white rounded-2xl shadow-lg shadow-lavender-100/50 border border-lavender-100 p-6 mb-8"
          >
            <h3 className="text-lg font-semibold text-lavender-700 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-lavender-500" />
              What Happens Next?
            </h3>
            <div className="space-y-3">
              {[
                { icon: "📧", text: "Confirmation email is on its way!" },
                { icon: "📦", text: "Your shell ships within 5-7 business days" },
                { icon: "🌈", text: "Track adventures in the STRATA app" },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.9 + index * 0.1 }}
                  className="flex items-center gap-3 p-3 bg-lavender-50 rounded-xl"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-lavender-600">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button 
              onClick={() => navigate('/kids')}
              variant="outline"
              className="border-lavender-300 text-lavender-600 hover:bg-lavender-50 rounded-xl px-6 py-3"
            >
              Back to Kids Collection
            </Button>
            <Button 
              onClick={() => navigate('/shop')}
              className="bg-gradient-to-r from-lavender-500 to-lavender-600 hover:from-lavender-600 hover:to-lavender-700 text-white rounded-xl px-6 py-3 shadow-lg shadow-lavender-300/50"
            >
              Explore More Shells
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-12 text-lavender-400 text-sm"
          >
            Order ID: <span className="font-mono">{serialNumber}</span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-strata-void text-strata-white relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
      </div>

      {/* Scan lines effect */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,255,0.03) 2px, rgba(0,255,255,0.03) 4px)'
        }}
      />

      <div className="relative z-10 max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 border border-emerald-500/50 rounded-sm mb-6">
            <Check className="w-4 h-4 text-emerald-400" />
            <span className="text-emerald-400 font-mono text-xs tracking-wider uppercase">
              {t('success.paymentConfirmed')}
            </span>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-light tracking-tight mb-4">
            {t('success.acquisitionComplete')}
          </h1>
          <p className="text-strata-silver/70 max-w-lg mx-auto">
            {isTactical 
              ? t('success.tacticalSecured')
              : isBond 
              ? t('success.bondSecured') 
              : t('success.ownershipSecured')}
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-12">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isActive = index === currentStepIndex;
            const isComplete = index < currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  className={`
                    flex items-center gap-2 px-3 py-1.5 rounded-sm border transition-all
                    ${isActive ? 'bg-strata-orange/20 border-strata-orange text-strata-orange' : ''}
                    ${isComplete ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : ''}
                    ${!isActive && !isComplete ? 'bg-strata-void border-strata-silver/20 text-strata-silver/40' : ''}
                  `}
                >
                  <StepIcon className="w-3.5 h-3.5" />
                  <span className="font-mono text-[10px] uppercase tracking-wider hidden md:inline">{step.label}</span>
                </motion.div>
                {index < steps.length - 1 && (
                  <ChevronRight className="w-4 h-4 text-strata-silver/30 mx-1" />
                )}
              </div>
            );
          })}
        </div>

        {/* Content Area */}
        <AnimatePresence mode="wait">
          {/* Certificate Preview */}
          {currentStep === 'certificate' && (
            <motion.div
              key="certificate"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              {/* Certificate Card */}
              <div className="bg-gradient-to-br from-strata-graphite/80 to-strata-void border border-strata-silver/20 rounded-sm overflow-hidden">
                {/* Certificate Header */}
                <div className="px-6 py-4 border-b border-strata-silver/10 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Shield className="w-5 h-5 text-strata-orange" />
                    <div>
                      <div className="font-mono text-xs text-strata-silver/60 uppercase tracking-wider">
                        {t('success.certificate.title')}
                      </div>
                      <div className="text-sm font-medium">
                        {isTactical 
                          ? t('success.certificate.tacticalType') 
                          : isBond 
                          ? t('success.certificate.bondType') 
                          : t('success.certificate.ownershipType')}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-mono text-xs text-strata-silver/60">{t('success.certificate.serial')}</div>
                    <div className="font-mono text-xs text-strata-cyan">{serialNumber}</div>
                  </div>
                </div>

                {/* Certificate Body */}
                <div className="p-6 grid md:grid-cols-2 gap-6">
                  {/* Terrain Preview */}
                  <div className="aspect-square bg-strata-void rounded-sm overflow-hidden border border-strata-silver/10 relative">
                    <img 
                      src={terrainImage} 
                      alt="STRATA Shell" 
                      className="w-full h-full object-cover opacity-80"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-strata-void via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="font-mono text-[10px] text-strata-cyan/80 uppercase tracking-wider mb-1">
                        {t('success.certificate.terrainConfig')}
                      </div>
                      <div className="text-sm font-medium capitalize">{terrainId}</div>
                    </div>
                  </div>

                  {/* Certificate Details */}
                  <div className="space-y-4">
                    <div className="p-4 bg-strata-void/50 border border-strata-silver/10 rounded-sm">
                      <div className="flex items-center gap-2 mb-3">
                        <InfinityIcon className="w-4 h-4 text-strata-orange" />
                        <span className="font-mono text-xs text-strata-silver/60 uppercase tracking-wider">
                          {isTactical ? t('success.certificate.allocation') : t('success.certificate.ownership')}
                        </span>
                      </div>
                      {isTactical ? (
                        <>
                          <div className="text-lg font-light text-strata-orange">
                            {t('success.certificate.manufacturingPending')}
                          </div>
                          <div className="text-xs text-strata-silver/50 mt-1">
                            {t('success.certificate.leadTime')}: 8-12 {t('success.certificate.weeks')}
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="text-2xl font-light">
                            {isBond ? '100' : '1'} <span className="text-sm text-strata-silver/60">{t('success.certificate.years')}</span>
                          </div>
                          <div className="text-xs text-strata-silver/50 mt-1">
                            {isBond ? t('success.certificate.bondLegacy') : t('success.certificate.annualRenewal')}
                          </div>
                        </>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="p-3 bg-strata-void/50 border border-strata-silver/10 rounded-sm">
                        <Globe className="w-4 h-4 text-strata-cyan mb-2" />
                        <div className="font-mono text-[10px] text-strata-silver/60 uppercase">{t('success.certificate.access')}</div>
                        <div className="text-sm">{t('success.certificate.global')}</div>
                      </div>
                      <div className="p-3 bg-strata-void/50 border border-strata-silver/10 rounded-sm">
                        <Clock className="w-4 h-4 text-strata-lume mb-2" />
                        <div className="font-mono text-[10px] text-strata-silver/60 uppercase">{t('success.certificate.issued')}</div>
                        <div className="text-sm font-mono">{new Date().toLocaleDateString()}</div>
                      </div>
                    </div>

                    <Button 
                      variant="outline" 
                      className="w-full border-strata-silver/30 text-strata-silver hover:bg-strata-silver/10"
                      disabled
                    >
                      <Download className="w-4 h-4 mr-2" />
                      {t('success.certificate.downloadPdf')}
                    </Button>
                  </div>
                </div>

                {/* Certificate Footer */}
                <div className="px-6 py-3 bg-strata-void/50 border-t border-strata-silver/10 flex items-center justify-between">
                  <div className="font-mono text-[10px] text-strata-silver/40">
                    {t('success.certificate.verified')} • {new Date().toISOString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="font-mono text-[10px] text-emerald-400 uppercase">{t('success.certificate.valid')}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button 
                  onClick={handleNextStep}
                  className="bg-strata-orange hover:bg-strata-orange/90 text-black font-mono uppercase tracking-wider"
                >
                  {t('success.proceedToActivation')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Activation Step */}
          {currentStep === 'activation' && (
            <motion.div
              key="activation"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-strata-graphite/50 border border-strata-silver/20 rounded-sm p-8 text-center">
                <Fingerprint className="w-16 h-16 text-strata-cyan mx-auto mb-6 animate-pulse" />
                <h2 className="text-xl font-light mb-2">{t('success.activation.title')}</h2>
                <p className="text-strata-silver/70 text-sm mb-6 max-w-md mx-auto">
                  {t('success.activation.description')}
                </p>
                
                <div className="inline-block bg-strata-void border border-strata-cyan/30 rounded-sm px-6 py-4 mb-6">
                  <div className="font-mono text-[10px] text-strata-silver/60 uppercase tracking-wider mb-1">
                    {t('success.activation.code')}
                  </div>
                  <div className="font-mono text-2xl text-strata-cyan tracking-widest">
                    {activationCode}
                  </div>
                </div>

                <p className="text-xs text-strata-silver/50">
                  {t('success.activation.saveCode')}
                </p>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="ghost"
                  onClick={() => setCurrentStep('certificate')}
                  className="text-strata-silver/60"
                >
                  {t('success.back')}
                </Button>
                <Button 
                  onClick={handleNextStep}
                  className="bg-strata-orange hover:bg-strata-orange/90 text-black font-mono uppercase tracking-wider"
                >
                  {t('success.continueCalibration')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Calibration Step */}
          {currentStep === 'calibration' && (
            <motion.div
              key="calibration"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <div className="bg-strata-graphite/50 border border-strata-silver/20 rounded-sm p-8">
                <div className="flex items-center gap-3 mb-6">
                  <Radio className="w-6 h-6 text-strata-lume" />
                  <div>
                    <h2 className="text-xl font-light">{t('success.calibration.title')}</h2>
                    <p className="text-strata-silver/70 text-sm">{t('success.calibration.subtitle')}</p>
                  </div>
                </div>

                {/* Calibration Checklist */}
                <div className="space-y-4">
                  {[
                    { key: 'terrain', icon: Map, label: t('success.calibration.terrainMapped') },
                    { key: 'hud', icon: Zap, label: t('success.calibration.hudSynced') },
                    { key: 'chrono', icon: Clock, label: t('success.calibration.chronoCalibrated') },
                  ].map((item, index) => (
                    <motion.div
                      key={item.key}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.3 }}
                      className="flex items-center gap-4 p-4 bg-strata-void/50 border border-strata-silver/10 rounded-sm"
                    >
                      <item.icon className="w-5 h-5 text-strata-cyan" />
                      <span className="flex-1 text-sm">{item.label}</span>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: index * 0.3 + 0.5 }}
                      >
                        <Check className="w-5 h-5 text-emerald-400" />
                      </motion.div>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between">
                <Button 
                  variant="ghost"
                  onClick={() => setCurrentStep('activation')}
                  className="text-strata-silver/60"
                >
                  {t('success.back')}
                </Button>
                <Button 
                  onClick={handleNextStep}
                  className="bg-strata-orange hover:bg-strata-orange/90 text-black font-mono uppercase tracking-wider"
                >
                  {t('success.finalizeSetup')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Complete Step */}
          {currentStep === 'complete' && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center space-y-8"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                className="w-24 h-24 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center mx-auto"
              >
                <Check className="w-12 h-12 text-emerald-400" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-light mb-2">{t('success.complete.title')}</h2>
                <p className="text-strata-silver/70 max-w-md mx-auto">
                  {t('success.complete.description')}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                <div className="p-4 bg-strata-graphite/50 border border-strata-silver/20 rounded-sm">
                  <Shield className="w-6 h-6 text-strata-orange mx-auto mb-2" />
                  <div className="font-mono text-[10px] text-strata-silver/60 uppercase">{t('success.complete.status')}</div>
                  <div className="text-sm font-medium text-emerald-400">{t('success.complete.active')}</div>
                </div>
                <div className="p-4 bg-strata-graphite/50 border border-strata-silver/20 rounded-sm">
                  <Globe className="w-6 h-6 text-strata-cyan mx-auto mb-2" />
                  <div className="font-mono text-[10px] text-strata-silver/60 uppercase">{t('success.complete.coverage')}</div>
                  <div className="text-sm font-medium">{t('success.complete.worldwide')}</div>
                </div>
                <div className="p-4 bg-strata-graphite/50 border border-strata-silver/20 rounded-sm">
                  <InfinityIcon className="w-6 h-6 text-strata-lume mx-auto mb-2" />
                  <div className="font-mono text-[10px] text-strata-silver/60 uppercase">{t('success.complete.protocol')}</div>
                  <div className="text-sm font-medium">{isBond ? 'STRATA BOND' : 'CENTURY'}</div>
                </div>
              </div>

              <div className="pt-6 flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="border-strata-silver/30 text-strata-silver"
                >
                  {t('success.complete.returnToShop')}
                </Button>
                <Button 
                  onClick={() => navigate('/strata')}
                  className="bg-strata-orange hover:bg-strata-orange/90 text-black font-mono uppercase tracking-wider"
                >
                  {t('success.complete.accessStrata')}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ShopSuccess;
