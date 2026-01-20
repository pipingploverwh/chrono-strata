import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, Check, Loader2, ArrowRight, Shield, Fingerprint, Lock, Scan, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { motion, AnimatePresence } from 'framer-motion';

type GateStep = 'location' | 'select' | 'payment';

// AAL Geometric Corner Accent
const AALSecurityCorner = ({ position, active = false }: { position: 'tl' | 'tr' | 'bl' | 'br'; active?: boolean }) => {
  const positionClasses = {
    tl: 'top-0 left-0',
    tr: 'top-0 right-0',
    bl: 'bottom-0 left-0',
    br: 'bottom-0 right-0'
  };
  
  const lineClasses = {
    tl: { h: 'top-0 left-0 origin-left', v: 'top-0 left-0 origin-top' },
    tr: { h: 'top-0 right-0 origin-right', v: 'top-0 right-0 origin-top' },
    bl: { h: 'bottom-0 left-0 origin-left', v: 'bottom-0 left-0 origin-bottom' },
    br: { h: 'bottom-0 right-0 origin-right', v: 'bottom-0 right-0 origin-bottom' }
  };

  const baseColor = active ? 'bg-emerald-400' : 'bg-zinc-600';
  
  return (
    <div className={`absolute ${positionClasses[position]} w-6 h-6 pointer-events-none`}>
      <motion.div 
        className={`absolute ${lineClasses[position].h} w-6 h-px ${baseColor}`}
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      />
      <motion.div 
        className={`absolute ${lineClasses[position].v} w-px h-6 ${baseColor}`}
        initial={{ scaleY: 0 }}
        animate={{ scaleY: 1 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      />
      <motion.div 
        className={`absolute ${position.includes('t') ? 'top-0' : 'bottom-0'} ${position.includes('l') ? 'left-0' : 'right-0'} w-2 h-2 rotate-45 border ${active ? 'border-emerald-400 bg-emerald-400/20' : 'border-zinc-600'}`}
        initial={{ scale: 0, rotate: 0 }}
        animate={{ scale: 1, rotate: 45 }}
        transition={{ duration: 0.3, delay: 0.3 }}
      />
    </div>
  );
};

// Security Status Indicator
const SecurityIndicator = ({ status, label }: { status: 'pending' | 'active' | 'complete'; label: string }) => {
  const statusColors = {
    pending: 'bg-zinc-700 text-zinc-500',
    active: 'bg-amber-500/20 text-amber-400 animate-pulse',
    complete: 'bg-emerald-500/20 text-emerald-400'
  };
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${status === 'complete' ? 'bg-emerald-400' : status === 'active' ? 'bg-amber-400' : 'bg-zinc-600'}`} />
      <span className={`text-[10px] font-mono uppercase tracking-wider ${status === 'complete' ? 'text-emerald-400' : status === 'active' ? 'text-amber-400' : 'text-zinc-500'}`}>
        {label}
      </span>
    </div>
  );
};

const StrataGate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<GateStep>('location');
  const [locationShared, setLocationShared] = useState(false);
  const [locationName, setLocationName] = useState<string>('');
  const [selectedCount, setSelectedCount] = useState<3 | 5 | 7 | null>(null);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Check if user already has access
  useEffect(() => {
    const hasAccess = localStorage.getItem('strata_access');
    if (hasAccess) {
      const count = localStorage.getItem('strata_location_count') || '3';
      navigate(`/world-${count}`);
    }
  }, [navigate]);

  const requestLocation = async () => {
    try {
      // Simulate security scan
      const interval = setInterval(() => {
        setScanProgress(p => Math.min(p + 15, 90));
      }, 150);

      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });

      clearInterval(interval);
      setScanProgress(100);

      const { latitude, longitude } = position.coords;
      
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`
        );
        const data = await response.json();
        const city = data.address?.city || data.address?.town || data.address?.village || 'Your Location';
        setLocationName(city);
      } catch {
        setLocationName('Your Location');
      }

      setLocationShared(true);
      toast.success('Identity verified');
      
      setTimeout(() => setStep('select'), 800);
    } catch (error) {
      setScanProgress(0);
      toast.error('Verification required to continue');
    }
  };

  const handlePayment = async () => {
    if (!email.trim()) {
      toast.error('Please enter your email');
      return;
    }
    if (!selectedCount) return;

    setIsProcessing(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-strata-checkout', {
        body: { email, locationCount: selectedCount }
      });

      if (error) throw error;
      if (data?.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      toast.error('Failed to start checkout');
    } finally {
      setIsProcessing(false);
    }
  };

  const tiers = [
    { count: 3 as const, name: 'Trio', desc: 'Essential', clearance: 'LEVEL I' },
    { count: 5 as const, name: 'Quinto', desc: 'Extended', clearance: 'LEVEL II' },
    { count: 7 as const, name: 'Septima', desc: 'Complete', clearance: 'LEVEL III' },
  ];

  const getStepStatus = (s: GateStep): 'pending' | 'active' | 'complete' => {
    const steps: GateStep[] = ['location', 'select', 'payment'];
    const currentIdx = steps.indexOf(step);
    const targetIdx = steps.indexOf(s);
    if (targetIdx < currentIdx) return 'complete';
    if (targetIdx === currentIdx) return 'active';
    return 'pending';
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ruled surface grid - AAL signature */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Horizontal precision lines */}
        {[...Array(40)].map((_, i) => (
          <motion.div
            key={`h-${i}`}
            className="absolute left-0 right-0 h-px bg-zinc-800/50"
            style={{ top: `${2.5 * i}%` }}
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.01 }}
          />
        ))}
        {/* Vertical precision lines */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={`v-${i}`}
            className="absolute top-0 bottom-0 w-px bg-zinc-800/30"
            style={{ left: `${5 * i}%` }}
            initial={{ scaleY: 0, opacity: 0 }}
            animate={{ scaleY: 1, opacity: 1 }}
            transition={{ duration: 0.8, delay: i * 0.02 }}
          />
        ))}
      </div>

      {/* Geometric accent - top left */}
      <div className="absolute top-8 left-8 pointer-events-none">
        <motion.div 
          className="w-24 h-24 border border-zinc-800"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute -top-px -left-px w-3 h-3 border-t border-l border-emerald-500/50" />
          <div className="absolute -bottom-px -right-px w-3 h-3 border-b border-r border-emerald-500/50" />
        </motion.div>
      </div>

      {/* Geometric accent - bottom right */}
      <div className="absolute bottom-8 right-8 pointer-events-none">
        <motion.div 
          className="w-16 h-16 border border-zinc-800 rotate-45"
          initial={{ scale: 0.8, opacity: 0, rotate: 0 }}
          animate={{ scale: 1, opacity: 1, rotate: 45 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Security header badge */}
        <motion.div 
          className="text-center mb-8"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex flex-col items-center">
            {/* Security emblem */}
            <div className="relative mb-4">
              <div className="w-16 h-16 border-2 border-zinc-700 flex items-center justify-center relative">
                <Shield className="w-7 h-7 text-zinc-400" />
                <div className="absolute -top-1 -left-1 w-2 h-2 bg-zinc-950 border border-zinc-600" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-zinc-950 border border-zinc-600" />
                <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-zinc-950 border border-zinc-600" />
                <div className="absolute -bottom-1 -right-1 w-2 h-2 bg-zinc-950 border border-zinc-600" />
              </div>
              {/* Active scan indicator */}
              <motion.div 
                className="absolute inset-0 border border-emerald-500/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>

            <div className="space-y-1">
              <h1 className="text-[10px] font-mono uppercase tracking-[0.4em] text-zinc-500">
                Secure Access Portal
              </h1>
              <p className="text-2xl font-extralight text-white tracking-wide">
                STRATA WORLD CLOCK
              </p>
              <p className="text-[10px] font-mono text-zinc-600 tracking-widest">
                STRATA COLLECTION
              </p>
            </div>
          </div>
        </motion.div>

        {/* Security status bar */}
        <motion.div 
          className="flex items-center justify-center gap-6 mb-6 py-3 border-y border-zinc-800"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <SecurityIndicator status={getStepStatus('location')} label="Verify Location" />
          <SecurityIndicator status={getStepStatus('select')} label="Select Clearance" />
          <SecurityIndicator status={getStepStatus('payment')} label="Authorize Access" />
        </motion.div>

        {/* Main content panel */}
        <motion.div 
          className="relative bg-zinc-900/80 backdrop-blur-xl border border-zinc-800"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <AALSecurityCorner position="tl" active={step === 'location'} />
          <AALSecurityCorner position="tr" active={step === 'select'} />
          <AALSecurityCorner position="bl" active={step === 'payment'} />
          <AALSecurityCorner position="br" active={locationShared} />

          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 'location' && (
                <motion.div 
                  key="location"
                  className="text-center space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  {/* Biometric-style scanner */}
                  <div className="relative w-24 h-24 mx-auto">
                    <div className="absolute inset-0 border border-zinc-700 rounded-full" />
                    <div className="absolute inset-2 border border-zinc-800 rounded-full" />
                    <div className="absolute inset-4 border border-dashed border-zinc-700 rounded-full flex items-center justify-center">
                      <Fingerprint className="w-8 h-8 text-zinc-500" />
                    </div>
                    {/* Scanning animation */}
                    {scanProgress > 0 && (
                      <motion.div 
                        className="absolute inset-0 border-2 border-emerald-400 rounded-full"
                        style={{ 
                          clipPath: `polygon(50% 50%, 50% 0%, ${50 + scanProgress * 0.5}% 0%, ${50 + scanProgress * 0.5}% ${scanProgress}%, 50% ${scanProgress}%)` 
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                      />
                    )}
                    {locationShared && (
                      <motion.div 
                        className="absolute inset-0 flex items-center justify-center bg-emerald-500/10 rounded-full"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                      >
                        <Check className="w-10 h-10 text-emerald-400" />
                      </motion.div>
                    )}
                  </div>

                  <div>
                    <h2 className="text-lg font-light text-white mb-1">Location Verification</h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Secure geolocation authentication required
                    </p>
                  </div>

                  {locationShared ? (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 bg-emerald-500/10 border border-emerald-500/30">
                      <MapPin className="w-4 h-4 text-emerald-400" />
                      <span className="text-sm text-emerald-400 font-mono">{locationName}</span>
                      <Check className="w-4 h-4 text-emerald-400" />
                    </div>
                  ) : (
                    <Button
                      onClick={requestLocation}
                      className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 font-mono text-xs uppercase tracking-wider"
                    >
                      <Scan className="w-4 h-4 mr-2" />
                      Initialize Verification
                    </Button>
                  )}
                </motion.div>
              )}

              {step === 'select' && (
                <motion.div 
                  key="select"
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border border-zinc-700 flex items-center justify-center">
                      <Globe className="w-6 h-6 text-zinc-400" />
                    </div>
                    <h2 className="text-lg font-light text-white mb-1">Select Clearance Level</h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Choose timezone access parameters
                    </p>
                  </div>

                  <div className="space-y-3">
                    {tiers.map((tier) => (
                      <button
                        key={tier.count}
                        onClick={() => setSelectedCount(tier.count)}
                        className={`w-full p-4 text-left transition-all relative group ${
                          selectedCount === tier.count
                            ? 'bg-emerald-500/10 border border-emerald-500/50'
                            : 'bg-zinc-800/50 border border-zinc-800 hover:border-zinc-700'
                        }`}
                      >
                        {/* AAL corner accents on selected */}
                        {selectedCount === tier.count && (
                          <>
                            <div className="absolute top-0 left-0 w-3 h-3 border-t border-l border-emerald-400" />
                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b border-r border-emerald-400" />
                          </>
                        )}
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={`text-2xl font-extralight ${selectedCount === tier.count ? 'text-emerald-400' : 'text-white'}`}>
                              {tier.count}
                            </div>
                            <div>
                              <div className={`text-sm font-medium ${selectedCount === tier.count ? 'text-emerald-400' : 'text-white'}`}>
                                {tier.name}
                              </div>
                              <div className="text-[10px] text-zinc-500 font-mono">{tier.desc}</div>
                            </div>
                          </div>
                          <div className={`text-[9px] font-mono tracking-wider ${selectedCount === tier.count ? 'text-emerald-400' : 'text-zinc-600'}`}>
                            {tier.clearance}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>

                  <Button
                    onClick={() => setStep('payment')}
                    disabled={!selectedCount}
                    className="w-full bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700 hover:border-zinc-600 font-mono text-xs uppercase tracking-wider disabled:opacity-50"
                  >
                    Proceed to Authorization
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </motion.div>
              )}

              {step === 'payment' && (
                <motion.div 
                  key="payment"
                  className="space-y-6"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                >
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-4 border border-zinc-700 flex items-center justify-center relative">
                      <Lock className="w-6 h-6 text-zinc-400" />
                      <motion.div 
                        className="absolute inset-0 border border-emerald-400/50"
                        animate={{ scale: [1, 1.1, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                      />
                    </div>
                    <h2 className="text-lg font-light text-white mb-1">Authorize Access</h2>
                    <p className="text-xs text-zinc-500 font-mono">
                      Complete secure payment protocol
                    </p>
                  </div>

                  {/* Access summary */}
                  <div className="border border-zinc-800 p-4 space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400 font-mono text-xs">CLEARANCE</span>
                      <span className="text-white font-mono">
                        {tiers.find(t => t.count === selectedCount)?.clearance}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-zinc-400 font-mono text-xs">ZONES</span>
                      <span className="text-white font-mono">{selectedCount}</span>
                    </div>
                    <div className="border-t border-zinc-800 pt-3 flex items-center justify-between">
                      <span className="text-zinc-400 font-mono text-xs">LIFETIME ACCESS</span>
                      <span className="text-xl font-light text-white">$18.00</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="relative">
                      <Input
                        type="email"
                        placeholder="Enter secure email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="bg-zinc-900 border-zinc-700 text-white placeholder:text-zinc-600 font-mono text-sm pl-10"
                      />
                      <Eye className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                    </div>
                    <Button
                      onClick={handlePayment}
                      disabled={isProcessing || !email}
                      className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs uppercase tracking-wider"
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="w-4 h-4 mr-2" />
                          Authorize $18.00
                        </>
                      )}
                    </Button>
                  </div>

                  <p className="text-[10px] text-center text-zinc-600 font-mono tracking-wider">
                    SECURE PAYMENT • STRIPE ENCRYPTION
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bottom security bar */}
          <div className="border-t border-zinc-800 px-4 py-2 flex items-center justify-between">
            <span className="text-[9px] font-mono text-zinc-600 tracking-widest">
              SECURITY PROTOCOL v2.0
            </span>
            <div className="flex items-center gap-1">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
              <span className="text-[9px] font-mono text-emerald-500/70">SECURED</span>
            </div>
          </div>
        </motion.div>

        {/* Back navigation */}
        {step !== 'location' && (
          <motion.button
            onClick={() => setStep(step === 'payment' ? 'select' : 'location')}
            className="mt-4 text-xs text-zinc-600 hover:text-zinc-400 transition-colors mx-auto block font-mono uppercase tracking-wider"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ← Return
          </motion.button>
        )}

        {/* Footer signature */}
        <motion.div 
          className="mt-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-[9px] font-mono text-zinc-700 tracking-[0.3em]">
            LAVANDAR × AAL
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default StrataGate;
