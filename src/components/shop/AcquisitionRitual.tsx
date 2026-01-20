import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Fingerprint, 
  FileSignature, 
  Cpu, 
  Check, 
  X, 
  ArrowRight, 
  Loader2,
  Shield,
  Zap,
  AlertTriangle
} from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

type RitualStep = 'idle' | 'biometric' | 'protocol' | 'fabrication' | 'executing';

interface AcquisitionRitualProps {
  isOpen: boolean;
  onClose: () => void;
  onExecute: () => void;
  isProcessing: boolean;
  selectedTerrain: {
    name: string;
    strataZone: string;
    color: string;
  };
  paymentMode: 'annual' | 'bond';
  price: number;
}

/**
 * Multi-step acquisition ritual flow.
 * Transforms checkout into a ceremonial "launch sequence":
 * Step 1: Biometric Authentication (scan animation)
 * Step 2: Protocol Acceptance (100-year pact signing)
 * Step 3: Fabrication (jacket being "printed")
 */
export const AcquisitionRitual = ({
  isOpen,
  onClose,
  onExecute,
  isProcessing,
  selectedTerrain,
  paymentMode,
  price
}: AcquisitionRitualProps) => {
  const { t } = useLanguage();
  const [currentStep, setCurrentStep] = useState<RitualStep>('idle');
  const [biometricProgress, setBiometricProgress] = useState(0);
  const [protocolSigned, setProtocolSigned] = useState(false);
  const [fabricationProgress, setFabricationProgress] = useState(0);

  // Reset on open
  useEffect(() => {
    if (isOpen) {
      setCurrentStep('biometric');
      setBiometricProgress(0);
      setProtocolSigned(false);
      setFabricationProgress(0);
    } else {
      setCurrentStep('idle');
    }
  }, [isOpen]);

  // Biometric scanning simulation
  useEffect(() => {
    if (currentStep === 'biometric') {
      const interval = setInterval(() => {
        setBiometricProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 8;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  // Fabrication progress simulation
  useEffect(() => {
    if (currentStep === 'fabrication') {
      const interval = setInterval(() => {
        setFabricationProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + Math.random() * 6;
        });
      }, 80);
      return () => clearInterval(interval);
    }
  }, [currentStep]);

  const handleBiometricComplete = () => {
    if (biometricProgress >= 100) {
      setCurrentStep('protocol');
    }
  };

  const handleProtocolSign = () => {
    setProtocolSigned(true);
    setTimeout(() => setCurrentStep('fabrication'), 800);
  };

  const handleFabricationComplete = () => {
    if (fabricationProgress >= 100) {
      setCurrentStep('executing');
      onExecute();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Backdrop with dimmed lights effect */}
          <motion.div
            className="absolute inset-0 bg-black"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.95 }}
            exit={{ opacity: 0 }}
            onClick={currentStep === 'executing' ? undefined : onClose}
          />

          {/* Ambient glow based on step */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            animate={{
              background: currentStep === 'biometric' 
                ? 'radial-gradient(circle at center, rgba(34, 197, 94, 0.1) 0%, transparent 60%)'
                : currentStep === 'protocol'
                ? 'radial-gradient(circle at center, rgba(249, 115, 22, 0.1) 0%, transparent 60%)'
                : currentStep === 'fabrication'
                ? 'radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, transparent 60%)'
                : 'none'
            }}
            transition={{ duration: 0.5 }}
          />

          {/* Ritual Container */}
          <motion.div
            className="relative bg-strata-void border border-strata-steel/40 rounded-lg max-w-lg w-full overflow-hidden"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Top status bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-strata-steel/30 bg-strata-graphite/50">
              <div className="flex items-center gap-3">
                <motion.div 
                  className={`w-2 h-2 rounded-full ${
                    currentStep === 'executing' ? 'bg-strata-lume' : 'bg-strata-orange'
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                />
                <span className="font-mono text-[10px] text-strata-silver uppercase tracking-[0.3em]">
                  {t('ritual.acquisitionSequence')}
                </span>
              </div>
              {currentStep !== 'executing' && (
                <button 
                  onClick={onClose}
                  className="p-1 hover:bg-strata-steel/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-strata-silver/60" />
                </button>
              )}
            </div>

            {/* Step indicators */}
            <div className="flex items-center justify-center gap-2 py-4 border-b border-strata-steel/20">
              {['biometric', 'protocol', 'fabrication'].map((step, i) => {
                const stepIndex = ['biometric', 'protocol', 'fabrication'].indexOf(currentStep);
                const isComplete = i < stepIndex;
                const isActive = step === currentStep;
                return (
                  <div key={step} className="flex items-center">
                    <motion.div
                      className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        isComplete ? 'bg-strata-lume/20 border-strata-lume' :
                        isActive ? 'border-strata-orange' :
                        'border-strata-steel/30'
                      }`}
                      animate={isActive ? { scale: [1, 1.1, 1] } : {}}
                      transition={{ repeat: Infinity, duration: 2 }}
                    >
                      {isComplete ? (
                        <Check className="w-4 h-4 text-strata-lume" />
                      ) : (
                        <span className={`font-mono text-xs ${isActive ? 'text-strata-orange' : 'text-strata-silver/40'}`}>
                          {i + 1}
                        </span>
                      )}
                    </motion.div>
                    {i < 2 && (
                      <div className={`w-8 h-0.5 mx-1 ${isComplete ? 'bg-strata-lume' : 'bg-strata-steel/30'}`} />
                    )}
                  </div>
                );
              })}
            </div>

            {/* Step Content */}
            <div className="p-6 min-h-[280px]">
              <AnimatePresence mode="wait">
                {/* Step 1: Biometric Authentication */}
                {currentStep === 'biometric' && (
                  <motion.div
                    key="biometric"
                    className="text-center space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Fingerprint scanner */}
                    <div className="relative mx-auto w-24 h-24">
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-strata-lume/30"
                        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                      />
                      <motion.div
                        className="absolute inset-2 rounded-full border border-strata-lume/50 flex items-center justify-center bg-strata-lume/5"
                        animate={{ borderColor: biometricProgress >= 100 ? 'rgb(34, 197, 94)' : 'rgba(34, 197, 94, 0.5)' }}
                      >
                        <Fingerprint className="w-10 h-10 text-strata-lume" />
                      </motion.div>
                      {/* Scan line */}
                      <motion.div
                        className="absolute left-2 right-2 h-0.5 bg-strata-lume/60"
                        animate={{ top: ['10%', '90%', '10%'] }}
                        transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                      />
                    </div>

                    <div>
                      <h3 className="font-mono text-sm text-strata-white uppercase tracking-wider mb-2">
                        {t('ritual.biometric.title')}
                      </h3>
                      <p className="text-strata-silver/60 text-xs">
                        {t('ritual.biometric.description')}
                      </p>
                    </div>

                    {/* Progress bar */}
                    <div className="space-y-2">
                      <div className="h-1 bg-strata-steel/30 rounded overflow-hidden">
                        <motion.div
                          className="h-full bg-strata-lume"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(biometricProgress, 100)}%` }}
                        />
                      </div>
                      <span className="font-mono text-[10px] text-strata-lume">
                        {Math.min(Math.round(biometricProgress), 100)}% VERIFIED
                      </span>
                    </div>

                    <button
                      onClick={handleBiometricComplete}
                      disabled={biometricProgress < 100}
                      className="w-full py-3 bg-strata-lume text-black font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-strata-lume/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      {t('ritual.biometric.proceed')}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}

                {/* Step 2: Protocol Acceptance */}
                {currentStep === 'protocol' && (
                  <motion.div
                    key="protocol"
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    <div className="text-center">
                      <FileSignature className="w-12 h-12 text-strata-orange mx-auto mb-4" />
                      <h3 className="font-mono text-sm text-strata-white uppercase tracking-wider mb-2">
                        {t('ritual.protocol.title')}
                      </h3>
                      <p className="text-strata-silver/60 text-xs">
                        {paymentMode === 'bond' 
                          ? t('ritual.protocol.bondDescription')
                          : t('ritual.protocol.annualDescription')
                        }
                      </p>
                    </div>

                    {/* Pact document */}
                    <div className="border border-strata-orange/30 bg-strata-orange/5 rounded p-4 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] text-strata-orange uppercase tracking-wider">
                          {t('ritual.protocol.agreement')}
                        </span>
                        <span className="font-mono text-[9px] text-strata-silver/40">
                          REV. 2026.01
                        </span>
                      </div>
                      <div className="text-xs text-strata-silver/80 space-y-2">
                        <p>• {t('ritual.protocol.term1')}</p>
                        <p>• {t('ritual.protocol.term2')}</p>
                        <p>• {t('ritual.protocol.term3')}</p>
                      </div>
                      <div className="pt-3 border-t border-strata-orange/20 flex items-center justify-between">
                        <span className="font-mono text-[10px] text-strata-silver/60">{t('ritual.protocol.amount')}</span>
                        <span className="font-mono text-lg text-strata-orange">
                          ${price.toLocaleString()}
                        </span>
                      </div>
                    </div>

                    {/* Sign button */}
                    <button
                      onClick={handleProtocolSign}
                      disabled={protocolSigned}
                      className={`w-full py-4 font-mono text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${
                        protocolSigned 
                          ? 'bg-strata-lume/20 border border-strata-lume text-strata-lume' 
                          : 'bg-strata-orange text-black hover:bg-strata-orange/90'
                      }`}
                    >
                      {protocolSigned ? (
                        <>
                          <Check className="w-4 h-4" />
                          {t('ritual.protocol.signed')}
                        </>
                      ) : (
                        <>
                          <FileSignature className="w-4 h-4" />
                          {t('ritual.protocol.signNow')}
                        </>
                      )}
                    </button>
                  </motion.div>
                )}

                {/* Step 3: Fabrication */}
                {currentStep === 'fabrication' && (
                  <motion.div
                    key="fabrication"
                    className="text-center space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                  >
                    {/* Fabrication animation */}
                    <div className="relative mx-auto w-32 h-32">
                      {/* Rotating rings */}
                      <motion.div
                        className="absolute inset-0 rounded-full border border-strata-cyan/30"
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
                      />
                      <motion.div
                        className="absolute inset-4 rounded-full border border-strata-cyan/50"
                        animate={{ rotate: -360 }}
                        transition={{ repeat: Infinity, duration: 5, ease: "linear" }}
                      />
                      {/* Center CPU */}
                      <div className="absolute inset-8 flex items-center justify-center">
                        <Cpu className="w-8 h-8 text-strata-cyan" />
                      </div>
                      {/* Build particles */}
                      {[...Array(8)].map((_, i) => (
                        <motion.div
                          key={i}
                          className="absolute w-1 h-1 bg-strata-cyan rounded-full"
                          style={{
                            left: '50%',
                            top: '50%',
                          }}
                          animate={{
                            x: [0, Math.cos(i * Math.PI / 4) * 50, 0],
                            y: [0, Math.sin(i * Math.PI / 4) * 50, 0],
                            opacity: [1, 0.5, 1],
                          }}
                          transition={{
                            repeat: Infinity,
                            duration: 2,
                            delay: i * 0.2,
                          }}
                        />
                      ))}
                    </div>

                    <div>
                      <h3 className="font-mono text-sm text-strata-white uppercase tracking-wider mb-2">
                        {t('ritual.fabrication.title')}
                      </h3>
                      <p className="text-strata-silver/60 text-xs">
                        {t('ritual.fabrication.description')} — {selectedTerrain.name}
                      </p>
                    </div>

                    {/* Fabrication progress */}
                    <div className="space-y-2">
                      <div className="h-2 bg-strata-steel/30 rounded overflow-hidden">
                        <motion.div
                          className="h-full bg-gradient-to-r from-strata-cyan to-strata-lume"
                          initial={{ width: 0 }}
                          animate={{ width: `${Math.min(fabricationProgress, 100)}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between font-mono text-[10px]">
                        <span className="text-strata-cyan">ALLOCATING UNIT...</span>
                        <span className="text-strata-lume">{Math.min(Math.round(fabricationProgress), 100)}%</span>
                      </div>
                    </div>

                    <button
                      onClick={handleFabricationComplete}
                      disabled={fabricationProgress < 100}
                      className="w-full py-4 bg-strata-cyan text-black font-mono text-xs font-bold uppercase tracking-wider disabled:opacity-30 disabled:cursor-not-allowed hover:bg-strata-cyan/90 transition-colors flex items-center justify-center gap-2"
                    >
                      <Zap className="w-4 h-4" />
                      {t('ritual.fabrication.execute')}
                    </button>
                  </motion.div>
                )}

                {/* Executing */}
                {currentStep === 'executing' && (
                  <motion.div
                    key="executing"
                    className="text-center space-y-6 py-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Loader2 className="w-16 h-16 text-strata-lume mx-auto animate-spin" />
                    <div>
                      <h3 className="font-mono text-sm text-strata-lume uppercase tracking-wider mb-2">
                        {t('ritual.executing.title')}
                      </h3>
                      <p className="text-strata-silver/60 text-xs">
                        {t('ritual.executing.description')}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom warning strip */}
            <div className="flex items-center justify-center gap-2 py-2 bg-strata-orange/10 border-t border-strata-orange/30">
              <AlertTriangle className="w-3 h-3 text-strata-orange" />
              <span className="font-mono text-[9px] text-strata-orange uppercase tracking-wider">
                {t('ritual.warning')}
              </span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AcquisitionRitual;
