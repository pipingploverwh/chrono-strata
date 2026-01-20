import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Sparkles, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const StrataWelcome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  
  const locationCount = searchParams.get('locations') || '3';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Verify payment and grant access
    if (sessionId) {
      // In production, verify with Stripe webhook or API
      // For now, grant access on successful redirect
      localStorage.setItem('strata_access', 'true');
      localStorage.setItem('strata_location_count', locationCount);
      localStorage.setItem('strata_session_id', sessionId);
      
      setTimeout(() => setIsVerifying(false), 1500);
    } else {
      setIsVerifying(false);
    }
  }, [sessionId, locationCount]);

  const goToWorldClock = () => {
    navigate(`/world-${locationCount}`);
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/10 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verifying your access...</p>
        </div>
      </div>
    );
  }

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

      <div className="relative z-10 text-center max-w-md">
        {/* Success animation */}
        <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-gradient-to-br from-emerald-500/20 to-rose-500/20 flex items-center justify-center animate-pulse">
          <div className="w-16 h-16 rounded-full bg-emerald-500/30 flex items-center justify-center">
            <Check className="w-8 h-8 text-emerald-400" />
          </div>
        </div>

        {/* Brand */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 mb-6">
          <Sparkles className="w-4 h-4 text-rose-400" />
          <span className="text-xs font-mono text-rose-400 tracking-wider">STRATA by LAVANDAR</span>
        </div>

        <h1 className="text-3xl font-extralight text-white mb-4">
          Welcome to Strata
        </h1>
        
        <p className="text-slate-400 mb-8">
          Your {locationCount}-zone world clock is ready. Enjoy lifetime access to elegant timekeeping designed by AAL.
        </p>

        <Button
          onClick={goToWorldClock}
          className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-medium px-8 py-6 text-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Enter Your World Clock
        </Button>

        <p className="mt-8 text-xs text-slate-600">
          Your access is saved to this device. Thank you for supporting Strata.
        </p>
      </div>
    </div>
  );
};

export default StrataWelcome;
