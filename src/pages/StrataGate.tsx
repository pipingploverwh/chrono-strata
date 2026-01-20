import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Globe, Sparkles, Check, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type GateStep = 'location' | 'select' | 'payment';

const StrataGate = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<GateStep>('location');
  const [locationShared, setLocationShared] = useState(false);
  const [locationName, setLocationName] = useState<string>('');
  const [selectedCount, setSelectedCount] = useState<3 | 5 | 7 | null>(null);
  const [email, setEmail] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

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
      const position = await new Promise<GeolocationPosition>((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, {
          enableHighAccuracy: true,
          timeout: 10000
        });
      });

      const { latitude, longitude } = position.coords;
      
      // Reverse geocode
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
      toast.success('Location shared successfully');
      
      // Auto-advance after short delay
      setTimeout(() => setStep('select'), 800);
    } catch (error) {
      toast.error('Location access is required to continue');
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
    { count: 3 as const, name: 'Trio', desc: 'Track 3 time zones' },
    { count: 5 as const, name: 'Quinto', desc: 'Track 5 time zones' },
    { count: 7 as const, name: 'Septima', desc: 'Track 7 time zones' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/10 to-slate-950 flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute h-px bg-gradient-to-r from-transparent via-rose-400/5 to-transparent"
            style={{
              top: `${3 + i * 3.3}%`,
              left: 0,
              right: 0,
              transform: `rotate(${-0.5 + i * 0.05}deg)`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 w-full max-w-lg">
        {/* Brand header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-4">
            <Sparkles className="w-4 h-4 text-rose-400" />
            <span className="text-xs font-mono text-rose-400 tracking-wider">STRATA by LAVANDAR</span>
          </div>
          <h1 className="text-3xl font-extralight text-white mb-2">World Clock Collection</h1>
          <p className="text-slate-400">Elegant timekeeping, designed by AAL</p>
        </div>

        {/* Progress steps */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {['location', 'select', 'payment'].map((s, i) => (
            <div key={s} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                step === s 
                  ? 'bg-rose-500 text-white' 
                  : ['location', 'select', 'payment'].indexOf(step) > i
                    ? 'bg-rose-500/20 text-rose-400'
                    : 'bg-slate-800 text-slate-500'
              }`}>
                {['location', 'select', 'payment'].indexOf(step) > i ? (
                  <Check className="w-4 h-4" />
                ) : (
                  i + 1
                )}
              </div>
              {i < 2 && (
                <div className={`w-12 h-0.5 mx-1 ${
                  ['location', 'select', 'payment'].indexOf(step) > i
                    ? 'bg-rose-500/50'
                    : 'bg-slate-800'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-2xl p-8">
          {step === 'location' && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-rose-500/10 flex items-center justify-center">
                <MapPin className="w-8 h-8 text-rose-400" />
              </div>
              <div>
                <h2 className="text-xl font-medium text-white mb-2">Share Your Location</h2>
                <p className="text-slate-400 text-sm">
                  We use your location to personalize your world clock experience
                </p>
              </div>
              {locationShared ? (
                <div className="flex items-center justify-center gap-2 text-emerald-400">
                  <Check className="w-5 h-5" />
                  <span>{locationName}</span>
                </div>
              ) : (
                <Button
                  onClick={requestLocation}
                  className="w-full bg-rose-500 hover:bg-rose-600 text-white"
                >
                  <MapPin className="w-4 h-4 mr-2" />
                  Share Location
                </Button>
              )}
            </div>
          )}

          {step === 'select' && (
            <div className="space-y-6">
              <div className="text-center">
                <Globe className="w-12 h-12 mx-auto text-rose-400 mb-4" />
                <h2 className="text-xl font-medium text-white mb-2">Choose Your View</h2>
                <p className="text-slate-400 text-sm">
                  How many time zones do you want to track?
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {tiers.map((tier) => (
                  <button
                    key={tier.count}
                    onClick={() => setSelectedCount(tier.count)}
                    className={`p-4 rounded-xl border transition-all ${
                      selectedCount === tier.count
                        ? 'bg-rose-500/20 border-rose-500 text-white'
                        : 'bg-slate-800/50 border-slate-700 text-slate-300 hover:border-slate-600'
                    }`}
                  >
                    <div className="text-3xl font-light mb-1">{tier.count}</div>
                    <div className="text-xs text-slate-400">{tier.name}</div>
                  </button>
                ))}
              </div>

              <Button
                onClick={() => setStep('payment')}
                disabled={!selectedCount}
                className="w-full bg-rose-500 hover:bg-rose-600 text-white disabled:opacity-50"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-rose-500/20 to-amber-500/20 flex items-center justify-center mb-4">
                  <Sparkles className="w-8 h-8 text-rose-400" />
                </div>
                <h2 className="text-xl font-medium text-white mb-2">Complete Access</h2>
                <p className="text-slate-400 text-sm">
                  One-time payment for lifetime access
                </p>
              </div>

              <div className="bg-slate-800/50 rounded-xl p-4 border border-slate-700">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-300">Strata World Clock</span>
                  <span className="text-white font-medium">{selectedCount} zones</span>
                </div>
                <div className="flex items-center justify-between text-lg">
                  <span className="text-slate-400">Total</span>
                  <span className="text-white font-bold">$18.00</span>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-500"
                />
                <Button
                  onClick={handlePayment}
                  disabled={isProcessing || !email}
                  className="w-full bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-medium"
                >
                  {isProcessing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Pay $18 & Get Access
                    </>
                  )}
                </Button>
              </div>

              <p className="text-xs text-center text-slate-500">
                Secure payment powered by Stripe
              </p>
            </div>
          )}
        </div>

        {/* Back button for steps after location */}
        {step !== 'location' && (
          <button
            onClick={() => setStep(step === 'payment' ? 'select' : 'location')}
            className="mt-4 text-sm text-slate-500 hover:text-slate-300 transition-colors mx-auto block"
          >
            ← Go back
          </button>
        )}
      </div>
    </div>
  );
};

export default StrataGate;
