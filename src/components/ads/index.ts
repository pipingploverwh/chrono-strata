export { default as GoogleAdSense } from "./GoogleAdSense";
export { default as AnchorAd } from "./AnchorAd";
export { default as InFeedAd } from "./InFeedAd";
export { default as SidebarAd } from "./SidebarAd";
export { default as AdProvider } from "./AdProvider";

// Ad slot IDs - Replace with actual AdSense ad unit IDs
// To get these: Google AdSense > Ads > By ad unit > Create new ad unit
export const AD_SLOTS = {
  // High-value B2B pages (Legal/Finance = $5-20 CPM)
  COMPLIANCE_SIDEBAR: "1234567890",
  COMPLIANCE_INFEED: "1234567891",
  INVESTOR_SIDEBAR: "1234567892",
  AVIATION_ANCHOR: "1234567893",
  BRIEFING_DISPLAY: "1234567894",
  
  // High-traffic pages (Repeat visitors = consistent revenue)
  WEATHER_DISPLAY: "1234567895",
  WEATHER_ANCHOR: "1234567896",
  STRATA_SIDEBAR: "1234567897",
  
  // E-commerce pages (Purchase intent = $2-6 CPM)
  SHOP_INFEED: "1234567898",
  SHOP_SIDEBAR: "1234567899",
  KIDS_INFEED: "1234567900",
  
  // Tool pages (Engaged users)
  DJ_TABLE_ANCHOR: "1234567901",
  APPAREL_SIDEBAR: "1234567902",
  
  // General site-wide
  FOOTER_BANNER: "1234567903",
} as const;
