import { useState, useEffect } from "react";
import { Bird, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useLanguageState } from "@/hooks/useLanguage";

const AGE_VERIFIED_KEY = "plover-dispensary-age-verified";

interface AgeGateProps {
  children: React.ReactNode;
}

export default function AgeGate({ children }: AgeGateProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const { t } = useLanguageState();

  useEffect(() => {
    const verified = localStorage.getItem(AGE_VERIFIED_KEY);
    if (verified === "true") {
      setIsVerified(true);
    } else {
      setIsVerified(false);
      setShowDialog(true);
    }
  }, []);

  const handleVerify = () => {
    localStorage.setItem(AGE_VERIFIED_KEY, "true");
    setIsVerified(true);
    setShowDialog(false);
  };

  const handleExit = () => {
    window.location.href = "https://google.com";
  };

  // Still loading
  if (isVerified === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-plover-sand">
        <div className="animate-pulse text-plover-earth/50">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={showDialog} onOpenChange={() => {}}>
        <DialogContent 
          className="sm:max-w-md border-plover-dune/30 bg-plover-cream"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-plover-sage/20 flex items-center justify-center mb-4">
              <Bird className="w-8 h-8 text-plover-sage" />
            </div>
            <DialogTitle className="text-2xl font-light text-plover-earth">
              {t('plover.ageGate.welcome')}
            </DialogTitle>
            <DialogDescription className="text-plover-earth/60 mt-2">
              {t('plover.ageGate.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3 mt-6">
            <Button
              onClick={handleVerify}
              className="w-full bg-plover-sage hover:bg-plover-sage/90 text-plover-cream py-6 text-base rounded-full"
            >
              <ShieldCheck className="w-5 h-5 mr-2" />
              {t('plover.ageGate.confirm')}
            </Button>
            
            <Button
              onClick={handleExit}
              variant="outline"
              className="w-full border-plover-dune/30 text-plover-earth hover:bg-plover-dune/10 py-6 rounded-full"
            >
              {t('plover.ageGate.exit')}
            </Button>
          </div>
          
          <p className="text-xs text-center text-plover-earth/40 mt-4 leading-relaxed">
            {t('plover.ageGate.legal')}
          </p>
        </DialogContent>
      </Dialog>
      
      {isVerified && children}
    </>
  );
}