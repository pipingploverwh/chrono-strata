import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const AGE_VERIFIED_KEY = "plover-dispensary-age-verified";

interface AgeGateProps {
  children: React.ReactNode;
}

export default function AgeGate({ children }: AgeGateProps) {
  const [isVerified, setIsVerified] = useState<boolean | null>(null);
  const [showDialog, setShowDialog] = useState(false);

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
      <div className="min-h-screen flex items-center justify-center bg-plover-dune">
        <div className="animate-pulse text-plover-ocean">Loading...</div>
      </div>
    );
  }

  return (
    <>
      <Dialog open={showDialog} onOpenChange={() => {}}>
        <DialogContent 
          className="sm:max-w-md border-plover-ocean/20 bg-plover-dune"
          onPointerDownOutside={(e) => e.preventDefault()}
          onEscapeKeyDown={(e) => e.preventDefault()}
        >
          <DialogHeader className="text-center">
            <div className="text-5xl mb-4">🐦</div>
            <DialogTitle className="text-2xl font-medium text-plover-driftwood">
              Welcome to The Piping Plover
            </DialogTitle>
            <DialogDescription className="text-plover-driftwood/70 mt-2">
              You must be 21 years of age or older to enter this site.
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 mt-6">
            <Button
              onClick={handleVerify}
              className="w-full bg-plover-ocean hover:bg-plover-ocean/90 text-white py-6 text-lg"
            >
              I am 21 or older
            </Button>
            
            <Button
              onClick={handleExit}
              variant="outline"
              className="w-full border-plover-ocean/30 text-plover-driftwood hover:bg-plover-sand/50 py-6"
            >
              Exit
            </Button>
          </div>
          
          <p className="text-xs text-center text-plover-driftwood/50 mt-4">
            By entering this site, you confirm that you are of legal age to consume cannabis 
            products in Massachusetts and agree to our terms of service.
          </p>
        </DialogContent>
      </Dialog>
      
      {isVerified && children}
    </>
  );
}
