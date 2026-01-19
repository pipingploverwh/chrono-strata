import { useState, useEffect } from "react";
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
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={showDialog} onOpenChange={() => {}}>
        <DialogContent 
          className="sm:max-w-md border-border bg-card"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center">
            <div className="text-5xl mb-4">🐦</div>
            <DialogTitle className="text-2xl font-medium text-foreground">
              {t('plover.ageGate.welcome')}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground mt-2">
              {t('plover.ageGate.description')}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <Button
              onClick={handleVerify}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg"
            >
              {t('plover.ageGate.confirm')}
            </Button>
            
            <Button
              onClick={handleExit}
              variant="outline"
              className="w-full border-border text-foreground hover:bg-muted py-6"
            >
              {t('plover.ageGate.exit')}
            </Button>
          </div>
          
          <p className="text-xs text-center text-muted-foreground mt-4">
            {t('plover.ageGate.legal')}
          </p>
        </DialogContent>
      </Dialog>
      
      {isVerified && children}
    </>
  );
}
