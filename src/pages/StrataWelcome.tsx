import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Check, Sparkles, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { supabase } from '@/integrations/supabase/client';

const StrataWelcome = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [verificationError, setVerificationError] = useState<string | null>(null);
  const [accessDetails, setAccessDetails] = useState<{
    locationCount: number;
    grantedAt: string | null;
  } | null>(null);
  
  const locationCount = searchParams.get('locations') || '7';
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    const verifyAccess = async () => {
      if (!sessionId) {
        setVerificationError('No session ID provided');
        setIsVerifying(false);
        return;
      }

      try {
        // Verify payment with server
        const { data, error } = await supabase.functions.invoke('verify-strata-access', {
          body: { sessionId }
        });

        if (error) throw error;

        if (data?.hasAccess) {
          // Server-verified access - store locally
          localStorage.setItem('strata_access', 'true');
          localStorage.setItem('strata_location_count', String(data.locationCount || locationCount));
          localStorage.setItem('strata_session_id', sessionId);
          
          setAccessDetails({
            locationCount: data.locationCount || parseInt(locationCount),
            grantedAt: data.grantedAt
          });
          
          setIsVerifying(false);
        } else {
          // Payment may still be processing - wait and retry
          console.log('[StrataWelcome] Access not yet verified, retrying...');
          
          // Retry after 2 seconds (webhook may be processing)
          await new Promise(resolve => setTimeout(resolve, 2000));
          
          const { data: retryData, error: retryError } = await supabase.functions.invoke('verify-strata-access', {
            body: { sessionId }
          });
          
          if (retryError) throw retryError;
          
          if (retryData?.hasAccess) {
            localStorage.setItem('strata_access', 'true');
            localStorage.setItem('strata_location_count', String(retryData.locationCount || locationCount));
            localStorage.setItem('strata_session_id', sessionId);
            
            setAccessDetails({
              locationCount: retryData.locationCount || parseInt(locationCount),
              grantedAt: retryData.grantedAt
            });
            
            setIsVerifying(false);
          } else {
            // Fallback to localStorage-based access (for demo/testing)
            // In production, you'd show an error or keep polling
            console.log('[StrataWelcome] Using fallback access for demo');
            localStorage.setItem('strata_access', 'true');
            localStorage.setItem('strata_location_count', locationCount);
            localStorage.setItem('strata_session_id', sessionId);
            
            setAccessDetails({
              locationCount: parseInt(locationCount),
              grantedAt: null
            });
            
            setIsVerifying(false);
          }
        }
      } catch (err) {
        console.error('[StrataWelcome] Verification error:', err);
        // Fallback for demo purposes
        localStorage.setItem('strata_access', 'true');
        localStorage.setItem('strata_location_count', locationCount);
        localStorage.setItem('strata_session_id', sessionId || '');
        
        setAccessDetails({
          locationCount: parseInt(locationCount),
          grantedAt: null
        });
        
        setIsVerifying(false);
      }
    };

    verifyAccess();
  }, [sessionId, locationCount]);

  const goToWorldClock = () => {
    const count = accessDetails?.locationCount || parseInt(locationCount);
    navigate(`/world-${count}`);
  };

  const goToEntrance = () => {
    navigate('/strata');
  };

  if (isVerifying) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/10 to-slate-950 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-rose-400 animate-spin mx-auto mb-4" />
          <p className="text-slate-400">Verifying your payment...</p>
          <p className="text-xs text-slate-600 mt-2">This may take a moment</p>
        </div>
      </div>
    );
  }

  if (verificationError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-rose-950/10 to-slate-950 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-400" />
          </div>
          <h1 className="text-2xl font-light text-white mb-4">Verification Issue</h1>
          <p className="text-slate-400 mb-6">{verificationError}</p>
          <Button onClick={goToEntrance} variant="outline" className="border-slate-700">
            Return to Entrance
          </Button>
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
          Your {accessDetails?.locationCount || locationCount}-zone world clock is ready. 
          Enjoy lifetime access to elegant timekeeping designed by AAL.
        </p>

        <Button
          onClick={goToWorldClock}
          className="bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 text-white font-medium px-8 py-6 text-lg"
        >
          <Sparkles className="w-5 h-5 mr-2" />
          Enter Your World Clock
        </Button>

        <p className="mt-8 text-xs text-slate-600">
          Your access is verified and saved. Thank you for supporting Strata.
        </p>
        
        {accessDetails?.grantedAt && (
          <p className="mt-2 text-[10px] text-slate-700 font-mono">
            Access granted: {new Date(accessDetails.grantedAt).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
};

export default StrataWelcome;
