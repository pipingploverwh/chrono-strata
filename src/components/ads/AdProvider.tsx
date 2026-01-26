import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import AnchorAd from "./AnchorAd";
import { AD_SLOTS } from "./index";

// Pages where anchor ads should show
const ANCHOR_AD_PAGES = [
  "/strata",
  "/aviation",
  "/marine",
  "/weather",
  "/dj-table",
  "/apparel-blueprint",
];

// Pages where no ads should show (premium/checkout flows)
const NO_AD_PAGES = [
  "/checkout",
  "/allocation-checkout",
  "/auth",
  "/admin",
];

interface AdProviderProps {
  children: React.ReactNode;
}

const AdProvider = ({ children }: AdProviderProps) => {
  const location = useLocation();
  const [showAnchor, setShowAnchor] = useState(false);

  useEffect(() => {
    // Check if current page should show anchor ad
    const shouldShowAnchor = ANCHOR_AD_PAGES.some(page => 
      location.pathname.startsWith(page)
    );
    const isNoAdPage = NO_AD_PAGES.some(page => 
      location.pathname.startsWith(page)
    );

    setShowAnchor(shouldShowAnchor && !isNoAdPage);
  }, [location.pathname]);

  // Select appropriate ad slot based on page
  const getAdSlot = () => {
    if (location.pathname.includes("aviation")) return AD_SLOTS.AVIATION_ANCHOR;
    if (location.pathname.includes("dj-table")) return AD_SLOTS.DJ_TABLE_ANCHOR;
    if (location.pathname.includes("weather")) return AD_SLOTS.WEATHER_ANCHOR;
    return AD_SLOTS.STRATA_SIDEBAR;
  };

  return (
    <>
      {children}
      {showAnchor && <AnchorAd position="bottom" adSlot={getAdSlot()} />}
    </>
  );
};

export default AdProvider;
