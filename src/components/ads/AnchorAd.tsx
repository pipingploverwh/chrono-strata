import { useState } from "react";
import { X } from "lucide-react";
import GoogleAdSense from "./GoogleAdSense";

interface AnchorAdProps {
  position?: "bottom" | "top";
  adSlot: string;
}

const AnchorAd = ({ position = "bottom", adSlot }: AnchorAdProps) => {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  return (
    <div
      className={`fixed ${position === "bottom" ? "bottom-0" : "top-0"} left-0 right-0 z-40 bg-surface-1/95 backdrop-blur-sm border-${position === "bottom" ? "t" : "b"} border-border shadow-lg`}
    >
      <div className="max-w-7xl mx-auto px-4 py-2 relative">
        <button
          onClick={() => setIsDismissed(true)}
          className="absolute top-1 right-2 p-1 text-muted-foreground hover:text-foreground transition-colors z-10"
          aria-label="Dismiss ad"
        >
          <X className="w-4 h-4" />
        </button>
        <GoogleAdSense
          adSlot={adSlot}
          adFormat="horizontal"
          className="min-h-[50px] max-h-[90px]"
        />
      </div>
    </div>
  );
};

export default AnchorAd;
