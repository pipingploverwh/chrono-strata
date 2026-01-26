import { useEffect, useRef } from "react";

interface GoogleAdSenseProps {
  adSlot: string;
  adFormat?: "auto" | "fluid" | "rectangle" | "horizontal" | "vertical";
  fullWidthResponsive?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

// Publisher ID - Replace with actual AdSense Publisher ID
const ADSENSE_CLIENT = "ca-pub-XXXXXXXXXXXXXXXX";

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const GoogleAdSense = ({
  adSlot,
  adFormat = "auto",
  fullWidthResponsive = true,
  className = "",
  style,
}: GoogleAdSenseProps) => {
  const adRef = useRef<HTMLModElement>(null);
  const isLoaded = useRef(false);

  useEffect(() => {
    // Only load once per component instance
    if (isLoaded.current) return;
    
    try {
      // Initialize adsbygoogle array if not exists
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
      isLoaded.current = true;
    } catch (error) {
      console.error("AdSense error:", error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`}>
      <ins
        ref={adRef}
        className="adsbygoogle"
        style={{
          display: "block",
          minHeight: "90px",
          ...style,
        }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive}
      />
    </div>
  );
};

export default GoogleAdSense;
